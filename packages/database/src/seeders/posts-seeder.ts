import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { posts } from '../schema/posts';
import { users } from '../schema/users';
import { BaseSeeder } from './base-seeder';

export class PostsSeeder extends BaseSeeder {
  name = 'posts';

  async run(db: NeonHttpDatabase): Promise<void> {
    // First, get existing users to reference
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      throw new Error('No users found. Please run the users seeder first.');
    }

    const samplePosts = [
      {
        userId: existingUsers[0]!.id,
        title: 'Welcome to Our Platform',
        content: 'This is our first post! We\'re excited to share our journey with you.'
      },
      {
        userId: existingUsers[0]!.id,
        title: 'Getting Started Guide',
        content: 'Here\'s everything you need to know to get started with our platform.'
      },
      {
        userId: existingUsers[1]!.id,
        title: 'My First Experience',
        content: 'I just joined the platform and I\'m loving it so far. The interface is intuitive and the features are exactly what I needed.'
      },
      {
        userId: existingUsers[1]!.id,
        title: 'Tips and Tricks',
        content: 'After using the platform for a while, here are some tips I\'ve discovered that might help others.'
      },
      {
        userId: existingUsers[2]!.id,
        title: 'Feature Request',
        content: 'I think it would be great to have a dark mode option. What do you think?'
      },
      {
        userId: existingUsers[2]!.id,
        title: 'Community Guidelines',
        content: 'Let\'s discuss what makes our community great and how we can maintain a positive environment.'
      },
      {
        userId: existingUsers[3]!.id,
        title: 'Technical Deep Dive',
        content: 'For those interested in the technical aspects, here\'s how we built this platform using modern technologies.'
      },
      {
        userId: existingUsers[4]!.id,
        title: 'User Feedback',
        content: 'We\'re always looking to improve. Please share your feedback and suggestions with us.'
      }
    ];

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
