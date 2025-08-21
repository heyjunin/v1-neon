import { logger } from "@v1/logger";
import { eq } from "drizzle-orm";
import { db } from "../drizzle";

export function createCrudWrapper<
  T extends Record<string, any>,
  NewT extends Record<string, any>,
>(table: any, tableName: string) {
  return {
    async create(data: NewT): Promise<T> {
      try {
        const result = await db.insert(table).values(data).returning();
        if (!result[0]) {
          throw new Error(`Failed to create ${tableName}: no rows returned`);
        }
        return result[0] as T;
      } catch (error) {
        logger.error(`Error creating ${tableName}:`, error);
        throw error;
      }
    },

    async update(id: string, data: Partial<NewT>): Promise<T | null> {
      try {
        const result = await db
          .update(table)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(table.id, id))
          .returning();
        return (result[0] as T) || null;
      } catch (error) {
        logger.error(`Error updating ${tableName}:`, error);
        throw error;
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        const result = await db
          .delete(table)
          .where(eq(table.id, id))
          .returning();
        return Array.isArray(result) && result.length > 0;
      } catch (error) {
        logger.error(`Error deleting ${tableName}:`, error);
        throw error;
      }
    },

    async getById(id: string): Promise<T | null> {
      try {
        const result = await db
          .select()
          .from(table)
          .where(eq(table.id, id))
          .limit(1);
        return (result[0] as T) || null;
      } catch (error) {
        logger.error(`Error getting ${tableName} by ID:`, error);
        throw error;
      }
    },

    async getAll(): Promise<T[]> {
      try {
        const result = await db.select().from(table);
        return result as T[];
      } catch (error) {
        logger.error(`Error getting all ${tableName}:`, error);
        throw error;
      }
    },
  };
}
