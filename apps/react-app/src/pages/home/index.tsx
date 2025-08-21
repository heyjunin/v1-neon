import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { ArrowRight, Shield, Sparkles, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm">
            <Sparkles className="h-3 w-3 mr-1" />
            Built with React Router v6
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to{' '}
            <span className="text-primary">V1 React App</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple React application built with React Router v6, using the V1 design system.
            No API calls, no database - just pure React goodness.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/dashboard">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/posts">
              View Posts
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This application demonstrates the power of React Router v6 combined with the V1 design system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>React Router v6</CardTitle>
              <CardDescription>
                Modern routing with nested routes, dynamic segments, and navigation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Nested routing</li>
                <li>• Dynamic segments</li>
                <li>• Programmatic navigation</li>
                <li>• Route protection</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>V1 Design System</CardTitle>
              <CardDescription>
                Consistent UI components built with Radix UI and Tailwind CSS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Radix UI primitives</li>
                <li>• Tailwind CSS styling</li>
                <li>• Dark mode support</li>
                <li>• Accessible components</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Monorepo Ready</CardTitle>
              <CardDescription>
                Built to work seamlessly within the V1 monorepo structure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Workspace dependencies</li>
                <li>• Shared packages</li>
                <li>• TypeScript support</li>
                <li>• Consistent tooling</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    View your dashboard with sample data
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse and view sample posts
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/posts">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
