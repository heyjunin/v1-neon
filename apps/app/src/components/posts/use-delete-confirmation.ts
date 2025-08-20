import { useState } from 'react';

interface DeleteConfirmationState {
  isOpen: boolean;
  itemId: string | null;
  itemTitle: string;
}

interface UseDeleteConfirmationReturn {
  deleteDialog: DeleteConfirmationState;
  openDeleteDialog: (id: string, title: string) => void;
  closeDeleteDialog: () => void;
  confirmDelete: (onConfirm: (id: string) => Promise<void>) => Promise<void>;
}

export function useDeleteConfirmation(): UseDeleteConfirmationReturn {
  const [deleteDialog, setDeleteDialog] = useState<DeleteConfirmationState>({
    isOpen: false,
    itemId: null,
    itemTitle: '',
  });

  const openDeleteDialog = (id: string, title: string) => {
    setDeleteDialog({
      isOpen: true,
      itemId: id,
      itemTitle: title,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      itemId: null,
      itemTitle: '',
    });
  };

  const confirmDelete = async (onConfirm: (id: string) => Promise<void>) => {
    if (!deleteDialog.itemId) return;

    try {
      await onConfirm(deleteDialog.itemId);
      closeDeleteDialog();
    } catch (error) {
      console.error('Error in delete confirmation:', error);
      throw error;
    }
  };

  return {
    deleteDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  };
}
