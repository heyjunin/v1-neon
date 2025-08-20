# Implementação tRPC

Este documento descreve a implementação do tRPC na aplicação Next.js para substituir as APIs REST tradicionais.

## Estrutura

### Servidor tRPC

- `src/lib/trpc/server.ts` - Configuração base do servidor tRPC
- `src/lib/trpc/root.ts` - Router principal que combina todos os routers
- `src/lib/trpc/routers/posts.ts` - Router específico para operações de posts

### Cliente tRPC

- `src/lib/trpc/client.ts` - Cliente tRPC para React
- `src/lib/trpc/provider.tsx` - Provider do tRPC com React Query
- `src/lib/trpc/hooks.ts` - Hooks utilitários para facilitar o uso

### API Handler

- `src/app/api/trpc/[trpc]/route.ts` - Handler da API tRPC para Next.js App Router

## Rotas Implementadas

### Posts

- `posts.getPosts` - Listar posts com filtros e paginação
- `posts.getPostById` - Buscar post por ID
- `posts.getPostsByUserId` - Buscar posts por usuário
- `posts.createPost` - Criar novo post
- `posts.updatePost` - Atualizar post existente
- `posts.deletePost` - Deletar post

## Hooks Disponíveis

### Queries

- `usePosts(options)` - Buscar posts com filtros e paginação
- `usePost(id)` - Buscar post por ID
- `usePostsByUser(userId)` - Buscar posts por usuário

### Mutations

- `useCreatePost()` - Criar post
- `useUpdatePost()` - Atualizar post
- `useDeletePost()` - Deletar post

## Benefícios da Migração

1. **Type Safety**: Tipagem end-to-end entre cliente e servidor
2. **Developer Experience**: Autocomplete e validação em tempo real
3. **Performance**: Batching automático de requisições
4. **Error Handling**: Tratamento de erros consistente
5. **Caching**: Cache automático com React Query
6. **Real-time**: Suporte para WebSockets (futuro)

## Uso

### Exemplo de Query

```tsx
import { usePosts } from '@/lib/trpc';

function PostsList() {
  const { data, isLoading, error } = usePosts({
    search: 'react',
    page: 1,
    limit: 10
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Exemplo de Mutation

```tsx
import { useCreatePost } from '@/lib/trpc';

function CreatePost() {
  const createPost = useCreatePost();

  const handleSubmit = async (data) => {
    try {
      await createPost.mutateAsync(data);
      // Cache será invalidado automaticamente
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Migração de APIs REST

As seguintes APIs REST foram removidas e substituídas por tRPC:

- `GET /api/posts` → `posts.getPosts`
- `POST /api/posts` → `posts.createPost`
- `PUT /api/posts/[id]` → `posts.updatePost`
- `DELETE /api/posts/[id]` → `posts.deletePost`

## Configuração

O tRPC está configurado no layout principal da aplicação:

```tsx
// src/app/[locale]/layout.tsx
import { TRPCProvider } from "@/lib/trpc";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Próximos Passos

1. Implementar autenticação no contexto do tRPC
2. Adicionar validação de permissões
3. Implementar WebSockets para real-time
4. Adicionar mais routers (users, comments, etc.)
5. Implementar rate limiting
6. Adicionar logging estruturado
