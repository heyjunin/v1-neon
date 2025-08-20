import { logger } from '@v1/logger';
import { getUser as getSupabaseUser } from '@v1/supabase/queries';
import { createUser as createDrizzleUser, updateUser as updateDrizzleUser } from '../mutations/users';
import { getPosts as getDrizzlePosts, getPostsWithUsers as getDrizzlePostsWithUsers, getPostById as getDrizzlePostById, getPostsByUserId as getDrizzlePostsByUserId } from '../queries/posts';
import { createPost as createDrizzlePost, updatePost as updateDrizzlePost, deletePost as deleteDrizzlePost } from '../mutations/posts';
import { getUserById } from '../queries/users';

export interface PostsFilters {
  search?: string;
  userId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface PostsPagination {
  page: number;
  limit: number;
}

export interface PostsResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DatabaseAdapter {
  getUser(): Promise<{ data: { user: any } | null; error: any }>;
  getPosts(filters?: PostsFilters, pagination?: PostsPagination): Promise<{ data: PostsResult | null; error: any }>;
  getPostsWithUsers(filters?: PostsFilters, pagination?: PostsPagination): Promise<{ data: PostsResult | null; error: any }>;
  getPostById(postId: string): Promise<{ data: any | null; error: any }>;
  getPostsByUserId(userId: string): Promise<{ data: any[] | null; error: any }>;
  createPost(postData: any): Promise<{ data: any | null; error: any }>;
  updatePost(postId: string, postData: any): Promise<{ data: any | null; error: any }>;
  deletePost(postId: string): Promise<{ data: boolean | null; error: any }>;
  updateUser(userId: string, data: any): Promise<{ data: any | null; error: any }>;
  createUser(userData: any): Promise<{ data: any | null; error: any }>;
}

export class DrizzleAdapter implements DatabaseAdapter {
  async getUser() {
    try {
      // Para manter compatibilidade, precisamos do usuário autenticado do Supabase
      const supabaseResult = await getSupabaseUser();
      
      if (!supabaseResult.data?.user) {
        return { data: null, error: 'No authenticated user' };
      }

      // Buscar dados completos do usuário no Drizzle
      const user = await getUserById(supabaseResult.data.user.id);
      
      return { 
        data: { user: user || supabaseResult.data.user }, 
        error: null 
      };
    } catch (error) {
      logger.error('Drizzle getUser error:', error);
      return { data: null, error };
    }
  }

  async getPosts(filters?: PostsFilters, pagination?: PostsPagination) {
    try {
      const posts = await getDrizzlePosts(filters, pagination);
      return { data: posts, error: null };
    } catch (error) {
      logger.error('Drizzle getPosts error:', error);
      return { data: null, error };
    }
  }

  async getPostsWithUsers(filters?: PostsFilters, pagination?: PostsPagination) {
    try {
      const posts = await getDrizzlePostsWithUsers(filters, pagination);
      return { data: posts, error: null };
    } catch (error) {
      logger.error('Drizzle getPostsWithUsers error:', error);
      return { data: null, error };
    }
  }

  async getPostById(postId: string) {
    try {
      const post = await getDrizzlePostById(postId);
      return { data: post, error: null };
    } catch (error) {
      logger.error('Drizzle getPostById error:', error);
      return { data: null, error };
    }
  }

  async getPostsByUserId(userId: string) {
    try {
      const posts = await getDrizzlePostsByUserId(userId);
      return { data: posts, error: null };
    } catch (error) {
      logger.error('Drizzle getPostsByUserId error:', error);
      return { data: null, error };
    }
  }

  async createPost(postData: any) {
    try {
      const post = await createDrizzlePost(postData);
      return { data: post, error: null };
    } catch (error) {
      logger.error('Drizzle createPost error:', error);
      return { data: null, error };
    }
  }

  async updatePost(postId: string, postData: any) {
    try {
      const post = await updateDrizzlePost(postId, postData);
      return { data: post, error: null };
    } catch (error) {
      logger.error('Drizzle updatePost error:', error);
      return { data: null, error };
    }
  }

  async deletePost(postId: string) {
    try {
      const success = await deleteDrizzlePost(postId);
      return { data: success, error: null };
    } catch (error) {
      logger.error('Drizzle deletePost error:', error);
      return { data: null, error };
    }
  }

  async updateUser(userId: string, data: any) {
    try {
      const user = await updateDrizzleUser(userId, data);
      return { data: user, error: null };
    } catch (error) {
      logger.error('Drizzle updateUser error:', error);
      return { data: null, error };
    }
  }

  async createUser(userData: any) {
    try {
      const user = await createDrizzleUser(userData);
      return { data: user, error: null };
    } catch (error) {
      logger.error('Drizzle createUser error:', error);
      return { data: null, error };
    }
  }
}

// Factory para criar o adapter (agora sempre Drizzle)
export function createDatabaseAdapter(): DatabaseAdapter {
  return new DrizzleAdapter();
}
