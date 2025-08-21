# 🚀 V1 Monorepo - Mapeamento de Portas

Este documento descreve o mapeamento de portas utilizado pelos diferentes apps e serviços do monorepo V1.

## 📋 Apps Principais

| Porta | App | Descrição | Comando |
|-------|-----|-----------|---------|
| **3000** | `@v1/app` | Next.js App (Aplicação principal) | `bun run dev:app` |
| **3001** | `@v1/web` | Next.js Web (Site público) | `bun run dev:web` |
| **3002** | `@v1/email-app` | Hono Email Service | `bun run dev:email-app` |
| **3003** | `@v1/react-app` | Vite React App (App PWA) | `bun run dev:react-app` |
| **3004** | `@v1/engine` | Hono API | `bun run dev:engine` |
| **3005** | `@v1/email` | React Email Dev Server | `bun run dev --filter=@v1/email` |

## 🔧 Serviços Supabase (Local)

| Porta | Serviço | Descrição | URL |
|-------|---------|-----------|-----|
| **54321** | Supabase API | API REST do Supabase | `http://localhost:54321` |
| **54322** | Supabase Database | PostgreSQL Database | `postgresql://localhost:54322` |
| **54323** | Supabase Studio | Interface web do Supabase | `http://localhost:54323` |
| **54327** | Supabase Analytics | Analytics service | `http://localhost:54327` |
| **54328** | Supabase Vector | Vector embeddings | `http://localhost:54328` |

## 🎯 Outros Serviços

| Porta | Serviço | Descrição | Status |
|-------|---------|-----------|--------|
| **3002** | Porta reservada | Para futuros projetos | Disponível |
| **5173** | Vite Default | Porta padrão do Vite | Pode conflitar |
| **8080** | Porta comum | Usada por vários serviços | Pode conflitar |
| **8000** | Porta comum | Usada por vários serviços | Pode conflitar |

## 🛠️ Scripts de Gerenciamento

### Kill Ports Script

```bash
# Mata todos os processos nas portas do monorepo
bun run kill-ports

# Ou execute diretamente
node scripts/kill-ports.js
```

### Safe Dev Script

```bash
# Executa kill-ports e depois inicia o desenvolvimento
bun run dev:safe

# Ou execute diretamente
bash scripts/dev-safe.sh
```

## 🚀 Comandos de Desenvolvimento

### Desenvolvimento Completo
```bash
# Inicia todos os apps em paralelo
bun run dev

# Versão segura (mata portas primeiro)
bun run dev:safe
```

### Apps Individuais
```bash
# Apenas o app principal
bun run dev:app

# Apenas o site web
bun run dev:web

# Apenas o React app
bun run dev:react-app

# Apenas o engine
bun run dev:engine
```

### Supabase Local
```bash
# Inicia Supabase local
bun run supabase:local

# Desenvolvimento com Supabase local
bun run dev:local
```

## 🔍 Verificação de Portas

### macOS/Linux
```bash
# Verificar se uma porta está em uso
lsof -i :3000

# Verificar todas as portas do monorepo
for port in 3000 3001 3002 3003 3004 3005 54321 54322 54323 54327 54328; do
  echo "Porta $port:"
  lsof -i :$port || echo "  Livre"
done
```

### Windows
```bash
# Verificar se uma porta está em uso
netstat -ano | findstr :3000

# Verificar todas as portas do monorepo
for port in 3000 3001 3002 3003 3004 3005 54321 54322 54323 54327 54328; do
  echo "Porta $port:"
  netstat -ano | findstr :$port || echo "  Livre"
done
```

## 🚨 Troubleshooting

### Problema: Porta já em uso
```bash
# Solução 1: Use o script kill-ports
bun run kill-ports

# Solução 2: Use o dev seguro
bun run dev:safe

# Solução 3: Mate manualmente
# macOS/Linux
sudo lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: Supabase não inicia
```bash
# Verifique se as portas estão livres
bun run kill-ports

# Reinicie o Supabase
bun run supabase:local
```

### Problema: Apps não carregam
```bash
# Limpe o cache e reinicie
bun run clean
bun run dev:safe
```

## 📊 Monitoramento

### Status das Portas
O script `kill-ports.js` fornece um relatório detalhado:

```
🚀 V1 Monorepo - Kill Ports Script
============================================================

📋 Mapeamento de Portas:

  3000 → @v1/app (Next.js App)
  3001 → @v1/web (Next.js Web)
  3003 → @v1/react-app (Vite React App)
 54321 → Supabase API (Local)
 54322 → Supabase Database (Local)
 54323 → Supabase Studio (Local)
 54327 → Supabase Analytics (Local)
 54328 → Supabase Vector (Local)

🔍 Verificando portas em uso...

📊 Resumo:
✅ 2 processo(s) morto(s)
🟢 6 porta(s) livre(s)

🎯 Total: 2 processo(s) morto(s) de 8 porta(s) verificada(s)
```

## 🎯 Boas Práticas

1. **Sempre use `bun run dev:safe`** para evitar conflitos de porta
2. **Verifique as portas** antes de iniciar novos serviços
3. **Use o script kill-ports** quando houver problemas
4. **Mantenha este mapeamento atualizado** quando adicionar novos apps
5. **Documente novas portas** neste arquivo

## 🔄 Atualizações

Quando adicionar novos apps ou serviços:

1. Atualize o mapeamento neste arquivo
2. Adicione a nova porta no `scripts/kill-ports.js`
3. Teste o script `dev:safe`
4. Atualize a documentação se necessário

---

**💡 Dica**: Use `bun run dev:safe` como seu comando padrão de desenvolvimento para evitar problemas de porta!
