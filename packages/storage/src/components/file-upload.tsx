'use client';

import { Button } from '@v1/ui/button';
import { Input } from '@v1/ui/input';
import { AlertCircle, CheckCircle, File, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { UploadResult } from '../types';

interface FileUploadProps {
  onUpload: (file: File) => Promise<UploadResult>;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  onUploadComplete,
  onUploadError,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  disabled = false,
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setErrors({});

    for (const file of files) {
      try {
        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        }

        // Update progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Upload file
        const result = await onUpload(file);
        
        setUploadResults(prev => [...prev, result]);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        onUploadComplete?.(result);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setErrors(prev => ({ ...prev, [file.name]: errorMessage }));
        onUploadError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    }

    setIsUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadResults(prev => prev.filter((_, i) => i !== index));
  };

  const retryUpload = async (file: File) => {
    try {
      setErrors(prev => ({ ...prev, [file.name]: '' }));
      const result = await onUpload(file);
      setUploadResults(prev => [...prev, result]);
      onUploadComplete?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setErrors(prev => ({ ...prev, [file.name]: errorMessage }));
      onUploadError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input */}
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Choose Files'}
        </Button>
        
        {isUploading && (
          <div className="text-sm text-muted-foreground">
            Uploading files...
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span className="text-sm flex-1">{fileName}</span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadResults.map((result, index) => (
            <div key={result.key} className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm flex-1">{result.key}</span>
              <span className="text-sm text-muted-foreground">
                {result.size} bytes
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-600">Upload Errors</h4>
          {Object.entries(errors).map(([fileName, error]) => (
            <div key={fileName} className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm flex-1">{fileName}</span>
              <span className="text-sm text-red-600">{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
