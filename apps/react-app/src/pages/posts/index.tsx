import { Link } from 'react-router-dom'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Badge } from '@v1/ui/badge'
import { Input } from '@v1/ui/input'
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  User, 
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export function PostsPage() {
  // Mock data
  const posts = [
    {
      id: 1,
      title: 'Getting Started with React Router v6',
      excerpt: 'Learn how to build modern React applications with React Router v6, including nested routes, dynamic segments, and navigation.',
      author: 'John Doe',
      date: '2024-01-15',
      status: 'published',
      views: 1247,
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Building a Design System with Radix UI',
      excerpt: 'Discover how to create a comprehensive design system using Radix UI primitives and Tailwind CSS for consistent, accessible components.',
      author: 'Jane Smith',
      date: '2024-01-14',
      status: 'draft',
      views: 0,
      readTime: '8 min read'
    },
    {
      id: 3,
      title: 'TypeScript Best Practices for React',
      excerpt: 'Explore advanced TypeScript patterns and best practices specifically tailored for React development.',
      author: 'Mike Johnson',
      date: '2024-01-13',
      status: 'published',
      views: 892,
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Modern CSS with Tailwind CSS',
      excerpt: 'Master utility-first CSS with Tailwind CSS and learn how to build beautiful, responsive interfaces efficiently.',
      author: 'Sarah Wilson',
      date: '2024-01-12',
      status: 'published',
      views: 1563,
      readTime: '4 min read'
    },
    {
      id: 5,
      title: 'State Management in React Applications',
      excerpt: 'Compare different state management solutions for React applications and learn when to use each approach.',
      author: 'Alex Brown',
      date: '2024-01-11',
      status: 'published',
      views: 734,
      readTime: '7 min read'
    },
    {
      id: 6,
      title: 'Performance Optimization in React',
      excerpt: 'Learn advanced techniques for optimizing React application performance, including memoization and code splitting.',
      author: 'Emily Davis',
      date: '2024-01-10',
      status: 'published',
      views: 1102,
      readTime: '9 min read'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Manage and view your blog posts</p>
        </div>
        <Button asChild>
          <Link to="/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            All Posts
          </Button>
          <Button variant="outline" size="sm">
            Published
          </Button>
          <Button variant="outline" size="sm">
            Drafts
          </Button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </div>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Post Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views.toLocaleString()}
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`/posts/${post.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (hidden when posts exist) */}
      {posts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first post to get started with your blog.
            </p>
            <Button asChild>
              <Link to="/posts/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
