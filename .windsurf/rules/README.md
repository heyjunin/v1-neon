# Cursor Rules for V1 Project

This directory contains Cursor rules that help maintain code quality and consistency across the V1 monorepo.

## Available Rules

### General Rules
- **[general.mdc](mdc:general.mdc)** - Always applied rules for the entire project
  - Project structure and conventions
  - Code style and formatting
  - Error handling and validation
  - Performance optimization guidelines

### Technology-Specific Rules
- **[typescript.mdc](mdc:typescript.mdc)** - TypeScript development rules
  - Type definitions and interfaces
  - Component structure patterns
  - Import/export conventions
  - State management guidelines

- **[nextjs.mdc](mdc:nextjs.mdc)** - Next.js development rules
  - App Router structure
  - Server vs Client Components
  - Data fetching patterns
  - API route conventions

- **[trpc.mdc](mdc:trpc.mdc)** - tRPC development rules
  - Router structure and organization
  - Procedure types and middleware
  - Error handling patterns
  - Logger integration

- **[trpc-server.mdc](mdc:trpc-server.mdc)** - tRPC Server patterns
  - Server configuration and setup
  - Router structure and procedures
  - Context and middleware patterns
  - Database integration
  - Error handling and logging

- **[trpc-hooks.mdc](mdc:trpc-hooks.mdc)** - tRPC Hooks patterns
  - Query and mutation hooks
  - Hook usage patterns
  - Error handling in hooks
  - Optimistic updates
  - Authentication hooks

- **[database.mdc](mdc:database.mdc)** - Database development rules
  - Drizzle ORM usage
  - Schema and migration patterns
  - Query and mutation patterns
  - Adapter pattern implementation

- **[ui-components.mdc](mdc:ui-components.mdc)** - UI Components rules
  - Component structure patterns
  - Shadcn UI integration
  - Styling guidelines
  - Accessibility requirements

- **[monorepo.mdc](mdc:monorepo.mdc)** - Monorepo development rules
  - Package structure and dependencies
  - Workspace management
  - Turbo configuration
  - Build and deployment strategies

### Feature-Specific Rules
- **[auth.mdc](mdc:auth.mdc)** - Authentication & Authorization patterns
  - OAuth integration (Discord, Google)
  - Session management
  - Protected routes
  - Role-based access control

- **[i18n.mdc](mdc:i18n.mdc)** - Internationalization patterns
  - Locale routing and detection
  - Translation management
  - Client/server i18n
  - SEO for multiple languages

- **[server-actions.mdc](mdc:server-actions.mdc)** - Server Actions patterns
  - Safe action client usage
  - Input validation with Zod
  - Rate limiting integration
  - Error handling patterns

- **[storage.mdc](mdc:storage.mdc)** - File Upload & Storage patterns
  - R2 storage integration
  - File validation and security
  - Image optimization
  - Upload components

- **[email.mdc](mdc:email.mdc)** - Email Service patterns
  - Resend integration
  - Email templates
  - Queue management
  - Tracking and analytics

- **[notifications.mdc](mdc:notifications.mdc)** - Notifications system patterns
  - Real-time notifications
  - Toast notifications
  - Notification preferences
  - tRPC integration

- **[organizations.mdc](mdc:organizations.mdc)** - Organizations Management patterns
  - Organization CRUD operations
  - Member management
  - Invite system
  - Role-based permissions

- **[posts.mdc](mdc:posts.mdc)** - Posts & Content patterns
  - Content management
  - Rich text editor
  - SEO optimization
  - Comment system

- **[api-routes.mdc](mdc:api-routes.mdc)** - API Routes patterns
  - Next.js API routes
  - Webhook handlers
  - Rate limiting
  - CORS configuration

### Quality & Performance Rules
- **[testing.mdc](mdc:testing.mdc)** - Testing patterns and best practices
  - Component testing
  - tRPC testing
  - API route testing
  - Database testing

- **[performance.mdc](mdc:performance.mdc)** - Performance & Monitoring patterns
  - Web Vitals optimization
  - Bundle analysis
  - Error tracking
  - Analytics integration

## Usage

These rules are automatically applied by Cursor based on:
- **alwaysApply**: Rules that apply to every request (general.mdc)
- **globs**: Rules that apply to specific file patterns
- **description**: Rules that can be manually referenced

## Project Structure

The V1 project is a monorepo with the following structure:
```
v1/
├── apps/           # Next.js applications
│   ├── app/        # Main application
│   ├── web/        # Web application
│   ├── email/      # Email service
│   └── api/        # API service
├── packages/       # Shared packages
│   ├── ui/         # UI components
│   ├── database/   # Database layer
│   ├── supabase/   # Supabase integration
│   └── ...         # Other shared packages
├── scripts/        # Setup and utility scripts
└── docs/          # Project documentation
```

## Key Technologies

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **tRPC** for type-safe APIs
- **Drizzle ORM** for database operations
- **Tailwind CSS** for styling
- **Shadcn UI** for components
- **Turbo** for monorepo management
- **Bun** as package manager

## Development Workflow

1. Follow the established patterns in each technology area
2. Use the appropriate rules for the files you're working with
3. Maintain consistency across packages
4. Use proper error handling and validation
5. Implement proper testing and documentation

## Contributing

When adding new rules:
1. Use the `.mdc` extension
2. Include proper metadata (alwaysApply, globs, description)
3. Follow the established format
4. Update this README if needed
