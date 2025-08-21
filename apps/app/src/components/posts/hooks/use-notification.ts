import { useState, useCallback } from "react";
import type { NotificationState, NotificationType } from "../types";

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    type: "success",
    message: "",
    isVisible: false,
  });

  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      setNotification({
        type,
        message,
        isVisible: true,
      });
    },
    [],
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showNotification("success", message);
    },
    [showNotification],
  );

  const showError = useCallback(
    (message: string) => {
      showNotification("error", message);
    },
    [showNotification],
  );

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
  };
}
