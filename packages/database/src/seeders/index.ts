export * from './base-seeder';
export * from './database-seeder';
export * from './example-advanced-seeder';
export * from './example-programmatic';
export * from './orchestrator';
export * from './posts-seeder';
export * from './types';
export * from './users-seeder';
export * from './utils/faker';

// Re-export all seeders for easy importing
import { DatabaseSeeder } from './database-seeder';
import { ExampleAdvancedSeeder } from './example-advanced-seeder';
import { PostsSeeder } from './posts-seeder';
import { UsersSeeder } from './users-seeder';

export const seeders = [
  new DatabaseSeeder(),
  new UsersSeeder(),
  new PostsSeeder(),
  new ExampleAdvancedSeeder()
];
