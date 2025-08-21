"use client";

import { usePWA } from "@/hooks/use-pwa";
import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
    } else {
      // Delay para esconder a mensagem quando voltar online
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showOfflineMessage) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-yellow-500 border border-yellow-600 rounded-lg shadow-lg p-3 z-50">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-yellow-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-yellow-800">
            {isOnline ? "Conexão restaurada" : "Você está offline"}
          </p>
          {!isOnline && (
            <p className="text-xs text-yellow-700 mt-1">
              Algumas funcionalidades podem não estar disponíveis
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowOfflineMessage(false)}
          className="flex-shrink-0 text-yellow-800 hover:text-yellow-900"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
