import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { users } from '../schema/users';
import { BaseSeeder } from './base-seeder';

export class UsersSeeder extends BaseSeeder {
  name = 'users';

  async run(db: NeonHttpDatabase): Promise<void> {
    const sampleUsers = [
      {
        email: 'admin@example.com',
        fullName: 'Admin User',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'jane.smith@example.com',
        fullName: 'Jane Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'mike.wilson@example.com',
        fullName: 'Mike Wilson',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'sarah.johnson@example.com',
        fullName: 'Sarah Johnson',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ];

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
