# Engine Client Setup

Este guia explica como configurar e usar o client TypeScript para a Engine API, construído com Hono RPC para type-safety completa.

## 🎯 Objetivo

Criar um client type-safe para a Engine API que pode ser usado por outras aplicações no monorepo, seguindo as melhores práticas do Hono RPC para monorepos.

## 🏗️ Estrutura do Package

```
packages/engine-client/
├── src/
│   ├── index.ts          # Exportações principais
│   ├── types.ts          # Tipos TypeScript
│   └── examples.ts       # Exemplos de uso
├── package.json          # Configuração do package
├── tsconfig.json         # Configuração TypeScript
├── tsup.config.ts        # Configuração de build
├── biome.json           # Configuração de linting
└── README.md            # Documentação
```

## 🚀 Setup Inicial

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

### 3. Testar o Client

```bash
# Teste manual completo
bun run test:engine-client:manual

# Ou teste individual
cd packages/engine-client
bun run test-client.js
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
// Retorna: { status: string, timestamp: string, uptime: number }
```

### Webhooks
```typescript
// Testar endpoint de webhook
const testResponse = await engineClient.webhooks['supabase/test'].$get()
// Retorna: { message: string, endpoint: string, method: string, description: string }

// Enviar webhook
const webhookResponse = await engineClient.webhooks.supabase.$post({
  json: {
    type: 'INSERT',
    table: 'users',
    record: {
      id: 'user-id',
      email: 'user@example.com',
      full_name: 'User Name',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
})
// Retorna: { success: boolean }
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

// Usar tipos inferidos
const loginData: LoginRequest = {
  email: 'admin@example.com',
  password: 'password123'
}

const response = await engineClient.auth.login.$post({ json: loginData })
const result: LoginResponse = await response.json()
```

## 🔄 Configuração para Monorepo

### TypeScript Project References

O `tsconfig.json` está configurado com project references para melhor performance:

```json
{
  "references": [
    {
      "path": "../engine"
    }
  ]
}
```

### Build Process

1. **Engine Build**: O engine deve ser buildado primeiro
2. **Client Build**: O client é buildado com referência ao engine
3. **Type Generation**: Os tipos são gerados automaticamente

### Scripts Disponíveis

```bash
# Build
bun run build

# Development (watch mode)
bun run dev

# Type checking
bun run typecheck

# Linting
bun run lint

# Formatting
bun run format
```

## 🧪 Exemplos Completos

### Exemplo 1: Health Check
```typescript
import { engineClient } from '@v1/engine-client'

export async function checkEngineHealth() {
  try {
    const response = await engineClient.health.$get()
    
    if (response.ok) {
      const data = await response.json()
      console.log('Engine is healthy:', data)
      return data
    } else {
      console.error('Engine health check failed:', response.status)
      return null
    }
  } catch (error) {
    console.error('Health check error:', error)
    return null
  }
}
```

### Exemplo 2: Webhook Integration
```typescript
import { engineClient } from '@v1/engine-client'
import type { WebhookPayload } from '@v1/engine-client'

export async function sendUserWebhook(userData: {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
}) {
  const payload: WebhookPayload = {
    type: 'INSERT',
    table: 'users',
    record: {
      id: userData.id,
      email: userData.email,
      full_name: userData.fullName,
      avatar_url: userData.avatarUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  try {
    const response = await engineClient.webhooks.supabase.$post({
      json: payload
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Webhook sent successfully:', result)
      return result
    } else {
      console.error('Webhook failed:', response.status)
      return null
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return null
  }
}
```

### Exemplo 3: Authentication Flow
```typescript
import { engineClient } from '@v1/engine-client'

export async function authenticateUser(email: string, password: string) {
  try {
    const loginResponse = await engineClient.auth.login.$post({
      json: { email, password }
    })

    if (loginResponse.ok) {
      const { token } = await loginResponse.json()
      
      // Get user profile
      const profileResponse = await engineClient.protected.profile.$get({
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (profileResponse.ok) {
        const profile = await profileResponse.json()
        return { token, profile }
      } else {
        console.error('Profile fetch failed:', profileResponse.status)
        return { token, profile: null }
      }
    } else {
      console.error('Login failed:', loginResponse.status)
      return null
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}
```

## 🔍 Troubleshooting

### Erro de Tipos

Se você encontrar erros de tipos:

1. **Verificar Build**: Certifique-se de que engine e client estão buildados
2. **Verificar Versões**: Confirme que ambos usam a mesma versão do Hono
3. **Limpar Cache**: Execute `bun run clean` e rebuild

```bash
# Rebuild completo
cd apps/engine && bun run build
cd packages/engine-client && bun run build
```

### Performance do IDE

Para melhorar a performance do IDE:

1. **Compile Antes**: Execute `bun run build` antes de usar o client
2. **Use Project References**: Configure TypeScript project references
3. **Separe em Módulos**: Divida o client em módulos menores

### Versões do Hono

Certifique-se de que engine e client usam a mesma versão:

```json
// apps/engine/package.json e packages/engine-client/package.json
{
  "dependencies": {
    "hono": "^4.8.12"
  }
}
```

## 📊 Monitoramento

### Logs do Client

O client não gera logs próprios, mas você pode monitorar:

1. **Respostas HTTP**: Status codes e headers
2. **Erros de Rede**: Timeouts e falhas de conexão
3. **Erros de Tipos**: TypeScript compilation errors

### Métricas Recomendadas

```typescript
// Exemplo de métricas
const startTime = Date.now()
const response = await engineClient.health.$get()
const duration = Date.now() - startTime

console.log(`Engine API response time: ${duration}ms`)
```

## 🎉 Benefícios

1. **Type Safety**: TypeScript completo com inferência automática
2. **Developer Experience**: IntelliSense e autocomplete
3. **Monorepo Integration**: Integração perfeita com o monorepo
4. **Performance**: Build otimizado com tsup
5. **Maintainability**: Código centralizado e reutilizável

## 📚 Referências

- [Hono RPC Documentation](https://hono.dev/docs/guides/rpc)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Engine API Documentation](../engine/README.md)
