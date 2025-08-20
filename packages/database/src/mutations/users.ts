import { logger } from '@v1/logger';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { users, type NewUser, type User } from '../schema/users';

export async function createUser(userData: NewUser): Promise<User> {
  try {
    const result = await db.insert(users).values(userData).returning();
    if (!result[0]) {
      throw new Error('Failed to create user: no rows returned');
    }
    return result[0];
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: Partial<Omit<NewUser, 'id' | 'createdAt'>>): Promise<User | null> {
  try {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result[0] || null;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const result = await db.delete(users).where(eq(users.id, userId)).returning();
    return result.length > 0;
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}
