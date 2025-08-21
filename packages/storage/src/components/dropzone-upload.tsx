"use client";

import { Alert, AlertDescription } from "@v1/ui/alert";
import { Button } from "@v1/ui/button";
import { Progress } from "@v1/ui/progress";
import {
  AlertCircle,
  Archive,
  CheckCircle,
  File,
  FileText,
  Image as ImageIcon,
  Music,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUpload } from "../hooks/use-upload";
import type { UploadResult } from "../types";

export interface DropzoneUploadProps {
  onUpload: (file: File) => Promise<UploadResult>;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
  onFilesChange?: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  uploadText?: string;
  dragText?: string;
}

export function DropzoneUpload({
  onUpload,
  onUploadComplete,
  onUploadError,
  onFilesChange,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "application/pdf": [".pdf"],
    "text/*": [".txt", ".md", ".json", ".csv"],
    "video/*": [".mp4", ".avi", ".mov", ".wmv"],
    "audio/*": [".mp3", ".wav", ".flac", ".aac"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  disabled = false,
  className = "",
  showPreview = true,
  uploadText = "Upload Files",
  dragText = "Drag & drop files here, or click to select",
}: DropzoneUploadProps) {
  const { uploadStates, isUploading, uploadFiles, removeFile, retryUpload } =
    useUpload({
      onUpload,
      onUploadComplete,
      onUploadError,
    });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled || isUploading) return;

      const filesToUpload = acceptedFiles.slice(0, maxFiles);
      onFilesChange?.(filesToUpload);
      uploadFiles(filesToUpload);
    },
    [disabled, isUploading, maxFiles, onFilesChange, uploadFiles],
  );

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="h-4 w-4" />;
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (file.type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    if (file.type === "application/pdf")
      return <FileText className="h-4 w-4" />;
    if (file.type.includes("zip") || file.type.includes("rar"))
      return <Archive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles,
      disabled: disabled || isUploading,
    });

  const completedUploads = uploadStates.filter(
    (state) => state.status === "completed",
  );
  const errorUploads = uploadStates.filter((state) => state.status === "error");
  const pendingUploads = uploadStates.filter(
    (state) => state.status === "pending" || state.status === "uploading",
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : isDragReject
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
          }
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? "Drop files here" : uploadText}
        </p>

        <p className="text-sm text-gray-500">{dragText}</p>

        <p className="text-xs text-gray-400 mt-2">
          Max file size: {formatFileSize(maxSize)} • Max files: {maxFiles}
        </p>
      </div>

      {/* Upload Progress */}
      {pendingUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploading Files</h4>
          {pendingUploads.map((state, index) => (
            <div key={`${state.file.name}-${index}`} className="space-y-2">
              <div className="flex items-center gap-3">
                {getFileIcon(state.file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {state.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(state.file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {state.status === "uploading" && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeFile(
                        uploadStates.findIndex((s) => s.file === state.file),
                      )
                    }
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Progress value={state.progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {/* Completed Uploads */}
      {completedUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-green-600">Uploaded Files</h4>
          {completedUploads.map((state, index) => (
            <div
              key={`${state.file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {state.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {state.result?.key} • {formatFileSize(state.file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  removeFile(
                    uploadStates.findIndex((s) => s.file === state.file),
                  )
                }
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Error Uploads */}
      {errorUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-red-600">Upload Errors</h4>
          {errorUploads.map((state, index) => (
            <Alert key={`${state.file.name}-${index}`} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{state.file.name}</p>
                  <p className="text-sm">{state.error}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      retryUpload(
                        uploadStates.findIndex((s) => s.file === state.file),
                      )
                    }
                  >
                    Retry
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeFile(
                        uploadStates.findIndex((s) => s.file === state.file),
                      )
                    }
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* File Previews */}
      {showPreview && completedUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">File Previews</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {completedUploads.map((state, index) => (
              <div
                key={`preview-${state.file.name}-${index}`}
                className="relative group"
              >
                {state.file.type.startsWith("image/") ? (
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(state.file)}
                      alt={state.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                    {getFileIcon(state.file)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeFile(
                        uploadStates.findIndex((s) => s.file === state.file),
                      )
                    }
                    className="h-8 w-8 p-0 bg-white text-black hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {state.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
