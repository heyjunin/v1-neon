"use client";

import { useToast } from "@v1/ui";

interface ActionToastProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

export function useActionToast(): ActionToastProps {
  const { toast } = useToast();

  const showSuccess = (message: string) => {
    toast({
      title: "Sucesso!",
      description: message,
      variant: "default",
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Erro",
      description: message,
      variant: "destructive",
    });
  };

  const showInfo = (message: string) => {
    toast({
      title: "Informação",
      description: message,
      variant: "default",
    });
  };

  return { showSuccess, showError, showInfo };
}
