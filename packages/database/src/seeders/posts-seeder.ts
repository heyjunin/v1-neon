import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { posts } from '../schema/posts';
import { users } from '../schema/users';
import { BaseSeeder } from './base-seeder';
import { fakerUtils } from './utils/faker';

export class PostsSeeder extends BaseSeeder {
  name = 'posts';

  async run(db: NeonHttpDatabase): Promise<void> {
    // Initialize faker with a seed for consistent results
    fakerUtils.initialize({ seed: 67890 });

    // First, get existing users to reference
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      throw new Error('No users found. Please run the users seeder first.');
    }

    // Generate 50 fake posts distributed among users
    const samplePosts = fakerUtils.array(() => {
      const randomUser = fakerUtils.random().element(existingUsers);
      const fakePost = fakerUtils.post();
      
      return {
        userId: randomUser.id,
        title: fakePost.title,
        content: fakePost.content
      };
    }, 50);

    await this.executeInTransaction(db, async () => {
      // Check if posts already exist
      const existingPosts = await db.select().from(posts).limit(1);
      
      if (existingPosts.length > 0) {
        throw new Error('Posts already exist in the database. Use --force to override.');
      }

      await this.batchInsert(db, posts, samplePosts);
    });
  }
}
