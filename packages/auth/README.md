# @v1/auth - Package de Autenticação Unificado

Este package fornece uma interface unificada para autenticação em aplicações Next.js e React Router, com suporte ao Supabase Auth.

## Características

- ✅ **Interface Universal**: Mesma API para Next.js e React Router
- ✅ **Provider Supabase**: Integração completa com Supabase Auth
- ✅ **Hooks Reutilizáveis**: `useAuth` e `useUser` para todas as apps
- ✅ **Componentes**: `AuthProvider` e `ProtectedRoute` prontos para uso
- ✅ **TypeScript**: Tipos completos e type-safe
- ✅ **OAuth**: Suporte para Google, Discord e outros providers

## Instalação

```bash
# O package já está incluído no monorepo
# Para usar em uma nova aplicação:
npm install @v1/auth
```

## Configuração

### Variáveis de Ambiente

#### Next.js
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### React Router (Vite)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Uso

### Next.js

```tsx
// app/providers.tsx
"use client";

import { AuthProvider } from "@v1/auth/components";
import { createBrowserAuthProvider } from "@v1/auth/providers/supabase";

const authProvider = createBrowserAuthProvider();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider provider={authProvider}>
      {children}
    </AuthProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// components/login.tsx
"use client";

import { useAuth } from "@v1/auth/hooks";

export function LoginButton() {
  const { signIn, isLoading } = useAuth();

  const handleLogin = () => {
    signIn("google", {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    });
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      Sign in with Google
    </button>
  );
}
```

### React Router

```tsx
// main.tsx
import { AuthProvider } from "@v1/auth/components";
import { createReactAuthProvider } from "@v1/auth/providers/supabase";

const authProvider = createReactAuthProvider();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider provider={authProvider}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// components/protected-route.tsx
import { ProtectedRoute } from "@v1/auth/components";

export function MyProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}

// pages/login.tsx
import { useAuth } from "@v1/auth/hooks";

export function LoginPage() {
  const { signIn, isLoading } = useAuth();

  const handleLogin = () => {
    signIn("google", {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      Sign in with Google
    </button>
  );
}
```

## API

### Hooks

#### `useAuth()`
Retorna o contexto completo de autenticação.

```tsx
const { user, isLoading, error, signIn, signOut, refreshSession } = useAuth();
```

#### `useUser()`
Retorna apenas os dados do usuário e estado de autenticação.

```tsx
const { user, isLoading, error, isAuthenticated } = useUser();
```

### Componentes

#### `AuthProvider`
Provider que gerencia o estado de autenticação.

```tsx
<AuthProvider provider={authProvider}>
  {children}
</AuthProvider>
```

#### `ProtectedRoute`
Componente que protege rotas baseado no estado de autenticação.

```tsx
<ProtectedRoute redirectTo="/login" fallback={<Loading />}>
  <ProtectedContent />
</ProtectedRoute>
```

### Providers

#### `createBrowserAuthProvider()` (Next.js)
Cria um provider para uso no lado do cliente.

#### `createServerAuthProvider()` (Next.js)
Cria um provider para uso no lado do servidor.

#### `createReactAuthProvider()` (React Router)
Cria um provider para aplicações React Router.

### Utilitários

#### `updateSession()` (Next.js)
Função para middleware do Next.js.

```tsx
// middleware.ts
import { updateSession } from "@v1/auth/utils";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request, NextResponse.next());
  // ... lógica adicional
  return response;
}
```

## Estrutura do Package

```
packages/auth/
├── src/
│   ├── providers/
│   │   └── supabase/
│   │       ├── shared.ts      # Lógica compartilhada
│   │       ├── nextjs.ts      # Providers Next.js
│   │       ├── react.ts       # Providers React Router
│   │       ├── types.ts       # Tipos do Supabase
│   │       └── index.ts       # Exports
│   ├── hooks/
│   │   ├── useAuth.ts         # Hook principal
│   │   ├── useUser.ts         # Hook para dados do usuário
│   │   └── index.ts           # Exports
│   ├── components/
│   │   ├── AuthProvider.tsx   # Provider universal
│   │   ├── ProtectedRoute.tsx # Rota protegida
│   │   └── index.ts           # Exports
│   ├── utils/
│   │   ├── middleware.ts      # Utils Next.js
│   │   ├── router.ts          # Utils React Router
│   │   └── index.ts           # Exports
│   └── types/
│       └── index.ts           # Tipos compartilhados
```

## Migração

### De @v1/supabase para @v1/auth

#### Antes
```tsx
import { createClient } from "@v1/supabase/client";

const supabase = createClient();
await supabase.auth.signInWithOAuth({ provider: "google" });
```

#### Depois
```tsx
import { useAuth } from "@v1/auth/hooks";

const { signIn } = useAuth();
await signIn("google");
```

## Contribuindo

1. Faça suas alterações no package `@v1/auth`
2. Execute `bun run typecheck` para verificar tipos
3. Teste em ambas as aplicações (Next.js e React Router)
4. Atualize a documentação se necessário

## Roadmap

- [ ] Suporte para outros providers (Auth0, Clerk, etc.)
- [ ] Refresh token automático
- [ ] Cache de sessão
- [ ] Middleware para React Router
- [ ] Testes unitários
- [ ] Exemplos de uso
