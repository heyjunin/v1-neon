import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { Seeder } from './types';

export abstract class BaseSeeder implements Seeder {
  abstract name: string;
  abstract run(db: NeonHttpDatabase): Promise<void>;

  protected async executeInTransaction<T>(
    db: NeonHttpDatabase,
    operation: () => Promise<T>
  ): Promise<T> {
    return await db.transaction(async (tx) => {
      return await operation();
    });
  }

  protected async batchInsert<T>(
    db: NeonHttpDatabase,
    table: any,
    data: T[],
    batchSize: number = 100
  ): Promise<void> {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await db.insert(table).values(batch);
    }
  }
}
