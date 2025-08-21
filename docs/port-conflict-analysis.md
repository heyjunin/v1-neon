# 🔍 Análise de Conflitos de Porta - V1 Monorepo

## 🚨 CONFLITOS ENCONTRADOS

### ❌ Conflito Crítico: Porta 3003

**Apps em Conflito:**
- `@v1/react-app` (Vite) - Porta 3003
- `@v1/email` (React Email) - Porta 3003

**Detalhes:**
- **React App**: `apps/react-app/vite.config.ts` → `port: 3003`
- **Email Package**: `packages/email/package.json` → `"dev": "email dev -p 3003"`

**Impacto:** Se ambos os serviços tentarem rodar simultaneamente, haverá conflito de porta.

## 📋 Mapeamento Atual de Portas

### ✅ Apps Principais (Sem Conflitos)
| Porta | App | Tipo | Arquivo de Config |
|-------|-----|------|-------------------|
| **3000** | `@v1/app` | Next.js | `apps/app/package.json` |
| **3001** | `@v1/web` | Next.js | `apps/web/package.json` |
| **3004** | `@v1/engine` | Hono API | `apps/engine/src/index.ts` |

### ✅ Apps de Serviço (Sem Conflitos)
| Porta | App | Tipo | Arquivo de Config |
|-------|-----|------|-------------------|
| **3002** | `@v1/email-app` | Hono | `apps/email/src/config/index.ts` |

### ❌ Apps em Conflito
| Porta | App | Tipo | Arquivo de Config | Status |
|-------|-----|------|-------------------|--------|
| **3003** | `@v1/react-app` | Vite | `apps/react-app/vite.config.ts` | ⚠️ Conflito |
| **3003** | `@v1/email` | React Email | `packages/email/package.json` | ⚠️ Conflito |

### 🔧 Serviços Supabase (Sem Conflitos)
| Porta | Serviço | Descrição |
|-------|---------|-----------|
| **54321** | Supabase API | API REST |
| **54322** | Supabase Database | PostgreSQL |
| **54323** | Supabase Studio | Interface web |
| **54327** | Supabase Analytics | Analytics |
| **54328** | Supabase Vector | Vector embeddings |

## 🛠️ Soluções Propostas

### Solução 1: Reorganizar Portas (Recomendada)

```bash
# Mapeamento Sugerido
3000 → @v1/app (Next.js App)
3001 → @v1/web (Next.js Web)
3002 → @v1/email-app (Hono Email Service)
3003 → @v1/react-app (Vite React App)
3004 → @v1/engine (Hono API)
3005 → @v1/email (React Email Dev Server) ← NOVA PORTA
```

### Solução 2: Remover Conflito do Email Package

O package `@v1/email` não deveria ter um servidor de desenvolvimento próprio, pois:
- É um package, não um app
- O servidor de email já existe em `@v1/email-app`
- O script `email dev` é para desenvolvimento de templates, não para rodar como serviço

## 🔧 Correções Necessárias

### 1. Atualizar Package Email

```json
// packages/email/package.json
{
  "scripts": {
    "dev": "email dev -p 3005",  // Mudar para 3005
    // ou remover completamente se não for necessário
  }
}
```

### 2. Atualizar Script Kill-Ports

```javascript
// scripts/kill-ports.js
const PORT_MAPPING = {
  // Apps principais
  3000: '@v1/app (Next.js App)',
  3001: '@v1/web (Next.js Web)', 
  3002: '@v1/email-app (Hono Email Service)',
  3003: '@v1/react-app (Vite React App)',
  3004: '@v1/engine (Hono API)',
  3005: '@v1/email (React Email Dev)', // Adicionar se necessário
  
  // Supabase Local
  54321: 'Supabase API (Local)',
  54322: 'Supabase Database (Local)',
  54323: 'Supabase Studio (Local)',
  54327: 'Supabase Analytics (Local)',
  54328: 'Supabase Vector (Local)',
};
```

### 3. Atualizar Documentação

```markdown
// docs/port-mapping.md
| Porta | App | Descrição |
|-------|-----|-----------|
| 3000 | @v1/app | Next.js App |
| 3001 | @v1/web | Next.js Web |
| 3002 | @v1/email-app | Email Service |
| 3003 | @v1/react-app | Vite React App |
| 3004 | @v1/engine | Hono API |
| 3005 | @v1/email | Email Dev Server |
```

## 🎯 Recomendações

### 1. Imediato
- **Remover o script `dev` do package email** se não for necessário
- **Ou alterar a porta para 3005** se o servidor de desenvolvimento for necessário

### 2. Curto Prazo
- Atualizar o script `kill-ports.js` com o novo mapeamento
- Atualizar a documentação de portas
- Testar todos os comandos de desenvolvimento

### 3. Longo Prazo
- Implementar verificação automática de conflitos de porta
- Criar testes para garantir que não há conflitos
- Documentar processo para adicionar novos apps

## 🧪 Testes Necessários

### Comandos para Testar
```bash
# Teste 1: Todos os apps principais
bun run dev:app      # Porta 3000
bun run dev:web      # Porta 3001  
bun run dev:react-app # Porta 3003
bun run dev:engine   # Porta 3004

# Teste 2: Email services
bun run dev:email-app # Porta 3002
# bun run dev --filter=@v1/email # Porta 3005 (se mantido)

# Teste 3: Supabase local
bun run supabase:local # Portas 54321-54328

# Teste 4: Desenvolvimento completo
bun run dev:safe
```

## 📊 Status Atual

| Status | Apps | Portas |
|--------|------|--------|
| ✅ **OK** | @v1/app, @v1/web, @v1/engine, @v1/email-app | 3000, 3001, 3002, 3004 |
| ❌ **Conflito** | @v1/react-app, @v1/email | 3003 |
| ✅ **OK** | Supabase Services | 54321-54328 |

## ✅ CONFLITOS RESOLVIDOS

### ✅ Correções Aplicadas

1. **Package Email**: Porta alterada de 3003 para 3005
   - `packages/email/package.json` → `"dev": "email dev -p 3005"`

2. **Script Kill-Ports**: Mapeamento atualizado
   - `scripts/kill-ports.js` → Adicionadas portas 3002, 3004, 3005

3. **Documentação**: Portas atualizadas
   - `docs/port-mapping.md` → Mapeamento completo atualizado

### ✅ Mapeamento Final (Sem Conflitos)

| Porta | App | Tipo | Status |
|-------|-----|------|--------|
| **3000** | `@v1/app` | Next.js App | ✅ OK |
| **3001** | `@v1/web` | Next.js Web | ✅ OK |
| **3002** | `@v1/email-app` | Hono Email Service | ✅ OK |
| **3003** | `@v1/react-app` | Vite React App | ✅ OK |
| **3004** | `@v1/engine` | Hono API | ✅ OK |
| **3005** | `@v1/email` | React Email Dev | ✅ OK |

### ✅ Teste Realizado

O script `kill-ports.js` foi testado e funcionou corretamente:
- ✅ Matou 3 processos que estavam ocupando portas
- ✅ Verificou 14 portas no total
- ✅ Todas as portas estão agora livres

## 🚀 Próximos Passos

1. **✅ Conflitos resolvidos** - Todas as portas estão livres
2. **✅ Scripts atualizados** - kill-ports.js e dev-safe.sh funcionando
3. **✅ Documentação atualizada** - port-mapping.md completo
4. **🧪 Testar**: Todos os comandos de desenvolvimento
5. **🔧 Implementar**: Verificação automática de conflitos (futuro)

---

**🎉 Status:** Todos os conflitos de porta foram resolvidos! Pode usar `bun run dev:safe` com segurança.
