/**
 * Componentes de proteção RBAC específicos para organizações
 */

import React from 'react';
import { useOrganization } from '@/contexts/organization-context';
import { 
  ProtectedByPermission,
  ProtectedByAllPermissions,
  ProtectedByAnyPermission,
  ProtectedByRole,
  ProtectedByOwner,
  ProtectedByAdminOrOwner,
  ProtectedByManageUser,
  RoleBasedContent,
  ConditionalProtection,
  Permission,
  Role,
} from '@v1/auth/rbac';

// Props base para componentes de proteção organizacional
interface BaseOrganizationProtectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Props para proteção por permissão organizacional
interface OrganizationPermissionProtectionProps extends BaseOrganizationProtectionProps {
  permission: Permission;
}

// Props para proteção por múltiplas permissões organizacionais
interface OrganizationMultiplePermissionsProtectionProps extends BaseOrganizationProtectionProps {
  permissions: Permission[];
}

// Props para proteção por role organizacional
interface OrganizationRoleProtectionProps extends BaseOrganizationProtectionProps {
  role: Role;
}

// Props para proteção por gerenciamento de usuário organizacional
interface OrganizationManageUserProtectionProps extends BaseOrganizationProtectionProps {
  targetUserRole: string;
}

/**
 * Componente para proteger conteúdo baseado em uma permissão específica na organização atual
 */
export function OrganizationProtectedByPermission({
  children,
  fallback = null,
  permission,
}: OrganizationPermissionProtectionProps) {
  const { userContext } = useOrganization();

  return (
    <ProtectedByPermission
      userContext={userContext}
      permission={permission}
      fallback={fallback}
    >
      {children}
    </ProtectedByPermission>
  );
}

/**
 * Componente para proteger conteúdo baseado em múltiplas permissões (todas necessárias)
 */
export function OrganizationProtectedByAllPermissions({
  children,
  fallback = null,
  permissions,
}: OrganizationMultiplePermissionsProtectionProps) {
  const { userContext } = useOrganization();

  return (
    <ProtectedByAllPermissions
      userContext={userContext}
      permissions={permissions}
      fallback={fallback}
    >
      {children}
    </ProtectedByAllPermissions>
  );
}

/**
 * Componente para proteger conteúdo baseado em múltiplas permissões (pelo menos uma necessária)
 */
export function OrganizationProtectedByAnyPermission({
  children,
  fallback = null,
  permissions,
}: OrganizationMultiplePermissionsProtectionProps) {
  const { userContext } = useOrganization();

  return (
    <ProtectedByAnyPermission
      userContext={userContext}
      permissions={permissions}
      fallback={fallback}
    >
      {children}
    </ProtectedByAnyPermission>
  );
}

/**
 * Componente para proteger conteúdo baseado em role na organização atual
 */
export function OrganizationProtectedByRole({
  children,
  fallback = null,
  role,
}: OrganizationRoleProtectionProps) {
  const { userContext } = useOrganization();

  return (
    <ProtectedByRole
      userContext={userContext}
      role={role}
      fallback={fallback}
    >
      {children}
    </ProtectedByRole>
  );
}

/**
 * Componente para proteger conteúdo apenas para owners da organização atual
 */
export function OrganizationProtectedByOwner({
  children,
  fallback = null,
}: BaseOrganizationProtectionProps) {
  const { userContext } = useOrganization();

  return (
    <ProtectedByOwner
      userContext={userContext}
      fallback={fallback}
    >
      {children}
    </ProtectedByOwner>
  );
}

/**
 * Componente para proteger conteúdo para admins ou owners da organização atual
 */
export function OrganizationProtectedByAdminOrOwner({
  children,
  fallback = null,
}: BaseOrganizationProtectionProps) {
  const { userContext } = useOrganization();

  return (
    <ProtectedByAdminOrOwner
      userContext={userContext}
      fallback={fallback}
    >
      {children}
    </ProtectedByAdminOrOwner>
  );
}

/**
 * Componente para proteger conteúdo baseado na capacidade de gerenciar um usuário
 */
export function OrganizationProtectedByManageUser({
  children,
  fallback = null,
  targetUserRole,
}: OrganizationManageUserProtectionProps) {
  const { userContext } = useOrganization();

  return (
    <ProtectedByManageUser
      userContext={userContext}
      targetUserRole={targetUserRole}
      fallback={fallback}
    >
      {children}
    </ProtectedByManageUser>
  );
}

/**
 * Componente para mostrar diferentes conteúdos baseados no role na organização atual
 */
interface OrganizationRoleBasedContentProps {
  ownerContent?: React.ReactNode;
  adminContent?: React.ReactNode;
  memberContent?: React.ReactNode;
  viewerContent?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function OrganizationRoleBasedContent({
  ownerContent,
  adminContent,
  memberContent,
  viewerContent,
  fallback = null,
}: OrganizationRoleBasedContentProps) {
  const { userContext } = useOrganization();

  return (
    <RoleBasedContent
      userContext={userContext}
      ownerContent={ownerContent}
      adminContent={adminContent}
      memberContent={memberContent}
      viewerContent={viewerContent}
      fallback={fallback}
    />
  );
}

/**
 * Componente para proteção condicional na organização atual
 */
interface OrganizationConditionalProtectionProps extends BaseOrganizationProtectionProps {
  condition: boolean;
  showFallbackMessage?: boolean;
  fallbackMessage?: string;
}

export function OrganizationConditionalProtection({
  children,
  fallback = null,
  condition,
  showFallbackMessage = false,
  fallbackMessage = "You don't have permission to view this content in this organization.",
}: OrganizationConditionalProtectionProps) {
  return (
    <ConditionalProtection
      condition={condition}
      fallback={fallback}
      showFallbackMessage={showFallbackMessage}
      fallbackMessage={fallbackMessage}
    >
      {children}
    </ConditionalProtection>
  );
}

/**
 * Componente para mostrar informações de permissão
 */
interface PermissionInfoProps {
  permission: Permission;
  showIcon?: boolean;
  className?: string;
}

export function PermissionInfo({ 
  permission, 
  showIcon = true, 
  className = "" 
}: PermissionInfoProps) {
  const { userContext } = useOrganization();
  
  if (!userContext) {
    return null;
  }

  // Aqui você pode importar um ícone de sua biblioteca de ícones
  const hasPermission = userContext.status === 'active';
  
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {showIcon && (
        <span className={hasPermission ? "text-green-500" : "text-red-500"}>
          {hasPermission ? "✓" : "✗"}
        </span>
      )}
      <span className="font-mono text-xs">{permission}</span>
    </div>
  );
}

/**
 * Componente para mostrar resumo das permissões do usuário
 */
export function UserPermissionsSummary({ className = "" }: { className?: string }) {
  const { userContext } = useOrganization();
  
  if (!userContext) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-sm text-gray-600">No organization context available</p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h4 className="font-semibold mb-2">Your Permissions</h4>
      <div className="space-y-1 text-sm">
        <div><strong>Role:</strong> {userContext.role}</div>
        <div><strong>Status:</strong> {userContext.status}</div>
        <div><strong>Organization:</strong> {userContext.organizationId}</div>
      </div>
    </div>
  );
}
