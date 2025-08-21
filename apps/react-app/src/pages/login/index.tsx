import { useAuth } from '@v1/auth/hooks'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Github, Mail } from 'lucide-react'

export function LoginPage() {
  const { signIn, isLoading } = useAuth()

  const handleGoogleSignIn = () => {
    signIn('google', {
      redirectTo: `${window.location.origin}/auth/callback`
    })
  }

  const handleDiscordSignIn = () => {
    signIn('discord', {
      redirectTo: `${window.location.origin}/auth/callback`
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your preferred sign-in method
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Sign in with your preferred provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
            <Button
              onClick={handleDiscordSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with Discord
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
