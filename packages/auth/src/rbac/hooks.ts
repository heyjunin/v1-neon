/**
 * Hooks React para verificação de permissões RBAC
 */

import { useMemo } from 'react';
import { Permission, Role } from './permissions';
import { OrganizationUserContext, PermissionCheck, createRBACChecker } from './utils';

/**
 * Hook para verificar permissões do usuário atual
 */
export function useRBAC(userContext: OrganizationUserContext | null) {
  const rbacChecker = useMemo(() => {
    return userContext ? createRBACChecker(userContext) : null;
  }, [userContext]);

  const can = useMemo(() => {
    if (!rbacChecker) return () => ({ hasPermission: false, reason: 'No user context' });
    return (permission: Permission) => rbacChecker.can(permission);
  }, [rbacChecker]);

  const canAll = useMemo(() => {
    if (!rbacChecker) return () => ({ hasPermission: false, reason: 'No user context' });
    return (permissions: Permission[]) => rbacChecker.canAll(permissions);
  }, [rbacChecker]);

  const canAny = useMemo(() => {
    if (!rbacChecker) return () => ({ hasPermission: false, reason: 'No user context' });
    return (permissions: Permission[]) => rbacChecker.canAny(permissions);
  }, [rbacChecker]);

  const hasRole = useMemo(() => {
    if (!rbacChecker) return () => ({ hasPermission: false, reason: 'No user context' });
    return (role: Role) => rbacChecker.hasRole(role);
  }, [rbacChecker]);

  const isOwner = useMemo(() => {
    return rbacChecker?.isOwner() || false;
  }, [rbacChecker]);

  const isAdminOrOwner = useMemo(() => {
    return rbacChecker?.isAdminOrOwner() || false;
  }, [rbacChecker]);

  const canManageUser = useMemo(() => {
    if (!rbacChecker) return () => ({ hasPermission: false, reason: 'No user context' });
    return (targetUserRole: string) => rbacChecker.canManageUser(targetUserRole);
  }, [rbacChecker]);

  return {
    can,
    canAll,
    canAny,
    hasRole,
    isOwner,
    isAdminOrOwner,
    canManageUser,
    isActive: userContext?.status === 'active',
    role: userContext?.role,
    organizationId: userContext?.organizationId,
  };
}

/**
 * Hook para verificar uma permissão específica
 */
export function usePermission(
  userContext: OrganizationUserContext | null,
  permission: Permission
): PermissionCheck {
  return useMemo(() => {
    if (!userContext) {
      return { hasPermission: false, reason: 'No user context' };
    }
    const rbac = createRBACChecker(userContext);
    return rbac.can(permission);
  }, [userContext, permission]);
}

/**
 * Hook para verificar múltiplas permissões (todas necessárias)
 */
export function useAllPermissions(
  userContext: OrganizationUserContext | null,
  permissions: Permission[]
): PermissionCheck {
  return useMemo(() => {
    if (!userContext) {
      return { hasPermission: false, reason: 'No user context' };
    }
    const rbac = createRBACChecker(userContext);
    return rbac.canAll(permissions);
  }, [userContext, permissions]);
}

/**
 * Hook para verificar múltiplas permissões (pelo menos uma necessária)
 */
export function useAnyPermission(
  userContext: OrganizationUserContext | null,
  permissions: Permission[]
): PermissionCheck {
  return useMemo(() => {
    if (!userContext) {
      return { hasPermission: false, reason: 'No user context' };
    }
    const rbac = createRBACChecker(userContext);
    return rbac.canAny(permissions);
  }, [userContext, permissions]);
}

/**
 * Hook para verificar role
 */
export function useRole(
  userContext: OrganizationUserContext | null,
  role: Role
): PermissionCheck {
  return useMemo(() => {
    if (!userContext) {
      return { hasPermission: false, reason: 'No user context' };
    }
    const rbac = createRBACChecker(userContext);
    return rbac.hasRole(role);
  }, [userContext, role]);
}

/**
 * Hook para verificar se é owner
 */
export function useIsOwner(userContext: OrganizationUserContext | null): boolean {
  return useMemo(() => {
    if (!userContext) return false;
    const rbac = createRBACChecker(userContext);
    return rbac.isOwner();
  }, [userContext]);
}

/**
 * Hook para verificar se é admin ou owner
 */
export function useIsAdminOrOwner(userContext: OrganizationUserContext | null): boolean {
  return useMemo(() => {
    if (!userContext) return false;
    const rbac = createRBACChecker(userContext);
    return rbac.isAdminOrOwner();
  }, [userContext]);
}

/**
 * Hook para verificar se pode gerenciar um usuário
 */
export function useCanManageUser(
  userContext: OrganizationUserContext | null,
  targetUserRole: string
): PermissionCheck {
  return useMemo(() => {
    if (!userContext) {
      return { hasPermission: false, reason: 'No user context' };
    }
    const rbac = createRBACChecker(userContext);
    return rbac.canManageUser(targetUserRole);
  }, [userContext, targetUserRole]);
}

/**
 * Hook para obter informações resumidas das permissões do usuário
 */
export function useUserPermissionsSummary(userContext: OrganizationUserContext | null) {
  return useMemo(() => {
    if (!userContext) {
      return {
        canViewOrganization: false,
        canManageOrganization: false,
        canManageMembers: false,
        canCreateContent: false,
        canManageContent: false,
        canViewAnalytics: false,
        isOwner: false,
        isAdminOrOwner: false,
        role: null,
      };
    }

    const rbac = createRBACChecker(userContext);
    
    return {
      canViewOrganization: rbac.can('organization:view').hasPermission,
      canManageOrganization: rbac.can('organization:update').hasPermission,
      canManageMembers: rbac.can('member:invite').hasPermission,
      canCreateContent: rbac.can('post:create').hasPermission,
      canManageContent: rbac.can('post:delete').hasPermission,
      canViewAnalytics: rbac.can('analytics:view').hasPermission,
      isOwner: rbac.isOwner(),
      isAdminOrOwner: rbac.isAdminOrOwner(),
      role: userContext.role,
    };
  }, [userContext]);
}
