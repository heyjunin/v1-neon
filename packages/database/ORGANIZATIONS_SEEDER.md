# Organizations Seeder

Este documento descreve o seeder de organizations implementado seguindo os padrões estabelecidos no projeto.

## Estrutura

O seeder de organizations está localizado em:
- **Arquivo principal**: `src/seeders/organizations-seeder.ts`
- **Funções auxiliares**: `src/seeders/organizations.ts`

## Funcionalidades

O seeder de organizations cria:

### 1. Organizations (8 organizações de exemplo)
- **Acme Corporation** - Soluções de tecnologia
- **TechStart Inc** - Startup focada em IA e machine learning
- **Global Solutions** - Consultoria internacional
- **Creative Agency** - Agência de marketing digital
- **Data Analytics Pro** - Soluções de analytics avançadas
- **Cloud Computing Solutions** - Infraestrutura cloud e DevOps
- **Mobile Development Studio** - Desenvolvimento de apps móveis
- **Cybersecurity Experts** - Soluções de segurança

### 2. Organization Members
- Adiciona o owner como membro com role 'owner'
- Adiciona 1-4 membros aleatórios por organização
- Roles distribuídos: 'admin' e 'member'
- Status: 'active'

### 3. Organization Invites
- Cria 1-3 convites por organização (apenas para as primeiras 5)
- Emails aleatórios usando faker
- Roles: 'admin' e 'member'
- Status: 'pending', 'accepted', 'expired'

## Como usar

### Executar apenas o seeder de organizations:
```bash
bun run db:seed:organizations
```

### Executar todos os seeders:
```bash
bun run db:seed:all
```

### Executar com opções específicas:
```bash
# Apenas organizations
bun run seed:run organizations --verbose

# Organizations e users
bun run seed:run users,organizations --verbose

# Forçar execução (sobrescrever dados existentes)
bun run seed:run organizations --force --verbose
```

## Dependências

O seeder de organizations depende de:
- **Users**: Precisa de usuários existentes para criar owners e members
- **Database**: Tabelas organizations, organization_members, organization_invites

## Padrões seguidos

1. **Herança**: Estende `BaseSeeder`
2. **Transações**: Usa `executeInTransaction` para operações atômicas
3. **Batch Insert**: Usa `batchInsert` para inserções em lote
4. **Logging**: Usa o logger centralizado do projeto
5. **Validação**: Verifica se dados já existem antes de inserir
6. **Faker**: Usa dados realistas para testes

## Estrutura de dados criada

### Organizations
```typescript
{
  name: string,
  slug: string,
  description: string,
  logoUrl: string,
  ownerId: string,
  isActive: boolean
}
```

### Organization Members
```typescript
{
  organizationId: string,
  userId: string,
  role: 'owner' | 'admin' | 'member',
  status: 'active' | 'invited' | 'suspended',
  invitedBy?: string,
  invitedAt?: Date,
  joinedAt: Date
}
```

### Organization Invites
```typescript
{
  organizationId: string,
  email: string,
  role: 'owner' | 'admin' | 'member',
  invitedBy: string,
  token: string,
  expiresAt: Date,
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
}
```

## Integração com tRPC

O seeder cria dados que são utilizados pelos endpoints tRPC em:
- `apps/app/src/lib/trpc/routers/organizations.ts`

Todos os endpoints estão testados e funcionando com os dados do seeder.
