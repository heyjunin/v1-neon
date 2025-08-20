export * from './base-seeder';
export * from './database-seeder';
export * from './orchestrator';
export * from './posts-seeder';
export * from './types';
export * from './users-seeder';

// Re-export all seeders for easy importing
import { DatabaseSeeder } from './database-seeder';
import { PostsSeeder } from './posts-seeder';
import { UsersSeeder } from './users-seeder';

export const seeders = [
  new DatabaseSeeder(),
  new UsersSeeder(),
  new PostsSeeder()
];
