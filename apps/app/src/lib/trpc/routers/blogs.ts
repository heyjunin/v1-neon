import { PERMISSIONS, createRBACChecker } from "@v1/auth/rbac";
import { createBlog, deleteBlog, updateBlog } from "@v1/database/mutations";
import {
    getBlogByDomain,
    getBlogByIdWithOrganization,
    getBlogsWithOrganization
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
const createBlogSchema = z.object({
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

const updateBlogSchema = z.object({
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

const getBlogsSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const getBlogByIdSchema = z.object({
  id: z.string(),
});

const deleteBlogSchema = z.object({
  id: z.string(),
});

export const blogsRouter = router({
  // Listar blogs da organização atual com filtros e paginação
  getBlogs: organizationProcedure.input(getBlogsSchema).query(async ({ input, ctx }) => {
    try {
      const blogs = await getBlogsWithOrganization(
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

      return blogs;
    } catch (error) {
      logger.error("Error in getBlogs:", error);
      throw new Error(
        `Failed to get blogs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }),

  // Buscar blog por ID (apenas se pertencer à organização atual)
  getBlogById: organizationProcedure
    .input(getBlogByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const blog = await getBlogByIdWithOrganization(input.id);

        if (!blog) {
          throw new Error("Blog not found");
        }

        // Verificar se o blog pertence à organização atual
        if (blog.organizationId !== ctx.organizationId) {
          throw new Error("Blog not found in current organization");
        }

        return blog;
      } catch (error) {
        logger.error("Error in getBlogById:", error);
        throw new Error("Failed to get blog");
      }
    }),

  // Buscar blogs por organização (apenas para usuários autenticados)
  getBlogsByOrganization: protectedProcedure
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

        const blogs = await getBlogsWithOrganization(
          {
            organizationId: input.organizationId,
          },
          {
            page: input.page,
            limit: input.limit,
          },
        );

        return blogs;
      } catch (error) {
        logger.error("Error in getBlogsByOrganization:", error);
        throw new Error("Failed to get blogs by organization");
      }
    }),

  // Criar blog na organização atual
  createBlog: organizationProcedure
    .input(createBlogSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão para criar blogs
        const rbacChecker = createRBACChecker({
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
          role: ctx.userRole,
          status: "active",
        });

        const permissionCheck = rbacChecker.can(PERMISSIONS.PROJECT_CREATE); // Usar permissão de projeto como blog
        if (!permissionCheck.hasPermission) {
          throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }

        // Verificar se o domínio já existe na organização
        if (input.domain) {
          const existingBlog = await getBlogByDomain(input.domain, ctx.organizationId);
          if (existingBlog) {
            throw new Error("Domain already exists in this organization");
          }
        }
        
        const blog = await createBlog({
          ...input,
          organizationId: ctx.organizationId,
        });
        
        logger.info(`Blog created by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return blog;
      } catch (error) {
        logger.error("Error in createBlog:", error);
        throw new Error("Failed to create blog");
      }
    }),

  // Atualizar blog (apenas se pertencer à organização atual)
  updateBlog: organizationProcedure
    .input(updateBlogSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Buscar o blog para verificar se pertence à organização atual
        const blog = await getBlogByIdWithOrganization(input.id);
        
        if (!blog) {
          throw new Error("Blog not found");
        }

        if (blog.organizationId !== ctx.organizationId) {
          throw new Error("Blog not found in current organization");
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
        if (input.domain && input.domain !== blog.domain) {
          const existingBlog = await getBlogByDomain(input.domain, ctx.organizationId);
          if (existingBlog) {
            throw new Error("Domain already exists in this organization");
          }
        }

        const updatedBlog = await updateBlog(input.id, {
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
        
        logger.info(`Blog ${input.id} updated by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return updatedBlog;
      } catch (error) {
        logger.error("Error in updateBlog:", error);
        throw new Error("Failed to update blog");
      }
    }),

  // Deletar blog (apenas se pertencer à organização atual)
  deleteBlog: organizationProcedure
    .input(deleteBlogSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Buscar o blog para verificar se pertence à organização atual
        const blog = await getBlogByIdWithOrganization(input.id);
        
        if (!blog) {
          throw new Error("Blog not found");
        }

        if (blog.organizationId !== ctx.organizationId) {
          throw new Error("Blog not found in current organization");
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

        await deleteBlog(input.id);
        
        logger.info(`Blog ${input.id} deleted by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return { success: true };
      } catch (error) {
        logger.error("Error in deleteBlog:", error);
        throw new Error("Failed to delete blog");
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

  // Buscar blog por domínio (público)
  getBlogByDomain: publicProcedure
    .input(z.object({ domain: z.string() }))
    .query(async ({ input }) => {
      try {
        const blog = await getBlogByDomain(input.domain);
        
        if (!blog || !blog.isActive) {
          throw new Error("Blog not found or inactive");
        }

        return blog;
      } catch (error) {
        logger.error("Error in getBlogByDomain:", error);
        throw new Error("Failed to get blog by domain");
      }
    }),
});
