![hero](image.png)

<p align="center">
	<h1 align="center"><b>V1 Neon - Enhanced Boilerplate</b></h1>
<p align="center">
    An enhanced open-source starter kit based on <a href="https://midday.ai">Midday</a> with modern database architecture.
    <br />
    <br />
    <a href="https://v1.run"><strong>Original Website</strong></a> · 
    <a href="https://github.com/midday-ai/v1/issues"><strong>Issues</strong></a> · 
    <a href="#whats-included"><strong>What's included</strong></a> ·
    <a href="#prerequisites"><strong>Prerequisites</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#architecture"><strong>Architecture</strong></a> ·
    <a href="#features"><strong>Features</strong></a>
  </p>
</p>

This is an enhanced version of the V1 boilerplate with significant improvements including **database decoupling from Supabase**, **Neon PostgreSQL integration**, **advanced seeder system**, **multi-tenancy support**, and **modern development practices**.

## 🚀 What's New

### 🔄 Database Architecture Overhaul
- **Decoupled from Supabase**: Database operations now use **Neon PostgreSQL** with **Drizzle ORM**
- **Supabase Auth Only**: Supabase is now used exclusively for authentication
- **Type-safe Database**: Full TypeScript support with Drizzle ORM
- **Migration System**: Robust migration management with Drizzle Kit

### 🔗 API Architecture (BFF Pattern)
- **tRPC as BFF**: Type-safe API layer implemented as Backend for Frontend within the app
- **End-to-end Type Safety**: Shared types between client and server
- **Integrated Authentication**: Seamless auth integration with Supabase
- **Optimized for Frontend**: API designed specifically for frontend needs

### 🌱 Advanced Seeder System
- **Laravel-inspired Seeders**: Powerful seeder system with faker.js integration
- **Batch Operations**: Efficient data insertion with transaction support
- **Realistic Data**: Generate realistic fake data with consistent seeds
- **Force Mode**: Override protection with `--force` flag

### 🏢 Multi-tenancy Support
- **Organizations Module**: Complete multi-tenancy system
- **Team Management**: Role-based access control (owner, admin, member)
- **Invite System**: Secure email-based invitation system
- **Permission System**: Granular permissions per organization

### 🔧 Development Experience
- **Bun Package Manager**: Faster package management and scripts
- **Enhanced Scripts**: Automated setup and provisioning
- **Better Error Handling**: Comprehensive error tracking and logging
- **Type Safety**: End-to-end TypeScript support

### 📁 Storage System
- **Cloudflare R2**: S3-compatible object storage
- **Image Transformations**: Real-time image processing with Sharp
- **Presigned URLs**: Secure upload/download URLs
- **File Validation**: Type and size validation
- **React Components**: Ready-to-use upload components

## What's included

[Next.js](https://nextjs.org/) - Framework<br>
[Turborepo](https://turbo.build) - Build system<br>
[Biome](https://biomejs.dev) - Linter, formatter<br>
[TailwindCSS](https://tailwindcss.com/) - Styling<br>
[Shadcn](https://ui.shadcn.com/) - UI components<br>
[TypeScript](https://www.typescriptlang.org/) - Type safety<br>
[Neon PostgreSQL](https://neon.tech/) - **Primary Database**<br>
[Drizzle ORM](https://orm.drizzle.team/) - **Type-safe ORM**<br>
[Supabase](https://supabase.com/) - **Authentication Only**<br>
[Upstash](https://upstash.com/) - Cache and rate limiting<br>
[React Email](https://react.email/) - Email templates<br>
[Resend](https://resend.com/) - Email delivery<br>
[i18n](https://next-international.vercel.app/) - Internationalization<br>
[Sentry](https://sentry.io/) - Error handling/monitoring<br>
[Dub](https://dub.sh/) - Sharable links<br>
[Trigger.dev](https://trigger.dev/) - Background jobs<br>
[OpenPanel](https://openpanel.dev/) - Analytics<br>
[Polar](https://polar.sh) - Billing (coming soon)<br>
[react-safe-action](https://next-safe-action.dev) - Validated Server Actions<br>
[nuqs](https://nuqs.47ng.com/) - Type-safe search params state manager<br>
[next-themes](https://next-themes-example.vercel.app/) - Theme manager<br>
[tRPC](https://trpc.io/) - **Type-safe BFF API**<br>
[Cloudflare R2](https://r2.cloudflare.com/) - **Object Storage**<br>
[Sharp](https://sharp.pixelplumbing.com/) - **Image Processing**<br>

## 🏗️ Architecture

### Database Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   Neon          │    │   Drizzle ORM   │
│   (Auth Only)   │    │   PostgreSQL    │    │   (Type-safe)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Application   │
                    │   (Next.js)     │
                    │   + tRPC BFF    │
                    └─────────────────┘
```

### Directory Structure

```
.
├── apps                         # App workspace
│    ├── api                     # Supabase (Auth, Storage, Edge Functions)
│    ├── app                     # Main application (with tRPC BFF)
│    ├── web                     # Marketing site
│    └── email                   # Email templates
├── packages                     # Shared packages
│    ├── analytics               # OpenPanel analytics
│    ├── database                # 🆕 Neon + Drizzle ORM
│    │   ├── src/
│    │   │   ├── schema/         # Database schemas
│    │   │   ├── queries/        # Database queries
│    │   │   ├── mutations/      # Database mutations
│    │   │   ├── seeders/        # 🆕 Seeder system
│    │   │   └── adapters/       # Database adapters
│    │   └── migrations/         # Drizzle migrations
│    ├── email                   # React email library
│    ├── jobs                    # Trigger.dev background jobs
│    ├── kv                      # Upstash rate-limited storage
│    ├── logger                  # Logger library
│    ├── supabase                # Supabase (Auth only)
│    ├── storage                 # 🆕 Cloudflare R2 storage
│    │   ├── src/
│    │   │   ├── client.ts       # Client-side storage
│    │   │   ├── server.ts       # Server-side R2 storage
│    │   │   ├── components/     # React upload components
│    │   │   └── utils.ts        # Storage utilities
│    │   └── types.ts            # Storage types
│    └── ui                      # Shared UI components
├── scripts                      # 🆕 Setup and automation scripts
│    ├── setup-neon.js          # Neon database setup
│    ├── setup-env.js           # Environment setup
│    ├── setup-storage.js       # Storage setup
│    └── supabase-*.sh          # Supabase management
├── tooling                      # Shared configurations
└── docs/                        # 🆕 Documentation
```

## 🎯 Features

### 🗄️ Database Features
- **Neon PostgreSQL**: Serverless PostgreSQL with automatic scaling
- **Drizzle ORM**: Type-safe database operations
- **Migration Management**: Version-controlled schema changes
- **Seeder System**: Laravel-inspired data seeding with faker.js
- **Transaction Support**: ACID-compliant operations
- **Performance Optimization**: Indexed queries and batch operations

### 🏢 Multi-tenancy Features
- **Organizations**: Complete multi-tenant architecture
- **Team Management**: Role-based access control
- **Invite System**: Email-based invitations with tokens
- **Permission System**: Granular permissions per organization
- **Isolation**: Data isolation between tenants

### 🔐 Authentication Features
- **Supabase Auth**: OAuth providers (Google, Discord, GitHub)
- **Session Management**: Secure session handling
- **Role-based Access**: Integration with organization roles
- **Email Verification**: Secure email verification flow

### 🚀 Development Features
- **Type Safety**: End-to-end TypeScript support
- **tRPC BFF**: Type-safe API layer implemented as Backend for Frontend
- **Hot Reload**: Fast development experience
- **Error Tracking**: Comprehensive error monitoring
- **Performance Monitoring**: Real-time performance insights

### 📁 Storage Features
- **Cloudflare R2**: S3-compatible object storage
- **Image Transformations**: Real-time image processing with Sharp
- **Presigned URLs**: Secure upload/download URLs
- **File Validation**: Type and size validation
- **React Components**: Ready-to-use upload components
- **Batch Operations**: Multiple file uploads
- **Progress Tracking**: Real-time upload progress

## Prerequisites

- [Bun](https://bun.sh/) - Package manager and runtime
- [Docker](https://docker.com/) - For local development
- [Neon Account](https://neon.tech/) - PostgreSQL database
- [Supabase Account](https://supabase.com/) - Authentication
- [Upstash Account](https://upstash.com/) - Redis cache
- [Resend Account](https://resend.com/) - Email delivery
- [Trigger.dev Account](https://trigger.dev/) - Background jobs
- [Sentry Account](https://sentry.io/) - Error tracking
- [OpenPanel Account](https://openpanel.dev/) - Analytics
- [Cloudflare Account](https://cloudflare.com/) - R2 Object Storage

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd v1-neon
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment

```bash
# Copy environment files
cp apps/app/env.local.example apps/app/.env.local
cp apps/api/.env.example apps/api/.env

# Setup complete environment
bun run setup:env:complete
```

### 4. Setup Database

```bash
# Setup Neon database (automated)
bun run setup:neon

# Or manually setup database
bun run db:setup
```

### 5. Setup Storage

```bash
# Setup Cloudflare R2 storage
bun run setup:storage
```

### 6. Start Development

```bash
# Start all services
bun dev

# Or start specific services
bun dev:app    # Main application
bun dev:web    # Marketing site
bun dev:api    # API services
bun dev:email  # Email templates
```

## 🗄️ Database Management

### Commands

```bash
# Generate migration
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema changes
bun run db:push

# Open Drizzle Studio
bun run db:studio

# Setup database (migrate + seed)
bun run db:setup

# Reset database
bun run db:reset
```

### Seeder System

```bash
# Run all seeders
bun run seed:run

# Run specific seeders
bun run seed:run users,posts

# List available seeders
bun run seed:list

# Force run (overwrite existing data)
bun run seed:run --force

# Show help
bun run seed:help
```

### Available Seeders

- **database**: Runs all seeders in correct order
- **users**: Creates sample users with realistic data
- **posts**: Creates sample posts distributed among users
- **organizations**: Creates sample organizations with members
- **example-advanced**: Demonstrates advanced faker features

## 🔗 tRPC BFF API

The tRPC API is implemented as a Backend for Frontend (BFF) pattern within the main application:

### Features
- **Type-safe API**: End-to-end TypeScript support between client and server
- **Integrated Authentication**: Seamless auth integration with Supabase
- **Optimized for Frontend**: API designed specifically for frontend needs
- **Automatic Caching**: React Query integration for optimal performance
- **Error Handling**: Comprehensive error handling with type safety

### Usage

```tsx
import { usePosts, useCreatePost } from '@/lib/trpc';

function PostsPage() {
  const { data: posts, isLoading } = usePosts({
    search: 'react',
    page: 1,
    limit: 10
  });
  
  const createPost = useCreatePost();

  const handleCreate = async (data) => {
    try {
      await createPost.mutateAsync(data);
    } catch (error) {
      if (error.data?.code === 'UNAUTHORIZED') {
        console.log('User needs to login');
      }
    }
  };

  return (
    <div>
      {posts?.data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### API Structure

```
apps/app/src/lib/trpc/
├── client.ts          # tRPC client configuration
├── provider.tsx       # React Query provider
├── hooks.ts           # Custom hooks for API calls
├── types.ts           # Shared types
├── context.ts         # Server context (auth, etc.)
├── server.ts          # Server exports (routers)
└── routers/
    ├── posts.ts       # Posts API routes
    └── organizations.ts # Organizations API routes
```

## 📁 Storage System

The Storage system provides comprehensive file management with Cloudflare R2:

### Features
- **Direct Upload**: Upload files directly to Cloudflare R2
- **Image Transformations**: Real-time image processing with Sharp
- **Presigned URLs**: Secure upload/download URLs
- **File Validation**: Type and size validation
- **React Components**: Ready-to-use upload components
- **Batch Operations**: Multiple file uploads
- **Progress Tracking**: Real-time upload progress

### Usage

```tsx
import { FileUpload } from '@v1/storage/components';
import { createClientStorage } from '@v1/storage/client';

function UploadComponent() {
  const clientStorage = createClientStorage({
    uploadUrl: '/api/upload',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'application/pdf']
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  };

  return (
    <FileUpload
      onUpload={handleUpload}
      accept="image/*"
      maxSize={5 * 1024 * 1024} // 5MB
      multiple={true}
      onUploadComplete={(result) => {
        console.log('Upload completed:', result);
      }}
    />
  );
}
```

### Server-Side Usage

```typescript
import { createR2Storage } from '@v1/storage/server';

const storage = createR2Storage({
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME!,
});

// Upload file
const result = await storage.upload('uploads/image.jpg', fileBuffer, {
  contentType: 'image/jpeg',
  public: true,
  metadata: { userId: '123' }
});

// Generate presigned URL
const presignedUrl = await storage.getPresignedUploadUrl('uploads/file.pdf', {
  expiresIn: 3600,
  contentType: 'application/pdf'
});
```

## 🏢 Organizations Module

The Organizations module provides complete multi-tenancy support:

### Features
- **Organization Management**: CRUD operations for organizations
- **Team Management**: Add/remove members with roles
- **Invite System**: Email-based invitations with secure tokens
- **Permission System**: Role-based access control
- **Multi-tenancy**: Data isolation between organizations

### Usage

```tsx
import { useOrganizations, useCreateOrganization } from '@/lib/trpc';

function OrganizationsPage() {
  const { data: organizations } = useOrganizations();
  const createOrg = useCreateOrganization();

  const handleCreate = async (data) => {
    await createOrg.mutateAsync(data);
  };

  return (
    <div>
      {organizations?.data.map(org => (
        <div key={org.id}>{org.name}</div>
      ))}
    </div>
  );
}
```

## 🔧 Development Scripts

### Setup Scripts
```bash
bun run setup:env          # Setup environment variables
bun run setup:env:complete # Complete environment setup
bun run setup:neon         # Setup Neon database
bun run setup:webhook      # Setup webhooks
bun run setup:storage      # Setup Cloudflare R2 storage
```

### Database Scripts
```bash
bun run db:migrate         # Run migrations
bun run db:generate        # Generate migration
bun run db:push           # Push schema changes
bun run db:studio         # Open Drizzle Studio
bun run db:setup          # Setup database
bun run db:reset          # Reset database
```

### Seeder Scripts
```bash
bun run seed:run          # Run all seeders
bun run seed:list         # List seeders
bun run seed:help         # Show help
```

### Supabase Scripts
```bash
bun run supabase:local    # Start local Supabase
bun run supabase:remote   # Connect to remote Supabase
bun run supabase:status   # Check Supabase status
```

## 🚀 Deployment

### Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fv1-neon&env=RESEND_API_KEY,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,SENTRY_AUTH_TOKEN,NEXT_PUBLIC_SENTRY_DSN,SENTRY_ORG,SENTRY_PROJECT,DUB_API_KEY,NEXT_PUBLIC_OPENPANEL_CLIENT_ID,OPENPANEL_SECRET_KEY,DATABASE_URL,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=v1-neon&repository-name=v1-neon)

### Environment Variables

Required environment variables for deployment:

```bash
# Database
DATABASE_URL=your_neon_database_url
USE_DRIZZLE=true

# Supabase (Auth only)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email
RESEND_API_KEY=your_resend_api_key

# Redis
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Analytics
OPENPANEL_SECRET_KEY=your_openpanel_key
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=your_openpanel_client_id

# Error Tracking
SENTRY_AUTH_TOKEN=your_sentry_auth_token
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project

# Background Jobs
TRIGGER_API_KEY=your_trigger_api_key
TRIGGER_API_URL=https://api.trigger.dev

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_REGION=auto
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

## 📚 Documentation

- [Database Seeding](./docs/database-seeding.md)
- [Discord OAuth Setup](./docs/discord-oauth-setup.md)
- [Supabase Environment Setup](./docs/supabase-environment-setup.md)
- [Webhook Setup](./docs/webhook-setup.md)
- [Storage System](./packages/storage/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Based on [Midday](https://midday.ai) and the original [V1](https://v1.run) boilerplate
- Enhanced with modern database architecture and development practices
- Built with the latest technologies and best practices

## 🆕 What's Different from Original V1

### Major Improvements
1. **Database Decoupling**: Separated database from Supabase, now using Neon PostgreSQL
2. **Type-safe ORM**: Replaced Supabase database with Drizzle ORM
3. **tRPC BFF**: Type-safe API layer implemented as Backend for Frontend within the app
4. **Advanced Seeder System**: Laravel-inspired seeding with faker.js
5. **Multi-tenancy**: Complete organizations module with team management
6. **Storage System**: Cloudflare R2 integration with image transformations
7. **Enhanced Scripts**: Automated setup and provisioning scripts
8. **Better DX**: Improved development experience with Bun and modern tooling
9. **Comprehensive Documentation**: Detailed docs for all features

### Technical Improvements
- **Performance**: Optimized database queries and batch operations
- **Type Safety**: End-to-end TypeScript support with tRPC BFF
- **Scalability**: Serverless database with automatic scaling
- **Security**: Enhanced authentication and permission systems
- **Storage**: S3-compatible object storage with image processing
- **API Design**: BFF pattern for optimized frontend-backend communication
- **Maintainability**: Better code organization and separation of concerns

This enhanced version maintains all the benefits of the original V1 while adding modern database architecture, type-safe BFF API, multi-tenancy support, comprehensive storage system, and improved development experience! 🚀
