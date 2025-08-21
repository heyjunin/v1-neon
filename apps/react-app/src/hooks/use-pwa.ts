import { useState, useEffect } from 'react'

interface PWAState {
  isInstalled: boolean
  isInstallable: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
  deferredPrompt: any
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    deferredPrompt: null,
  })

  useEffect(() => {
    // Verificar se a PWA está instalada
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setPwaState(prev => ({ ...prev, isInstalled: true }))
      }
    }

    // Verificar conectividade
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }))

    // Capturar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaState(prev => ({ 
        ...prev, 
        isInstallable: true, 
        deferredPrompt: e 
      }))
    }

    // Capturar evento de instalação concluída
    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false,
        deferredPrompt: null 
      }))
    }

    // Capturar evento de atualização disponível
    const handleUpdateFound = () => {
      setPwaState(prev => ({ ...prev, isUpdateAvailable: true }))
    }

    // Verificar instalação inicial
    checkIfInstalled()

    // Adicionar event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Service Worker events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('updatefound', handleUpdateFound)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('updatefound', handleUpdateFound)
      }
    }
  }, [])

  const installPWA = async () => {
    if (pwaState.deferredPrompt) {
      pwaState.deferredPrompt.prompt()
      const { outcome } = await pwaState.deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setPwaState(prev => ({ 
          ...prev, 
          isInstalled: true, 
          isInstallable: false,
          deferredPrompt: null 
        }))
      }
    }
  }

  const updatePWA = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      })
    }
  }

  return {
    ...pwaState,
    installPWA,
    updatePWA,
  }
}
