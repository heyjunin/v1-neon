# Email Service App

Servidor Hono para envio de emails, substituindo a edge function do Supabase.

## 🚀 Tecnologias

- **Hono** - Framework web rápido e leve
- **Bun** - Runtime JavaScript/TypeScript
- **@v1/email** - Package de email reutilizável
- **Resend** - Serviço de envio de emails (via package)
- **React Email** - Templates de email (via package)

## 📦 Instalação

```bash
# Instalar dependências
bun install

# Configurar variáveis de ambiente
bun run setup:env
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
# Porta do servidor
PORT=3002

# Resend (envio de emails) - Usado pelo package @v1/email
RESEND_API_KEY=your_resend_api_key

# Supabase Webhook Secret - Usado pelo package @v1/email
SEND_EMAIL_HOOK_SECRET=your_webhook_secret

# URL base da aplicação (para templates de email)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃‍♂️ Execução

```bash
# Desenvolvimento (com hot reload)
bun run dev

# Produção
bun run build
bun run start
```

## 📡 Endpoints

### GET `/`
- **Descrição**: Status da API
- **Resposta**: Informações sobre o serviço

### GET `/health`
- **Descrição**: Health check
- **Resposta**: Status de saúde do serviço

### POST `/webhook/send-email`
- **Descrição**: Webhook do Supabase para envio de emails
- **Headers**: Requer headers de autenticação do Supabase
- **Body**: Payload do webhook do Supabase Auth

### POST `/send-test-email`
- **Descrição**: Envio manual de email para testes
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "type": "welcome"
  }
  ```

## 🔄 Tipos de Email Suportados

### 1. Welcome Email (`signup`)
- Enviado quando um usuário se cadastra
- Template: `WelcomeEmail` (do package @v1/email)

### 2. Password Reset (`reset_password`)
- Enviado quando usuário solicita reset de senha
- **TODO**: Implementar template no package

### 3. Magic Link (`magic_link`)
- Enviado quando usuário solicita magic link
- **TODO**: Implementar template no package

## 🏗️ Estrutura do Projeto

```
apps/email/
├── src/
│   ├── index.ts          # Ponto de entrada do servidor
│   ├── server.ts         # Configuração do Hono
│   ├── config/           # Configuração do app
│   ├── handlers/         # Handlers HTTP
│   ├── routes/           # Definição de rotas
│   └── middleware/       # Middleware específico
├── package.json
├── tsconfig.json
└── README.md
```

## 🔗 Integração com Supabase

Para integrar com o Supabase Auth:

1. Configure o webhook no Supabase Dashboard
2. URL: `https://your-domain.com/webhook/send-email`
3. Secret: Configure `SEND_EMAIL_HOOK_SECRET`

## 🧪 Testes

```bash
# Testar health check
curl http://localhost:3002/health

# Testar envio de email
curl -X POST http://localhost:3002/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "type": "welcome"}'
```

## 📝 Logs

O servidor registra logs detalhados para:
- Recebimento de webhooks
- Envio de emails
- Erros de validação
- Falhas de envio

## 🚀 Deploy

### Vercel
```bash
# Build para produção
bun run build

# Deploy
vercel --prod
```

### Railway
```bash
# Deploy automático via Git
railway up
```

## 🔒 Segurança

- Validação de webhook com `standardwebhooks` (via package)
- Validação de payload com Zod (via package)
- CORS configurado
- Headers de segurança
- Rate limiting (TODO)

## 📦 Package @v1/email

Este app utiliza o package `@v1/email` que contém:

- **EmailService**: Lógica de envio de emails
- **WebhookService**: Validação de webhooks
- **Templates**: Templates de email React
- **Componentes**: Componentes reutilizáveis
- **Tipos**: Definições TypeScript
- **Configuração**: Sistema de configuração

O package pode ser usado por outros apps do monorepo para enviar emails sem precisar reimplementar a lógica.
