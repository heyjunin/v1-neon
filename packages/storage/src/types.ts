export interface StorageConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
  endpoint?: string;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  public?: boolean;
  cacheControl?: string;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
  etag: string;
}

export interface FileInfo {
  key: string;
  url: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
}

export interface ListOptions {
  prefix?: string;
  maxKeys?: number;
  continuationToken?: string;
}

export interface ListResult {
  files: FileInfo[];
  nextContinuationToken?: string;
  isTruncated: boolean;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: 'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top' | 'center';
  background?: string;
  blur?: number;
  sharpen?: number;
  rotate?: number;
  flip?: 'horizontal' | 'vertical';
  flop?: 'horizontal' | 'vertical';
}

export interface PresignedUrlOptions {
  expiresIn?: number; // seconds
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface StorageError extends Error {
  code?: string;
  statusCode?: number;
  requestId?: string;
}
