import { createPost, deletePost, updatePost } from '@v1/database/mutations';
import { getPostById, getPostsByUserId, getPostsWithUsers } from '@v1/database/queries';
import { logger } from '@v1/logger';
import { z } from 'zod';
import { loggedProcedure, router } from '../server';

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
        throw new Error('Failed to get posts');
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
  createPost: loggedProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      try {
        // TODO: Obter userId do contexto de autenticação
        const userId = 'temp-user-id'; // Temporário para teste
        const post = await createPost({
          ...input,
          userId,
        });
        return post;
      } catch (error) {
        logger.error('Error in createPost:', error);
        throw new Error('Failed to create post');
      }
    }),

  // Atualizar post
  updatePost: loggedProcedure
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
  deletePost: loggedProcedure
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
});
