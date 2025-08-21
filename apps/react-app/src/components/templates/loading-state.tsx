// Loading state components for different contexts
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@v1/ui/card'
import { Skeleton } from '@v1/ui/skeleton'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  className?: string
  variant?: 'spinner' | 'skeleton' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8'
}

// Loading com spinner
export function LoadingSpinner({ className, size = 'md', text }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2 p-8', className)}>
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}

// Loading com skeleton
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Loading para listas
export function LoadingList({ items = 5, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

// Loading para tabela
export function LoadingTable({ rows = 5, columns = 4, className }: { 
  rows?: number; 
  columns?: number; 
  className?: string 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex space-x-4 p-3 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Loading geral que escolhe o tipo baseado na variante
export function LoadingState({ variant = 'spinner', className, ...props }: LoadingStateProps) {
  switch (variant) {
    case 'skeleton':
      return <LoadingSkeleton className={className} />
    case 'pulse':
      return (
        <div className={cn('animate-pulse', className)}>
          <LoadingSkeleton />
        </div>
      )
    default:
      return <LoadingSpinner className={className} {...props} />
  }
}
