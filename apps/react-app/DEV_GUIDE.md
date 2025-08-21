# 🚀 Guia de Desenvolvimento - V1 React App

Uma aplicação React **opinativa** e **otimizada** para desenvolvimento por uma única pessoa, focando em **velocidade**, **DRY** e **facilidade de manutenção**.

## 📁 Estrutura Opinativa

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layouts/         # Layouts de página
│   ├── templates/       # Templates reutilizáveis (headers, loading, empty states)
│   ├── theme/          # Sistema de tema
│   ├── pwa/            # Componentes PWA
│   ├── dev-tools/      # Ferramentas de desenvolvimento
│   └── error-boundary.tsx
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
│   ├── constants.ts    # Constantes centralizadas
│   ├── types.ts        # Tipos TypeScript
│   └── utils.ts        # Funções utilitárias
└── router/             # Configuração de rotas
```

## 🎯 Como Criar uma Nova Página

### 1. Página Simples

```tsx
// src/pages/minha-pagina/index.tsx
import { PageLayout } from '@/components/layouts'
import { PageHeader } from '@/components/templates'
import { Button } from '@v1/ui/button'

export function MinhaPaginaPage() {
  return (
    <PageLayout
      meta={{
        title: 'Minha Página - V1 React App',
        description: 'Descrição da minha página'
      }}
    >
      <PageHeader
        title="Minha Página"
        description="Descrição detalhada da página"
        actions={
          <Button>Ação Principal</Button>
        }
      />
      
      {/* Seu conteúdo aqui */}
    </PageLayout>
  )
}
```

### 2. Página de Dashboard

```tsx
// src/pages/meu-dashboard/index.tsx
import { DashboardLayout } from '@/components/layouts'
import { DashboardPageHeader } from '@/components/templates'

export function MeuDashboardPage() {
  return (
    <DashboardLayout
      meta={{ title: 'Meu Dashboard' }}
    >
      <DashboardPageHeader
        title="Dashboard"
        description="Métricas e informações importantes"
      />
      
      {/* Seu conteúdo de dashboard aqui */}
    </DashboardLayout>
  )
}
```

### 3. Página com Loading e Empty States

```tsx
// src/pages/lista/index.tsx
import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/layouts'
import { LoadingSpinner, EmptyState } from '@/components/templates'

export function ListaPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false)
      setItems([]) // ou seus dados
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSpinner text="Carregando lista..." />
      </PageLayout>
    )
  }

  if (items.length === 0) {
    return (
      <PageLayout>
        <EmptyState
          title="Nenhum item encontrado"
          description="Comece criando seu primeiro item"
          action={{
            label: 'Criar Item',
            onClick: () => console.log('Criar item')
          }}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Renderizar lista */}
    </PageLayout>
  )
}
```

## 🛠️ Ferramentas de Desenvolvimento

### Dev Panel
- Pressione o botão "Dev Tools" no canto inferior direito (apenas em desenvolvimento)
- Acesse informações do sistema, tema, performance e debug
- Teste funcionalidades como clear storage, trigger error, etc.

### Error Boundaries
- Erros são capturados automaticamente
- Em desenvolvimento, mostra detalhes completos do erro
- Em produção, mostra interface amigável ao usuário

### Constantes Centralizadas

```tsx
// src/lib/constants.ts
import { APP_CONFIG, FEATURE_FLAGS } from '@/lib/constants'

// Usar constantes ao invés de strings hardcoded
console.log(APP_CONFIG.name) // 'V1 React App'
```

### Utilities

```tsx
// src/lib/utils.ts
import { cn, storage, date, dev } from '@/lib/utils'

// Combinar classes CSS
const className = cn('base-class', condition && 'conditional-class')

// Storage com type safety
storage.set('key', { data: 'value' })
const data = storage.get('key')

// Formatação de datas
const formatted = date.format(new Date()) // '15 de janeiro de 2024'
const relative = date.relative(new Date()) // 'há 5 minutos'

// Logs de desenvolvimento
dev.log('Debug info') // Só aparece em desenvolvimento
```

## 🎨 Sistema de Tema

### Usar o Tema

```tsx
import { useThemeContext } from '@/components/theme'

function MeuComponente() {
  const { theme, isDark, toggleTheme } = useThemeContext()
  
  return (
    <div className={cn('p-4', isDark && 'bg-dark-specific')}>
      Tema atual: {theme}
    </div>
  )
}
```

## 📱 PWA Features

### Usar PWA State

```tsx
import { usePWA } from '@/hooks/use-pwa'

function MeuComponente() {
  const { isInstalled, isOnline, installPWA } = usePWA()
  
  return (
    <div>
      {!isInstalled && (
        <Button onClick={installPWA}>
          Instalar App
        </Button>
      )}
      <div>Status: {isOnline ? 'Online' : 'Offline'}</div>
    </div>
  )
}
```

## 🔄 Adicionar Nova Rota

1. Criar a página em `src/pages/nova-pagina/index.tsx`
2. Adicionar no router:

```tsx
// src/router/index.tsx
import { NovaPaginaPage } from '@/pages/nova-pagina'

// Adicionar na configuração de rotas
{
  path: 'nova-pagina',
  element: <NovaPaginaPage />,
}
```

3. Adicionar no header (se necessário):

```tsx
// src/components/layout/header.tsx
const navItems = [
  // ... outras rotas
  { path: '/nova-pagina', label: 'Nova Página', icon: IconeEscolhido },
]
```

## 🧪 Padrões de Código

### 1. Sempre use os layouts
```tsx
// ❌ Não fazer
export function MinhaPage() {
  return <div>Conteúdo</div>
}

// ✅ Fazer
export function MinhaPage() {
  return (
    <PageLayout>
      <div>Conteúdo</div>
    </PageLayout>
  )
}
```

### 2. Use templates para consistência
```tsx
// ✅ Use PageHeader ao invés de criar headers customizados
<PageHeader
  title="Título"
  description="Descrição"
  actions={<Button>Ação</Button>}
/>
```

### 3. Gerencie estados de loading e empty
```tsx
// ✅ Sempre considere loading e empty states
if (isLoading) return <LoadingSpinner />
if (isEmpty) return <EmptyState />
return <ConteudoNormal />
```

### 4. Use constantes centralizadas
```tsx
// ❌ Não fazer
const appName = 'V1 React App'

// ✅ Fazer
import { APP_CONFIG } from '@/lib/constants'
const appName = APP_CONFIG.name
```

## 🚀 Deploy e Build

```bash
# Desenvolvimento
bun run dev

# Build para produção
bun run build

# Preview do build
bun run preview
```

## 🔧 Troubleshooting

### Problema: Componente não encontrado
- Verifique se está importando do caminho correto (`@/components/...`)
- Verifique se o componente está exportado no `index.ts`

### Problema: Tema não funciona
- Verifique se a aplicação está envolvida no `ThemeProvider`
- Verifique se as classes CSS estão corretas (use `cn()` para combinar)

### Problema: PWA não instala
- Verifique se está rodando em HTTPS (ou localhost)
- Verifique se o service worker está registrado
- Use o Dev Panel para debuggar o estado PWA

## 📚 Recursos Úteis

- **Página de Exemplos**: `/examples` - Veja todos os componentes em ação
- **Dev Tools**: Canto inferior direito em desenvolvimento
- **Design System**: Baseado no V1 UI com Radix + Tailwind
- **Ícones**: Lucide React (https://lucide.dev)

---

**Dica**: Sempre comece copiando um exemplo existente e modificando. É mais rápido e mantém a consistência! 🎯
