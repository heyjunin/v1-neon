import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@v1/ui/tabs'
import {
    AlertCircle,
    BookOpen,
    Code2,
    Layout,
    Loader2,
    Sparkles
} from 'lucide-react'
import { useState } from 'react'

// Importar todos os templates e componentes
import { PageLayout } from '@/components/layouts'
import {
    ContentPageHeader, DashboardPageHeader, EmptyPosts,
    EmptySearch,
    EmptyStateCard, LoadingList, LoadingSkeleton, LoadingSpinner, LoadingTable, PageHeader
} from '@/components/templates'

export function ExamplesPage() {
  const [currentExample, setCurrentExample] = useState<string>('layouts')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)

  const triggerLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const examples = [
    {
      id: 'layouts',
      title: 'Layouts',
      description: 'Diferentes tipos de layout para páginas',
      icon: Layout
    },
    {
      id: 'headers',
      title: 'Page Headers',
      description: 'Cabeçalhos padronizados para páginas',
      icon: BookOpen
    },
    {
      id: 'loading',
      title: 'Loading States',
      description: 'Estados de carregamento reutilizáveis',
      icon: Loader2
    },
    {
      id: 'empty',
      title: 'Empty States',
      description: 'Estados vazios com call-to-actions',
      icon: AlertCircle
    }
  ]

  return (
    <PageLayout
      meta={{
        title: 'Exemplos de Componentes - V1 React App',
        description: 'Guia prático de como usar os componentes e templates da aplicação'
      }}
      maxWidth="full"
    >
      <PageHeader
        title="Guia de Componentes"
        description="Exemplos práticos de como usar layouts, templates e componentes da aplicação. Use este guia como referência para criar novas páginas."
        badge={{ text: 'Dev Guide', variant: 'secondary' }}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Code2 className="h-4 w-4 mr-2" />
              Ver Código
            </Button>
            <Button size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Novo Exemplo
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com navegação */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Exemplos
          </h3>
          {examples.map((example) => {
            const Icon = example.icon
            return (
              <Button
                key={example.id}
                variant={currentExample === example.id ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setCurrentExample(example.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {example.title}
              </Button>
            )
          })}
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3">
          <Tabs value={currentExample} onValueChange={setCurrentExample}>
            <TabsList className="hidden">
              {examples.map(example => (
                <TabsTrigger key={example.id} value={example.id} />
              ))}
            </TabsList>

            {/* Layouts Examples */}
            <TabsContent value="layouts" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Sistema de Layouts</h2>
                <p className="text-muted-foreground mb-4">
                  Diferentes tipos de layout para diferentes necessidades de páginas.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">PageLayout</CardTitle>
                    <CardDescription>Layout padrão para páginas gerais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 p-4 rounded-md text-sm font-mono">
                      {`<PageLayout maxWidth="xl" padding="md">
  {children}
</PageLayout>`}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">DashboardLayout</CardTitle>
                    <CardDescription>Layout otimizado para dashboards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 p-4 rounded-md text-sm font-mono">
                      {`<DashboardLayout>
  {children}
</DashboardLayout>`}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ContentLayout</CardTitle>
                    <CardDescription>Layout para artigos e conteúdo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 p-4 rounded-md text-sm font-mono">
                      {`<ContentLayout>
  {children}
</ContentLayout>`}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CenteredLayout</CardTitle>
                    <CardDescription>Layout centralizado para auth, erro, etc</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 p-4 rounded-md text-sm font-mono">
                      {`<CenteredLayout>
  {children}
</CenteredLayout>`}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Headers Examples */}
            <TabsContent value="headers" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Page Headers</h2>
                <p className="text-muted-foreground mb-4">
                  Cabeçalhos padronizados que podem ser reutilizados em diferentes páginas.
                </p>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <PageHeader
                      title="Exemplo de Page Header"
                      description="Este é um exemplo de como usar o PageHeader com descrição e ações."
                      badge={{ text: 'Exemplo', variant: 'outline' }}
                      actions={
                        <Button size="sm">
                          Ação Principal
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <DashboardPageHeader
                      title="Dashboard Header"
                      description="Header específico para páginas de dashboard."
                      backTo={{ path: '/', label: 'Voltar' }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <ContentPageHeader
                      title="Content Header"
                      description="Header para páginas de conteúdo, centralizado em telas menores."
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Loading Examples */}
            <TabsContent value="loading" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Loading States</h2>
                  <p className="text-muted-foreground mb-4">
                    Diferentes tipos de loading para diferentes contextos.
                  </p>
                </div>
                <Button onClick={triggerLoading} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Testar Loading
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Loading Spinner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <LoadingSpinner text="Carregando..." />
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        Clique em "Testar Loading" para ver o spinner
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Loading Skeleton</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <LoadingSkeleton />
                    ) : (
                      <div className="text-center p-8 text-muted-foreground">
                        Clique em "Testar Loading" para ver o skeleton
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Loading List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoadingList items={3} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Loading Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoadingTable rows={3} columns={3} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Empty States Examples */}
            <TabsContent value="empty" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Empty States</h2>
                  <p className="text-muted-foreground mb-4">
                    Estados vazios com call-to-actions para engajar o usuário.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmpty(!showEmpty)}
                >
                  {showEmpty ? 'Mostrar Conteúdo' : 'Mostrar Empty State'}
                </Button>
              </div>

              {showEmpty ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <EmptyStateCard
                    title="Empty State Genérico"
                    description="Estado vazio genérico com ação personalizada."
                    action={{
                      label: 'Criar Novo',
                      onClick: () => alert('Ação executada!')
                    }}
                  />

                  <Card>
                    <CardContent className="p-0">
                      <EmptyPosts onCreatePost={() => alert('Criar post!')} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-0">
                      <EmptySearch 
                        query="React"
                        onClearSearch={() => alert('Busca limpa!')} 
                      />
                    </CardContent>
                  </Card>

                  <EmptyStateCard
                    title="Estado Customizado"
                    description="Você pode personalizar completamente o empty state."
                  >
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Ação 1</Button>
                      <Button size="sm" variant="outline">Ação 2</Button>
                    </div>
                  </EmptyStateCard>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <CardTitle>Item {i + 1}</CardTitle>
                        <CardDescription>
                          Descrição do item {i + 1}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Conteúdo do card {i + 1}. Este é um exemplo de como
                          o conteúdo aparece quando não está vazio.
                        </p>
                        <div className="mt-3">
                          <Badge variant="secondary">Tag {i + 1}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  )
}
