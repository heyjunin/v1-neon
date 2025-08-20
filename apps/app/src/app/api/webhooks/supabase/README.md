# Supabase Webhook Handler

Este endpoint recebe webhooks do Supabase quando usuários são criados e os sincroniza com o banco principal (Neon).

## Configuração

### 1. Configurar Webhook no Supabase

No dashboard do Supabase, vá para **Database > Webhooks** e crie um novo webhook:

- **Name**: `user_created_webhook`
- **Table**: `public.users`
- **Events**: `INSERT`
- **HTTP Method**: `POST`
- **URL**: `https://your-domain.com/api/webhooks/supabase`
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

# Para usar Supabase (fallback)
USE_DRIZZLE=false
```

### 3. Testar o Webhook

1. Crie um novo usuário no Supabase
2. Verifique os logs da aplicação
3. Confirme que o usuário foi criado no banco principal

## Funcionamento

1. **Trigger**: Quando um usuário é criado no Supabase (`auth.users`)
2. **Webhook**: Supabase envia POST para `/api/webhooks/supabase`
3. **Processamento**: A API cria o usuário no banco principal (Neon/Supabase)
4. **Logs**: Todas as operações são logadas para debugging

## Estrutura do Payload

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

## Troubleshooting

### Erro 500 - Failed to create user
- Verifique se o banco principal está acessível
- Confirme se as variáveis de ambiente estão corretas
- Verifique os logs para detalhes do erro

### Webhook não está sendo chamado
- Confirme se a URL está correta no Supabase
- Verifique se o webhook está ativo
- Teste a URL manualmente

### Usuário duplicado
- O sistema usa `onConflictDoNothing()` para evitar duplicatas
- Verifique se há triggers conflitantes no Supabase
