# Database Seeding - Sistema de População de Dados

Este documento explica como usar o sistema de seeding do banco de dados, inspirado no Laravel, para popular o banco Neon com dados de teste.

## Comandos Disponíveis

### Comandos de Banco de Dados

```bash
# Aplicar migrações
bun run db:migrate

# Gerar novas migrações
bun run db:generate

# Push do schema para o banco (cria/atualiza tabelas)
bun run db:push

# Abrir Drizzle Studio
bun run db:studio

# Setup completo (migrate + seed)
bun run db:setup

# Reset completo (push + seed com force)
bun run db:reset
```

### Comandos de Seeding

```bash
# Ver ajuda e opções disponíveis
bun run seed:help

# Listar todos os seeders disponíveis
bun run seed:list

# Executar todos os seeders
bun run seed:run

# Executar um seeder específico
bun run seed:run users
bun run seed:run posts
bun run seed:run database

# Executar múltiplos seeders específicos
bun run seed:run users,posts
```

### Opções Avançadas

```bash
# Forçar execução mesmo se dados já existirem
bun run seed:run --force

# Executar com saída detalhada
bun run seed:run --verbose

# Combinar opções
bun run seed:run users --force --verbose
```

## Fluxo de Trabalho Recomendado

### 1. **Desenvolvimento Inicial**
```bash
# Primeira vez configurando o banco
bun run db:push        # Cria as tabelas
bun run seed:run       # Popula com dados iniciais
```

### 2. **Desenvolvimento Diário**
```bash
# Após mudanças no schema
bun run db:generate    # Gerar nova migração
bun run db:push        # Aplicar mudanças
bun run seed:run       # Repopular dados se necessário
```

### 3. **Reset Completo**
```bash
# Quando quiser começar do zero
bun run db:reset       # Push + seed com force
```

### 4. **Debug e Desenvolvimento**
```bash
# Para desenvolvimento com logs detalhados
bun run seed:run users --verbose
bun run db:studio      # Interface visual do banco
```

## Seeders Disponíveis

### 1. **database** - Seeder Principal
- Executa todos os seeders em ordem (users → posts)
- **Dados gerados**: 20 usuários + 50 posts
- **Dependências**: Nenhuma

### 2. **users** - Seeder de Usuários
- Gera usuários fictícios com dados completos
- **Dados gerados**: 20 usuários
- **Dependências**: Nenhuma
- **Dados incluídos**:
  - Email, nome completo, avatar
  - Informações pessoais (bio, localização, etc.)

### 3. **posts** - Seeder de Posts
- Gera posts fictícios associados aos usuários
- **Dados gerados**: 50 posts
- **Dependências**: Requer usuários existentes
- **Dados incluídos**:
  - Título, conteúdo, tags
  - Categoria e metadados

### 4. **example-advanced** - Seeder de Exemplo
- Demonstra funcionalidades avançadas do sistema
- **Dados gerados**: Vários tipos de dados
- **Dependências**: Nenhuma

## Estrutura do Sistema

### Base Seeder
Todos os seeders herdam da classe `BaseSeeder` que fornece:
- Execução em transação (quando suportado)
- Inserção em lotes para performance
- Tratamento de erros consistente

### Faker Utils
Sistema de geração de dados fictícios com:
- Dados de usuário realistas
- Posts com conteúdo variado
- Informações de empresa e endereço
- Utilitários para datas, imagens, etc.

### Orchestrator
Gerencia a execução dos seeders:
- Registro e execução de seeders
- Controle de dependências
- Logs detalhados
- Tratamento de erros

## Exemplos de Uso

### Cenário 1: População Inicial
```bash
# Executar todos os seeders para população inicial
bun run seed:run
```

### Cenário 2: Apenas Usuários
```bash
# Gerar apenas usuários para testes
bun run seed:run users --verbose
```

### Cenário 3: Forçar Reexecução
```bash
# Forçar reexecução mesmo com dados existentes
bun run seed:run --force
```

### Cenário 4: Desenvolvimento
```bash
# Executar com logs detalhados para debug
bun run seed:run users,posts --verbose
```

### Cenário 5: Setup Completo
```bash
# Setup completo do banco de dados
bun run db:setup
```

### Cenário 6: Reset Completo
```bash
# Reset completo do banco de dados
bun run db:reset
```

## Configuração

### Variáveis de Ambiente
Os seeders precisam das seguintes variáveis:
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
```

### Seeds Consistentes
O sistema usa seeds fixos para gerar dados consistentes:
- **Users**: Seed `12345`
- **Posts**: Seed `67890`

## Troubleshooting

### Erro: "Users already exist"
```bash
# Use --force para sobrescrever
bun run seed:run --force
```

### Erro: "No users found"
```bash
# Execute o seeder de usuários primeiro
bun run seed:run users
bun run seed:run posts
```

### Erro: "relation does not exist"
```bash
# Aplique as migrações primeiro
bun run db:push
bun run seed:run
```

### Erro de Conexão
- Verifique se `DATABASE_URL` está configurada
- Certifique-se de que o banco Neon está acessível
- Verifique as permissões do banco

### Logs Detalhados
```bash
# Use --verbose para logs detalhados
bun run seed:run --verbose
```

## Criando Novos Seeders

### 1. Criar o Seeder
```typescript
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { BaseSeeder } from './base-seeder';

export class MySeeder extends BaseSeeder {
  name = 'my-seeder';

  async run(db: NeonHttpDatabase): Promise<void> {
    // Sua lógica de seeding aqui
  }
}
```

### 2. Registrar no Index
```typescript
// packages/database/src/seeders/index.ts
export * from './my-seeder';

export const seeders = [
  // ... outros seeders
  new MySeeder()
];
```

### 3. Testar
```bash
bun run seed:list  # Verificar se aparece na lista
bun run seed:run my-seeder  # Executar o novo seeder
```

## Integração com CI/CD

### Pipeline de Testes
```yaml
# Exemplo para GitHub Actions
- name: Setup Database
  run: |
    bun run db:push
    bun run seed:run --force
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Ambiente de Desenvolvimento
```bash
# Script para setup completo
#!/bin/bash
bun run setup:env
bun run db:reset
```

## Performance

### Inserção em Lotes
O sistema usa inserção em lotes (batch size: 100) para melhor performance.

### Transações
Quando suportado, os seeders executam em transações para consistência.

### Logs
Logs estruturados com Pino para monitoramento e debug.

## Comandos Rápidos

### Setup Inicial
```bash
bun run db:reset
```

### Desenvolvimento
```bash
bun run db:push
bun run seed:run users --verbose
```

### Debug
```bash
bun run db:studio
bun run seed:list
```
