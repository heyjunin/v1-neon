# Sistema RBAC para Organizações

Este documento explica como usar o sistema RBAC (Role-Based Access Control) implementado para organizações.

## Visão Geral

O sistema RBAC permite controlar o acesso a recursos e funcionalidades baseado nos roles (papéis) dos usuários dentro de uma organização.

### Roles Disponíveis

- **Owner**: Controle total sobre a organização
- **Admin**: Pode gerenciar membros e conteúdo, mas não pode deletar a organização
- **Member**: Pode criar e gerenciar seu próprio conteúdo
- **Viewer**: Apenas visualização de conteúdo

### Permissões Principais

```typescript
// Organização
ORGANIZATION_VIEW, ORGANIZATION_UPDATE, ORGANIZATION_DELETE, ORGANIZATION_TRANSFER

// Membros
MEMBER_VIEW, MEMBER_INVITE, MEMBER_UPDATE_ROLE, MEMBER_REMOVE, MEMBER_SUSPEND

// Conteúdo
POST_VIEW, POST_CREATE, POST_UPDATE, POST_DELETE, POST_PUBLISH

// Projetos
PROJECT_VIEW, PROJECT_CREATE, PROJECT_UPDATE, PROJECT_DELETE, PROJECT_MANAGE

// Analytics
ANALYTICS_VIEW, REPORTS_VIEW, REPORTS_EXPORT
```

## Como Usar

### 1. Hooks para Verificação de Permissões

```typescript
import { 
  useOrganizationRBAC,
  useOrganizationPermission,
  useIsOrganizationOwner 
} from '@/hooks/use-organization-rbac';

function MyComponent() {
  const rbac = useOrganizationRBAC();
  const canEdit = useOrganizationPermission('organization:update');
  const isOwner = useIsOrganizationOwner();

  if (canEdit.hasPermission) {
    // Mostrar botão de editar
  }

  if (isOwner) {
    // Mostrar funcionalidades de owner
  }
}
```

### 2. Componentes de Proteção

```typescript
import { 
  OrganizationProtectedByPermission,
  OrganizationProtectedByOwner,
  OrganizationProtectedByAdminOrOwner 
} from '@/components/rbac/organization-protected';

function Dashboard() {
  return (
    <div>
      {/* Apenas usuários com permissão podem ver */}
      <OrganizationProtectedByPermission permission="organization:update">
        <Button>Edit Organization</Button>
      </OrganizationProtectedByPermission>

      {/* Apenas owners podem ver */}
      <OrganizationProtectedByOwner>
        <Button variant="destructive">Delete Organization</Button>
      </OrganizationProtectedByOwner>

      {/* Admins e owners podem ver */}
      <OrganizationProtectedByAdminOrOwner>
        <Button>Manage Members</Button>
      </OrganizationProtectedByAdminOrOwner>
    </div>
  );
}
```

### 3. Conteúdo Baseado em Role

```typescript
import { OrganizationRoleBasedContent } from '@/components/rbac/organization-protected';

function RoleDashboard() {
  return (
    <OrganizationRoleBasedContent
      ownerContent={<OwnerDashboard />}
      adminContent={<AdminDashboard />}
      memberContent={<MemberDashboard />}
      viewerContent={<ViewerDashboard />}
      fallback={<NoAccessMessage />}
    />
  );
}
```

### 4. Proteção em Procedures tRPC

```typescript
// No router tRPC
updateOrganization: protectedProcedure
  .input(updateOrganizationSchema)
  .mutation(async ({ input, ctx }) => {
    // Verificar permissão
    await checkPermission(ctx.user.id, input.id, PERMISSIONS.ORGANIZATION_UPDATE);
    
    // Executar operação
    const organization = await updateOrganization(input.id, input.data);
    return organization;
  });
```

## Exemplos Práticos

### Gerenciamento de Membros

```typescript
function MemberManagement() {
  const rbac = useOrganizationRBAC();

  return (
    <div>
      {/* Convidar membros */}
      <OrganizationProtectedByPermission permission="member:invite">
        <Button onClick={inviteMember}>Invite Member</Button>
      </OrganizationProtectedByPermission>

      {/* Lista de membros */}
      {members.map(member => (
        <div key={member.id}>
          <span>{member.name} - {member.role}</span>
          
          {/* Alterar role - verificar se pode gerenciar este usuário */}
          {rbac.canManageUser(member.role).hasPermission && (
            <OrganizationProtectedByPermission permission="member:update_role">
              <Button onClick={() => changeRole(member.id)}>
                Change Role
              </Button>
            </OrganizationProtectedByPermission>
          )}

          {/* Remover membro */}
          {rbac.canManageUser(member.role).hasPermission && (
            <OrganizationProtectedByPermission permission="member:remove">
              <Button onClick={() => removeMember(member.id)}>
                Remove
              </Button>
            </OrganizationProtectedByPermission>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Botões Condicionais

```typescript
function ActionButtons() {
  const rbac = useOrganizationRBAC();

  return (
    <div>
      {/* Botão sempre visível, mas pode estar desabilitado */}
      <Button 
        disabled={!rbac.can('post:create').hasPermission}
        onClick={createPost}
      >
        Create Post
      </Button>

      {/* Botão só aparece se tiver permissão */}
      <OrganizationProtectedByPermission permission="post:delete">
        <Button variant="destructive" onClick={deletePost}>
          Delete Post
        </Button>
      </OrganizationProtectedByPermission>

      {/* Botão com fallback personalizado */}
      <OrganizationProtectedByPermission 
        permission="analytics:view"
        fallback={
          <Button disabled>
            View Analytics (No Permission)
          </Button>
        }
      >
        <Button onClick={viewAnalytics}>
          View Analytics
        </Button>
      </OrganizationProtectedByPermission>
    </div>
  );
}
```

## Boas Práticas

1. **Use componentes de proteção** para UI sensível
2. **Sempre verifique permissões no backend** (procedures tRPC)
3. **Forneça feedback claro** quando usuários não têm permissão
4. **Use fallbacks informativos** em vez de esconder completamente
5. **Teste todos os cenários de permissão**

## Hierarquia de Roles

```
Owner > Admin > Member > Viewer
```

- **Owners** podem fazer tudo
- **Admins** podem gerenciar members e viewers, mas não outros admins ou owners
- **Members** têm permissões básicas de criação de conteúdo
- **Viewers** têm apenas permissões de leitura

## Debugging

Para debugar permissões, use o componente `UserPermissionsSummary`:

```typescript
import { UserPermissionsSummary } from '@/components/rbac/organization-protected';

function DebugPermissions() {
  return (
    <div>
      <UserPermissionsSummary />
      {/* Resto do componente */}
    </div>
  );
}
```

Este componente mostra o role atual do usuário e suas permissões na organização.
