# @v1/email Package

Package reutilizável para envio de emails com templates React Email e integração com Resend.

## 🚀 Funcionalidades

- **EmailService**: Serviço para envio de emails
- **WebhookService**: Validação de webhooks do Supabase
- **Templates**: Templates de email usando React Email
- **Componentes**: Componentes reutilizáveis para emails
- **Configuração**: Sistema de configuração flexível

## 📦 Instalação

```bash
# O package já está disponível no workspace
# Para usar em outros projetos:
npm install @v1/email
```

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Resend (envio de emails)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Create v1 <onboarding@resend.dev>

# Supabase Webhook Secret
SEND_EMAIL_HOOK_SECRET=your_webhook_secret
```

## 📖 Uso

### EmailService

```typescript
import { EmailService, createEmailConfig, validateEmailConfig } from "@v1/email";

const config = createEmailConfig();
validateEmailConfig(config);

const emailService = new EmailService(config);

// Enviar email de boas-vindas
await emailService.sendWelcomeEmail("user@example.com");

// Enviar email de teste
await emailService.sendTestEmail("user@example.com", "welcome");

// Processar webhook do Supabase
await emailService.processWebhook(webhookPayload);
```

### WebhookService

```typescript
import { WebhookService, createEmailConfig, validateEmailConfig } from "@v1/email";

const config = createEmailConfig();
validateEmailConfig(config);

const webhookService = new WebhookService(config);

// Verificar webhook
const verifiedPayload = webhookService.verify(payload, headers);
```

### Templates

```typescript
import { WelcomeEmail } from "@v1/email";

// Usar template diretamente
const html = await render(React.createElement(WelcomeEmail));
```

### Componentes

```typescript
import { Logo } from "@v1/email";

// Usar componente em templates customizados
<Logo baseUrl="https://example.com" />
```

## 🏗️ Estrutura

```
packages/email/
├── src/
│   ├── services/
│   │   ├── email-service.ts     # Lógica de envio de emails
│   │   └── webhook-service.ts   # Validação de webhooks
│   ├── templates/
│   │   └── welcome.tsx          # Templates de email
│   ├── components/
│   │   └── logo.tsx             # Componentes reutilizáveis
│   ├── types/
│   │   └── email.ts             # Tipos TypeScript
│   ├── config/
│   │   └── email-config.ts      # Configuração
│   └── index.ts                 # Exports públicos
├── dist/                        # Build compilado
├── package.json
└── tsconfig.json
```

## 🔄 Tipos de Email Suportados

### 1. Welcome Email (`signup`)
- Enviado quando um usuário se cadastra
- Template: `WelcomeEmail`

### 2. Password Reset (`reset_password`)
- Enviado quando usuário solicita reset de senha
- **TODO**: Implementar template

### 3. Magic Link (`magic_link`)
- Enviado quando usuário solicita magic link
- **TODO**: Implementar template

## 🧪 Desenvolvimento

```bash
# Instalar dependências
bun install

# Type checking
bun run typecheck

# Build
bun run build

# Lint
bun run lint

# Format
bun run format
```

## 📝 Exports

```typescript
// Services
export { EmailService } from "./services/email-service";
export { WebhookService } from "./services/webhook-service";

// Configuration
export { createEmailConfig, validateEmailConfig } from "./config/email-config";

// Types
export type {
  WebhookPayload,
  TestEmailRequest,
  EmailResponse,
  EmailConfig,
} from "./types/email";

// Templates
export { default as WelcomeEmail } from "./templates/welcome";

// Components
export { Logo } from "./components/logo";
```

## 🔗 Integração com Supabase

Para integrar com o Supabase Auth:

1. Configure o webhook no Supabase Dashboard
2. URL: `https://your-domain.com/webhook/send-email`
3. Secret: Configure `SEND_EMAIL_HOOK_SECRET`

## 🚀 Deploy

O package é compilado para JavaScript e pode ser usado em qualquer ambiente Node.js ou Bun.

```bash
# Build para produção
bun run build

# Os arquivos compilados estarão em dist/
```
