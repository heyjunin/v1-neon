'use client';

import { useState } from 'react';
import { Button } from '@v1/ui/button';
import { Input } from '@v1/ui/input';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
  etag: string;
}

export function UploadExample() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return response.json();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setErrors([]);

    for (const file of files) {
      try {
        const result = await handleFileUpload(file);
        setUploadResults(prev => [...prev, result]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setErrors(prev => [...prev, `${file.name}: ${errorMessage}`]);
      }
    }

    setIsUploading(false);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">File Upload Example</h2>
        <p className="text-muted-foreground">
          Upload files to Cloudflare R2 storage
        </p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Choose files to upload</p>
          <p className="text-sm text-muted-foreground">
            PNG, JPG, PDF up to 10MB
          </p>
        </div>
        
        <div className="mt-4">
          <Input
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 mx-auto"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Select Files'}
          </Button>
        </div>
      </div>

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          {uploadResults.map((result, index) => (
            <div key={result.key} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">{result.key}</p>
                <p className="text-sm text-muted-foreground">
                  {(result.size / 1024).toFixed(1)} KB • {result.contentType}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(result.url, '_blank')}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-red-600">Upload Errors</h3>
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Files are uploaded directly to Cloudflare R2</li>
          <li>• Images are optimized and served via CDN</li>
          <li>• Files are publicly accessible via generated URLs</li>
          <li>• All uploads are logged for monitoring</li>
        </ul>
      </div>
    </div>
  );
}
