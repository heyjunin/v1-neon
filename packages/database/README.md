# Database Package

This package provides database functionality using Drizzle ORM with Neon PostgreSQL.

## Features

- **Neon PostgreSQL** database with Drizzle ORM
- Complete CRUD operations for posts and users
- Advanced filtering, pagination, and sorting
- Migration management
- **Seeder system** (Laravel-inspired) with faker-js
- **Supabase Auth integration** (authentication only)

## Seeder System

The seeder system allows you to populate your database with sample data, similar to Laravel's `artisan db:seed` command.

### Available Commands

```bash
# Run all seeders
bun run seed run

# Run specific seeder(s)
bun run seed run users
bun run seed run users,posts

# List available seeders
bun run seed list

# Show help
bun run seed help

# Force run (overwrite existing data)
bun run seed run --force

# Verbose output
bun run seed run --verbose
```

### Available Seeders

- **database**: Runs all seeders in the correct order
- **users**: Creates sample users (20 fake users with realistic data)
- **posts**: Creates sample posts (50 fake posts distributed among users)
- **example-advanced**: Demonstrates various faker features (for learning purposes)

### Creating Custom Seeders

1. Create a new seeder file in `src/seeders/`:

```typescript
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { BaseSeeder } from './base-seeder';
import { fakerUtils } from './utils/faker';
import { yourTable } from '../schema/your-table';

export class YourSeeder extends BaseSeeder {
  name = 'your-seeder';

  async run(db: NeonHttpDatabase): Promise<void> {
    // Initialize faker with a seed for consistent results
    fakerUtils.initialize({ seed: 12345 });

    // Generate fake data
    const sampleData = fakerUtils.array(() => ({
      // Use faker utilities to generate realistic data
      name: fakerUtils.user().fullName,
      email: fakerUtils.user().email,
      description: fakerUtils.lorem().sentence(),
      createdAt: fakerUtils.date().recent(30)
    }), 50);

    await this.executeInTransaction(db, async () => {
      // Check if data already exists
      const existing = await db.select().from(yourTable).limit(1);
      
      if (existing.length > 0) {
        throw new Error('Data already exists. Use --force to override.');
      }

      await this.batchInsert(db, yourTable, sampleData);
    });
  }
}
```

2. Register the seeder in `src/seeders/index.ts`:

```typescript
import { YourSeeder } from './your-seeder';

export const seeders = [
  new DatabaseSeeder(),
  new UsersSeeder(),
  new PostsSeeder(),
  new YourSeeder() // Add your seeder here
];
```

### Seeder Features

- **Transaction support**: All operations are wrapped in transactions
- **Batch inserts**: Large datasets are inserted in batches for better performance
- **Duplicate protection**: Seeders check for existing data before inserting
- **Force mode**: Override duplicate protection with `--force` flag
- **Verbose logging**: Detailed output with `--verbose` flag
- **Error handling**: Graceful error handling with detailed error messages
- **Faker.js integration**: Generate realistic fake data with consistent seeds

### Usage Examples

```bash
# Development setup
bun run seed run

# Production-like data
bun run seed run --force

# Debug seeding process
bun run seed run --verbose

# Run only specific seeders
bun run seed run users,posts

# Check what seeders are available
bun run seed list

# Run the advanced example seeder
bun run seed run example-advanced
```

### Faker.js Integration

The seeder system includes comprehensive faker.js integration for generating realistic fake data:

#### Available Faker Utilities

```typescript
import { fakerUtils } from '@v1/database/seeders';

// Initialize with seed for consistent results
fakerUtils.initialize({ seed: 12345 });

// Generate user data
const user = fakerUtils.user();
// { email, fullName, avatarUrl, firstName, lastName, username, bio, location, website, phone, birthDate }

// Generate post data
const post = fakerUtils.post();
// { title, content, excerpt, tags, category }

// Generate company data
const company = fakerUtils.company();
// { name, catchPhrase, bs, industry, foundedYear, employeeCount }

// Generate address data
const address = fakerUtils.address();
// { street, city, state, country, zipCode, coordinates }

// Generate dates
const recentDate = fakerUtils.date().recent(7);
const futureDate = fakerUtils.date().future(1);

// Generate random data
const randomNumber = fakerUtils.random().number(1, 100);
const randomBoolean = fakerUtils.random().boolean();
const randomUuid = fakerUtils.random().uuid();

// Generate images
const avatar = fakerUtils.image().avatar();
const placeholder = fakerUtils.image().urlPlaceholder(300, 200);

// Generate lorem text
const sentence = fakerUtils.lorem().sentence();
const paragraph = fakerUtils.lorem().paragraph();

// Generate arrays of data
const users = fakerUtils.array(() => fakerUtils.user(), 10);
```

## Database Operations

### Using the Database Adapter

```typescript
import { createDatabaseAdapter } from '@v1/database/adapters';

const adapter = createDatabaseAdapter();

// Get posts with pagination and filters
const result = await adapter.getPostsWithUsers(
  { search: 'react', sortBy: 'createdAt', sortOrder: 'desc' },
  { page: 1, limit: 10 }
);

// Create a new post
const newPost = await adapter.createPost({
  title: 'My Post',
  content: 'Post content',
  userId: 'user-id'
});

// Update a post
const updatedPost = await adapter.updatePost('post-id', {
  title: 'Updated Title'
});

// Delete a post
const deleted = await adapter.deletePost('post-id');
```

### Direct Queries and Mutations

```typescript
import { queries } from '@v1/database/queries';
import { mutations } from '@v1/database/mutations';

// Get posts with filters and pagination
const posts = await queries.getPosts(
  { search: 'react' },
  { page: 1, limit: 10 }
);

// Create post
const post = await mutations.createPost({
  title: 'My Post',
  content: 'Post content',
  userId: 'user-id'
});
```

## Schema

The database schema is defined in `src/schema/`:

- `users.ts` - User table definition
- `posts.ts` - Posts table definition

## Database Configuration

This package now uses **Neon PostgreSQL** exclusively for all database operations. Supabase is only used for authentication.

### Environment Variables

```bash
# Required for database connection
DATABASE_URL=postgresql://user:password@host:port/database

# Optional: Enable Drizzle Studio
DRIZZLE_STUDIO=true
```

## Migrations

```bash
# Generate migration
bun run generate

# Run migrations
bun run migrate

# Push schema changes
bun run push

# Open Drizzle Studio
bun run studio
```
