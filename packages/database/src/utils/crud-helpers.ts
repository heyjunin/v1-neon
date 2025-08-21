import { logger } from "@v1/logger";

// Generic helper for database operations with error handling
export async function executeDbOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logger.error(`Error ${operationName}:`, error);
    throw error;
  }
}

// Generic helper for creating entities with strong typing
export async function createEntity<
  T extends Record<string, any>,
  NewT extends Record<string, any>,
>(
  insertOperation: (data: NewT) => Promise<T[]>,
  data: NewT,
  entityName: string,
): Promise<T> {
  return executeDbOperation(async () => {
    const result = await insertOperation(data);
    if (!result[0]) {
      throw new Error(`Failed to create ${entityName}: no rows returned`);
    }
    return result[0];
  }, `creating ${entityName}`);
}

// Generic helper for updating entities with strong typing
export async function updateEntity<
  T extends Record<string, any>,
  UpdateT extends Record<string, any>,
>(
  updateOperation: (id: string, data: UpdateT) => Promise<T[]>,
  id: string,
  data: UpdateT,
  entityName: string,
): Promise<T | null> {
  return executeDbOperation(async () => {
    const result = await updateOperation(id, data);
    return result[0] || null;
  }, `updating ${entityName}`);
}

// Generic helper for deleting entities with strong typing
export async function deleteEntity<T extends Record<string, any>>(
  deleteOperation: (id: string) => Promise<T[]>,
  id: string,
  entityName: string,
): Promise<boolean> {
  return executeDbOperation(async () => {
    const result = await deleteOperation(id);
    return result.length > 0;
  }, `deleting ${entityName}`);
}
