# @v1/database

Pacote de banco de dados usando Drizzle ORM + Neon PostgreSQL.

## 🚀 Setup Rápido

### Opção 1: Setup Automático (Recomendado)
```bash
# No diretório raiz do projeto
bun run setup:neon
```

### Opção 2: Setup Manual
```bash
# 1. Instalar dependências
bun install

# 2. Provisionar banco Neon
bun run provision-neon

# 3. Executar migrações
bun run push

# 4. Migrar dados (opcional)
bun run migrate-data
```

## 📋 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `bun run generate` | Gera migrações baseadas nos schemas |
| `bun run push` | Aplica migrações no banco |
| `bun run migrate` | Executa migrações com controle de versão |
| `bun run studio` | Abre o Drizzle Studio |
| `bun run provision-neon` | Provisiona banco Neon via Launchpad |
| `bun run migrate-data` | Migra dados do Supabase para Neon |
| `bun run setup-complete` | Setup completo (provision + migrate + seed) |

## 🗄️ Estrutura do Banco

### Tabelas

#### `users`
- `id` (uuid, primary key)
- `email` (text, unique)
- `fullName` (text, nullable)
- `avatarUrl` (text, nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

#### `posts`
- `id` (uuid, primary key)
- `userId` (uuid, foreign key)
- `title` (text)
- `content` (text)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🔄 Migração do Supabase

Este pacote inclui um sistema de adapters que permite migração gradual do Supabase para Neon:

### Variáveis de Ambiente
```bash
# Para usar Drizzle (Neon)
USE_DRIZZLE=true

# Para usar Supabase (padrão)
USE_DRIZZLE=false
```

### Adapters
- `SupabaseAdapter`: Usa Supabase para todas as operações
- `DrizzleAdapter`: Usa Drizzle + Neon para operações de banco, mantém Supabase para auth

## 🔧 Desenvolvimento

### Gerar Novas Migrações
```bash
# Após modificar schemas
bun run generate
```

### Aplicar Migrações
```bash
# Para desenvolvimento (push direto)
bun run push

# Para produção (migrações versionadas)
bun run migrate
```

### Visualizar Dados
```bash
# Abrir Drizzle Studio
bun run studio
```

## 📊 Migração de Dados

O script `migrate-data` migra automaticamente:
- Usuários do Supabase para Neon
- Posts do Supabase para Neon
- Preserva relacionamentos e timestamps

## 🔐 Autenticação

A autenticação continua usando Supabase Auth. O adapter do Drizzle integra com o Supabase Auth para obter o usuário autenticado.

## 🚨 Importante

- O banco Neon provisionado via Launchpad expira em 72 horas
- Use o Claim URL para tornar o banco permanente
- Sempre teste em ambiente de desenvolvimento antes de usar em produção
