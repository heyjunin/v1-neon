import { usePWA } from '@/hooks/use-pwa'
import { Badge } from '@v1/ui/badge'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <Badge variant="destructive" className="animate-pulse">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    </div>
  )
}
