'use client';

import { Button } from '@v1/ui/button';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface InlineNotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  className?: string;
}

export function InlineNotification({
  type,
  message,
  onClose,
  className = '',
}: InlineNotificationProps) {
  const bgColor = type === 'success' 
    ? 'bg-green-50 border-green-200 text-green-800' 
    : 'bg-red-50 border-red-200 text-red-800';
  
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`flex items-center gap-2 p-4 rounded-md border ${bgColor} ${className}`}>
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-auto h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
