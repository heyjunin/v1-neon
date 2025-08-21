# V1 React App

Uma aplicação React simples construída com React Router v6, usando o design system do monorepo V1.

## 🚀 Características

- **React Router v6**: Roteamento moderno com nested routes e dynamic segments
- **V1 Design System**: Componentes UI consistentes baseados em Radix UI e Tailwind CSS
- **TypeScript**: Tipagem completa para melhor DX
- **Vite**: Build tool rápido e moderno
- **PWA Ready**: Progressive Web App com service worker e cache
- **Monorepo Ready**: Integração perfeita com o workspace do V1

## 📦 Tecnologias

- React 18
- React Router v6
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide React Icons

## 🏗️ Estrutura

```
src/
├── components/
│   └── layout/          # Componentes de layout
├── pages/               # Páginas da aplicação
│   ├── home/           # Página inicial
│   ├── dashboard/      # Dashboard
│   ├── posts/          # Listagem e detalhes de posts
│   └── profile/        # Perfil do usuário
└── router/             # Configuração do React Router
```

## 🚀 Como Executar

### Desenvolvimento

```bash
# A partir da raiz do monorepo
bun run dev:react-app

# Ou diretamente na pasta da aplicação
cd apps/react-app
bun dev
```

### Build

```bash
bun run build
```

### Preview

```bash
bun run preview
```

## 📱 Páginas Disponíveis

- **Home** (`/`): Página inicial com overview da aplicação
- **Dashboard** (`/dashboard`): Dashboard com estatísticas e informações do usuário
- **Posts** (`/posts`): Listagem de posts com filtros e busca
- **Post Detail** (`/posts/:id`): Detalhes de um post específico
- **Profile** (`/profile`): Perfil e configurações do usuário

## 🎨 Design System

A aplicação utiliza o package `@v1/ui` que fornece:

- Componentes baseados em Radix UI
- Sistema de design tokens
- Suporte a dark mode
- Componentes acessíveis
- Tailwind CSS para estilização

## 🔧 Configuração

### Vite

A aplicação usa Vite como build tool, configurado para:

- Suporte a TypeScript
- Hot Module Replacement
- Path aliases (`@/*`)
- Integração com Tailwind CSS

### TypeScript

Configuração TypeScript otimizada para:

- React 18
- JSX
- Path mapping
- Strict mode

### Tailwind CSS

Configurado para usar o preset do package UI:

```typescript
// tailwind.config.ts
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('@v1/ui/tailwind.config')],
}
```

## 📦 Dependências

### Principais

- `@v1/ui`: Design system compartilhado
- `react-router-dom`: Roteamento
- `lucide-react`: Ícones

### Desenvolvimento

- `@vitejs/plugin-react`: Plugin React para Vite
- `typescript`: Tipagem
- `tailwindcss`: CSS framework

## 🎯 Próximos Passos

Esta aplicação serve como base para:

1. **Integração com APIs**: Adicionar TanStack Query para data fetching
2. **Autenticação**: Integrar com Supabase Auth
3. **Estado Global**: Implementar Zustand ou Redux Toolkit
4. **Testes**: Adicionar Vitest e Testing Library
5. **PWA**: Transformar em Progressive Web App

## 🤝 Contribuição

Esta aplicação faz parte do monorepo V1. Para contribuir:

1. Siga os padrões do monorepo
2. Use o package UI para componentes
3. Mantenha a consistência com outras aplicações
4. Teste suas mudanças

## 📄 Licença

MIT - veja o arquivo LICENSE na raiz do projeto.
