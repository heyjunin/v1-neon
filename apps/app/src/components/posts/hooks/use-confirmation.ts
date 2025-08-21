import { useState } from "react";

interface ConfirmationState {
  isOpen: boolean;
  itemId: string | null;
  itemTitle: string;
  actionType?: string;
}

interface UseConfirmationReturn {
  confirmation: ConfirmationState;
  openConfirmation: (id: string, title: string, actionType?: string) => void;
  closeConfirmation: () => void;
  confirmAction: (onConfirm: (id: string) => Promise<void>) => Promise<void>;
}

export function useConfirmation(): UseConfirmationReturn {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    itemId: null,
    itemTitle: "",
    actionType: "",
  });

  const openConfirmation = (id: string, title: string, actionType?: string) => {
    setConfirmation({
      isOpen: true,
      itemId: id,
      itemTitle: title,
      actionType,
    });
  };

  const closeConfirmation = () => {
    setConfirmation({
      isOpen: false,
      itemId: null,
      itemTitle: "",
      actionType: "",
    });
  };

  const confirmAction = async (onConfirm: (id: string) => Promise<void>) => {
    if (!confirmation.itemId) return;

    // Fechar a modal imediatamente após confirmação
    closeConfirmation();

    try {
      await onConfirm(confirmation.itemId);
    } catch (error) {
      console.error("Error in confirmation:", error);
      throw error;
    }
  };

  return {
    confirmation,
    openConfirmation,
    closeConfirmation,
    confirmAction,
  };
}
