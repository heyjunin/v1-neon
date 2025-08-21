"use client";

import { Button } from "@v1/ui/button";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import * as React from "react";
import type { NotificationType } from "../types";

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose?: () => void;
  className?: string;
  variant?: "inline" | "toast";
  duration?: number;
  isVisible?: boolean;
}

export function PostNotification({
  type,
  message,
  onClose,
  className = "",
  variant = "inline",
  duration = 5000,
  isVisible = true,
}: NotificationProps) {
  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : "bg-red-50 border-red-200 text-red-800";

  const Icon = type === "success" ? CheckCircle : AlertCircle;

  // Auto-close for toast variant
  React.useEffect(() => {
    if (variant === "toast" && isVisible && onClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [variant, isVisible, onClose, duration]);

  if (variant === "toast" && !isVisible) return null;

  const baseClasses = `flex items-center gap-2 p-4 rounded-md border ${bgColor}`;
  const containerClasses =
    variant === "toast"
      ? "fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-right-2 duration-300"
      : "";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={baseClasses}>
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
    </div>
  );
}
