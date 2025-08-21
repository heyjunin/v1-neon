// Page layout components with SEO support
import type { LayoutProps, PageMeta } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Helmet } from 'react-helmet-async'

interface PageLayoutProps extends LayoutProps {
  meta?: PageMeta
  containerClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-none'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

export function PageLayout({
  children,
  meta,
  className,
  containerClassName,
  maxWidth = 'xl',
  padding = 'md'
}: PageLayoutProps) {
  return (
    <>
      {meta && (
        <Helmet>
          <title>{meta.title}</title>
          {meta.description && <meta name="description" content={meta.description} />}
          {meta.keywords && <meta name="keywords" content={meta.keywords.join(', ')} />}
          {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
          <meta property="og:title" content={meta.title} />
          {meta.description && <meta property="og:description" content={meta.description} />}
        </Helmet>
      )}
      
      <div className={cn('min-h-[calc(100vh-8rem)] flex flex-col', className)}>
        <div className={cn(
          'container mx-auto flex-1',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          containerClassName
        )}>
          {children}
        </div>
      </div>
    </>
  )
}

// Layout específico para páginas de dashboard
export function DashboardLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <PageLayout
      className={cn('bg-muted/30', className)}
      maxWidth="full"
      padding="lg"
      {...props}
    >
      {children}
    </PageLayout>
  )
}

// Layout para páginas de conteúdo/artigos
export function ContentLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <PageLayout
      className={className}
      maxWidth="lg"
      padding="md"
      {...props}
    >
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {children}
      </div>
    </PageLayout>
  )
}

// Layout centrado para páginas de auth, erro, etc
export function CenteredLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <PageLayout
      className={cn('items-center justify-center', className)}
      maxWidth="sm"
      padding="md"
      {...props}
    >
      {children}
    </PageLayout>
  )
}
