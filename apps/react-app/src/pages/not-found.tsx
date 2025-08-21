import { Button } from '@v1/ui/button'
import { Card, CardContent } from '@v1/ui/card'
import { ArrowLeft, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-primary">404</h1>
              <h2 className="text-2xl font-semibold">Page Not Found</h2>
              <p className="text-muted-foreground">
                Sorry, the page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
