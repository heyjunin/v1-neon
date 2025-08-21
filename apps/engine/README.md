# V1 Engine API

Uma API simples construída com Hono, JWT, OpenAPI e Zod Validator.

## Funcionalidades

- ✅ JWT Authentication
- ✅ Logger middleware
- ✅ OpenAPI documentation
- ✅ Zod validation
- ✅ CORS support
- ✅ Pretty JSON responses
- ✅ Health check endpoint
- ✅ Protected routes
- ✅ Supabase Auth Webhook Handler

## Instalação

```bash
cd apps/engine
bun install
```

## Desenvolvimento

```bash
bun run dev
```

A API estará disponível em `http://localhost:3004`

## Endpoints

### Health Check
- `GET /health` - Verifica se a API está funcionando

### Autenticação
- `POST /auth/login` - Login do usuário

**Credenciais de teste:**
- Email: `admin@example.com`
- Senha: `password123`

### Rotas Protegidas
- `GET /protected/profile` - Perfil do usuário (requer JWT)

### Webhooks
- `POST /webhooks/supabase` - Webhook do Supabase Auth para sincronização de usuários
- `GET /webhooks/supabase/test` - Teste do endpoint de webhook

## Documentação

- **OpenAPI Docs**: `http://localhost:3004/docs`
- **Swagger UI**: `http://localhost:3004/swagger`

## Configuração do Webhook Supabase

### 1. Configurar Webhook no Supabase

No dashboard do Supabase, vá para **Database > Webhooks** e crie um novo webhook:

- **Name**: `user_created_webhook`
- **Table**: `public.users`
- **Events**: `INSERT`
- **HTTP Method**: `POST`
- **URL**: `http://localhost:3004/webhooks/supabase`
- **Headers**: 
  ```
  Content-Type: application/json
  ```

### 2. Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

```bash
# Para usar Drizzle (Neon) - RECOMENDADO
USE_DRIZZLE=true
DATABASE_URL=your_neon_database_url
```

### 3. Testar o Webhook

1. Inicie a aplicação engine: `bun run dev`
2. Crie um novo usuário no Supabase
3. Verifique os logs da aplicação
4. Confirme que o usuário foi criado no banco principal

### 4. Estrutura do Payload

```json
{
  "type": "INSERT",
  "table": "users",
  "record": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "User Name",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

## Estrutura do Projeto

```
src/
├── index.ts              # Arquivo principal
├── lib/
│   └── jwt.ts           # Utilitários JWT
├── middleware/
│   └── auth.ts          # Middleware de autenticação
├── routes/
│   ├── auth.ts          # Rotas de autenticação
│   ├── health.ts        # Rotas de health check
│   ├── protected.ts     # Rotas protegidas
│   └── webhooks.ts      # Rotas de webhook
└── types/
    └── auth.ts          # Tipos TypeScript
```

## Tecnologias

- **Hono**: Framework web ultrafast
- **Jose**: Biblioteca JWT
- **Zod**: Validação de schemas
- **OpenAPI**: Documentação da API
- **Bun**: Runtime JavaScript
