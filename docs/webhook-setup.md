# Configuração do Webhook Supabase

Este guia explica como configurar o webhook para sincronizar usuários do Supabase com o banco Neon.

## 🚀 Setup Rápido (Desenvolvimento Local)

### 1. Aplicar Migração Automaticamente

```bash
# No diretório raiz do projeto
bun run setup:webhook
```

### 2. Setup Manual (Alternativo)

```bash
# 1. Navegar para o diretório Supabase
cd apps/api/supabase

# 2. Aplicar migrações
supabase db reset

# 3. Ou aplicar apenas a migração do webhook
supabase db push
```

## 🌐 Setup para Produção (Supabase Cloud)

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
URL: https://your-domain.com/api/webhooks/supabase
Headers:
  Content-Type: application/json
```

### 3. Via SQL (Alternativo)

Execute no SQL Editor do Supabase:

```sql
-- Instalar extensão http se não estiver disponível
CREATE EXTENSION IF NOT EXISTS http;

-- Criar função para chamar webhook
CREATE OR REPLACE FUNCTION public.handle_user_webhook()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM http_post(
    url := 'https://your-domain.com/api/webhooks/supabase',
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

## 🔧 Configuração da Aplicação

### 1. Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas:

```bash
# Para usar Neon (recomendado)
USE_DRIZZLE=true
DATABASE_URL=your_neon_database_url

# Para usar Supabase (fallback)
USE_DRIZZLE=false
```

### 2. Iniciar Aplicação

```bash
# Desenvolvimento
bun run dev

# Produção
bun run build
bun run start
```

## 🧪 Testando o Webhook

### 1. Criar Usuário de Teste

```bash
# Via Supabase CLI
supabase auth signup --email test@example.com --password password123

# Ou via Dashboard do Supabase
# Dashboard > Authentication > Users > Add User
```

### 2. Verificar Logs

```bash
# Ver logs da aplicação
bun run dev

# Procurar por mensagens como:
# "Webhook received: { type: 'INSERT', table: 'users', recordId: '...' }"
# "User created successfully in database: ..."
```

### 3. Verificar Banco de Dados

```bash
# Verificar se usuário foi criado no Neon
bun run studio  # Abre Drizzle Studio
```

## 🔍 Troubleshooting

### Webhook não está sendo chamado

1. **Verificar URL**: Confirme se a URL está correta
2. **Verificar Trigger**: Confirme se o trigger está ativo
3. **Testar Manualmente**: Faça uma requisição POST para a URL

```bash
curl -X POST http://localhost:3000/api/webhooks/supabase \
  -H "Content-Type: application/json" \
  -d '{"type":"INSERT","table":"users","record":{"id":"test","email":"test@example.com"}}'
```

### Erro 500 - Failed to create user

1. **Verificar Banco**: Confirme se o banco Neon está acessível
2. **Verificar Variáveis**: Confirme se `USE_DRIZZLE` e `DATABASE_URL` estão corretas
3. **Verificar Logs**: Procure por erros específicos nos logs

### Usuário duplicado

1. **Verificar Triggers**: Pode haver triggers conflitantes
2. **Verificar Migrações**: Confirme se não há triggers duplicados

## 📋 Checklist de Configuração

- [ ] Migração aplicada no Supabase
- [ ] Webhook configurado (local ou cloud)
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação rodando
- [ ] Usuário de teste criado
- [ ] Logs confirmando funcionamento
- [ ] Usuário criado no banco principal

## 🚨 Importante

- **Desenvolvimento**: Use `http://localhost:3000/api/webhooks/supabase`
- **Produção**: Use `https://your-domain.com/api/webhooks/supabase`
- **Logs**: Sempre verifique os logs para confirmar funcionamento
- **Testes**: Sempre teste após configuração

