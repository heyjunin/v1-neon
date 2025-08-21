"use client";

import { useToast } from "@v1/ui";
import { useCallback } from "react";
import type { NotificationType } from "../types";

export function useOrganizationToast() {
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

  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      if (type === "success") {
        showSuccess(message);
      } else {
        showError(message);
      }
    },
    [showSuccess, showError],
  );

  return {
    showSuccess,
    showError,
    showNotification,
  };
}
