import { useEffect, useState } from 'react'

interface PWAState {
  isInstalled: boolean
  isInstallable: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
  deferredPrompt: unknown
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
      if (window.matchMedia?.('(display-mode: standalone)').matches) {
        setPwaState(prev => ({ ...prev, isInstalled: true }))
      }
    }

    // Verificar se a PWA pode ser instalada
    const checkIfInstallable = () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setPwaState(prev => ({ ...prev, isInstallable: true }))
      }
    }

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaState(prev => ({ 
        ...prev, 
        deferredPrompt: e,
        isInstallable: true 
      }))
    }

    // Listener para mudanças de conectividade
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }))

    // Listener para atualizações do service worker
    const handleUpdateFound = () => {
      setPwaState(prev => ({ ...prev, isUpdateAvailable: true }))
    }

    // Inicializar verificações
    checkIfInstalled()
    checkIfInstallable()

    // Adicionar event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verificar se há atualizações do service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('updatefound', handleUpdateFound)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('updatefound', handleUpdateFound)
      }
    }
  }, [])

  // Função para instalar a PWA
  const installPWA = async () => {
    if (pwaState.deferredPrompt) {
      const promptEvent = pwaState.deferredPrompt as { prompt: () => Promise<{ outcome: string }> }
      const result = await promptEvent.prompt()
      
      if (result.outcome === 'accepted') {
        setPwaState(prev => ({ 
          ...prev, 
          isInstalled: true,
          deferredPrompt: null 
        }))
      }
    }
  }

  // Função para atualizar a PWA
  const updatePWA = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
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
