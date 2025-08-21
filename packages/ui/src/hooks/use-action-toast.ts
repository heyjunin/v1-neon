"use client";

import { useToast } from "@v1/ui";
import { useCallback } from "react";

export interface ToastActions {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

export function useActionToast(): ToastActions {
  const { toast } = useToast();

  const showSuccess = useCallback(
    (message: string) => {
      toast({
        title: "Sucesso",
        description: message,
        variant: "default",
      });
    },
    [toast],
  );

  const showError = useCallback(
    (message: string) => {
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    },
    [toast],
  );

  const showInfo = useCallback(
    (message: string) => {
      toast({
        title: "Informação",
        description: message,
        variant: "default",
      });
    },
    [toast],
  );

  const showWarning = useCallback(
    (message: string) => {
      toast({
        title: "Atenção",
        description: message,
        variant: "default",
      });
    },
    [toast],
  );

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
