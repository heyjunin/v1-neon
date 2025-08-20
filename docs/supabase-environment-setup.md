# Sistema de Alternância Supabase Local/Remoto

Este guia explica como alternar facilmente entre Supabase local e remoto no projeto.

## 🏗️ Estrutura de Arquivos

```
apps/
├── app/
│   ├── .env.local          # Configuração local
│   ├── .env.remote         # Configuração remota
│   ├── .env                # Configuração ativa
│   ├── env.local.example   # Exemplo local
│   └── env.remote.example  # Exemplo remoto
├── web/
│   ├── .env.local          # Configuração local
│   ├── .env.remote         # Configuração remota
│   ├── .env                # Configuração ativa
│   ├── env.local.example   # Exemplo local
│   └── env.remote.example  # Exemplo remoto
└── email/
    ├── .env.local          # Configuração local
    ├── .env.remote         # Configuração remota
    ├── .env                # Configuração ativa
    ├── env.local.example   # Exemplo local
    └── env.remote.example  # Exemplo remoto
```

## 🚀 Setup Inicial

### 1. Configuração Completa

```bash
# Configurar todos os arquivos de ambiente
bun run setup:env:complete
```

### 2. Configuração Manual

```bash
# Para cada app, copie os arquivos de exemplo
cp apps/app/env.local.example apps/app/.env.local
cp apps/app/env.remote.example apps/app/.env.remote
cp apps/web/env.local.example apps/web/.env.local
cp apps/web/env.remote.example apps/web/.env.remote
cp apps/email/env.local.example apps/email/.env.local
cp apps/email/env.remote.example apps/email/.env.remote
```

## 🔄 Alternando Entre Ambientes

### Para Desenvolvimento Local

```bash
# Alternar para Supabase local
bun run supabase:local

# Iniciar desenvolvimento com local
bun run dev:local
```

### Para Produção/Remoto

```bash
# Alternar para Supabase remoto
bun run supabase:remote

# Iniciar desenvolvimento com remoto
bun run dev:remote
```

### Verificar Status

```bash
# Verificar ambiente atual
bun run supabase:status
```

## 📋 Variáveis de Ambiente

### App Principal (`apps/app/`)

**Local:**
```bash
USE_SUPABASE_LOCAL=true
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_PROJECT_ID=create-v1
```

**Remoto:**
```bash
USE_SUPABASE_LOCAL=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
SUPABASE_SERVICE_KEY=your_remote_service_key
SUPABASE_PROJECT_ID=your_project_id
```

### Web App (`apps/web/`)

**Local:**
```bash
USE_SUPABASE_LOCAL=true
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Remoto:**
```bash
USE_SUPABASE_LOCAL=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Email Service (`apps/email/`)

**Local:**
```bash
PORT=3002
RESEND_API_KEY=your_resend_api_key
SEND_EMAIL_HOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Remoto:**
```bash
PORT=3002
RESEND_API_KEY=your_resend_api_key
SEND_EMAIL_HOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `bun run setup:env:complete` | Configura todos os arquivos de ambiente |
| `bun run supabase:local` | Alterna para ambiente local |
| `bun run supabase:remote` | Alterna para ambiente remoto |
| `bun run supabase:status` | Verifica status atual |
| `bun run dev:local` | Inicia dev com local |
| `bun run dev:remote` | Inicia dev com remoto |

## 🎯 Fluxo de Trabalho

### Desenvolvimento Local

1. **Configurar ambiente:**
   ```bash
   bun run setup:env:complete
   ```

2. **Alternar para local:**
   ```bash
   bun run supabase:local
   ```

3. **Iniciar desenvolvimento:**
   ```bash
   bun run dev:local
   ```

4. **Acessar recursos:**
   - App: http://localhost:3000
   - Web: http://localhost:3001
   - Email: http://localhost:3002
   - Supabase Dashboard: http://localhost:54323

### Testes/Produção

1. **Alternar para remoto:**
   ```bash
   bun run supabase:remote
   ```

2. **Iniciar desenvolvimento:**
   ```bash
   bun run dev:remote
   ```

3. **Acessar recursos:**
   - Supabase Dashboard: https://supabase.com/dashboard

## 🔍 Troubleshooting

### Problemas Comuns

**1. Arquivos .env não encontrados**
```bash
# Executar setup completo
bun run setup:env:complete
```

**2. Supabase local não inicia**
```bash
# Verificar Docker
docker info

# Verificar Supabase CLI
supabase --version

# Iniciar manualmente
cd apps/api/supabase
supabase start
```

**3. Variáveis não carregadas**
```bash
# Verificar se arquivos .env existem
ls -la apps/*/.env

# Verificar status
bun run supabase:status
```

### Verificações de Sistema

```bash
# Verificar Docker
docker info

# Verificar Supabase CLI
supabase --version

# Verificar arquivos de ambiente
bun run supabase:status
```

## 📊 Monitoramento

### Logs de Ambiente

Os scripts registram automaticamente:
- Qual ambiente está sendo usado
- Status do Supabase local
- URLs de acesso
- Erros de configuração

### Verificação de Status

```bash
bun run supabase:status
```

**Saída esperada:**
```
🔍 Supabase Environment Status
================================
🏠 Environment: LOCAL
✅ Status: Running
📊 Dashboard: http://localhost:54323
🔗 API: http://localhost:54321
🗄️  Database: postgresql://postgres:postgres@localhost:54322/postgres

🔧 System Checks:
   Docker: ✅ Available
   Supabase CLI: ✅ Installed
```

## 🚨 Importante

- **Sempre** execute `bun run supabase:local` antes de desenvolver localmente
- **Sempre** execute `bun run supabase:remote` antes de testar com produção
- **Nunca** commite arquivos `.env` (eles estão no .gitignore)
- **Sempre** atualize os arquivos `.env.remote` com suas credenciais reais
- **Verifique** o status antes de começar a desenvolver

## 🔗 Links Úteis

- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/environment-variables)
- [Docker Installation](https://docs.docker.com/get-docker/)
- [Supabase CLI Installation](https://supabase.com/docs/guides/cli)
