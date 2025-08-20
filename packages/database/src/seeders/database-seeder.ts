import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { BaseSeeder } from './base-seeder';
import { PostsSeeder } from './posts-seeder';
import { UsersSeeder } from './users-seeder';

export class DatabaseSeeder extends BaseSeeder {
  name = 'database';

  async run(db: NeonHttpDatabase): Promise<void> {
    const usersSeeder = new UsersSeeder();
    const postsSeeder = new PostsSeeder();

    // Run seeders in order (users first, then posts)
    await usersSeeder.run(db);
    await postsSeeder.run(db);
  }
}
