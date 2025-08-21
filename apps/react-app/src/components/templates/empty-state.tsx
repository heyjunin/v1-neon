import { cn } from '@/lib/utils'
import { Button } from '@v1/ui/button'
import { Card, CardContent } from '@v1/ui/card'
import {
    AlertCircle,
    Database,
    FileText,
    Inbox,
    Plus,
    Search,
    Settings,
    Users
} from 'lucide-react'
import React from 'react'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }
  className?: string
  children?: React.ReactNode
}

// Ícones pré-definidos para diferentes tipos de empty state
const EmptyStateIcons = {
  posts: FileText,
  search: Search,
  users: Users,
  inbox: Inbox,
  settings: Settings,
  database: Database,
  general: AlertCircle
}

export function EmptyState({
  icon: Icon = EmptyStateIcons.general,
  title,
  description,
  action,
  className,
  children
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="mb-4 h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}

      {action && (
        <Button 
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="mb-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}

      {children}
    </div>
  )
}

// Empty states específicos e reutilizáveis
export function EmptyPosts({ onCreatePost }: { onCreatePost?: () => void }) {
  return (
    <EmptyState
      icon={EmptyStateIcons.posts}
      title="Nenhum post encontrado"
      description="Você ainda não criou nenhum post. Comece criando seu primeiro post agora."
      action={onCreatePost ? {
        label: 'Criar Post',
        onClick: onCreatePost
      } : undefined}
    />
  )
}

export function EmptySearch({ query, onClearSearch }: { 
  query?: string
  onClearSearch?: () => void 
}) {
  return (
    <EmptyState
      icon={EmptyStateIcons.search}
      title={query ? `Nenhum resultado para "${query}"` : 'Nenhum resultado encontrado'}
      description="Tente ajustar seus filtros ou termos de busca para encontrar o que você está procurando."
      action={onClearSearch ? {
        label: 'Limpar Busca',
        onClick: onClearSearch,
        variant: 'outline'
      } : undefined}
    />
  )
}

export function EmptyUsers({ onInviteUser }: { onInviteUser?: () => void }) {
  return (
    <EmptyState
      icon={EmptyStateIcons.users}
      title="Nenhum usuário encontrado"
      description="Não há usuários cadastrados no sistema. Convide pessoas para se juntarem."
      action={onInviteUser ? {
        label: 'Convidar Usuário',
        onClick: onInviteUser
      } : undefined}
    />
  )
}

// Empty state em formato de card
export function EmptyStateCard({ 
  className,
  ...props 
}: EmptyStateProps & { className?: string }) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="p-0">
        <EmptyState {...props} />
      </CardContent>
    </Card>
  )
}

// Empty state para seções específicas
export function EmptySection({ 
  title, 
  description,
  className 
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('text-center py-8', className)}>
      <div className="mb-2 h-12 w-12 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="font-medium text-sm">{title}</h4>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
