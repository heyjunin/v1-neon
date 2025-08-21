import { PERMISSIONS } from "@v1/auth/rbac";
import {
  acceptInvite,
  activateMember,
  activateOrganization,
  addMemberToOrganization,
  bulkAddMembers,
  cancelInvite,
  createInvite,
  createOrganization,
  deactivateOrganization,
  deleteOrganization,
  removeMemberFromOrganization,
  resendInvite,
  suspendMember,
  transferOwnership,
  updateMemberRole,
  updateOrganization,
} from "@v1/database/mutations";
import {
  getInviteByToken,
  getOrganizationById,
  getOrganizationBySlug,
  getOrganizationInvites,
  getOrganizationMembers,
  getOrganizationsByMemberId,
  getOrganizationsByOwnerId,
  getOrganizationsWithOwner,
  getPendingInvitesByEmail,
  getUserOrganizations,
} from "@v1/database/queries";
import { logger } from "@v1/logger";
import { z } from "zod";
import {
  loggedProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../context";

// Função auxiliar para verificar permissões de organização
async function checkOrganizationPermission(userId: string, organizationId: string, permission: string) {
  const userOrganizations = await getUserOrganizations(userId);
  const userOrg = userOrganizations.find(org => org.id === organizationId);
  
  if (!userOrg || userOrg.status !== 'active') {
    return false;
  }

  // Mapeamento básico de roles para permissões
  const rolePermissions: Record<string, string[]> = {
    owner: Object.values(PERMISSIONS),
    admin: [
      PERMISSIONS.ORGANIZATION_VIEW,
      PERMISSIONS.ORGANIZATION_UPDATE,
      PERMISSIONS.MEMBER_VIEW,
      PERMISSIONS.MEMBER_INVITE,
      PERMISSIONS.MEMBER_UPDATE_ROLE,
      PERMISSIONS.MEMBER_REMOVE,
      PERMISSIONS.INVITE_VIEW,
      PERMISSIONS.INVITE_CREATE,
      PERMISSIONS.INVITE_CANCEL,
      PERMISSIONS.INVITE_RESEND,
    ],
    member: [
      PERMISSIONS.ORGANIZATION_VIEW,
      PERMISSIONS.MEMBER_VIEW,
      PERMISSIONS.POST_VIEW,
      PERMISSIONS.POST_CREATE,
      PERMISSIONS.POST_UPDATE,
    ],
    viewer: [
      PERMISSIONS.ORGANIZATION_VIEW,
      PERMISSIONS.MEMBER_VIEW,
      PERMISSIONS.POST_VIEW,
    ],
  };

  const userPermissions = rolePermissions[userOrg.role] || [];
  return userPermissions.includes(permission);
}

// Schemas
const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .max(50, "Slug deve ter no máximo 50 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    ),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

const updateOrganizationSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .max(50, "Slug deve ter no máximo 50 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    )
    .optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

const getOrganizationsSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  ownerId: z.string().optional(),
  memberId: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const organizationIdSchema = z.object({
  id: z.string(),
});

const organizationSlugSchema = z.object({
  slug: z.string(),
});

const addMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(["owner", "admin", "member"]).default("member"),
});

const updateMemberRoleSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(["owner", "admin", "member"]),
});

const removeMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
});

const createInviteSchema = z.object({
  organizationId: z.string(),
  email: z.string().email("Email inválido"),
  role: z.enum(["owner", "admin", "member"]).default("member"),
});

const acceptInviteSchema = z.object({
  token: z.string(),
});

const cancelInviteSchema = z.object({
  inviteId: z.string(),
});

const resendInviteSchema = z.object({
  inviteId: z.string(),
});

const transferOwnershipSchema = z.object({
  organizationId: z.string(),
  newOwnerId: z.string(),
});

const bulkAddMembersSchema = z.object({
  organizationId: z.string(),
  members: z.array(
    z.object({
      userId: z.string(),
      role: z.enum(["owner", "admin", "member"]).default("member"),
    }),
  ),
});

export const organizationsRouter = router({
  // Listar organizations com filtros e paginação
  getOrganizations: loggedProcedure
    .input(getOrganizationsSchema)
    .query(async ({ input }) => {
      try {
        const organizations = await getOrganizationsWithOwner(
          {
            search: input.search,
            ownerId: input.ownerId,
            memberId: input.memberId,
            isActive: input.isActive,
            sortBy: input.sortBy,
            sortOrder: input.sortOrder,
          },
          {
            page: input.page,
            limit: input.limit,
          },
        );

        return organizations;
      } catch (error) {
        logger.error("Error in getOrganizations:", error);
        console.error("Detailed error:", error);

        if (
          error instanceof Error &&
          (error.message.includes("relation") ||
            error.message.includes("table") ||
            error.message.includes("connection"))
        ) {
          return {
            data: [],
            total: 0,
            page: input.page,
            limit: input.limit,
            totalPages: 0,
          };
        }

        throw new Error(
          `Failed to get organizations: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  // Buscar organization por ID
  getOrganizationById: loggedProcedure
    .input(organizationIdSchema)
    .query(async ({ input }) => {
      try {
        const organization = await getOrganizationById(input.id);

        if (!organization) {
          throw new Error("Organization not found");
        }

        return organization;
      } catch (error) {
        logger.error("Error in getOrganizationById:", error);
        throw new Error("Failed to get organization");
      }
    }),

  // Buscar organization por slug
  getOrganizationBySlug: loggedProcedure
    .input(organizationSlugSchema)
    .query(async ({ input }) => {
      try {
        const organization = await getOrganizationBySlug(input.slug);

        if (!organization) {
          throw new Error("Organization not found");
        }

        return organization;
      } catch (error) {
        logger.error("Error in getOrganizationBySlug:", error);
        throw new Error("Failed to get organization");
      }
    }),

  // Buscar organizations por owner
  getOrganizationsByOwnerId: loggedProcedure
    .input(z.object({ ownerId: z.string() }))
    .query(async ({ input }) => {
      try {
        const organizations = await getOrganizationsByOwnerId(input.ownerId);
        return organizations || [];
      } catch (error) {
        logger.error("Error in getOrganizationsByOwnerId:", error);
        throw new Error("Failed to get organizations by owner");
      }
    }),

  // Buscar organizations por member
  getOrganizationsByMemberId: loggedProcedure
    .input(z.object({ memberId: z.string() }))
    .query(async ({ input }) => {
      try {
        const organizations = await getOrganizationsByMemberId(input.memberId);
        return organizations || [];
      } catch (error) {
        logger.error("Error in getOrganizationsByMemberId:", error);
        throw new Error("Failed to get organizations by member");
      }
    }),

  // Buscar organizations do usuário atual
  getUserOrganizations: protectedProcedure.query(async ({ ctx }) => {
    try {
      const organizations = await getUserOrganizations(ctx.user.id);
      return organizations || [];
    } catch (error) {
      logger.error("Error in getUserOrganizations:", error);
      throw new Error("Failed to get user organizations");
    }
  }),

  // Criar organization
  createOrganization: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const organization = await createOrganization({
          ...input,
          ownerId: ctx.user.id,
        });
        return organization;
      } catch (error) {
        logger.error("Error in createOrganization:", error);
        throw new Error("Failed to create organization");
      }
    }),

  // Atualizar organization
  updateOrganization: protectedProcedure
    .input(updateOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão para atualizar organização
        const canUpdate = await checkOrganizationPermission(ctx.user.id, input.id, PERMISSIONS.ORGANIZATION_UPDATE);
        
        if (!canUpdate) {
          throw new Error("You don't have permission to update this organization");
        }

        const { id, ...updateData } = input;
        const organization = await updateOrganization(id, updateData);
        
        logger.info(`Organization ${id} updated by user ${ctx.user.id}`);
        return organization;
      } catch (error) {
        logger.error("Error in updateOrganization:", error);
        throw new Error("Failed to update organization");
      }
    }),

  // Deletar organization
  deleteOrganization: protectedProcedure
    .input(organizationIdSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar se o usuário é owner da organização
        const userOrganizations = await getUserOrganizations(ctx.user.id);
        const userOrg = userOrganizations.find(org => org.id === input.id);
        
        if (!userOrg || userOrg.role !== 'owner' || userOrg.status !== 'active') {
          throw new Error("Only organization owners can delete organizations");
        }

        await deleteOrganization(input.id);
        
        logger.info(`Organization ${input.id} deleted by owner ${ctx.user.id}`);
        return { success: true };
      } catch (error) {
        logger.error("Error in deleteOrganization:", error);
        throw new Error("Failed to delete organization");
      }
    }),

  // Desativar organization
  deactivateOrganization: protectedProcedure
    .input(organizationIdSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await deactivateOrganization(input.id);
        return { success };
      } catch (error) {
        logger.error("Error in deactivateOrganization:", error);
        throw new Error("Failed to deactivate organization");
      }
    }),

  // Ativar organization
  activateOrganization: protectedProcedure
    .input(organizationIdSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await activateOrganization(input.id);
        return { success };
      } catch (error) {
        logger.error("Error in activateOrganization:", error);
        throw new Error("Failed to activate organization");
      }
    }),

  // Buscar membros da organization
  getOrganizationMembers: loggedProcedure
    .input(organizationIdSchema)
    .query(async ({ input }) => {
      try {
        const members = await getOrganizationMembers(input.id);
        return members || [];
      } catch (error) {
        logger.error("Error in getOrganizationMembers:", error);
        throw new Error("Failed to get organization members");
      }
    }),

  // Adicionar membro à organization
  addMember: protectedProcedure
    .input(addMemberSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const member = await addMemberToOrganization({
          ...input,
          invitedBy: ctx.user.id,
          joinedAt: new Date(),
        });
        return member;
      } catch (error) {
        logger.error("Error in addMember:", error);
        throw new Error("Failed to add member");
      }
    }),

  // Atualizar role do membro
  updateMemberRole: protectedProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ input }) => {
      try {
        const member = await updateMemberRole(
          input.organizationId,
          input.userId,
          input.role,
        );
        return member;
      } catch (error) {
        logger.error("Error in updateMemberRole:", error);
        throw new Error("Failed to update member role");
      }
    }),

  // Remover membro da organization
  removeMember: protectedProcedure
    .input(removeMemberSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await removeMemberFromOrganization(
          input.organizationId,
          input.userId,
        );
        return { success };
      } catch (error) {
        logger.error("Error in removeMember:", error);
        throw new Error("Failed to remove member");
      }
    }),

  // Suspender membro
  suspendMember: protectedProcedure
    .input(removeMemberSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await suspendMember(input.organizationId, input.userId);
        return { success };
      } catch (error) {
        logger.error("Error in suspendMember:", error);
        throw new Error("Failed to suspend member");
      }
    }),

  // Ativar membro
  activateMember: protectedProcedure
    .input(removeMemberSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await activateMember(
          input.organizationId,
          input.userId,
        );
        return { success };
      } catch (error) {
        logger.error("Error in activateMember:", error);
        throw new Error("Failed to activate member");
      }
    }),

  // Buscar convites da organization
  getOrganizationInvites: loggedProcedure
    .input(organizationIdSchema)
    .query(async ({ input }) => {
      try {
        const invites = await getOrganizationInvites(input.id);
        return invites || [];
      } catch (error) {
        logger.error("Error in getOrganizationInvites:", error);
        throw new Error("Failed to get organization invites");
      }
    }),

  // Criar convite
  createInvite: protectedProcedure
    .input(createInviteSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const invite = await createInvite({
          ...input,
          invitedBy: ctx.user.id,
        });
        return invite;
      } catch (error) {
        logger.error("Error in createInvite:", error);
        throw new Error("Failed to create invite");
      }
    }),

  // Aceitar convite
  acceptInvite: protectedProcedure
    .input(acceptInviteSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await acceptInvite(input.token, ctx.user.id);
        return result;
      } catch (error) {
        logger.error("Error in acceptInvite:", error);
        throw new Error("Failed to accept invite");
      }
    }),

  // Cancelar convite
  cancelInvite: protectedProcedure
    .input(cancelInviteSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await cancelInvite(input.inviteId);
        return { success };
      } catch (error) {
        logger.error("Error in cancelInvite:", error);
        throw new Error("Failed to cancel invite");
      }
    }),

  // Reenviar convite
  resendInvite: protectedProcedure
    .input(resendInviteSchema)
    .mutation(async ({ input }) => {
      try {
        const invite = await resendInvite(input.inviteId);
        return invite;
      } catch (error) {
        logger.error("Error in resendInvite:", error);
        throw new Error("Failed to resend invite");
      }
    }),

  // Transferir ownership
  transferOwnership: protectedProcedure
    .input(transferOwnershipSchema)
    .mutation(async ({ input }) => {
      try {
        const success = await transferOwnership(
          input.organizationId,
          input.newOwnerId,
        );
        return { success };
      } catch (error) {
        logger.error("Error in transferOwnership:", error);
        throw new Error("Failed to transfer ownership");
      }
    }),

  // Adicionar múltiplos membros
  bulkAddMembers: protectedProcedure
    .input(bulkAddMembersSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const members = await bulkAddMembers(
          input.organizationId,
          input.members.map((member) => ({
            ...member,
            invitedBy: ctx.user.id,
          })),
        );
        return members;
      } catch (error) {
        logger.error("Error in bulkAddMembers:", error);
        throw new Error("Failed to add members");
      }
    }),

  // Buscar convites pendentes por email
  getPendingInvitesByEmail: loggedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const invites = await getPendingInvitesByEmail(input.email);
        return invites || [];
      } catch (error) {
        logger.error("Error in getPendingInvitesByEmail:", error);
        throw new Error("Failed to get pending invites");
      }
    }),

  // Buscar convite por token
  getInviteByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const invite = await getInviteByToken(input.token);
        return invite;
      } catch (error) {
        logger.error("Error in getInviteByToken:", error);
        throw new Error("Failed to get invite");
      }
    }),

  // Rota de teste para verificar a conexão
  testConnection: publicProcedure.query(async () => {
    try {
      const { getOrganizations } = await import("@v1/database/queries");
      const result = await getOrganizations({}, { page: 1, limit: 1 });
      return {
        success: true,
        message: "Database connection working",
        totalOrganizations: result.total,
      };
    } catch (error) {
      logger.error("Database connection test failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        error: error,
      };
    }
  }),
});
