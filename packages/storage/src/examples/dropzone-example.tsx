"use client";

import { useState } from "react";
import { createClientStorage } from "../client";
import { DropzoneUpload } from "../components/dropzone-upload";
import type { UploadResult } from "../types";

export function DropzoneExample() {
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

  // Configurar o cliente de storage (substitua pelos seus dados reais)
  const storageClient = createClientStorage({
    uploadUrl: "/api/upload", // Endpoint para upload
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      "image/*",
      "application/pdf",
      "text/*",
      "video/*",
      "audio/*",
    ],
  });

  const handleUpload = async (file: File): Promise<UploadResult> => {
    // Aqui você pode implementar a lógica de upload real
    // Por exemplo, usando o storageClient ou uma API personalizada

    // Simulação de upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result: UploadResult = {
      key: `uploads/${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file), // URL temporária para preview
      size: file.size,
      contentType: file.type,
      etag: `etag-${Date.now()}`,
    };

    return result;
  };

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResults((prev) => [...prev, result]);
    console.log("Upload completed:", result);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
  };

  const handleFilesChange = (files: File[]) => {
    console.log("Files selected:", files);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          File Upload with Drag & Drop
        </h1>
        <p className="text-gray-600">
          Upload multiple files with drag & drop functionality
        </p>
      </div>

      <DropzoneUpload
        onUpload={handleUpload}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        onFilesChange={handleFilesChange}
        maxSize={50 * 1024 * 1024} // 50MB
        maxFiles={10}
        showPreview={true}
        uploadText="Upload Files"
        dragText="Drag & drop files here, or click to select"
        className="w-full"
      />

      {/* Results Summary */}
      {uploadResults.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Upload Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadResults.map((result, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {result.key}
                </p>
                <p className="text-xs text-gray-500">
                  Size: {(result.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-gray-500">
                  Type: {result.contentType}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
