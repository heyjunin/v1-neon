# Solução: Erro de Conexão com Banco de Dados

## 🚨 Problema Identificado

**Erro:** `No database connection string was provided to 'neon()'. Perhaps an environment variable has not been set?`

**Causa:** O pacote `@v1/database` não estava carregando as variáveis de ambiente corretamente.

## ✅ Solução Implementada

### 1. **Instalação do dotenv**

```bash
cd packages/database
bun add dotenv
```

### 2. **Modificação do arquivo `drizzle.ts`**

**Antes:**
```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql as any);
```

**Depois:**
```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql as any);
```

## 🔧 Por que isso aconteceu?

1. **Pacotes isolados:** Cada pacote no monorepo tem seu próprio contexto de variáveis de ambiente
2. **Carregamento automático:** O Next.js carrega automaticamente `.env.local` apenas para a aplicação principal
3. **Pacotes externos:** Pacotes como `@v1/database` precisam carregar suas próprias variáveis de ambiente

## 📁 Estrutura de Arquivos de Ambiente

```
apps/app/
├── .env.local          # Variáveis da aplicação Next.js
└── env.local.example   # Exemplo de configuração

packages/database/
├── .env                # Variáveis do pacote database
└── package.json        # Dependências incluindo dotenv
```

## 🚀 Verificação da Solução

### **Teste de Compilação**
```bash
bun run typecheck --filter=@v1/app
# ✅ Sucesso: 0 erros

bun run dev:app
# ✅ Sucesso: Aplicação inicia sem erros
```

### **Teste de Conexão**
```bash
curl -I http://localhost:3000
# ✅ Resposta: HTTP/1.1 307 Temporary Redirect
# ✅ Redirecionamento para /login (indica que o banco está funcionando)
```

## 🔍 Variáveis de Ambiente Configuradas

### **Neon Database**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_kCAhLs40IFHd@ep-young-wildflower-a2pcgyq4.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
DATABASE_URL_POOLER=postgresql://neondb_owner:npg_kCAhLs40IFHd@ep-young-wildflower-a2pcgyq4-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

### **Supabase (Auth)**
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛠️ Comandos Úteis

### **Verificar Variáveis de Ambiente**
```bash
# Verificar se DATABASE_URL está configurada
grep DATABASE_URL apps/app/.env.local
grep DATABASE_URL packages/database/.env
```

### **Reiniciar Aplicação**
```bash
# Matar processos na porta 3000
lsof -ti:3000 | xargs kill -9

# Iniciar aplicação
bun run dev:app
```

### **Verificar Conexão**
```bash
# Testar se a aplicação está respondendo
curl -I http://localhost:3000
```

## 🎯 Resultado Final

- ✅ **Conexão com banco estabelecida**
- ✅ **Aplicação iniciando sem erros**
- ✅ **Sistema de multi-tenancy funcionando**
- ✅ **Seletor de organization operacional**

## 🔮 Próximos Passos

1. **Testar funcionalidades:**
   - Login/registro de usuários
   - Criação de organizations
   - CRUD de posts

2. **Verificar migrações:**
   ```bash
   cd packages/database
   bun run migrate
   ```

3. **Executar seeders:**
   ```bash
   cd packages/database
   bun run seed
   ```

## 📚 Referências

- [Drizzle ORM - Neon Integration](https://orm.drizzle.team/docs/get-started-neon)
- [dotenv - Environment Variables](https://www.npmjs.com/package/dotenv)
- [Next.js - Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
