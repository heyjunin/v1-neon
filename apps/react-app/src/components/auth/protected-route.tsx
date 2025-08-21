import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  // Temporariamente desabilitado - sempre redireciona para login
  const isAuthenticated = false
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }
  
  return <>{children}</>
}
