export * from "./base-seeder";
export * from "./database-seeder";
export * from "./example-advanced-seeder";
export * from "./example-programmatic";
export * from "./notifications-seeder";
export * from "./orchestrator";
export * from "./organizations";
export * from "./organizations-seeder";
export * from "./posts-seeder";
export * from "./rbac-seeder";
export * from "./users-seeder";
export * from "./utils/faker";
export { ExampleAdvancedSeeder, NotificationsSeeder, OrganizationsSeeder, PostsSeeder, RBACSeeder, UsersSeeder };

// Re-export all seeders for easy importing
  import { DatabaseSeeder } from "./database-seeder";
  import { ExampleAdvancedSeeder } from "./example-advanced-seeder";
  import { NotificationsSeeder } from "./notifications-seeder";
  import { OrganizationsSeeder } from "./organizations-seeder";
  import { PostsSeeder } from "./posts-seeder";
  import { RBACSeeder } from "./rbac-seeder";
  import { UsersSeeder } from "./users-seeder";
  
export const seeders = [
  new DatabaseSeeder(),
  new UsersSeeder(),
  new OrganizationsSeeder(),
  new PostsSeeder(),
  new NotificationsSeeder(),
  new RBACSeeder(),
  new ExampleAdvancedSeeder(),
];




