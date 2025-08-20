# Configuração do Discord OAuth no Supabase

Este documento explica como configurar o Discord como provedor de autenticação OAuth no Supabase.

## 1. Criar uma Aplicação no Discord

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome para sua aplicação
4. Vá para a seção "OAuth2" no menu lateral

## 2. Configurar OAuth2

### Configurações Básicas:
- **Client ID**: Copie este valor para `DISCORD_CLIENT_ID`
- **Client Secret**: Clique em "Reset Secret" e copie o novo valor para `DISCORD_SECRET`

### URLs de Redirecionamento:
Adicione as seguintes URLs de redirecionamento:
- Para desenvolvimento local: `http://localhost:54321/auth/v1/callback`
- Para produção: `https://your-project.supabase.co/auth/v1/callback`

### Escopos (Scopes):
Selecione os seguintes escopos:
- `identify` - Para obter informações básicas do usuário
- `email` - Para obter o email do usuário (opcional)

## 3. Configurar Variáveis de Ambiente

### Para Desenvolvimento Local:
```bash
# No arquivo .env.local
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_SECRET=your_discord_secret
```

### Para Produção:
```bash
# No arquivo .env.remote
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_SECRET=your_discord_secret
```

## 4. Configurar no Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para "Authentication" > "Providers"
4. Habilite o provedor "Discord"
5. Preencha:
   - **Client ID**: Seu Discord Client ID
   - **Client Secret**: Seu Discord Client Secret
   - **Redirect URL**: Deixe o padrão do Supabase

## 5. Testar a Integração

1. Inicie o projeto localmente: `bun turbo dev --parallel`
2. Acesse a página de login: `http://localhost:3000/login`
3. Clique no botão "Sign in with Discord"
4. Complete o fluxo de autenticação
5. Verifique se o usuário foi criado no banco Neon

## 6. Dados do Usuário

O Discord fornece os seguintes dados do usuário:
- `id`: ID único do usuário no Discord
- `email`: Email do usuário (se disponível)
- `user_metadata.full_name`: Nome completo do usuário
- `user_metadata.avatar_url`: URL do avatar do usuário

## 7. Sincronização Automática

O sistema automaticamente sincroniza os dados do usuário do Discord com o banco Neon:
- Cria um novo usuário se não existir
- Atualiza dados existentes se houver mudanças
- Logs são gerados para debug

## Troubleshooting

### Erro: "Invalid redirect URI"
- Verifique se a URL de redirecionamento está corretamente configurada no Discord Developer Portal
- Certifique-se de que a URL corresponde exatamente à configurada no Supabase

### Erro: "Client ID or Secret invalid"
- Verifique se o Client ID e Secret estão corretos
- Certifique-se de que as variáveis de ambiente estão configuradas

### Usuário não é criado no banco Neon
- Verifique os logs do servidor para erros de sincronização
- Certifique-se de que a conexão com o banco Neon está funcionando
- Verifique se as permissões do banco estão corretas
