import { useThemeContext } from '@/components/theme'
import { usePWA } from '@/hooks/use-pwa'
import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Separator } from '@v1/ui/separator'
import {
    CheckCircle,
    Download,
    Globe,
    Info,
    RefreshCw,
    Shield,
    Smartphone,
    WifiOff,
    Zap
} from 'lucide-react'

export function PWAPage() {
  const { 
    isInstalled, 
    isInstallable, 
    isOnline, 
    isUpdateAvailable, 
    installPWA, 
    updatePWA 
  } = usePWA()
  
  const { isDark } = useThemeContext()

  const pwaFeatures = [
    {
      title: 'Instalação',
      description: 'Instale o app no seu dispositivo',
      icon: Download,
      status: isInstalled ? 'Instalado' : isInstallable ? 'Disponível' : 'Não disponível',
      statusColor: isInstalled ? 'bg-green-500' : isInstallable ? 'bg-blue-500' : 'bg-gray-500',
      action: isInstallable ? installPWA : undefined,
      actionText: 'Instalar',
      disabled: !isInstallable || isInstalled
    },
    {
      title: 'Atualizações',
      description: 'Receba atualizações automáticas',
      icon: RefreshCw,
      status: isUpdateAvailable ? 'Disponível' : 'Atualizado',
      statusColor: isUpdateAvailable ? 'bg-orange-500' : 'bg-green-500',
      action: isUpdateAvailable ? updatePWA : undefined,
      actionText: 'Atualizar',
      disabled: !isUpdateAvailable
    },
    {
      title: 'Modo Offline',
      description: 'Funciona sem internet',
      icon: WifiOff,
      status: isOnline ? 'Online' : 'Offline',
      statusColor: isOnline ? 'bg-green-500' : 'bg-red-500',
      action: undefined,
      actionText: '',
      disabled: true
    },
    {
      title: 'App Nativo',
      description: 'Experiência como app nativo',
      icon: Smartphone,
      status: isInstalled ? 'Ativo' : 'Navegador',
      statusColor: isInstalled ? 'bg-green-500' : 'bg-blue-500',
      action: undefined,
      actionText: '',
      disabled: true
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">PWA Dashboard</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Gerencie e monitore as funcionalidades PWA da aplicação. 
          Veja o status de instalação, atualizações e conectividade.
        </p>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Status Geral</span>
          </CardTitle>
          <CardDescription>
            Visão geral do estado atual da aplicação PWA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className={`h-3 w-3 rounded-full mx-auto ${isInstalled ? 'bg-green-500' : 'bg-gray-300'}`} />
              <p className="text-sm font-medium">Instalação</p>
              <p className="text-xs text-muted-foreground">
                {isInstalled ? 'Instalado' : 'Não instalado'}
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className={`h-3 w-3 rounded-full mx-auto ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-sm font-medium">Conectividade</p>
              <p className="text-xs text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className={`h-3 w-3 rounded-full mx-auto ${isUpdateAvailable ? 'bg-orange-500' : 'bg-green-500'}`} />
              <p className="text-sm font-medium">Atualizações</p>
              <p className="text-xs text-muted-foreground">
                {isUpdateAvailable ? 'Disponível' : 'Atualizado'}
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className={`h-3 w-3 rounded-full mx-auto ${isInstallable ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <p className="text-sm font-medium">Instalável</p>
              <p className="text-xs text-muted-foreground">
                {isInstallable ? 'Sim' : 'Não'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {pwaFeatures.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${feature.statusColor.replace('bg-', 'bg-')}`}
                  >
                    {feature.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${feature.statusColor}`} />
                    <span className="text-sm text-muted-foreground">
                      {feature.status}
                    </span>
                  </div>
                  {feature.action && (
                    <Button 
                      size="sm" 
                      onClick={feature.action}
                      disabled={feature.disabled}
                    >
                      {feature.actionText}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Como Instalar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="font-medium">Chrome/Edge:</p>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Clique no ícone de instalação na barra de endereços</li>
                <li>• Ou use o menu (⋮) → "Instalar aplicativo"</li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <p className="font-medium">Safari (iOS):</p>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Toque no botão de compartilhar</li>
                <li>• Selecione "Adicionar à Tela de Início"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Benefícios PWA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Funciona offline</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instalação rápida</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Atualizações automáticas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Experiência nativa</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span>Informações do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Tema Atual</p>
              <p className="text-muted-foreground">{isDark ? 'Dark' : 'Light'}</p>
            </div>
            <div>
              <p className="font-medium">User Agent</p>
              <p className="text-muted-foreground text-xs truncate">
                {navigator.userAgent.split(' ')[0]}
              </p>
            </div>
            <div>
              <p className="font-medium">Service Worker</p>
              <p className="text-muted-foreground">
                {'serviceWorker' in navigator ? 'Suportado' : 'Não suportado'}
              </p>
            </div>
            <div>
              <p className="font-medium">Display Mode</p>
              <p className="text-muted-foreground">
                {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
