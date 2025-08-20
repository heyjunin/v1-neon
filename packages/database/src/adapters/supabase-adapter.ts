import { logger } from '@v1/logger';
import { updateUser as updateSupabaseUser } from '@v1/supabase/mutations';
import { getUser as getSupabaseUser } from '@v1/supabase/queries';
import { createClient } from '@v1/supabase/server';
import { createUser as createDrizzleUser, updateUser as updateDrizzleUser } from '../mutations/users';
import { getPosts as getDrizzlePosts } from '../queries/posts';
import { getUserById } from '../queries/users';

export interface DatabaseAdapter {
  getUser(): Promise<{ data: { user: any } | null; error: any }>;
  getPosts(): Promise<{ data: any[] | null; error: any }>;
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

  async getPosts() {
    try {
      const supabase = createClient();
      const result = await supabase.from("posts").select("*");
      return result;
    } catch (error) {
      logger.error('Supabase getPosts error:', error);
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

  async getPosts() {
    try {
      const posts = await getDrizzlePosts();
      return { data: posts, error: null };
    } catch (error) {
      logger.error('Drizzle getPosts error:', error);
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
