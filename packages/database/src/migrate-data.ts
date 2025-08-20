import { createClient } from '@v1/supabase/server';
import { db } from './drizzle';
import { users, posts } from './schema';
import { logger } from '@v1/logger';

async function migrateData() {
  try {
    logger.info('Starting data migration from Supabase to Neon...');

    // Conectar ao Supabase
    const supabase = createClient();

    // Migrar usuários
    logger.info('Migrating users...');
    const { data: supabaseUsers, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }

    if (supabaseUsers && supabaseUsers.length > 0) {
      const mappedUsers = supabaseUsers.map(user => ({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at ? new Date(user.created_at) : undefined,
        updatedAt: user.updated_at ? new Date(user.updated_at) : undefined,
      }));
      
      await db.insert(users).values(mappedUsers).onConflictDoNothing();
      logger.info(`Migrated ${supabaseUsers.length} users`);
    }

    // Migrar posts
    logger.info('Migrating posts...');
    const { data: supabasePosts, error: postsError } = await supabase
      .from('posts')
      .select('*');

    if (postsError) {
      throw new Error(`Error fetching posts: ${postsError.message}`);
    }

    if (supabasePosts && supabasePosts.length > 0) {
      const mappedPosts = supabasePosts.map(post => ({
        id: post.id,
        userId: post.user_id,
        title: post.title,
        content: post.content,
        createdAt: post.created_at ? new Date(post.created_at) : undefined,
        updatedAt: post.updated_at ? new Date(post.updated_at) : undefined,
      }));
      
      await db.insert(posts).values(mappedPosts).onConflictDoNothing();
      logger.info(`Migrated ${supabasePosts.length} posts`);
    }

    logger.info('Data migration completed successfully!');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateData()
    .then(() => {
      logger.info('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateData };
