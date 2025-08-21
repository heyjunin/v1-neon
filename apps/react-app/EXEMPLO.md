# Exemplo de Uso - V1 React App

Este arquivo demonstra como usar a aplicação React criada.

## 🚀 Executando a Aplicação

### 1. Instalar Dependências

```bash
# Na raiz do monorepo
bun install
```

### 2. Executar em Desenvolvimento

```bash
# Opção 1: A partir da raiz do monorepo
bun run dev:react-app

# Opção 2: Diretamente na pasta da aplicação
cd apps/react-app
bun dev
```

A aplicação estará disponível em: `http://localhost:3003`

## 📱 Navegação

### Páginas Disponíveis

1. **Home** (`/`)
   - Página inicial com overview da aplicação
   - Demonstração dos recursos do React Router v6
   - Links para outras páginas

2. **Dashboard** (`/dashboard`)
   - Dashboard com estatísticas mockadas
   - Cards com informações do usuário
   - Gráficos de progresso

3. **Posts** (`/posts`)
   - Listagem de posts com dados mockados
   - Filtros e busca (funcionalidade visual)
   - Cards com informações dos posts

4. **Post Detail** (`/posts/:id`)
   - Detalhes de um post específico
   - Usa parâmetros dinâmicos do React Router
   - Sidebar com informações adicionais

5. **Profile** (`/profile`)
   - Perfil do usuário com dados mockados
   - Formulários de edição
   - Estatísticas do usuário

## 🎨 Componentes Utilizados

### Do Package UI (`@v1/ui`)

- `Button`: Botões com variantes (default, outline, etc.)
- `Card`: Cards para organizar conteúdo
- `Badge`: Badges para status e tags
- `Input`: Campos de entrada
- `Label`: Labels para formulários
- `Avatar`: Avatar do usuário
- `Separator`: Separadores visuais
- `Progress`: Barras de progresso
- `NavigationMenu`: Menu de navegação

### Ícones (Lucide React)

- `Home`, `BarChart3`, `FileText`, `User`
- `ArrowLeft`, `ArrowRight`, `Plus`, `Search`
- `Calendar`, `Eye`, `Edit`, `Trash2`
- `Settings`, `Shield`, `Bell`, `Key`

## 🔧 Funcionalidades Demonstradas

### React Router v6

1. **Nested Routes**: Layout compartilhado com `<Outlet />`
2. **Dynamic Segments**: `/posts/:id` para detalhes de posts
3. **Programmatic Navigation**: `useNavigate()` para navegação
4. **Route Parameters**: `useParams()` para acessar parâmetros
5. **Navigation State**: `useLocation()` para estado da rota

### Design System

1. **Consistent Styling**: Todos os componentes seguem o design system
2. **Responsive Design**: Layout responsivo com Tailwind CSS
3. **Dark Mode Ready**: Componentes preparados para dark mode
4. **Accessibility**: Componentes acessíveis do Radix UI

### TypeScript

1. **Type Safety**: Tipagem completa em todos os componentes
2. **Path Aliases**: `@/*` para imports mais limpos
3. **Component Props**: Props tipadas para todos os componentes

## 📊 Dados Mockados

A aplicação usa dados mockados para demonstrar:

- **Posts**: Lista de posts com títulos, autores, datas
- **User Data**: Informações do usuário (nome, email, bio)
- **Statistics**: Métricas e estatísticas
- **Navigation**: Links e rotas funcionais

## 🎯 Próximos Passos

Para expandir esta aplicação:

1. **Adicionar TanStack Query**:
   ```bash
   bun add @tanstack/react-query
   ```

2. **Integrar com Supabase**:
   ```bash
   # Já disponível no monorepo
   # Usar @v1/supabase
   ```

3. **Adicionar Estado Global**:
   ```bash
   bun add zustand
   ```

4. **Implementar Testes**:
   ```bash
   bun add -D vitest @testing-library/react @testing-library/jest-dom
   ```

## 🔍 Estrutura de Arquivos

```
apps/react-app/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── root-layout.tsx    # Layout principal
│   │       ├── header.tsx         # Header com navegação
│   │       └── footer.tsx         # Footer
│   ├── pages/
│   │   ├── home/
│   │   │   └── index.tsx          # Página inicial
│   │   ├── dashboard/
│   │   │   └── index.tsx          # Dashboard
│   │   ├── posts/
│   │   │   ├── index.tsx          # Listagem de posts
│   │   │   └── post-detail.tsx    # Detalhes do post
│   │   ├── profile/
│   │   │   └── index.tsx          # Perfil do usuário
│   │   └── not-found.tsx          # Página 404
│   ├── router/
│   │   └── index.tsx              # Configuração do React Router
│   └── main.tsx                   # Ponto de entrada
├── package.json                   # Dependências
├── vite.config.ts                 # Configuração do Vite
├── tailwind.config.ts             # Configuração do Tailwind
├── tsconfig.json                  # Configuração do TypeScript
└── README.md                      # Documentação
```

## 🎉 Conclusão

Esta aplicação demonstra como criar uma aplicação React moderna usando:

- ✅ React Router v6 para roteamento
- ✅ Design system compartilhado do monorepo
- ✅ TypeScript para type safety
- ✅ Vite para build rápido
- ✅ Tailwind CSS para estilização
- ✅ Componentes acessíveis do Radix UI

A aplicação está pronta para ser expandida com funcionalidades reais como APIs, autenticação e estado global.
