# @v1/engine-client

Client TypeScript para a Engine API, construído com Hono RPC para type-safety completa.

## 🚀 Instalação

```bash
# No diretório raiz do monorepo
bun add @v1/engine-client
```

## 📖 Uso Básico

### Importação

```typescript
import { engineClient, createEngineClient } from '@v1/engine-client'
```

### Cliente Padrão

```typescript
// Usar o cliente padrão (http://localhost:3004)
const response = await engineClient.health.$get()

if (response.ok) {
  const data = await response.json()
  console.log('Health check:', data)
}
```

### Cliente Customizado

```typescript
// Criar cliente com URL customizada
const customClient = createEngineClient('https://api.example.com')

const response = await customClient.health.$get()
```

## 🔧 Endpoints Disponíveis

### Health Check
```typescript
const response = await engineClient.health.$get()
```

### Webhooks
```typescript
// Testar endpoint de webhook
const testResponse = await engineClient.webhooks['supabase/test'].$get()

// Enviar webhook
const webhookResponse = await engineClient.webhooks.supabase.$post({
  json: {
    type: 'INSERT',
    table: 'users',
    record: {
      id: 'user-id',
      email: 'user@example.com',
      // ... outros campos
    }
  }
})
```

### Autenticação
```typescript
// Login
const loginResponse = await engineClient.auth.login.$post({
  json: {
    email: 'admin@example.com',
    password: 'password123'
  }
})

if (loginResponse.ok) {
  const { token } = await loginResponse.json()
  
  // Usar token para rotas protegidas
  const profileResponse = await engineClient.protected.profile.$get({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
```

## 🎯 Type Safety

O client oferece type-safety completa graças ao Hono RPC:

```typescript
import type { InferRequestType, InferResponseType } from '@v1/engine-client'

// Inferir tipo da requisição
type LoginRequest = InferRequestType<typeof engineClient.auth.login.$post>['json']

// Inferir tipo da resposta
type LoginResponse = InferResponseType<typeof engineClient.auth.login.$post>
```

## 🔄 Configuração para Monorepo

### 1. Build do Engine

Primeiro, certifique-se de que o engine está buildado:

```bash
cd apps/engine
bun run build
```

### 2. Build do Client

```bash
cd packages/engine-client
bun run build
```

### 3. TypeScript Project References

O `tsconfig.json` já está configurado com project references:

```json
{
  "references": [
    {
      "path": "../engine"
    }
  ]
}
```

## 🧪 Exemplos

Veja exemplos completos em `src/examples.ts`:

```typescript
import { testHealthCheck, testWebhookWithCustomClient } from '@v1/engine-client/examples'

// Testar health check
await testHealthCheck()

// Testar webhook
await testWebhookWithCustomClient()
```

## 🔍 Troubleshooting

### Erro de Tipos

Se você encontrar erros de tipos, certifique-se de que:

1. O engine está buildado: `cd apps/engine && bun run build`
2. O client está buildado: `cd packages/engine-client && bun run build`
3. As versões do Hono são compatíveis entre engine e client

### Performance do IDE

Para melhorar a performance do IDE em monorepos grandes:

1. **Compile antes de usar**: Execute `bun run build` antes de usar o client
2. **Use project references**: Configure TypeScript project references
3. **Separe em múltiplos arquivos**: Divida o client em módulos menores

### Versões do Hono

Certifique-se de que engine e client usam a mesma versão do Hono:

```json
// apps/engine/package.json e packages/engine-client/package.json
{
  "dependencies": {
    "hono": "^4.8.12"
  }
}
```

## 📚 Documentação Adicional

- [Hono RPC Documentation](https://hono.dev/docs/guides/rpc)
- [Engine API Documentation](../engine/README.md)
- [Monorepo Best Practices](../../README.md)

## 🤝 Contribuindo

1. Faça as alterações no engine primeiro
2. Atualize os tipos no client se necessário
3. Execute `bun run build` em ambos os packages
4. Teste com os exemplos em `src/examples.ts`
