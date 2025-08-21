# Configuração do Webhook Supabase para Engine API

Este guia explica como configurar o webhook do Supabase Auth para usar a aplicação Engine como handler centralizado.

## 🎯 Objetivo

Centralizar o processamento de webhooks do Supabase Auth na aplicação Engine, permitindo que múltiplas aplicações compartilhem o mesmo handler de sincronização de usuários.

## 🚀 Setup Rápido

### 1. Aplicar Migração Automaticamente

```bash
# No diretório raiz do projeto
bun run setup:engine-webhook
```

### 2. Iniciar Engine API

```bash
# Iniciar apenas a Engine API
bun run dev:engine

# Ou iniciar todas as aplicações
bun run dev
```

## 🔧 Configuração Manual

### 1. Aplicar Migração no Supabase

```bash
# Navegar para o diretório Supabase
cd apps/api/supabase

# Aplicar migrações
supabase db reset

# Ou aplicar apenas a migração do webhook
supabase db push
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` no diretório `apps/engine/`:

```bash
# Engine API Configuration
PORT=3004

# Database (Neon)
USE_DRIZZLE=true
DATABASE_URL=your_neon_database_url

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

## 🌐 Configuração para Produção

### 1. Via Dashboard do Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Database > Webhooks**
4. Clique em **Create a new webhook**

### 2. Configuração do Webhook

```yaml
Name: user_created_webhook
Table: public.users
Events: INSERT
HTTP Method: POST
URL: https://your-engine-domain.com/webhooks/supabase
Headers:
  Content-Type: application/json
```

### 3. Via SQL (Alternativo)

Execute no SQL Editor do Supabase:

```sql
-- Instalar extensão http se não estiver disponível
CREATE EXTENSION IF NOT EXISTS http;

-- Criar função para chamar webhook da Engine API
CREATE OR REPLACE FUNCTION public.handle_user_webhook()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM http_post(
    url := 'https://your-engine-domain.com/webhooks/supabase',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', 'INSERT',
      'table', 'users',
      'record', json_build_object(
        'id', NEW.id,
        'email', NEW.email,
        'full_name', NEW.raw_user_meta_data->>'full_name',
        'avatar_url', NEW.raw_user_meta_data->>'avatar_url',
        'created_at', NEW.created_at,
        'updated_at', NEW.updated_at
      )
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
CREATE TRIGGER on_auth_user_webhook
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_webhook();
```

## 🧪 Testando o Webhook

### 1. Verificar se Engine API está rodando

```bash
# Verificar se a API está respondendo
curl http://localhost:3004/health

# Testar endpoint de webhook
curl http://localhost:3004/webhooks/supabase/test
```

### 2. Criar Usuário de Teste

```bash
# Via Supabase CLI
supabase auth signup --email test@example.com --password password123

# Ou via Dashboard do Supabase
# Dashboard > Authentication > Users > Add User
```

### 3. Verificar Logs

```bash
# Ver logs da Engine API
cd apps/engine
bun run dev

# Procurar por mensagens como:
# "Webhook received: { type: 'INSERT', table: 'users', recordId: '...' }"
# "User created successfully in Neon database: ..."
```

### 4. Verificar Banco de Dados

```bash
# Verificar se usuário foi criado no Neon
bun run studio  # Abre Drizzle Studio
```

## 📊 Monitoramento

### 1. Logs da Engine API

A Engine API registra todas as operações de webhook:

```typescript
logger.info("Webhook received:", { type, table, recordId: record?.id });
logger.info("User created successfully in Neon database:", user.id);
logger.error("Failed to create user in Neon database:", error);
```

### 2. Endpoints de Monitoramento

- `GET /health` - Status geral da API
- `GET /webhooks/supabase/test` - Teste do webhook
- `GET /docs` - Documentação OpenAPI
- `GET /swagger` - Interface Swagger

## 🔍 Troubleshooting

### Webhook não está sendo chamado

1. **Verificar URL**: Confirme se a URL está correta
2. **Verificar Trigger**: Confirme se o trigger está ativo
3. **Testar Manualmente**: Faça uma requisição POST para a URL

```bash
curl -X POST http://localhost:3004/webhooks/supabase \
  -H "Content-Type: application/json" \
  -d '{"type":"INSERT","table":"users","record":{"id":"test","email":"test@example.com"}}'
```

### Erro 500 - Failed to create user

1. **Verificar Banco**: Confirme se o banco Neon está acessível
2. **Verificar Variáveis**: Confirme se `USE_DRIZZLE` e `DATABASE_URL` estão corretas
3. **Verificar Logs**: Procure por erros específicos nos logs da Engine API

### Engine API não inicia

1. **Verificar Dependências**: Execute `bun install` no diretório `apps/engine/`
2. **Verificar Porta**: Confirme se a porta 3004 está disponível
3. **Verificar Variáveis**: Confirme se as variáveis de ambiente estão configuradas

## 🔄 Migração do Webhook Anterior

Se você estava usando o webhook na aplicação Next.js (`apps/app`), siga estes passos:

1. **Parar aplicação anterior**: Pare a aplicação Next.js
2. **Aplicar nova migração**: Execute `bun run setup:engine-webhook`
3. **Iniciar Engine API**: Execute `bun run dev:engine`
4. **Testar**: Crie um usuário no Supabase e verifique os logs da Engine API

## 📋 Checklist de Configuração

- [ ] Migração aplicada no Supabase
- [ ] Engine API rodando na porta 3004
- [ ] Variáveis de ambiente configuradas
- [ ] Webhook testado e funcionando
- [ ] Logs sendo registrados corretamente
- [ ] Usuários sendo sincronizados com Neon

## 🎉 Benefícios da Centralização

1. **Reutilização**: Múltiplas aplicações podem usar o mesmo handler
2. **Manutenibilidade**: Código centralizado e mais fácil de manter
3. **Monitoramento**: Logs centralizados na Engine API
4. **Escalabilidade**: Fácil de escalar independentemente
5. **Testabilidade**: Endpoints dedicados para testes

