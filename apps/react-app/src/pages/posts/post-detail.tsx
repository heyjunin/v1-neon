import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@v1/ui/card'
import { Separator } from '@v1/ui/separator'
import {
    ArrowLeft,
    Calendar,
    Clock,
    Edit,
    Eye,
    Tag,
    Trash2,
    User
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()

  // Mock data - in a real app, this would come from an API
  const post = {
    id: postId,
    title: 'Getting Started with React Router v6',
    content: `React Router v6 is the latest version of the popular routing library for React applications. It introduces several improvements and new features that make building complex routing systems easier and more intuitive.

## Key Features

### 1. Nested Routes
One of the most powerful features of React Router v6 is its support for nested routes. This allows you to create complex routing hierarchies where child routes are rendered within parent route components.

### 2. Dynamic Segments
Dynamic segments allow you to capture URL parameters and use them in your components. This is perfect for creating detail pages, user profiles, or any page that needs to display data based on URL parameters.

### 3. Programmatic Navigation
React Router v6 provides several ways to navigate programmatically, including the useNavigate hook and the navigate function.

### 4. Route Protection
You can easily protect routes by creating wrapper components that check authentication status and redirect users if necessary.

## Getting Started

To get started with React Router v6, you'll need to install the package:

\`\`\`bash
npm install react-router-dom
\`\`\`

Then, you can set up your router configuration and start building your routes.

## Best Practices

- Use the Outlet component to render nested routes
- Leverage the useParams hook to access URL parameters
- Implement proper error boundaries for your routes
- Use the useNavigate hook for programmatic navigation

React Router v6 makes building complex routing systems much more manageable and provides a great developer experience.`,
    author: 'John Doe',
    authorEmail: 'john.doe@example.com',
    date: '2024-01-15',
    updatedDate: '2024-01-16',
    status: 'published',
    views: 1247,
    readTime: '5 min read',
    tags: ['React', 'Routing', 'JavaScript', 'Frontend'],
    excerpt: 'Learn how to build modern React applications with React Router v6, including nested routes, dynamic segments, and navigation.'
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(`/posts/${postId}/edit`)
  }

  const handleDelete = () => {
    // In a real app, this would show a confirmation dialog
    navigate('/posts')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-muted-foreground">Visualizando detalhes do post</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Separator className="my-6" />
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Autor:</strong> {post.author}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Criado em:</strong>{' '}
                  {new Date(post.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {post.updatedDate && post.updatedDate !== post.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Atualizado em:</strong>{' '}
                    {new Date(post.updatedDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Visualizações:</strong> {post.views.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Tempo de leitura:</strong> {post.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Status:</strong>{' '}
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status}
                  </Badge>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Editar Post
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Tag className="h-4 w-4 mr-2" />
                Gerenciar Tags
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
