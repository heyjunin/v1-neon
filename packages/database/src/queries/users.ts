import { logger } from '@v1/logger';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { users, type User } from '../schema/users';

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    return await db.select().from(users);
  } catch (error) {
    logger.error('Error getting all users:', error);
    throw error;
  }
}
