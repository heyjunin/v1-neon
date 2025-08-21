import { DashboardLayout } from '@/components/layouts'
import { DashboardPageHeader } from '@/components/templates'
import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Progress } from '@v1/ui/progress'
import {
  Activity,
  BarChart3,
  Calendar,
  FileText,
  Mail,
  TrendingUp,
  User,
  Users
} from 'lucide-react'

export function DashboardPage() {
  // Mock data
  const stats = [
    { title: 'Total Posts', value: '24', icon: FileText, trend: '+12%' },
    { title: 'Active Users', value: '1,234', icon: Users, trend: '+8%' },
    { title: 'Page Views', value: '45.2K', icon: TrendingUp, trend: '+23%' },
    { title: 'Engagement', value: '89%', icon: Activity, trend: '+5%' },
  ]

  const recentPosts = [
    { id: 1, title: 'Getting Started with React Router v6', author: 'John Doe', date: '2024-01-15', status: 'published' },
    { id: 2, title: 'Building a Design System with Radix UI', author: 'Jane Smith', date: '2024-01-14', status: 'draft' },
    { id: 3, title: 'TypeScript Best Practices', author: 'Mike Johnson', date: '2024-01-13', status: 'published' },
    { id: 4, title: 'Modern CSS with Tailwind', author: 'Sarah Wilson', date: '2024-01-12', status: 'published' },
  ]

  return (
    <DashboardLayout
      meta={{
        title: 'Dashboard - V1 React App',
        description: 'Painel de controle com métricas e informações importantes'
      }}
    >
      <DashboardPageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening today."
        actions={
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Email:</span>
              <span className="font-medium">user@example.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Member since:</span>
              <span className="font-medium">Jan 15, 2024</span>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">User ID:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                usr_123456
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>Your latest blog posts and articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium">{post.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progress Overview
            </CardTitle>
            <CardDescription>Your goals and achievements this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Posts Published</span>
                <span className="text-sm text-muted-foreground">18/20</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Engagement Rate</span>
                <span className="text-sm text-muted-foreground">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Page Views</span>
                <span className="text-sm text-muted-foreground">45.2K/50K</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
