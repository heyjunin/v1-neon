import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { users } from '../schema/users';
import { BaseSeeder } from './base-seeder';
import { fakerUtils } from './utils/faker';

export class UsersSeeder extends BaseSeeder {
  name = 'users';

  async run(db: NeonHttpDatabase): Promise<void> {
    // Initialize faker with a seed for consistent results
    fakerUtils.initialize({ seed: 12345 });

    // Generate 20 fake users
    const sampleUsers = fakerUtils.array(() => fakerUtils.user(), 20);

    await this.executeInTransaction(db, async () => {
      // Check if users already exist
      const existingUsers = await db.select().from(users).limit(1);
      
      if (existingUsers.length > 0) {
        throw new Error('Users already exist in the database. Use --force to override.');
      }

      await this.batchInsert(db, users, sampleUsers);
    });
  }
}
