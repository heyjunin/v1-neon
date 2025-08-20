# tRPC Logger Implementation

## Visão Geral

Esta implementação adiciona logging detalhado ao tRPC usando o `loggerLink` oficial, combinado com middleware de logging personalizado no servidor.

## Estrutura Implementada

### 1. Logger Link (Cliente)

**Arquivo:** `src/lib/trpc/logger-config.ts`

- **Configuração Automática:** Detecta automaticamente o ambiente (dev/prod)
- **Logs em Desenvolvimento:** Logs completos de todas as operações
- **Logs em Produção:** Apenas erros
- **Prefixos Personalizados:** `[tRPC Client]`, `[tRPC Client Error]`
- **Suporte a Cores:** ANSI no servidor, CSS no cliente

### 2. Middleware de Logging (Servidor)

**Arquivo:** `src/lib/trpc/context.ts`

- **Logs Detalhados:** Inclui tipo de operação, usuário, input, duração
- **Tratamento de Erros:** Captura e loga erros com contexto completo
- **Timestamps:** ISO strings para rastreamento temporal
- **Prefixos:** `[tRPC Server]` para identificação

### 3. Provider Atualizado

**Arquivo:** `src/lib/trpc/provider.tsx`

- Integra o loggerLink na configuração do cliente
- Mantém compatibilidade com a estrutura existente

## Funcionalidades

### Logs do Cliente (loggerLink)

```typescript
// Desenvolvimento
[tRPC Client] → posts.getPosts
[tRPC Client] ← posts.getPosts (200ms)

// Produção (apenas erros)
[tRPC Client Error] ← posts.getPosts (Error: Database connection failed)
```

### Logs do Servidor (Middleware)

```typescript
[tRPC Server] QUERY posts.getPosts started {
  userId: "user-123",
  input: { page: 1, limit: 10 },
  timestamp: "2024-01-15T10:30:00.000Z"
}

[tRPC Server] QUERY posts.getPosts completed successfully {
  userId: "user-123",
  duration: "150ms",
  timestamp: "2024-01-15T10:30:00.150Z"
}
```

## Configurações Disponíveis

### 1. Configuração Padrão
```typescript
import { createLoggerLink } from './logger-config';
createLoggerLink() // Configuração automática
```

### 2. Configuração de Desenvolvimento
```typescript
import { createDevLoggerLink } from './logger-config';
createDevLoggerLink() // Logs verbosos apenas em dev
```

### 3. Configuração de Produção
```typescript
import { createProdLoggerLink } from './logger-config';
createProdLoggerLink() // Apenas erros
```

## Benefícios

1. **Debugging Melhorado:** Logs detalhados em desenvolvimento
2. **Performance:** Logs mínimos em produção
3. **Rastreabilidade:** Timestamps e contexto completo
4. **Identificação:** Prefixos claros para cliente/servidor
5. **Flexibilidade:** Configurações específicas por ambiente

## Uso

O loggerLink é automaticamente ativado quando você usa qualquer procedimento tRPC. Não é necessário código adicional nos componentes.

### Exemplo de Uso

```typescript
// Em um componente React
const { data: posts, isLoading } = trpc.posts.getPosts.useQuery({
  page: 1,
  limit: 10
});

// Logs automáticos:
// [tRPC Client] → posts.getPosts
// [tRPC Server] QUERY posts.getPosts started
// [tRPC Server] QUERY posts.getPosts completed successfully
// [tRPC Client] ← posts.getPosts (150ms)
```

## Monitoramento

Para monitorar os logs em produção, você pode:

1. **Console do Navegador:** Para logs do cliente
2. **Logs do Servidor:** Para logs do servidor (console/arquivo)
3. **Ferramentas de Monitoramento:** Integrar com Sentry, LogRocket, etc.

## Customização

Para personalizar os logs, edite:

- **Cliente:** `src/lib/trpc/logger-config.ts`
- **Servidor:** `src/lib/trpc/context.ts` (middleware de logging)

## Referências

- [tRPC Logger Link Documentation](https://trpc.io/docs/client/links/loggerLink)
- [tRPC Middleware Documentation](https://trpc.io/docs/server/middlewares)
