"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [isOnline, setIsOnline] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Verificar se está em modo standalone (instalado)
    const checkStandalone = () => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches;
      setIsStandalone(standalone);
    };

    // Verificar conectividade
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Capturar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      checkStandalone();
    };

    // Event listeners
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Verificações iniciais
    updateOnlineStatus();
    checkStandalone();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
      return true;
    }
    
    return false;
  };

  return {
    isOnline,
    isStandalone,
    isInstallable,
    installApp,
  };
}
