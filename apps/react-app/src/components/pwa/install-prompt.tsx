import { usePWA } from '@/hooks/use-pwa'
import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Download, Wifi, WifiOff, X } from 'lucide-react'
import { useState } from 'react'

export function InstallPrompt() {
  const { isInstallable, isInstalled, isOnline, installPWA } = usePWA()
  const [isVisible, setIsVisible] = useState(true)

  if (!isInstallable || isInstalled || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Instalar App</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Instale esta aplicação para acesso rápido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? 'default' : 'destructive'} className="text-xs">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={installPWA}
              className="flex-1"
              disabled={!isOnline}
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
