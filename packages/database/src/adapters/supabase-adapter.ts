import { logger } from '@v1/logger';
import { updateUser as updateSupabaseUser } from '@v1/supabase/mutations';
import { getUser as getSupabaseUser } from '@v1/supabase/queries';
import { createClient } from '@v1/supabase/server';
import { createPost as createDrizzlePost, deletePost as deleteDrizzlePost, updatePost as updateDrizzlePost } from '../mutations/posts';
import { createUser as createDrizzleUser, updateUser as updateDrizzleUser } from '../mutations/users';
import { getPostById as getDrizzlePostById, getPosts as getDrizzlePosts, getPostsByUserId as getDrizzlePostsByUserId, getPostsWithUsers as getDrizzlePostsWithUsers } from '../queries/posts';
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

export class SupabaseAdapter implements DatabaseAdapter {
  async getUser() {
    try {
      return await getSupabaseUser();
    } catch (error) {
      logger.error('Supabase getUser error:', error);
      return { data: null, error };
    }
  }

  async getPosts(filters?: PostsFilters, pagination?: PostsPagination) {
    try {
      const supabase = createClient();
      const { search, userId, sortBy = 'created_at', sortOrder = 'desc' } = filters || {};
      const { page = 1, limit = 10 } = pagination || {};

      let query = supabase.from("posts").select("*", { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }
      
      if (userId) {
        query = query.eq("user_id", userId);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const result = await query;

      if (result.error) {
        return { data: null, error: result.error };
      }

      const postsResult: PostsResult = {
        data: result.data || [],
        total: result.count || 0,
        page,
        limit,
        totalPages: Math.ceil((result.count || 0) / limit)
      };

      return { data: postsResult, error: null };
    } catch (error) {
      logger.error('Supabase getPosts error:', error);
      return { data: null, error };
    }
  }

  async getPostsWithUsers(filters?: PostsFilters, pagination?: PostsPagination) {
    try {
      const supabase = createClient();
      const { search, userId, sortBy = 'created_at', sortOrder = 'desc' } = filters || {};
      const { page = 1, limit = 10 } = pagination || {};

      let query = supabase
        .from("posts")
        .select(`
          *,
          users (
            id,
            email,
            full_name
          )
        `, { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }
      
      if (userId) {
        query = query.eq("user_id", userId);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const result = await query;

      if (result.error) {
        return { data: null, error: result.error };
      }

      const postsResult: PostsResult = {
        data: result.data || [],
        total: result.count || 0,
        page,
        limit,
        totalPages: Math.ceil((result.count || 0) / limit)
      };

      return { data: postsResult, error: null };
    } catch (error) {
      logger.error('Supabase getPostsWithUsers error:', error);
      return { data: null, error };
    }
  }

  async getPostById(postId: string) {
    try {
      const supabase = createClient();
      const result = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();
      return result;
    } catch (error) {
      logger.error('Supabase getPostById error:', error);
      return { data: null, error };
    }
  }

  async getPostsByUserId(userId: string) {
    try {
      const supabase = createClient();
      const result = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId);
      return result;
    } catch (error) {
      logger.error('Supabase getPostsByUserId error:', error);
      return { data: null, error };
    }
  }

  async createPost(postData: any) {
    try {
      const supabase = createClient();
      const result = await supabase
        .from("posts")
        .insert(postData)
        .select()
        .single();
      return result;
    } catch (error) {
      logger.error('Supabase createPost error:', error);
      return { data: null, error };
    }
  }

  async updatePost(postId: string, postData: any) {
    try {
      const supabase = createClient();
      const result = await supabase
        .from("posts")
        .update(postData)
        .eq("id", postId)
        .select()
        .single();
      return result;
    } catch (error) {
      logger.error('Supabase updatePost error:', error);
      return { data: null, error };
    }
  }

  async deletePost(postId: string) {
    try {
      const supabase = createClient();
      const result = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
      return { data: (result.count ?? 0) > 0, error: null };
    } catch (error) {
      logger.error('Supabase deletePost error:', error);
      return { data: null, error };
    }
  }

  async updateUser(userId: string, data: any) {
    try {
      return await updateSupabaseUser(userId, data);
    } catch (error) {
      logger.error('Supabase updateUser error:', error);
      return { data: null, error };
    }
  }

  async createUser(userData: any) {
    try {
      const supabase = createClient();
      const result = await supabase.from("users").insert(userData).select().single();
      return { data: result.data, error: result.error };
    } catch (error) {
      logger.error('Supabase createUser error:', error);
      return { data: null, error };
    }
  }
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

// Factory para escolher o adapter baseado na variável de ambiente
export function createDatabaseAdapter(): DatabaseAdapter {
  const useDrizzle = process.env.USE_DRIZZLE === 'true';
  return useDrizzle ? new DrizzleAdapter() : new SupabaseAdapter();
}
