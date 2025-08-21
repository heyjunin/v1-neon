/**
 * Middleware RBAC para tRPC
 */

import { TRPCError } from '@trpc/server';
import { Permission, Role } from './permissions';
import { createRBACChecker, OrganizationUserContext } from './utils';

// Interface para contexto tRPC com informações de organização
export interface TRPCContextWithOrg {
  user: {
    id: string;
    email: string;
  };
  organizationMember?: {
    organizationId: string;
    role: string;
    status: string;
  };
}

/**
 * Função para obter o contexto do usuário na organização
 */
export async function getOrganizationUserContext(
  ctx: TRPCContextWithOrg,
  organizationId?: string
): Promise<OrganizationUserContext | null> {
  // Se organizationId foi fornecido, usar ele
  if (organizationId && ctx.organizationMember?.organizationId === organizationId) {
    return {
      userId: ctx.user.id,
      organizationId: ctx.organizationMember.organizationId,
      role: ctx.organizationMember.role,
      status: ctx.organizationMember.status,
    };
  }

  // Se não foi fornecido organizationId, usar a organização atual do contexto
  if (ctx.organizationMember) {
    return {
      userId: ctx.user.id,
      organizationId: ctx.organizationMember.organizationId,
      role: ctx.organizationMember.role,
      status: ctx.organizationMember.status,
    };
  }

  return null;
}

/**
 * Middleware para verificar permissões
 */
export function requirePermission(permission: Permission) {
  return async (ctx: TRPCContextWithOrg, organizationId?: string) => {
    const userContext = await getOrganizationUserContext(ctx, organizationId);

    if (!userContext) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User is not a member of any organization',
      });
    }

    const rbac = createRBACChecker(userContext);
    const check = rbac.can(permission);

    if (!check.hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: check.reason || 'Insufficient permissions',
      });
    }

    return userContext;
  };
}

/**
 * Middleware para verificar múltiplas permissões (todas necessárias)
 */
export function requireAllPermissions(permissions: Permission[]) {
  return async (ctx: TRPCContextWithOrg, organizationId?: string) => {
    const userContext = await getOrganizationUserContext(ctx, organizationId);

    if (!userContext) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User is not a member of any organization',
      });
    }

    const rbac = createRBACChecker(userContext);
    const check = rbac.canAll(permissions);

    if (!check.hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: check.reason || 'Insufficient permissions',
      });
    }

    return userContext;
  };
}

/**
 * Middleware para verificar múltiplas permissões (pelo menos uma necessária)
 */
export function requireAnyPermission(permissions: Permission[]) {
  return async (ctx: TRPCContextWithOrg, organizationId?: string) => {
    const userContext = await getOrganizationUserContext(ctx, organizationId);

    if (!userContext) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User is not a member of any organization',
      });
    }

    const rbac = createRBACChecker(userContext);
    const check = rbac.canAny(permissions);

    if (!check.hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: check.reason || 'Insufficient permissions',
      });
    }

    return userContext;
  };
}

/**
 * Middleware para verificar role mínimo
 */
export function requireRole(role: Role) {
  return async (ctx: TRPCContextWithOrg, organizationId?: string) => {
    const userContext = await getOrganizationUserContext(ctx, organizationId);

    if (!userContext) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User is not a member of any organization',
      });
    }

    const rbac = createRBACChecker(userContext);
    const check = rbac.hasRole(role);

    if (!check.hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: check.reason || `Requires role: ${role}`,
      });
    }

    return userContext;
  };
}

/**
 * Middleware para verificar se é owner
 */
export function requireOwner() {
  return async (ctx: TRPCContextWithOrg, organizationId?: string) => {
    const userContext = await getOrganizationUserContext(ctx, organizationId);

    if (!userContext) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User is not a member of any organization',
      });
    }

    const rbac = createRBACChecker(userContext);

    if (!rbac.isOwner()) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only organization owners can perform this action',
      });
    }

    return userContext;
  };
}

/**
 * Middleware para verificar se é admin ou owner
 */
export function requireAdminOrOwner() {
  return async (ctx: TRPCContextWithOrg, organizationId?: string) => {
    const userContext = await getOrganizationUserContext(ctx, organizationId);

    if (!userContext) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User is not a member of any organization',
      });
    }

    const rbac = createRBACChecker(userContext);

    if (!rbac.isAdminOrOwner()) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only organization admins or owners can perform this action',
      });
    }

    return userContext;
  };
}

/**
 * Middleware para verificar se pode gerenciar um usuário específico
 */
export function requireCanManageUser(targetUserRole: string) {
  return async (ctx: TRPCContextWithOrg, organizationId?: string) => {
    const userContext = await getOrganizationUserContext(ctx, organizationId);

    if (!userContext) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User is not a member of any organization',
      });
    }

    const rbac = createRBACChecker(userContext);
    const check = rbac.canManageUser(targetUserRole);

    if (!check.hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: check.reason || 'Cannot manage this user',
      });
    }

    return userContext;
  };
}
