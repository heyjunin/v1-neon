export * from './base-seeder';
export * from './orchestrator';
export * from './posts-seeder';
export * from './types';
export * from './users-seeder';

// Re-export all seeders for easy importing
import { PostsSeeder } from './posts-seeder';
import { UsersSeeder } from './users-seeder';

export const seeders = [
  new UsersSeeder(),
  new PostsSeeder()
];
