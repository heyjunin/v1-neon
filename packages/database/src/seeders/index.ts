export * from './base-seeder';
export * from './database-seeder';
export * from './example-advanced-seeder';
export * from './example-programmatic';
export * from './notifications-seeder';
export * from './orchestrator';
export * from './organizations';
export * from './organizations-seeder';
export * from './posts-seeder';
export * from './types';
export * from './users-seeder';
export * from './utils/faker';

// Re-export all seeders for easy importing
import { DatabaseSeeder } from './database-seeder';
import { ExampleAdvancedSeeder } from './example-advanced-seeder';
import { NotificationsSeeder } from './notifications-seeder';
import { OrganizationsSeeder } from './organizations-seeder';
import { PostsSeeder } from './posts-seeder';
import { UsersSeeder } from './users-seeder';

export const seeders = [
  new DatabaseSeeder(),
  new UsersSeeder(),
  new OrganizationsSeeder(),
  new PostsSeeder(),
  new NotificationsSeeder(),
  new ExampleAdvancedSeeder()
];

import { ProductsSeederSeeder } from './products-seeder.js';
export { ProductsSeederSeeder };

import { CategoriesSeederSeeder } from './categories-seeder.js';
export { CategoriesSeederSeeder };

import { NodeSeederSeeder } from './node-seeder.js';
export { NodeSeederSeeder };

import { TagsSeederSeeder } from './tags-seeder.js';
export { TagsSeederSeeder };

import { ProductSeederSeeder } from './product-seeder.js';
export { ProductSeederSeeder };
