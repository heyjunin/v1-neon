import { useCallback, useState } from "react";
import type { UploadResult } from "../types";

interface UploadState {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  result?: UploadResult;
  error?: string;
}

interface UseUploadOptions {
  onUpload: (file: File) => Promise<UploadResult>;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
}

export function useUpload({
  onUpload,
  onUploadComplete,
  onUploadError,
}: UseUploadOptions) {
  const [uploadStates, setUploadStates] = useState<UploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      const newState: UploadState = {
        file,
        progress: 0,
        status: "pending",
      };

      setUploadStates((prev) => [...prev, newState]);
      const stateIndex = uploadStates.length;

      try {
        setUploadStates((prev) =>
          prev.map((state, index) =>
            index === stateIndex
              ? { ...state, status: "uploading", progress: 0 }
              : state,
          ),
        );

        const result = await onUpload(file);

        setUploadStates((prev) =>
          prev.map((state, index) =>
            index === stateIndex
              ? { ...state, status: "completed", progress: 100, result }
              : state,
          ),
        );

        onUploadComplete?.(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";

        setUploadStates((prev) =>
          prev.map((state, index) =>
            index === stateIndex
              ? { ...state, status: "error", error: errorMessage }
              : state,
          ),
        );

        onUploadError?.(
          error instanceof Error ? error : new Error(errorMessage),
        );
        throw error;
      }
    },
    [onUpload, onUploadComplete, onUploadError, uploadStates.length],
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      setIsUploading(true);

      try {
        const results = await Promise.all(
          files.map((file) => uploadFile(file)),
        );
        return results;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile],
  );

  const removeFile = useCallback((index: number) => {
    setUploadStates((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const retryUpload = useCallback(
    async (index: number) => {
      const state = uploadStates[index];
      if (!state) return;

      try {
        setUploadStates((prev) =>
          prev.map((s, i) =>
            i === index
              ? { ...s, status: "uploading", progress: 0, error: undefined }
              : s,
          ),
        );

        const result = await onUpload(state.file);

        setUploadStates((prev) =>
          prev.map((s, i) =>
            i === index
              ? { ...s, status: "completed", progress: 100, result }
              : s,
          ),
        );

        onUploadComplete?.(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";

        setUploadStates((prev) =>
          prev.map((s, i) =>
            i === index ? { ...s, status: "error", error: errorMessage } : s,
          ),
        );

        onUploadError?.(
          error instanceof Error ? error : new Error(errorMessage),
        );
        throw error;
      }
    },
    [uploadStates, onUpload, onUploadComplete, onUploadError],
  );

  const clearUploads = useCallback(() => {
    setUploadStates([]);
  }, []);

  return {
    uploadStates,
    isUploading,
    uploadFile,
    uploadFiles,
    removeFile,
    retryUpload,
    clearUploads,
  };
}
