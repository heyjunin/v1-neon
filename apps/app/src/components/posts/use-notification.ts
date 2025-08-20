import { useState } from 'react';

interface NotificationState {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
}

interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (type: 'success' | 'error', message: string) => void;
  hideNotification: () => void;
}

export function useNotification(): UseNotificationReturn {
  const [notification, setNotification] = useState<NotificationState>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, isVisible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
}
