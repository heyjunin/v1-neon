import { Button } from '@v1/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Separator } from '@v1/ui/separator'
import { ArrowLeft } from 'lucide-react'
import type React from 'react'
import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  description?: string
  backLink?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, backLink, actions }: PageHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {backLink && (
              <Button variant="outline" size="sm" asChild>
                <Link to={backLink}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
            )}
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              {description && (
                <CardDescription className="text-base">{description}</CardDescription>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </CardHeader>
    </Card>
  )
}

export function ContentPageHeader({ title, description, backLink, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {backLink && (
            <Button variant="outline" size="sm" asChild>
              <Link to={backLink}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-lg">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <Separator className="mt-6" />
    </div>
  )
}

export function DashboardPageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <Separator className="mt-6" />
    </div>
  )
}
