import { logger } from '@v1/logger';
import { desc, eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { posts, type Post } from '../schema/posts';
import { users } from '../schema/users';

export async function getPosts(): Promise<Post[]> {
  try {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  } catch (error) {
    logger.error('Error getting posts:', error);
    throw error;
  }
}

export async function getPostsWithUsers(): Promise<(Post & { user: { id: string; email: string; fullName: string | null } })[]> {
  try {
    return await db
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
      .orderBy(desc(posts.createdAt));
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
