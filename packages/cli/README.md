# V1 CLI

CLI development tools for the V1 project, inspired by Laravel's Artisan commands. This CLI provides a comprehensive set of commands to accelerate database development, model creation, seeding, and migrations.

## 🚀 Features

- **Laravel-like Experience**: Familiar commands for developers coming from Laravel
- **Smart Templates**: Multiple template types for different use cases
- **Auto-integration**: Automatic file updates and index management
- **TypeScript Support**: Full TypeScript support with type safety
- **Schema Intelligence**: Automatic field detection and faker data generation
- **Extensible Architecture**: Easy to add new commands and templates

## 📦 Installation

The CLI is automatically available when you install the project dependencies:

```bash
bun install
```

## 🛠️ Available Commands

### `make:seeder` - Create Database Seeders

Create seeder files with different templates for populating your database with test data.

```bash
# Basic usage
bun run make:seeder users

# With table reference
bun run make:seeder products --table=products

# With specific template
bun run make:seeder categories --template=faker

# Force overwrite existing file
bun run make:seeder users --force
```

**Options:**
- `-t, --table <table>` - Related table name
- `--template <template>` - Template type (basic|faker|advanced)
- `-f, --force` - Overwrite existing file

### `make:model` - Create Database Models

Create model (schema) files with different templates and optional automatic seeder creation.

```bash
# Basic model
bun run make:model users

# Model with relations template
bun run make:model products --template=with-relations

# Full model with all features
bun run make:model categories --template=full

# Model with automatic seeder creation (Laravel-like)
bun run make:model products --seed

# Model with seeder and migration
bun run make:model orders --seed --migration

# Force overwrite existing file
bun run make:model users --force
```

**Options:**
- `-t, --template <template>` - Template type (basic|with-relations|full)
- `-s, --seed` - Also create a seeder for this model
- `-m, --migration` - Also create a migration for this model
- `-f, --force` - Overwrite existing file

### `make:migration` - Create Database Migrations

Create migration files with different templates for database schema changes.

```bash
# Basic migration
bun run make:migration add_status_to_users

# Create table migration
bun run make:migration create_products_table --table=products --template=create

# Alter table migration
bun run make:migration add_email_to_users --table=users --template=alter

# Drop table migration
bun run make:migration drop_old_table --table=old_table --template=drop

# Force overwrite existing file
bun run make:migration my_migration --force
```

**Options:**
- `-t, --table <table>` - Related table name
- `--template <template>` - Template type (basic|create|alter|drop)
- `-f, --force` - Overwrite existing file

## 📋 Template System

### Seeder Templates

#### `basic` - Simple Seeder
Basic seeder template with manual data entry and transaction support.

```typescript
export class UsersSeeder extends BaseSeeder {
  name = 'users';

  async run(db: NeonHttpDatabase): Promise<void> {
    const data = [
      // Add your seed data here
    ];

    await this.executeInTransaction(db, async () => {
      await this.batchInsert(db, users, data);
    });
  }
}
```

#### `faker` - Faker.js Integration
Seeder with faker.js integration for generating realistic test data.

```typescript
export class ProductsSeeder extends BaseSeeder {
  name = 'products';

  async run(db: NeonHttpDatabase): Promise<void> {
    fakerUtils.initialize({ seed: 12345 });

    const sampleData = fakerUtils.array(() => ({
      name: fakerUtils.commerce.productName(),
      price: fakerUtils.number.float({ min: 10, max: 1000 }),
      // Auto-generated based on field types
    }), 20);

    await this.executeInTransaction(db, async () => {
      await this.batchInsert(db, products, sampleData);
    });
  }
}
```

#### `advanced` - Complex Scenarios
Advanced seeder with multiple scenarios, relationships, and comprehensive data generation.

```typescript
export class CategoriesSeeder extends BaseSeeder {
  name = 'categories';
  description = 'Seed categories with various scenarios and relationships';

  async run(db: NeonHttpDatabase): Promise<void> {
    const data = this.generateSeedData();
    
    await this.executeInTransaction(db, async () => {
      await this.batchInsert(db, categories, data);
    });
  }

  private generateSeedData() {
    // Complex data generation logic
  }
}
```

### Model Templates

#### `basic` - Simple Model
Basic model with essential fields and timestamps.

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // TODO: Add your fields here
  // name: text('name').notNull(),
  // email: text('email').notNull().unique(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

#### `with-relations` - Relationship Support
Model with relationship definitions and foreign key support.

```typescript
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Fields
  name: text('name').notNull(),
  description: text('description'),
  
  // Foreign keys
  categoryId: uuid('category_id').references(() => categories.id),
  userId: uuid('user_id').references(() => users.id),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
}));
```

#### `full` - Complete Model
Complete model with relations, indexes, utility types, and constants.

```typescript
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Fields with examples
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  metadata: jsonb('metadata'),
  
  // Foreign keys
  categoryId: uuid('category_id').references(() => categories.id),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Indexes
  nameIdx: index('products_name_idx').on(table.name),
  createdAtIdx: index('products_created_at_idx').on(table.createdAt),
}));

// Relations
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// Types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// Utility types
export type ProductWithRelations = Product & {
  category?: Category | null;
};

// Constants
export const ProductStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
} as const;

export type ProductStatusType = typeof ProductStatus[keyof typeof ProductStatus];
```

### Migration Templates

#### `basic` - Empty Migration
Basic migration template with examples and structure.

```sql
-- Migration: add_status_to_users
-- Created at: 2024-01-15T10:30:00.000Z

-- TODO: Write your migration here
-- Examples:

-- Create a new table
-- CREATE TABLE "example_table" (
--   "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   "name" TEXT NOT NULL,
--   "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
-- );

-- Add a column to existing table
-- ALTER TABLE "existing_table" ADD COLUMN "new_column" TEXT;

-- Create an index
-- CREATE INDEX "example_index" ON "example_table" ("name");
```

#### `create` - Create Table Migration
Template for creating new tables with proper structure.

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- TODO: Add your columns here
  -- "name" TEXT NOT NULL,
  -- "description" TEXT,
  -- "is_active" BOOLEAN DEFAULT true NOT NULL,
  
  -- Timestamps
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes
-- CREATE INDEX IF NOT EXISTS "products_name_idx" ON "products" ("name");
-- CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" ("created_at");

-- Add foreign key constraints if needed
-- ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" 
--   FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE;
```

#### `alter` - Alter Table Migration
Template for modifying existing tables.

```sql
-- Alter users table
-- Migration: add_email_to_users

-- TODO: Add your alterations here
-- Examples:

-- Add new columns
-- ALTER TABLE "users" ADD COLUMN "email" TEXT;
-- ALTER TABLE "users" ADD COLUMN "status" VARCHAR(50) DEFAULT 'active' NOT NULL;

-- Modify existing columns
-- ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
-- ALTER TABLE "users" ALTER COLUMN "age" DROP NOT NULL;

-- Rename columns
-- ALTER TABLE "users" RENAME COLUMN "old_name" TO "new_name";

-- Add constraints
-- ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");

-- Create new indexes
-- CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
```

#### `drop` - Drop Table Migration
Template for dropping tables with proper cleanup.

```sql
-- Drop old_table table
-- Migration: drop_old_table
-- WARNING: This will permanently delete the table and all its data!

-- Drop dependent objects first (if any)
-- DROP VIEW IF EXISTS "old_table_view" CASCADE;
-- DROP FUNCTION IF EXISTS "old_table_trigger_function"() CASCADE;

-- Drop indexes
-- DROP INDEX IF EXISTS "old_table_name_idx";

-- Drop foreign key constraints from other tables
-- ALTER TABLE "other_table" DROP CONSTRAINT IF EXISTS "other_table_old_table_id_fkey";

-- Drop the table
DROP TABLE IF EXISTS "old_table" CASCADE;
```

## 🎯 Laravel-like Workflow Examples

### Complete Model Creation (like `php artisan make:model -s`)

```bash
# Create a complete model with seeder
bun run make:model Product --seed --template=full

# This creates:
# - packages/database/src/schema/product.ts
# - packages/database/src/seeders/product-seeder.ts
# - Updates index files automatically
```

### Model with Seeder and Migration (like `php artisan make:model -sm`)

```bash
# Create model with seeder and migration
bun run make:model Order --seed --migration --template=with-relations

# This creates:
# - packages/database/src/schema/order.ts
# - packages/database/src/seeders/order-seeder.ts
# - packages/database/src/migrations/YYYY-MM-DD_HHMMSS_create_order_table.sql
```

### Database Schema Evolution

```bash
# 1. Create initial model
bun run make:model User --template=basic

# 2. Create seeder for test data
bun run make:seeder users --table=users --template=faker

# 3. Add new fields via migration
bun run make:migration add_email_to_users --table=users --template=alter

# 4. Create related model
bun run make:model Profile --seed --template=with-relations

# 5. Add relationship via migration
bun run make:migration add_user_id_to_profiles --table=profiles --template=alter
```

## 🔧 Development

### Building the CLI

```bash
# Build the CLI
bun run cli:build

# Development mode with hot reload
bun run cli:dev
```

### Adding New Commands

1. Create a new command file in `src/commands/`
2. Export the command function
3. Add it to `src/commands/index.ts`
4. Register it in `src/index.ts`

Example:

```typescript
// src/commands/make-controller.ts
import { Command } from 'commander';
import chalk from 'chalk';

export function makeControllerCommand() {
  return new Command('make:controller')
    .description('Create a new controller file')
    .argument('<name>', 'Name of the controller')
    .action(async (name) => {
      // Implementation
    });
}
```

### Adding New Templates

1. Create template file in appropriate directory
2. Export the template constant
3. Add to the template index file
4. Update the command to use the new template

### Template System

Templates use a simple placeholder system:

- `{{seederName}}`: kebab-case name
- `{{SeederName}}`: PascalCase name
- `{{tableName}}`: table name (if provided)
- `{{TableName}}`: PascalCase table name
- `{{modelName}}`: model name
- `{{ModelName}}`: PascalCase model name

Conditional blocks are supported:
- `{{#if fields}}...{{/if}}`: Conditional content based on fields
- `{{#if relations}}...{{/if}}`: Conditional content based on relations

## 🏗️ Architecture

```
packages/cli/
├── src/
│   ├── commands/          # CLI commands
│   │   ├── make-seeder.ts
│   │   ├── make-model.ts
│   │   ├── make-migration.ts
│   │   └── index.ts
│   ├── templates/         # Code templates
│   │   ├── seeder/        # Seeder templates
│   │   ├── model/         # Model templates
│   │   └── migration/     # Migration templates
│   ├── utils/            # Utility functions
│   │   ├── schema-parser.ts    # Schema analysis
│   │   ├── template-engine.ts  # Template rendering
│   │   ├── validators.ts       # Input validation
│   │   └── file-system.ts      # File operations
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── index.ts          # Main entry point
├── bin/
│   └── v1-cli.js         # Executable
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 Schema Intelligence

The CLI includes intelligent schema parsing that can:

- **Auto-detect Fields**: Parse existing schema files to understand structure
- **Generate Faker Data**: Create appropriate fake data based on field types
- **Handle Relations**: Automatically detect and handle foreign key relationships
- **Type Mapping**: Map Drizzle types to TypeScript types automatically

### Field Type Detection

```typescript
// Automatically detected from schema
const fields = [
  { name: 'email', type: 'string' },      // → fakerUtils.internet.email()
  { name: 'price', type: 'number' },      // → fakerUtils.number.float()
  { name: 'isActive', type: 'boolean' },  // → fakerUtils.datatype.boolean()
  { name: 'createdAt', type: 'Date' },    // → fakerUtils.date.past()
];
```

## 🚀 Best Practices

### 1. Naming Conventions

- **Models**: Use PascalCase (e.g., `User`, `ProductCategory`)
- **Tables**: Use snake_case (e.g., `users`, `product_categories`)
- **Seeders**: Use kebab-case with `-seeder` suffix (e.g., `users-seeder`)
- **Migrations**: Use descriptive names (e.g., `add_email_to_users`)

### 2. Template Selection

- **basic**: For simple models without relationships
- **with-relations**: For models with foreign keys and relationships
- **full**: For complex models with indexes, types, and constants

### 3. Workflow

1. Start with `basic` template for simple models
2. Use `--seed` flag for automatic test data generation
3. Use `with-relations` or `full` for complex models
4. Create migrations for schema changes
5. Use `--force` only when necessary

### 4. File Organization

- Models go in `packages/database/src/schema/`
- Seeders go in `packages/database/src/seeders/`
- Migrations go in `packages/database/src/migrations/`
- Index files are automatically updated

## 🐛 Troubleshooting

### Common Issues

1. **File Already Exists**: Use `--force` flag to overwrite
2. **Template Not Found**: Check template name spelling
3. **Import Errors**: Ensure all dependencies are installed
4. **Build Errors**: Run `bun run cli:build` to rebuild

### Debug Mode

```bash
# Enable verbose output
DEBUG=* bun run make:model users --seed

# Check CLI version
bun run v1 --version
```

## 🤝 Contributing

When adding new commands:

1. Follow the existing command structure
2. Add proper TypeScript types
3. Include error handling
4. Add help text
5. Update this README
6. Add tests if applicable

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Use chalk for colored output
- Handle errors gracefully

## 📄 License

This CLI is part of the V1 project and follows the same license terms.

---

**Happy coding! 🚀**

For more information about the V1 project, see the main README.md file.
