/**
 * Hook personalizado para usar RBAC com contexto de organização
 */

import { useOrganization } from "@/contexts/organization-context";
import { Permission, Role, useRBAC } from "@v1/auth/rbac";

/**
 * Hook principal para verificações RBAC na organização atual
 */
export function useOrganizationRBAC() {
  const { userContext } = useOrganization();
  return useRBAC(userContext);
}

/**
 * Hook para verificar uma permissão específica na organização atual
 */
export function useOrganizationPermission(permission: Permission) {
  const { can } = useOrganizationRBAC();
  return can(permission);
}

/**
 * Hook para verificar múltiplas permissões (todas necessárias)
 */
export function useOrganizationAllPermissions(permissions: Permission[]) {
  const { canAll } = useOrganizationRBAC();
  return canAll(permissions);
}

/**
 * Hook para verificar múltiplas permissões (pelo menos uma necessária)
 */
export function useOrganizationAnyPermission(permissions: Permission[]) {
  const { canAny } = useOrganizationRBAC();
  return canAny(permissions);
}

/**
 * Hook para verificar role na organização atual
 */
export function useOrganizationRole(role: Role) {
  const { hasRole } = useOrganizationRBAC();
  return hasRole(role);
}

/**
 * Hook para verificar se é owner da organização atual
 */
export function useIsOrganizationOwner() {
  const { isOwner } = useOrganizationRBAC();
  return isOwner;
}

/**
 * Hook para verificar se é admin ou owner da organização atual
 */
export function useIsOrganizationAdminOrOwner() {
  const { isAdminOrOwner } = useOrganizationRBAC();
  return isAdminOrOwner;
}

/**
 * Hook para verificar se pode gerenciar um usuário na organização atual
 */
export function useCanManageOrganizationUser(targetUserRole: string) {
  const { canManageUser } = useOrganizationRBAC();
  return canManageUser(targetUserRole);
}

/**
 * Hook para obter resumo das permissões na organização atual
 */
export function useOrganizationPermissionsSummary() {
  const { userContext } = useOrganization();
  const rbac = useRBAC(userContext);
  
  return {
    // Permissões de organização
    canViewOrganization: rbac.can('organization:view').hasPermission,
    canUpdateOrganization: rbac.can('organization:update').hasPermission,
    canDeleteOrganization: rbac.can('organization:delete').hasPermission,
    canTransferOrganization: rbac.can('organization:transfer').hasPermission,
    canManageOrganizationSettings: rbac.can('organization:settings').hasPermission,
    
    // Permissões de membros
    canViewMembers: rbac.can('member:view').hasPermission,
    canInviteMembers: rbac.can('member:invite').hasPermission,
    canUpdateMemberRoles: rbac.can('member:update_role').hasPermission,
    canRemoveMembers: rbac.can('member:remove').hasPermission,
    canSuspendMembers: rbac.can('member:suspend').hasPermission,
    
    // Permissões de posts
    canViewPosts: rbac.can('post:view').hasPermission,
    canCreatePosts: rbac.can('post:create').hasPermission,
    canUpdatePosts: rbac.can('post:update').hasPermission,
    canDeletePosts: rbac.can('post:delete').hasPermission,
    canPublishPosts: rbac.can('post:publish').hasPermission,
    
    // Permissões de projetos
    canViewProjects: rbac.can('project:view').hasPermission,
    canCreateProjects: rbac.can('project:create').hasPermission,
    canUpdateProjects: rbac.can('project:update').hasPermission,
    canDeleteProjects: rbac.can('project:delete').hasPermission,
    canManageProjects: rbac.can('project:manage').hasPermission,
    
    // Permissões de analytics
    canViewAnalytics: rbac.can('analytics:view').hasPermission,
    canViewReports: rbac.can('reports:view').hasPermission,
    canExportReports: rbac.can('reports:export').hasPermission,
    
    // Info do usuário
    role: userContext?.role,
    isOwner: rbac.isOwner,
    isAdminOrOwner: rbac.isAdminOrOwner,
    isActive: rbac.isActive,
  };
}
