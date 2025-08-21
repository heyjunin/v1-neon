import { useAuth } from '@v1/auth/hooks'
import { Icons } from '@v1/ui/icons'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { user, isLoading, error } = useAuth()

  useEffect(() => {
    if (error) {
      console.error('Authentication error:', error)
      navigate('/login?error=auth_failed')
      return
    }

    if (!isLoading && user) {
      // Successful authentication
      navigate('/dashboard')
    }
  }, [user, isLoading, error, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Completing authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Icons.Check className="h-8 w-8 text-green-500 mx-auto mb-4" />
        <p className="text-lg">Authentication successful!</p>
        <p className="text-sm text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
