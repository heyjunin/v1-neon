/**
 * Utilitários RBAC para verificação de permissões
 */

import {
    PERMISSIONS,
    Permission,
    Role,
    hasAllPermissions,
    hasAnyPermission,
    hasPermission,
    hasRoleLevel
} from './permissions';

// Interface para contexto de usuário em uma organização
export interface OrganizationUserContext {
  userId: string;
  organizationId: string;
  role: string;
  status: string;
}

// Interface para verificação de permissões
export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
}

/**
 * Classe principal para verificação de permissões RBAC
 */
export class RBACChecker {
  private userContext: OrganizationUserContext;

  constructor(userContext: OrganizationUserContext) {
    this.userContext = userContext;
  }

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  can(permission: Permission): PermissionCheck {
    // Verificar se o usuário está ativo
    if (this.userContext.status !== 'active') {
      return {
        hasPermission: false,
        reason: 'User is not active in this organization'
      };
    }

    // Verificar se o role tem a permissão
    const hasAccess = hasPermission(this.userContext.role, permission);
    
    return {
      hasPermission: hasAccess,
      reason: hasAccess ? undefined : `Role '${this.userContext.role}' does not have permission '${permission}'`
    };
  }

  /**
   * Verifica se o usuário tem todas as permissões especificadas
   */
  canAll(permissions: Permission[]): PermissionCheck {
    if (this.userContext.status !== 'active') {
      return {
        hasPermission: false,
        reason: 'User is not active in this organization'
      };
    }

    const hasAccess = hasAllPermissions(this.userContext.role, permissions);
    
    return {
      hasPermission: hasAccess,
      reason: hasAccess ? undefined : `Role '${this.userContext.role}' does not have all required permissions`
    };
  }

  /**
   * Verifica se o usuário tem pelo menos uma das permissões especificadas
   */
  canAny(permissions: Permission[]): PermissionCheck {
    if (this.userContext.status !== 'active') {
      return {
        hasPermission: false,
        reason: 'User is not active in this organization'
      };
    }

    const hasAccess = hasAnyPermission(this.userContext.role, permissions);
    
    return {
      hasPermission: hasAccess,
      reason: hasAccess ? undefined : `Role '${this.userContext.role}' does not have any of the required permissions`
    };
  }

  /**
   * Verifica se o usuário tem um nível de role suficiente
   */
  hasRole(requiredRole: Role): PermissionCheck {
    if (this.userContext.status !== 'active') {
      return {
        hasPermission: false,
        reason: 'User is not active in this organization'
      };
    }

    const hasAccess = hasRoleLevel(this.userContext.role, requiredRole);
    
    return {
      hasPermission: hasAccess,
      reason: hasAccess ? undefined : `Role '${this.userContext.role}' does not meet required level '${requiredRole}'`
    };
  }

  /**
   * Verifica se o usuário é o owner da organização
   */
  isOwner(): boolean {
    return this.userContext.role === 'owner' && this.userContext.status === 'active';
  }

  /**
   * Verifica se o usuário é admin ou owner
   */
  isAdminOrOwner(): boolean {
    return ['admin', 'owner'].includes(this.userContext.role) && this.userContext.status === 'active';
  }

  /**
   * Verifica se o usuário pode gerenciar outro usuário
   */
  canManageUser(targetUserRole: string): PermissionCheck {
    if (this.userContext.status !== 'active') {
      return {
        hasPermission: false,
        reason: 'User is not active in this organization'
      };
    }

    // Owner pode gerenciar todos
    if (this.userContext.role === 'owner') {
      return { hasPermission: true };
    }

    // Admin pode gerenciar members e viewers, mas não outros admins ou owners
    if (this.userContext.role === 'admin') {
      const canManage = ['member', 'viewer'].includes(targetUserRole);
      return {
        hasPermission: canManage,
        reason: canManage ? undefined : `Admin cannot manage users with role '${targetUserRole}'`
      };
    }

    // Members e viewers não podem gerenciar outros usuários
    return {
      hasPermission: false,
      reason: `Role '${this.userContext.role}' cannot manage other users`
    };
  }
}

/**
 * Factory function para criar um RBACChecker
 */
export function createRBACChecker(userContext: OrganizationUserContext): RBACChecker {
  return new RBACChecker(userContext);
}

/**
 * Função utilitária para verificação rápida de permissão
 */
export function checkPermission(
  userContext: OrganizationUserContext, 
  permission: Permission
): PermissionCheck {
  const checker = createRBACChecker(userContext);
  return checker.can(permission);
}

/**
 * Função para verificar se um usuário pode acessar um recurso
 */
export function canAccessResource(
  userContext: OrganizationUserContext,
  resourceType: 'organization' | 'member' | 'post' | 'project',
  action: 'view' | 'create' | 'update' | 'delete' | 'manage'
): PermissionCheck {
  const permissionMap: Record<string, Permission> = {
    'organization:view': PERMISSIONS.ORGANIZATION_VIEW,
    'organization:update': PERMISSIONS.ORGANIZATION_UPDATE,
    'organization:delete': PERMISSIONS.ORGANIZATION_DELETE,
    'organization:manage': PERMISSIONS.ORGANIZATION_SETTINGS,
    
    'member:view': PERMISSIONS.MEMBER_VIEW,
    'member:create': PERMISSIONS.MEMBER_INVITE,
    'member:update': PERMISSIONS.MEMBER_UPDATE_ROLE,
    'member:delete': PERMISSIONS.MEMBER_REMOVE,
    'member:manage': PERMISSIONS.MEMBER_UPDATE_ROLE,
    
    'post:view': PERMISSIONS.POST_VIEW,
    'post:create': PERMISSIONS.POST_CREATE,
    'post:update': PERMISSIONS.POST_UPDATE,
    'post:delete': PERMISSIONS.POST_DELETE,
    'post:manage': PERMISSIONS.POST_PUBLISH,
    
    'project:view': PERMISSIONS.PROJECT_VIEW,
    'project:create': PERMISSIONS.PROJECT_CREATE,
    'project:update': PERMISSIONS.PROJECT_UPDATE,
    'project:delete': PERMISSIONS.PROJECT_DELETE,
    'project:manage': PERMISSIONS.PROJECT_MANAGE,
  };

  const permissionKey = `${resourceType}:${action}`;
  const permission = permissionMap[permissionKey];

  if (!permission) {
    return {
      hasPermission: false,
      reason: `Invalid resource/action combination: ${permissionKey}`
    };
  }

  return checkPermission(userContext, permission);
}
