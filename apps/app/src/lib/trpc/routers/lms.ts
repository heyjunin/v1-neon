import { PERMISSIONS, createRBACChecker } from "@v1/auth/rbac";
import { createLMS, deleteLMS, updateLMS } from "@v1/database/mutations";
import {
  getLMSByIdWithOrganization,
  getLMSWithOrganization,
  getLMSByOrganizationId,
  getLMSByDomain,
} from "@v1/database/queries";
import { getTimezones } from "@v1/location";
import { logger } from "@v1/logger";
import { z } from "zod";
import {
  organizationProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../context";

// Schemas
const createLMSSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  ogMetaTags: z.record(z.any()).optional(),
  seoMetaTags: z.record(z.any()).optional(),
  domain: z.string().optional(),
  isMultiLanguage: z.boolean().default(false),
  primaryLanguage: z.string().optional(),
  secondaryLanguage: z.string().optional(),
  primaryTimezone: z.string().optional(),
  secondaryTimezone: z.string().optional(),
});

const updateLMSSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  ogMetaTags: z.record(z.any()).optional(),
  seoMetaTags: z.record(z.any()).optional(),
  domain: z.string().optional(),
  isMultiLanguage: z.boolean().default(false),
  primaryLanguage: z.string().optional(),
  secondaryLanguage: z.string().optional(),
  primaryTimezone: z.string().optional(),
  secondaryTimezone: z.string().optional(),
});

const getLMSSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const getLMSByIdSchema = z.object({
  id: z.string(),
});

const deleteLMSSchema = z.object({
  id: z.string(),
});

export const lmsRouter = router({
  // Listar LMS da organização atual com filtros e paginação
  getLMS: organizationProcedure.input(getLMSSchema).query(async ({ input, ctx }) => {
    try {
      const lmsList = await getLMSWithOrganization(
        {
          search: input.search,
          organizationId: ctx.organizationId,
          isActive: input.isActive,
          sortBy: input.sortBy,
          sortOrder: input.sortOrder,
        },
        {
          page: input.page,
          limit: input.limit,
        },
      );

      return lmsList;
    } catch (error) {
      logger.error("Error in getLMS:", error);
      throw new Error(
        `Failed to get LMS: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }),

  // Buscar LMS por ID (apenas se pertencer à organização atual)
  getLMSById: organizationProcedure
    .input(getLMSByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const lmsItem = await getLMSByIdWithOrganization(input.id);

        if (!lmsItem) {
          throw new Error("LMS not found");
        }

        // Verificar se o LMS pertence à organização atual
        if (lmsItem.organizationId !== ctx.organizationId) {
          throw new Error("LMS not found in current organization");
        }

        return lmsItem;
      } catch (error) {
        logger.error("Error in getLMSById:", error);
        throw new Error("Failed to get LMS");
      }
    }),

  // Buscar LMS por organização (apenas para usuários autenticados)
  getLMSByOrganization: protectedProcedure
    .input(z.object({ 
      organizationId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ input, ctx }) => {
      try {
        // Verificar se o usuário é membro da organização
        const { getOrganizationMember } = await import("@v1/database/queries");
        const member = await getOrganizationMember(input.organizationId, ctx.user.id);
        
        if (!member || member.status !== "active") {
          throw new Error("You don't have access to this organization");
        }

        const lmsList = await getLMSWithOrganization(
          {
            organizationId: input.organizationId,
          },
          {
            page: input.page,
            limit: input.limit,
          },
        );

        return lmsList;
      } catch (error) {
        logger.error("Error in getLMSByOrganization:", error);
        throw new Error("Failed to get LMS by organization");
      }
    }),

  // Criar LMS na organização atual
  createLMS: organizationProcedure
    .input(createLMSSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão para criar LMS
        const rbacChecker = createRBACChecker({
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
          role: ctx.userRole,
          status: "active",
        });

        const permissionCheck = rbacChecker.can(PERMISSIONS.PROJECT_CREATE); // Usar permissão de projeto como LMS
        if (!permissionCheck.hasPermission) {
          throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }

        // Verificar se o domínio já existe na organização
        if (input.domain) {
          const existingLMS = await getLMSByDomain(input.domain, ctx.organizationId);
          if (existingLMS) {
            throw new Error("Domain already exists in this organization");
          }
        }
        
        const lmsItem = await createLMS({
          ...input,
          organizationId: ctx.organizationId,
        });
        
        logger.info(`LMS created by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return lmsItem;
      } catch (error) {
        logger.error("Error in createLMS:", error);
        throw new Error("Failed to create LMS");
      }
    }),

  // Atualizar LMS (apenas se pertencer à organização atual)
  updateLMS: organizationProcedure
    .input(updateLMSSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Buscar o LMS para verificar se pertence à organização atual
        const lmsItem = await getLMSByIdWithOrganization(input.id);
        
        if (!lmsItem) {
          throw new Error("LMS not found");
        }

        if (lmsItem.organizationId !== ctx.organizationId) {
          throw new Error("LMS not found in current organization");
        }

        // Verificar permissões
        const rbacChecker = createRBACChecker({
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
          role: ctx.userRole,
          status: "active",
        });

        const permissionCheck = rbacChecker.can(PERMISSIONS.PROJECT_UPDATE);
        if (!permissionCheck.hasPermission) {
          throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }

        // Verificar se o domínio já existe na organização (se foi alterado)
        if (input.domain && input.domain !== lmsItem.domain) {
          const existingLMS = await getLMSByDomain(input.domain, ctx.organizationId);
          if (existingLMS) {
            throw new Error("Domain already exists in this organization");
          }
        }

        const updatedLMS = await updateLMS(input.id, {
          name: input.name,
          shortDescription: input.shortDescription,
          longDescription: input.longDescription,
          ogMetaTags: input.ogMetaTags,
          seoMetaTags: input.seoMetaTags,
          domain: input.domain,
          isMultiLanguage: input.isMultiLanguage,
          primaryLanguage: input.primaryLanguage,
          secondaryLanguage: input.secondaryLanguage,
          primaryTimezone: input.primaryTimezone,
          secondaryTimezone: input.secondaryTimezone,
        });
        
        logger.info(`LMS ${input.id} updated by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return updatedLMS;
      } catch (error) {
        logger.error("Error in updateLMS:", error);
        throw new Error("Failed to update LMS");
      }
    }),

  // Deletar LMS (apenas se pertencer à organização atual)
  deleteLMS: organizationProcedure
    .input(deleteLMSSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Buscar o LMS para verificar se pertence à organização atual
        const lmsItem = await getLMSByIdWithOrganization(input.id);
        
        if (!lmsItem) {
          throw new Error("LMS not found");
        }

        if (lmsItem.organizationId !== ctx.organizationId) {
          throw new Error("LMS not found in current organization");
        }

        // Verificar permissões
        const rbacChecker = createRBACChecker({
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
          role: ctx.userRole,
          status: "active",
        });

        const permissionCheck = rbacChecker.can(PERMISSIONS.PROJECT_DELETE);
        if (!permissionCheck.hasPermission) {
          throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }

        await deleteLMS(input.id);
        
        logger.info(`LMS ${input.id} deleted by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return { success: true };
      } catch (error) {
        logger.error("Error in deleteLMS:", error);
        throw new Error("Failed to delete LMS");
      }
    }),

  // Obter timezones disponíveis
  getTimezones: publicProcedure.query(async () => {
    try {
      return getTimezones();
    } catch (error) {
      logger.error("Error getting timezones:", error);
      throw new Error("Failed to get timezones");
    }
  }),

  // Buscar LMS por domínio (público)
  getLMSByDomain: publicProcedure
    .input(z.object({ domain: z.string() }))
    .query(async ({ input }) => {
      try {
        const lmsItem = await getLMSByDomain(input.domain);
        
        if (!lmsItem || !lmsItem.isActive) {
          throw new Error("LMS not found or inactive");
        }

        return lmsItem;
      } catch (error) {
        logger.error("Error in getLMSByDomain:", error);
        throw new Error("Failed to get LMS by domain");
      }
    }),
});
