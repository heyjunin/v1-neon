import { logger } from '@v1/logger';
import mime from 'mime-types';
import sharp from 'sharp';
import type { ImageTransformOptions } from './types';

/**
 * Get MIME type from filename or buffer
 */
export function getMimeType(input: string | Buffer): string {
  if (Buffer.isBuffer(input)) {
    // Try to detect from buffer content
    const header = input.slice(0, 4);
    if (header[0] === 0xFF && header[1] === 0xD8) return 'image/jpeg';
    if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) return 'image/png';
    if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) return 'image/gif';
    if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) return 'image/webp';
    return 'application/octet-stream';
  }
  
  return mime.lookup(input) || 'application/octet-stream';
}

/**
 * Transform image using Sharp
 */
export async function transformImage(
  buffer: Buffer,
  options: ImageTransformOptions = {}
): Promise<Buffer> {
  try {
    let sharpInstance = sharp(buffer);

    // Apply transformations
    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize(options.width, options.height, {
        fit: options.fit || 'cover',
        position: options.position || 'center',
        background: options.background || '#ffffff',
      });
    }

    if (options.blur) {
      sharpInstance = sharpInstance.blur(options.blur);
    }

    if (options.sharpen) {
      sharpInstance = sharpInstance.sharpen(options.sharpen);
    }

    if (options.rotate) {
      sharpInstance = sharpInstance.rotate(options.rotate);
    }

    if (options.flip) {
      sharpInstance = sharpInstance.flip();
    }

    if (options.flop) {
      sharpInstance = sharpInstance.flop();
    }

    // Set output format and quality
    if (options.format) {
      switch (options.format) {
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality: options.quality || 80 });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality: options.quality || 80 });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: options.quality || 80 });
          break;
        case 'avif':
          sharpInstance = sharpInstance.avif({ quality: options.quality || 80 });
          break;
      }
    }

    return await sharpInstance.toBuffer();
  } catch (error) {
    logger.error('Image transformation error:', error);
    throw new Error('Failed to transform image');
  }
}

/**
 * Generate optimized image variants
 */
export async function generateImageVariants(
  buffer: Buffer,
  variants: Array<{ name: string; options: ImageTransformOptions }>
): Promise<Record<string, Buffer>> {
  const results: Record<string, Buffer> = {};

  for (const variant of variants) {
    try {
      results[variant.name] = await transformImage(buffer, variant.options);
    } catch (error) {
      logger.error(`Failed to generate variant ${variant.name}:`, error);
      // Continue with other variants
    }
  }

  return results;
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}

/**
 * Validate file type
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: string[]
): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.slice(0, -1));
    }
    return mimeType === type;
  });
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(
  originalName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || '';
  const name = originalName.replace(/\.[^/.]+$/, '');
  
  const filename = `${name}-${timestamp}-${random}.${extension}`;
  return prefix ? `${prefix}/${filename}` : filename;
}

/**
 * Parse file size string to bytes
 */
export function parseFileSize(sizeString: string): number {
  const units: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };

  const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
  if (!match) {
    throw new Error('Invalid file size format');
  }

  const [, size, unit] = match;
  if (!size || !unit) {
    throw new Error('Invalid file size format');
  }
  
  const upperUnit = unit.toUpperCase();
  const unitValue = units[upperUnit];
  if (!unitValue) {
    throw new Error('Invalid file size unit');
  }
  
  return parseFloat(size) * unitValue;
}

/**
 * Format bytes to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const extension = mime.extension(mimeType);
  return extension ? `.${extension}` : '';
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a video
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Check if file is a document
 */
export function isDocument(mimeType: string): boolean {
  return mimeType.startsWith('application/') && (
    mimeType.includes('pdf') ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('powerpoint') ||
    mimeType.includes('text')
  );
}
