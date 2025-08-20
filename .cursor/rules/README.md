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
