import { PERMISSIONS, createRBACChecker } from "@v1/auth/rbac";
import { createPost, deletePost, updatePost } from "@v1/database/mutations";
import {
  getPostByIdWithUser,
  getPostsWithUsers
} from "@v1/database/queries";
import { logger } from "@v1/logger";
import { z } from "zod";
import {
  organizationProcedure,
  protectedProcedure,
  publicProcedure,
  router
} from "../context";

// Schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

const getPostsSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  userId: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const getPostByIdSchema = z.object({
  id: z.string(),
});

const deletePostSchema = z.object({
  id: z.string(),
});

export const postsRouter = router({
  // Listar posts da organização atual com filtros e paginação
  getPosts: organizationProcedure.input(getPostsSchema).query(async ({ input, ctx }) => {
    try {
      const posts = await getPostsWithUsers(
        {
          search: input.search,
          userId: input.userId,
          organizationId: ctx.organizationId, // Filtrar por organização atual
          sortBy: input.sortBy,
          sortOrder: input.sortOrder,
        },
        {
          page: input.page,
          limit: input.limit,
        },
      );

      return posts;
    } catch (error) {
      logger.error("Error in getPosts:", error);
      console.error("Detailed error:", error);

      // Se for um erro de conexão ou tabela não encontrada, vamos retornar dados vazios
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
        `Failed to get posts: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }),

  // Buscar post por ID (apenas se pertencer à organização atual)
  getPostById: organizationProcedure
    .input(getPostByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const post = await getPostByIdWithUser(input.id);

        if (!post) {
          throw new Error("Post not found");
        }

        // Verificar se o post pertence à organização atual
        if (post.organizationId !== ctx.organizationId) {
          throw new Error("Post not found in current organization");
        }

        return post;
      } catch (error) {
        logger.error("Error in getPostById:", error);
        throw new Error("Failed to get post");
      }
    }),

  // Buscar posts por usuário na organização atual
  getPostsByUserId: organizationProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        // Buscar posts do usuário na organização atual
        const posts = await getPostsWithUsers(
          {
            userId: input.userId,
            organizationId: ctx.organizationId,
          },
          { page: 1, limit: 100 }
        );
        
        return posts.data || [];
      } catch (error) {
        logger.error("Error in getPostsByUserId:", error);
        throw new Error("Failed to get posts by user");
      }
    }),

  // Criar post na organização atual
  createPost: organizationProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verificar permissão para criar posts
        const rbacChecker = createRBACChecker({
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
          role: ctx.userRole,
          status: "active",
        });

        const permissionCheck = rbacChecker.can(PERMISSIONS.POST_CREATE);
        if (!permissionCheck.hasPermission) {
          throw new Error(`Permission denied: ${permissionCheck.reason}`);
        }
        
        const post = await createPost({
          ...input,
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
        });
        
        logger.info(`Post created by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return post;
      } catch (error) {
        logger.error("Error in createPost:", error);
        throw new Error("Failed to create post");
      }
    }),

  // Atualizar post (apenas se pertencer à organização atual)
  updatePost: organizationProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Buscar o post para verificar se pertence à organização atual
        const post = await getPostByIdWithUser(input.id);
        
        if (!post) {
          throw new Error("Post not found");
        }

        if (post.organizationId !== ctx.organizationId) {
          throw new Error("Post not found in current organization");
        }

        // Verificar permissões
        const rbacChecker = createRBACChecker({
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
          role: ctx.userRole,
          status: "active",
        });

        // Se o usuário é o autor do post, verificar permissão de edição própria
        if (post.userId === ctx.user.id) {
          const permissionCheck = rbacChecker.can(PERMISSIONS.POST_UPDATE);
          if (!permissionCheck.hasPermission) {
            throw new Error(`Permission denied: ${permissionCheck.reason}`);
          }
        } else {
          // Se não é o autor, verificar se tem permissão para editar posts de outros
          const permissionCheck = rbacChecker.can(PERMISSIONS.POST_UPDATE);
          if (!permissionCheck.hasPermission) {
            throw new Error("You don't have permission to edit this post");
          }
        }

        const updatedPost = await updatePost(input.id, {
          title: input.title,
          content: input.content,
        });
        
        logger.info(`Post ${input.id} updated by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return updatedPost;
      } catch (error) {
        logger.error("Error in updatePost:", error);
        throw new Error("Failed to update post");
      }
    }),

  // Deletar post (apenas se pertencer à organização atual)
  deletePost: organizationProcedure
    .input(deletePostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Buscar o post para verificar se pertence à organização atual
        const post = await getPostByIdWithUser(input.id);
        
        if (!post) {
          throw new Error("Post not found");
        }

        if (post.organizationId !== ctx.organizationId) {
          throw new Error("Post not found in current organization");
        }

        // Verificar permissões
        const rbacChecker = createRBACChecker({
          userId: ctx.user.id,
          organizationId: ctx.organizationId,
          role: ctx.userRole,
          status: "active",
        });

        // Se o usuário é o autor do post, verificar permissão de exclusão própria
        if (post.userId === ctx.user.id) {
          const permissionCheck = rbacChecker.can(PERMISSIONS.POST_DELETE);
          if (!permissionCheck.hasPermission) {
            throw new Error(`Permission denied: ${permissionCheck.reason}`);
          }
        } else {
          // Se não é o autor, verificar se tem permissão para deletar posts de outros
          const permissionCheck = rbacChecker.can(PERMISSIONS.POST_DELETE);
          if (!permissionCheck.hasPermission) {
            throw new Error("You don't have permission to delete this post");
          }
        }

        await deletePost(input.id);
        
        logger.info(`Post ${input.id} deleted by user ${ctx.user.id} in organization ${ctx.organizationId}`);
        return { success: true };
      } catch (error) {
        logger.error("Error in deletePost:", error);
        throw new Error("Failed to delete post");
      }
    }),

  // Rota de teste para verificar a conexão (pública)
  testConnection: publicProcedure.query(async () => {
    try {
      // Tentar uma query simples
      const { getPosts } = await import("@v1/database/queries");
      const result = await getPosts({}, { page: 1, limit: 1 });
      return {
        success: true,
        message: "Database connection working",
        totalPosts: result.total,
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

  // Rota para obter posts de uma organização específica (apenas para usuários autenticados)
  getPostsByOrganization: protectedProcedure
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

        const posts = await getPostsWithUsers(
          {
            organizationId: input.organizationId,
          },
          {
            page: input.page,
            limit: input.limit,
          },
        );

        return posts;
      } catch (error) {
        logger.error("Error in getPostsByOrganization:", error);
        throw new Error("Failed to get posts by organization");
      }
    }),
});
