import { useToast } from '@v1/ui';

export function usePostToast() {
  const { toast } = useToast();

  const showSuccess = (message: string) => {
    toast({
      title: 'Sucesso',
      description: message,
      variant: 'default',
    });
  };

  const showError = (message: string) => {
    toast({
      title: 'Erro',
      description: message,
      variant: 'destructive',
    });
  };

  const showLoading = (message: string) => {
    toast({
      title: 'Processando',
      description: message,
      variant: 'default',
    });
  };

  return {
    showSuccess,
    showError,
    showLoading,
  };
}
