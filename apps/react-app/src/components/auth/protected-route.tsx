import { ProtectedRoute as AuthProtectedRoute } from '@v1/auth/components'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  return (
    <AuthProtectedRoute redirectTo={redirectTo}>
      {children}
    </AuthProtectedRoute>
  )
}
