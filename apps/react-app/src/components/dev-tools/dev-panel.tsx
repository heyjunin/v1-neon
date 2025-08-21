import { useThemeContext } from '@/components/theme'
import { usePWA } from '@/hooks/use-pwa'
import { FEATURE_FLAGS } from '@/lib/constants'
import { dev, storage } from '@/lib/utils'
import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@v1/ui/card'
import { Separator } from '@v1/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@v1/ui/tabs'
import {
    Bug,
    Eye,
    EyeOff,
    Monitor,
    Palette,
    RefreshCw,
    Settings,
    Trash2,
    X
} from 'lucide-react'
import React, { useState } from 'react'

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { theme, toggleTheme, isDark } = useThemeContext()
  const { isInstalled, isOnline, isInstallable, isUpdateAvailable } = usePWA()

  // Só renderiza em desenvolvimento
  if (!import.meta.env.DEV || !FEATURE_FLAGS.enableDevTools) {
    return null
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(true)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const systemInfo = {
    'React Version': React.version,
    'Node Env': import.meta.env.MODE,
    'Vite Version': import.meta.env.VITE_VERSION || 'N/A',
    'Theme': theme,
    'PWA Installed': isInstalled ? 'Yes' : 'No',
    'Online': isOnline ? 'Yes' : 'No',
    'Viewport': `${window.innerWidth}x${window.innerHeight}`,
    'User Agent': navigator.userAgent.split(' ')[0]
  }

  const performanceInfo = {
    'Memory Used': `${Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0} MB`,
    'Memory Total': `${Math.round((performance as any).memory?.totalJSHeapSize / 1024 / 1024) || 0} MB`,
    'Connection': (navigator as any).connection?.effectiveType || 'Unknown',
    'Device Memory': `${(navigator as any).deviceMemory || 'Unknown'} GB`,
    'Hardware Concurrency': navigator.hardwareConcurrency || 'Unknown'
  }

  const clearStorage = () => {
    storage.clear()
    dev.log('Storage cleared')
    window.location.reload()
  }

  const triggerError = () => {
    throw new Error('Dev Panel: Erro de teste disparado')
  }

  const logSystemInfo = () => {
    dev.log('System Info:', systemInfo)
    dev.log('Performance Info:', performanceInfo)
    dev.log('Feature Flags:', FEATURE_FLAGS)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(false)}
          className="h-8 w-8 p-0"
        >
          <EyeOff className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => setIsOpen(true)}
          className="shadow-lg"
        >
          <Bug className="h-4 w-4 mr-2" />
          Dev Tools
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-96 max-h-[80vh] overflow-hidden">
      <Card className="shadow-2xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <CardTitle className="text-sm">Dev Tools</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {import.meta.env.MODE}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 max-h-[60vh] overflow-y-auto">
          <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-3">
              <TabsTrigger value="system" className="text-xs">
                <Monitor className="h-3 w-3 mr-1" />
                System
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="debug" className="text-xs">
                <Bug className="h-3 w-3 mr-1" />
                Debug
              </TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-3 mt-0">
              <div>
                <h4 className="text-xs font-medium mb-2">System Info</h4>
                <div className="space-y-1">
                  {Object.entries(systemInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-xs font-medium mb-2">Performance</h4>
                <div className="space-y-1">
                  {Object.entries(performanceInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="theme" className="space-y-3 mt-0">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start"
                >
                  <Palette className="h-3 w-3 mr-2" />
                  Toggle Theme ({isDark ? 'Dark' : 'Light'})
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-background border text-xs text-center">
                    Light Mode
                  </div>
                  <div className="p-2 rounded bg-foreground text-background text-xs text-center">
                    Dark Mode
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-2 mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full justify-start"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Reload Page
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearStorage}
                className="w-full justify-start"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Clear Storage
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logSystemInfo}
                className="w-full justify-start"
              >
                <Monitor className="h-3 w-3 mr-2" />
                Log System Info
              </Button>

              <div className="text-xs text-muted-foreground mt-2">
                <div>PWA: {isInstallable ? '✅ Installable' : '❌ Not Installable'}</div>
                <div>Update: {isUpdateAvailable ? '🔄 Available' : '✅ Up to date'}</div>
                <div>Network: {isOnline ? '🟢 Online' : '🔴 Offline'}</div>
              </div>
            </TabsContent>

            <TabsContent value="debug" className="space-y-2 mt-0">
              <Button
                variant="destructive"
                size="sm"
                onClick={triggerError}
                className="w-full justify-start"
              >
                <Bug className="h-3 w-3 mr-2" />
                Trigger Error
              </Button>
              
              <div className="text-xs space-y-1">
                <div className="text-muted-foreground">Feature Flags:</div>
                {Object.entries(FEATURE_FLAGS).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <Badge variant={value ? 'default' : 'secondary'} className="text-xs h-4">
                      {value ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
