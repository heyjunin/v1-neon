import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "@v1/logger";
import type {
  FileInfo,
  ListOptions,
  ListResult,
  PresignedUrlOptions,
  StorageConfig,
  StorageError,
  UploadOptions,
  UploadResult,
} from "./types";

export class R2Storage {
  private client: S3Client;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;

    this.client = new S3Client({
      region: config.region || "auto",
      endpoint:
        config.endpoint ||
        `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Upload a file to R2
   */
  async upload(
    key: string,
    data: Buffer | string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    try {
      const {
        contentType,
        metadata = {},
        public: isPublic = false,
        cacheControl = "public, max-age=31536000",
      } = options;

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: data,
        ContentType: contentType,
        Metadata: metadata,
        CacheControl: cacheControl,
        ACL: isPublic ? "public-read" : "private",
      });

      const result = await this.client.send(command);

      const url = isPublic
        ? `https://${this.config.bucketName}.r2.dev/${key}`
        : `https://${this.config.accountId}.r2.cloudflarestorage.com/${this.config.bucketName}/${key}`;

      return {
        key,
        url,
        size:
          data instanceof Buffer
            ? data.length
            : Buffer.byteLength(data, "utf8"),
        contentType: contentType || "application/octet-stream",
        etag: result.ETag?.replace(/"/g, "") || "",
      };
    } catch (error) {
      logger.error("R2 upload error:", error);
      throw this.createStorageError(error, "Upload failed");
    }
  }

  /**
   * Get a file from R2
   */
  async get(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      const result = await this.client.send(command);

      if (!result.Body) {
        throw new Error("File not found");
      }

      return Buffer.from(await result.Body.transformToByteArray());
    } catch (error) {
      logger.error("R2 get error:", error);
      throw this.createStorageError(error, "Get failed");
    }
  }

  /**
   * Delete a file from R2
   */
  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.client.send(command);
      logger.info("File deleted from R2:", key);
    } catch (error) {
      logger.error("R2 delete error:", error);
      throw this.createStorageError(error, "Delete failed");
    }
  }

  /**
   * List files in R2
   */
  async list(options: ListOptions = {}): Promise<ListResult> {
    try {
      const { prefix = "", maxKeys = 1000, continuationToken } = options;

      const command = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken,
      });

      const result = await this.client.send(command);

      const files: FileInfo[] = (result.Contents || []).map((item) => ({
        key: item.Key!,
        url: `https://${this.config.bucketName}.r2.dev/${item.Key}`,
        size: item.Size || 0,
        contentType: "application/octet-stream", // R2 doesn't provide this in list
        lastModified: item.LastModified || new Date(),
        etag: item.ETag?.replace(/"/g, "") || "",
      }));

      return {
        files,
        nextContinuationToken: result.NextContinuationToken,
        isTruncated: result.IsTruncated || false,
      };
    } catch (error) {
      logger.error("R2 list error:", error);
      throw this.createStorageError(error, "List failed");
    }
  }

  /**
   * Get file info (metadata)
   */
  async getInfo(key: string): Promise<FileInfo> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      const result = await this.client.send(command);

      return {
        key,
        url: `https://${this.config.bucketName}.r2.dev/${key}`,
        size: result.ContentLength || 0,
        contentType: result.ContentType || "application/octet-stream",
        lastModified: result.LastModified || new Date(),
        etag: result.ETag?.replace(/"/g, "") || "",
      };
    } catch (error) {
      logger.error("R2 getInfo error:", error);
      throw this.createStorageError(error, "GetInfo failed");
    }
  }

  /**
   * Generate presigned URL for upload
   */
  async getPresignedUploadUrl(
    key: string,
    options: PresignedUrlOptions = {},
  ): Promise<string> {
    try {
      const { expiresIn = 3600, contentType, metadata = {} } = options;

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: contentType,
        Metadata: metadata,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      logger.error("R2 presigned upload URL error:", error);
      throw this.createStorageError(error, "Presigned URL generation failed");
    }
  }

  /**
   * Generate presigned URL for download
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      logger.error("R2 presigned download URL error:", error);
      throw this.createStorageError(error, "Presigned URL generation failed");
    }
  }

  /**
   * Check if file exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      await this.getInfo(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create storage error with proper typing
   */
  private createStorageError(error: any, message: string): StorageError {
    const storageError = new Error(message) as StorageError;
    storageError.code = error.Code || error.code;
    storageError.statusCode =
      error.$metadata?.httpStatusCode || error.statusCode;
    storageError.requestId = error.$metadata?.requestId || error.requestId;
    return storageError;
  }
}

// Factory function to create R2Storage instance
export function createR2Storage(config: StorageConfig): R2Storage {
  return new R2Storage(config);
}

// Default export
export default R2Storage;
