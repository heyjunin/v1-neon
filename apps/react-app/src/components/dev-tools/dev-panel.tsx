import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Separator } from '@v1/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@v1/ui/tabs'
import {
  Bug,
  Code,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Monitor,
  Network,
  Settings,
  Shield,
  Smartphone
} from 'lucide-react'
import { useState } from 'react'

// Tipos para as APIs do navegador
interface PerformanceMemory {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface NavigatorConnection {
  effectiveType: string
  downlink: number
  rtt: number
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory
}

interface ExtendedNavigator extends Navigator {
  connection?: NavigatorConnection
  deviceMemory?: number
}

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Informações do sistema
  const systemInfo = {
    'User Agent': navigator.userAgent,
    'Platform': navigator.platform,
    'Language': navigator.language,
    'Cookie Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
    'Online': navigator.onLine ? 'Yes' : 'No',
    'Do Not Track': navigator.doNotTrack || 'Not set',
    'Hardware Concurrency': navigator.hardwareConcurrency || 'Unknown'
  }

  // Informações de performance
  const performanceInfo = {
    'Memory Used': `${Math.round(((performance as ExtendedPerformance).memory?.usedJSHeapSize || 0) / 1024 / 1024)} MB`,
    'Memory Total': `${Math.round(((performance as ExtendedPerformance).memory?.totalJSHeapSize || 0) / 1024 / 1024)} MB`,
    'Connection': ((navigator as ExtendedNavigator).connection?.effectiveType || 'Unknown'),
    'Device Memory': `${(navigator as ExtendedNavigator).deviceMemory || 'Unknown'} GB`,
    'Hardware Concurrency': navigator.hardwareConcurrency || 'Unknown'
  }

  // Informações de tela
  const screenInfo = {
    'Width': `${screen.width}px`,
    'Height': `${screen.height}px`,
    'Available Width': `${screen.availWidth}px`,
    'Available Height': `${screen.availHeight}px`,
    'Color Depth': `${screen.colorDepth} bits`,
    'Pixel Depth': `${screen.pixelDepth} bits`,
    'Device Pixel Ratio': window.devicePixelRatio || 'Unknown'
  }

  // Informações de localização
  const locationInfo = {
    'Protocol': window.location.protocol,
    'Host': window.location.host,
    'Pathname': window.location.pathname,
    'Search': window.location.search || 'None',
    'Hash': window.location.hash || 'None',
    'Origin': window.location.origin
  }

  // Informações de storage
  const storageInfo = {
    'Local Storage': localStorage ? 'Available' : 'Not Available',
    'Session Storage': sessionStorage ? 'Available' : 'Not Available',
    'IndexedDB': 'indexedDB' in window ? 'Available' : 'Not Available',
    'WebSQL': 'openDatabase' in window ? 'Available' : 'Not Available'
  }

  // Informações de APIs
  const apiInfo = {
    'Service Workers': 'serviceWorker' in navigator ? 'Available' : 'Not Available',
    'Push Notifications': 'PushManager' in window ? 'Available' : 'Not Available',
    'Geolocation': 'geolocation' in navigator ? 'Available' : 'Not Available',
    'WebGL': 'WebGLRenderingContext' in window ? 'Available' : 'Not Available',
    'Web Audio': 'AudioContext' in window ? 'Available' : 'Not Available',
    'WebRTC': 'RTCPeerConnection' in window ? 'Available' : 'Not Available'
  }

  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <Bug className="h-4 w-4" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-96 max-h-96 overflow-hidden shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Dev Tools
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <CardDescription>
              Development information and debugging tools
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
                <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
                <TabsTrigger value="apis" className="text-xs">APIs</TabsTrigger>
              </TabsList>

              <div className="max-h-64 overflow-y-auto p-4">
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3" />
                      <span>React 18</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3" />
                      <span>TypeScript</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <span>Vite</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      <span>Custom Auth</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="system" className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Cpu className="h-3 w-3" />
                      System Info
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(systemInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Smartphone className="h-3 w-3" />
                      Screen Info
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(screenInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <HardDrive className="h-3 w-3" />
                      Performance
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(performanceInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Database className="h-3 w-3" />
                      Storage
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(storageInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <Badge variant={value === 'Available' ? 'default' : 'secondary'} className="text-xs">
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="apis" className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Settings className="h-3 w-3" />
                      Web APIs
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(apiInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <Badge variant={value === 'Available' ? 'default' : 'secondary'} className="text-xs">
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Network className="h-3 w-3" />
                      Location
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(locationInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-mono max-w-32 truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
