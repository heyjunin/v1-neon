/**
 * Exemplo de como usar o sistema RBAC nas procedures tRPC de organizações
 * Este arquivo mostra como integrar o middleware RBAC nas operações sensíveis
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { 
  updateOrganization,
  deleteOrganization,
  addMemberToOrganization,
  updateMemberRole,
  removeMemberFromOrganization,
  transferOwnership,
} from '@v1/database/mutations';
import { getUserOrganizations } from '@v1/database/queries';
import { logger } from '@v1/logger';
import { PERMISSIONS } from '@v1/auth/rbac';
import { protectedProcedure, router } from '../context';

// Função auxiliar para obter o contexto de usuário na organização
async function getOrganizationUserContext(userId: string, organizationId: string) {
  const userOrganizations = await getUserOrganizations(userId);
  const userOrg = userOrganizations.find(org => org.id === organizationId);
  
  if (!userOrg) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User is not a member of this organization',
    });
  }

  return {
    userId,
    organizationId,
    role: userOrg.role,
    status: userOrg.status,
  };
}

// Função auxiliar para verificar permissão
async function checkPermission(userId: string, organizationId: string, permission: string) {
  const userContext = await getOrganizationUserContext(userId, organizationId);
  
  if (userContext.status !== 'active') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User is not active in this organization',
    });
  }

  // Aqui você implementaria a lógica de verificação de permissão
  // Por simplicidade, vou usar uma verificação básica de role
  const rolePermissions: Record<string, string[]> = {
    owner: Object.values(PERMISSIONS),
    admin: [
      PERMISSIONS.ORGANIZATION_VIEW,
      PERMISSIONS.ORGANIZATION_UPDATE,
      PERMISSIONS.MEMBER_VIEW,
      PERMISSIONS.MEMBER_INVITE,
      PERMISSIONS.MEMBER_UPDATE_ROLE,
      PERMISSIONS.MEMBER_REMOVE,
      // ... outras permissões de admin
    ],
    member: [
      PERMISSIONS.ORGANIZATION_VIEW,
      PERMISSIONS.MEMBER_VIEW,
      PERMISSIONS.POST_VIEW,
      PERMISSIONS.POST_CREATE,
      // ... outras permissões de member
    ],
  };

  const userPermissions = rolePermissions[userContext.role] || [];
  
  if (!userPermissions.includes(permission)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Insufficient permissions. Required: ${permission}`,
    });
  }

  return userContext;
}

// Schemas
const updateOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

const addMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(['owner', 'admin', 'member']).default('member'),
});

const updateMemberRoleSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
});

const removeMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
});

const transferOwnershipSchema = z.object({
  organizationId: z.string(),
  newOwnerId: z.string(),
});

export const organizationsRBACRouter = router({
  // Atualizar organização - Requer permissão ORGANIZATION_UPDATE
  updateOrganization: protectedProcedure
    .input(updateOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão
        await checkPermission(ctx.user.id, input.id, PERMISSIONS.ORGANIZATION_UPDATE);

        const { id, ...updateData } = input;
        const organization = await updateOrganization(id, updateData);
        
        logger.info(`Organization ${id} updated by user ${ctx.user.id}`);
        return organization;
      } catch (error) {
        logger.error('Error in updateOrganization:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update organization',
        });
      }
    }),

  // Deletar organização - Requer ser owner
  deleteOrganization: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await getOrganizationUserContext(ctx.user.id, input.id);
        
        // Apenas owners podem deletar organizações
        if (userContext.role !== 'owner') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only organization owners can delete organizations',
          });
        }

        await deleteOrganization(input.id);
        
        logger.info(`Organization ${input.id} deleted by owner ${ctx.user.id}`);
        return { success: true };
      } catch (error) {
        logger.error('Error in deleteOrganization:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete organization',
        });
      }
    }),

  // Adicionar membro - Requer permissão MEMBER_INVITE
  addMember: protectedProcedure
    .input(addMemberSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão
        const userContext = await checkPermission(
          ctx.user.id, 
          input.organizationId, 
          PERMISSIONS.MEMBER_INVITE
        );

        // Verificar se o usuário pode adicionar membros com o role especificado
        if (input.role === 'owner' && userContext.role !== 'owner') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only owners can add other owners',
          });
        }

        if (input.role === 'admin' && !['owner', 'admin'].includes(userContext.role)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only owners and admins can add admins',
          });
        }

        const member = await addMemberToOrganization({
          ...input,
          invitedBy: ctx.user.id,
          joinedAt: new Date(),
          status: 'active',
        });
        
        logger.info(`User ${input.userId} added to organization ${input.organizationId} by ${ctx.user.id}`);
        return member;
      } catch (error) {
        logger.error('Error in addMember:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add member',
        });
      }
    }),

  // Atualizar role do membro - Requer permissão MEMBER_UPDATE_ROLE
  updateMemberRole: protectedProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão
        const userContext = await checkPermission(
          ctx.user.id, 
          input.organizationId, 
          PERMISSIONS.MEMBER_UPDATE_ROLE
        );

        // Obter informações do membro alvo
        const targetUserContext = await getOrganizationUserContext(input.userId, input.organizationId);

        // Verificar se o usuário pode gerenciar o membro alvo
        if (userContext.role === 'admin' && ['owner', 'admin'].includes(targetUserContext.role)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Admins cannot manage owners or other admins',
          });
        }

        // Verificar se o usuário pode atribuir o novo role
        if (input.role === 'owner' && userContext.role !== 'owner') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only owners can promote users to owner',
          });
        }

        const member = await updateMemberRole(
          input.organizationId,
          input.userId,
          input.role
        );
        
        logger.info(`User ${input.userId} role updated to ${input.role} in organization ${input.organizationId} by ${ctx.user.id}`);
        return member;
      } catch (error) {
        logger.error('Error in updateMemberRole:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update member role',
        });
      }
    }),

  // Remover membro - Requer permissão MEMBER_REMOVE
  removeMember: protectedProcedure
    .input(removeMemberSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão
        const userContext = await checkPermission(
          ctx.user.id, 
          input.organizationId, 
          PERMISSIONS.MEMBER_REMOVE
        );

        // Obter informações do membro alvo
        const targetUserContext = await getOrganizationUserContext(input.userId, input.organizationId);

        // Verificar se o usuário pode remover o membro alvo
        if (userContext.role === 'admin' && ['owner', 'admin'].includes(targetUserContext.role)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Admins cannot remove owners or other admins',
          });
        }

        // Owners não podem se auto-remover se forem o único owner
        if (targetUserContext.role === 'owner' && input.userId === ctx.user.id) {
          // Aqui você deveria verificar se há outros owners
          // Por simplicidade, vou apenas bloquear
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Owners cannot remove themselves. Transfer ownership first.',
          });
        }

        const success = await removeMemberFromOrganization(
          input.organizationId,
          input.userId
        );
        
        logger.info(`User ${input.userId} removed from organization ${input.organizationId} by ${ctx.user.id}`);
        return { success };
      } catch (error) {
        logger.error('Error in removeMember:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove member',
        });
      }
    }),

  // Transferir ownership - Apenas owners
  transferOwnership: protectedProcedure
    .input(transferOwnershipSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userContext = await getOrganizationUserContext(ctx.user.id, input.organizationId);
        
        // Apenas owners podem transferir ownership
        if (userContext.role !== 'owner') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only organization owners can transfer ownership',
          });
        }

        // Verificar se o novo owner é membro da organização
        await getOrganizationUserContext(input.newOwnerId, input.organizationId);

        const success = await transferOwnership(
          input.organizationId,
          input.newOwnerId
        );
        
        logger.info(`Ownership of organization ${input.organizationId} transferred from ${ctx.user.id} to ${input.newOwnerId}`);
        return { success };
      } catch (error) {
        logger.error('Error in transferOwnership:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to transfer ownership',
        });
      }
    }),
});
