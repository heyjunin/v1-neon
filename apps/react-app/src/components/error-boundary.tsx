import { dev } from '@/lib/utils'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
// Error boundary component for catching React errors

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: React.ErrorInfo | null
  resetError: () => void
}

// Error Fallback padrão
function DefaultErrorFallback({ error, errorInfo, resetError }: ErrorFallbackProps) {
  const isDev = import.meta.env.DEV

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Oops! Algo deu errado</CardTitle>
          <CardDescription>
            Ocorreu um erro inesperado na aplicação. Tente recarregar a página ou voltar ao início.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
          
          {isDev && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                Detalhes do Erro (Dev Mode)
              </summary>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-xs font-mono text-destructive mb-2">
                  {error.name}: {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                    {error.stack}
                  </pre>
                )}
                {errorInfo?.componentStack && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Component Stack:
                    </p>
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Error Boundary Class Component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log do erro
    dev.error('Error Boundary caught an error:', error, errorInfo)

    // Callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Em produção, você pode enviar para um serviço de monitoramento
    if (!import.meta.env.DEV) {
      // Exemplo: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Hook para trigger de erros (útil para testing)
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    throw error
  }, [])
}

// Componente para teste de erro (apenas em dev)
export function ErrorTrigger() {
  const triggerError = useErrorHandler()

  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => triggerError(new Error('Erro de teste disparado pelo dev'))}
      >
        🐛 Trigger Error (Dev)
      </Button>
    </div>
  )
}
