import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Badge } from '@v1/ui/badge'
import { RefreshCw, X } from 'lucide-react'
import { usePWA } from '@/hooks/use-pwa'

export function UpdatePrompt() {
  const { isUpdateAvailable, updatePWA } = usePWA()

  if (!isUpdateAvailable) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-orange-800">Nova Versão</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Atualização
            </Badge>
          </div>
          <CardDescription className="text-xs text-orange-600">
            Uma nova versão está disponível
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={updatePWA}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
