import type { ImageTransformOptions, UploadOptions, UploadResult } from './types';

export interface ClientStorageConfig {
  uploadUrl: string;
  maxFileSize?: number;
  allowedTypes?: string[];
}

export class ClientStorage {
  private config: ClientStorageConfig;

  constructor(config: ClientStorageConfig) {
    this.config = {
      maxFileSize: 10 * 1024 * 1024, // 10MB default
      allowedTypes: ['image/*', 'application/pdf', 'text/*'],
      ...config,
    };
  }

  /**
   * Upload file directly from client
   */
  async uploadFile(
    file: File,
    key?: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Validate file
      this.validateFile(file);

      // Generate key if not provided
      const fileKey = key || this.generateKey(file.name);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', fileKey);
      
      if (options.contentType) {
        formData.append('contentType', options.contentType);
      }
      
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata));
      }

      // Upload file
      const response = await fetch(this.config.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Client upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[],
    keyPrefix?: string,
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const uploads = files.map((file, index) => {
      const key = keyPrefix ? `${keyPrefix}/${index}-${file.name}` : undefined;
      return this.uploadFile(file, key, options);
    });

    return Promise.all(uploads);
  }

  /**
   * Get image URL with transformations
   */
  getImageUrl(key: string, options: ImageTransformOptions = {}): string {
    const params = new URLSearchParams();
    
    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format) params.append('f', options.format);
    if (options.fit) params.append('fit', options.fit);
    if (options.position) params.append('p', options.position);
    if (options.background) params.append('bg', options.background);
    if (options.blur) params.append('blur', options.blur.toString());
    if (options.sharpen) params.append('sharpen', options.sharpen.toString());
    if (options.rotate) params.append('r', options.rotate.toString());
    if (options.flip) params.append('flip', options.flip);
    if (options.flop) params.append('flop', options.flop);

    const queryString = params.toString();
    return queryString ? `${key}?${queryString}` : key;
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    // Check file size
    if (this.config.maxFileSize && file.size > this.config.maxFileSize) {
      throw new Error(`File too large. Maximum size is ${this.config.maxFileSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (this.config.allowedTypes && !this.config.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    })) {
      throw new Error(`File type not allowed. Allowed types: ${this.config.allowedTypes.join(', ')}`);
    }
  }

  /**
   * Generate unique key for file
   */
  private generateKey(filename: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = filename.split('.').pop();
    return `uploads/${timestamp}-${random}.${extension}`;
  }
}

// Factory function to create ClientStorage instance
export function createClientStorage(config: ClientStorageConfig): ClientStorage {
  return new ClientStorage(config);
}

// Default export
export default ClientStorage;
