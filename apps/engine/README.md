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

## Documentação

- **OpenAPI Docs**: `http://localhost:3004/docs`
- **Swagger UI**: `http://localhost:3004/swagger`

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
│   └── protected.ts     # Rotas protegidas
└── types/
    └── auth.ts          # Tipos TypeScript
```

## Tecnologias

- **Hono**: Framework web ultrafast
- **Jose**: Biblioteca JWT
- **Zod**: Validação de schemas
- **OpenAPI**: Documentação da API
- **Bun**: Runtime JavaScript
