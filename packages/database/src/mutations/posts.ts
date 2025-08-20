import { logger } from '@v1/logger';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { posts, type NewPost, type Post } from '../schema/posts';

export async function createPost(postData: NewPost): Promise<Post> {
  try {
    const result = await db.insert(posts).values(postData).returning();
    if (!result[0]) {
      throw new Error('Failed to create post: no rows returned');
    }
    return result[0];
  } catch (error) {
    logger.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(postId: string, postData: Partial<Omit<NewPost, 'id' | 'createdAt'>>): Promise<Post | null> {
  try {
    const result = await db
      .update(posts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(posts.id, postId))
      .returning();
    return result[0] || null;
  } catch (error) {
    logger.error('Error updating post:', error);
    throw error;
  }
}

export async function deletePost(postId: string): Promise<boolean> {
  try {
    const result = await db.delete(posts).where(eq(posts.id, postId)).returning();
    return result.length > 0;
  } catch (error) {
    logger.error('Error deleting post:', error);
    throw error;
  }
}

export async function deletePostsByUserId(userId: string): Promise<number> {
  try {
    const result = await db.delete(posts).where(eq(posts.userId, userId)).returning();
    return result.length;
  } catch (error) {
    logger.error('Error deleting posts by user ID:', error);
    throw error;
  }
}
