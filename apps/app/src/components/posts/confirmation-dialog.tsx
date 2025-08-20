'use client';

import { Button } from '@v1/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@v1/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
  actionType?: 'delete' | 'archive' | 'publish' | 'custom';
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
  actionType = 'delete',
  confirmText,
  cancelText = 'Cancelar',
}: ConfirmationDialogProps) {
  const getActionConfig = () => {
    switch (actionType) {
      case 'delete':
        return {
          icon: Trash2,
          variant: 'destructive' as const,
          text: confirmText || 'Excluir',
          loadingText: 'Excluindo...',
        };
      case 'archive':
        return {
          icon: AlertTriangle,
          variant: 'outline' as const,
          text: confirmText || 'Arquivar',
          loadingText: 'Arquivando...',
        };
      case 'publish':
        return {
          icon: AlertTriangle,
          variant: 'default' as const,
          text: confirmText || 'Publicar',
          loadingText: 'Publicando...',
        };
      default:
        return {
          icon: AlertTriangle,
          variant: 'default' as const,
          text: confirmText || 'Confirmar',
          loadingText: 'Processando...',
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              actionType === 'delete' ? 'bg-destructive/10' : 'bg-blue-100'
            }`}>
              <Icon className={`h-5 w-5 ${
                actionType === 'delete' ? 'text-destructive' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-2">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.variant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? config.loadingText : config.text}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
