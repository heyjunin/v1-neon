import { logger } from '@v1/logger';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { posts, type Post } from '../schema/posts';
import { users } from '../schema/users';

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
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getPosts(filters?: PostsFilters, pagination?: PostsPagination): Promise<PostsResult> {
  try {
    const { search, userId, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};
    const { page = 1, limit = 10 } = pagination || {};

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(posts.title, `%${search}%`),
          like(posts.content, `%${search}%`)
        )
      );
    }
    
    if (userId) {
      conditions.push(eq(posts.userId, userId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause = sortOrder === 'asc' 
      ? asc(posts[sortBy]) 
      : desc(posts[sortBy]);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(whereClause)
      .execute();
    
    const total = countResult[0]?.count || 0;

    // Get paginated data
    const offset = (page - 1) * limit;
    const data = await db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error('Error getting posts:', error);
    throw error;
  }
}

export async function getPostsWithUsers(filters?: PostsFilters, pagination?: PostsPagination): Promise<PostsResult & { data: (Post & { user: { id: string; email: string; fullName: string | null } })[] }> {
  try {
    const { search, userId, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};
    const { page = 1, limit = 10 } = pagination || {};

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(posts.title, `%${search}%`),
          like(posts.content, `%${search}%`)
        )
      );
    }
    
    if (userId) {
      conditions.push(eq(posts.userId, userId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause = sortOrder === 'asc' 
      ? asc(posts[sortBy]) 
      : desc(posts[sortBy]);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(whereClause)
      .execute();
    
    const total = countResult[0]?.count || 0;

    // Get paginated data with users
    const offset = (page - 1) * limit;
    const data = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error('Error getting posts with users:', error);
    throw error;
  }
}

export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const result = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting post by ID:', error);
    throw error;
  }
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  try {
    return await db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
  } catch (error) {
    logger.error('Error getting posts by user ID:', error);
    throw error;
  }
}
