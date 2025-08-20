'use client';

import { CheckCircle, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Notification({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}: NotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icon = type === 'success' ? CheckCircle : XCircle;
  const bgColor = type === 'success' 
    ? 'bg-green-50 border-green-200 text-green-800' 
    : 'bg-red-50 border-red-200 text-red-800';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-right-2 duration-300">
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${bgColor} shadow-lg`}>
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon({ className: 'h-5 w-5' })}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
