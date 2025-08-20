import { createPost, deletePost, updatePost } from '@v1/database/mutations';
import { getPostById, getPostsByUserId, getPostsWithUsers } from '@v1/database/queries';
import { logger } from '@v1/logger';
import { z } from 'zod';
import { loggedProcedure, protectedProcedure, publicProcedure, router } from '../context';

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
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const getPostByIdSchema = z.object({
  id: z.string(),
});

const deletePostSchema = z.object({
  id: z.string(),
});

export const postsRouter = router({
  // Listar posts com filtros e paginação
  getPosts: loggedProcedure
    .input(getPostsSchema)
    .query(async ({ input }) => {
      try {
        // Primeiro, vamos tentar uma query simples para testar a conexão
        const posts = await getPostsWithUsers(
          {
            search: input.search,
            userId: input.userId,
            sortBy: input.sortBy,
            sortOrder: input.sortOrder,
          },
          {
            page: input.page,
            limit: input.limit,
          }
        );

        return posts;
      } catch (error) {
        logger.error('Error in getPosts:', error);
        console.error('Detailed error:', error);
        
        // Se for um erro de conexão ou tabela não encontrada, vamos retornar dados vazios
        if (error instanceof Error && (
          error.message.includes('relation') || 
          error.message.includes('table') ||
          error.message.includes('connection')
        )) {
          return {
            data: [],
            total: 0,
            page: input.page,
            limit: input.limit,
            totalPages: 0
          };
        }
        
        throw new Error(`Failed to get posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  // Buscar post por ID
  getPostById: loggedProcedure
    .input(getPostByIdSchema)
    .query(async ({ input }) => {
      try {
        const post = await getPostById(input.id);

        if (!post) {
          throw new Error('Post not found');
        }

        return post;
      } catch (error) {
        logger.error('Error in getPostById:', error);
        throw new Error('Failed to get post');
      }
    }),

  // Buscar posts por usuário
  getPostsByUserId: loggedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const posts = await getPostsByUserId(input.userId);
        return posts || [];
      } catch (error) {
        logger.error('Error in getPostsByUserId:', error);
        throw new Error('Failed to get posts by user');
      }
    }),

  // Criar post
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const post = await createPost({
          ...input,
          userId: ctx.user.id,
        });
        return post;
      } catch (error) {
        logger.error('Error in createPost:', error);
        throw new Error('Failed to create post');
      }
    }),

  // Atualizar post
  updatePost: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      try {
        const post = await updatePost(input.id, {
          title: input.title,
          content: input.content,
        });
        return post;
      } catch (error) {
        logger.error('Error in updatePost:', error);
        throw new Error('Failed to update post');
      }
    }),

  // Deletar post
  deletePost: protectedProcedure
    .input(deletePostSchema)
    .mutation(async ({ input }) => {
      try {
        await deletePost(input.id);
        return { success: true };
      } catch (error) {
        logger.error('Error in deletePost:', error);
        throw new Error('Failed to delete post');
      }
    }),

  // Rota de teste para verificar a conexão
  testConnection: publicProcedure
    .query(async () => {
      try {
        // Tentar uma query simples
        const { getPosts } = await import('@v1/database/queries');
        const result = await getPosts({}, { page: 1, limit: 1 });
        return { 
          success: true, 
          message: 'Database connection working',
          totalPosts: result.total 
        };
      } catch (error) {
        logger.error('Database connection test failed:', error);
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error',
          error: error 
        };
      }
    }),
});
