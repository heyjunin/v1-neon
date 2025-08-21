import { cn } from '@/lib/utils'
import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Separator } from '@v1/ui/separator'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  backTo?: {
    path: string
    label?: string
  }
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  badge,
  backTo,
  actions,
  className,
  children
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 pb-6', className)}>
      {/* Back Navigation */}
      {backTo && (
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link to={backTo.path}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backTo.label || 'Voltar'}
            </Link>
          </Button>
        </div>
      )}

      {/* Header Content */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {badge && (
              <Badge variant={badge.variant || 'default'}>
                {badge.text}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>

      {/* Custom Children */}
      {children}

      <Separator />
    </div>
  )
}

// Variantes específicas do PageHeader
export function DashboardPageHeader({ title, ...props }: Omit<PageHeaderProps, 'title'> & { title: string }) {
  return (
    <PageHeader
      title={title}
      badge={{ text: 'Dashboard', variant: 'secondary' }}
      {...props}
    />
  )
}

export function ContentPageHeader({ title, ...props }: Omit<PageHeaderProps, 'title'> & { title: string }) {
  return (
    <PageHeader
      title={title}
      className="text-center sm:text-left"
      {...props}
    />
  )
}
