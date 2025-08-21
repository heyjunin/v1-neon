/**
 * Componentes React para proteção baseada em permissões RBAC
 */

import React from 'react';
import {
    useAllPermissions,
    useAnyPermission,
    useCanManageUser,
    useIsAdminOrOwner,
    useIsOwner,
    usePermission,
    useRole
} from './hooks';
import { Permission, Role } from './permissions';
import { OrganizationUserContext } from './utils';

// Props base para componentes de proteção
interface BaseProtectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  userContext: OrganizationUserContext | null;
}

// Props para proteção por permissão
interface PermissionProtectionProps extends BaseProtectionProps {
  permission: Permission;
}

// Props para proteção por múltiplas permissões
interface MultiplePermissionsProtectionProps extends BaseProtectionProps {
  permissions: Permission[];
}

// Props para proteção por role
interface RoleProtectionProps extends BaseProtectionProps {
  role: Role;
}

// Props para proteção por gerenciamento de usuário
interface ManageUserProtectionProps extends BaseProtectionProps {
  targetUserRole: string;
}

/**
 * Componente para proteger conteúdo baseado em uma permissão específica
 */
export function ProtectedByPermission({
  children,
  fallback = null,
  userContext,
  permission,
}: PermissionProtectionProps) {
  const { hasPermission } = usePermission(userContext, permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger conteúdo baseado em múltiplas permissões (todas necessárias)
 */
export function ProtectedByAllPermissions({
  children,
  fallback = null,
  userContext,
  permissions,
}: MultiplePermissionsProtectionProps) {
  const { hasPermission } = useAllPermissions(userContext, permissions);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger conteúdo baseado em múltiplas permissões (pelo menos uma necessária)
 */
export function ProtectedByAnyPermission({
  children,
  fallback = null,
  userContext,
  permissions,
}: MultiplePermissionsProtectionProps) {
  const { hasPermission } = useAnyPermission(userContext, permissions);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger conteúdo baseado em role
 */
export function ProtectedByRole({
  children,
  fallback = null,
  userContext,
  role,
}: RoleProtectionProps) {
  const { hasPermission } = useRole(userContext, role);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger conteúdo apenas para owners
 */
export function ProtectedByOwner({
  children,
  fallback = null,
  userContext,
}: BaseProtectionProps) {
  const isOwner = useIsOwner(userContext);

  if (!isOwner) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger conteúdo para admins ou owners
 */
export function ProtectedByAdminOrOwner({
  children,
  fallback = null,
  userContext,
}: BaseProtectionProps) {
  const isAdminOrOwner = useIsAdminOrOwner(userContext);

  if (!isAdminOrOwner) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger conteúdo baseado na capacidade de gerenciar um usuário
 */
export function ProtectedByManageUser({
  children,
  fallback = null,
  userContext,
  targetUserRole,
}: ManageUserProtectionProps) {
  const { hasPermission } = useCanManageUser(userContext, targetUserRole);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente genérico para proteção condicional
 */
interface ConditionalProtectionProps extends BaseProtectionProps {
  condition: boolean;
  showFallbackMessage?: boolean;
  fallbackMessage?: string;
}

export function ConditionalProtection({
  children,
  fallback = null,
  condition,
  showFallbackMessage = false,
  fallbackMessage = "You don't have permission to view this content.",
}: ConditionalProtectionProps) {
  if (!condition) {
    if (showFallbackMessage && !fallback) {
      return <div className="text-muted-foreground text-sm p-4">{fallbackMessage}</div>;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Componente para mostrar diferentes conteúdos baseados no role
 */
interface RoleBasedContentProps {
  userContext: OrganizationUserContext | null;
  ownerContent?: React.ReactNode;
  adminContent?: React.ReactNode;
  memberContent?: React.ReactNode;
  viewerContent?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleBasedContent({
  userContext,
  ownerContent,
  adminContent,
  memberContent,
  viewerContent,
  fallback = null,
}: RoleBasedContentProps) {
  if (!userContext || userContext.status !== 'active') {
    return <>{fallback}</>;
  }

  switch (userContext.role) {
    case 'owner':
      return <>{ownerContent || fallback}</>;
    case 'admin':
      return <>{adminContent || fallback}</>;
    case 'member':
      return <>{memberContent || fallback}</>;
    case 'viewer':
      return <>{viewerContent || fallback}</>;
    default:
      return <>{fallback}</>;
  }
}

/**
 * HOC para proteger componentes inteiros
 */
export function withPermissionProtection<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  permission: Permission,
  fallbackComponent?: React.ComponentType<any>
) {
  return function ProtectedComponent(props: T & { userContext: OrganizationUserContext | null }) {
    const { userContext, ...restProps } = props;
    const { hasPermission } = usePermission(userContext, permission);

    if (!hasPermission) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent />;
      }
      return null;
    }

    return <WrappedComponent {...(restProps as T)} />;
  };
}

/**
 * HOC para proteger componentes por role
 */
export function withRoleProtection<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  role: Role,
  fallbackComponent?: React.ComponentType<any>
) {
  return function ProtectedComponent(props: T & { userContext: OrganizationUserContext | null }) {
    const { userContext, ...restProps } = props;
    const { hasPermission } = useRole(userContext, role);

    if (!hasPermission) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent />;
      }
      return null;
    }

    return <WrappedComponent {...(restProps as T)} />;
  };
}
