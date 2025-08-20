# Gemini Assistant Guide for V1 Project

This document provides essential guidelines for the AI assistant to ensure code generation and modifications align with the project's standards.

## 1. Project Overview & Core Technologies

- **Architecture**: Monorepo managed by **Turbo**.
- **Package Manager**: **Bun**.
- **Framework**: **Next.js 14** with App Router.
- **Language**: **TypeScript**.
- **API**: **tRPC** for type-safe, end-to-end APIs.
- **Database**: **Drizzle ORM** with PostgreSQL.
- **UI**: **Shadcn UI** components built on **Tailwind CSS** and Radix UI.
- **Linting/Formatting**: **Biome**.
- **Package Scope**: All internal packages are under the `@v1` scope (e.g., `@v1/ui`, `@v1/database`).

## 2. General Principles & Code Style

- **Programming Style**: Write concise, functional, and declarative TypeScript. Avoid classes.
- **File Structure**: Group files by feature. A typical component file is structured:
  1. Imports
  2. Type/Interface definitions
  3. Exported component
  4. Subcomponents, helpers, static content
- **Naming**: Use `kebab-case` for directories and files. Use descriptive variable names (e.g., `isLoading`, `hasError`).
- **Exports**: Prefer named exports. Use default exports mainly for Next.js pages and layouts.
- **Error Handling**: This is a priority.
  - Use early returns and guard clauses.
  - Use **Zod** for all runtime validation (forms, API inputs).
  - Model expected errors as return values in Server Actions.
- **Performance**:
  - **Default to React Server Components (RSC)**. Minimize the use of `use client`.
  - Use `use client` only for components that need browser APIs or React hooks (`useState`, `useEffect`).
  - Wrap client components in `<Suspense>` with a fallback.

## 3. Technology-Specific Rules

### Monorepo (Turbo & Bun)

- **Dependencies**: Use `bun` for all package management. Internal dependencies must use the `workspace:*` protocol in `package.json`.
- **Scripts**: Use `turbo` to run scripts from the root (e.g., `bun run dev`, `bun run build`, `bun run lint`).

### TypeScript

- **Types vs. Interfaces**: Prefer `interfaces` for object shapes. Use `type` for unions, intersections, and utility types.
- **Enums**: **Avoid enums**. Use `const` assertions or union types instead.
- **Imports**: Use absolute imports for internal packages (e.g., `import { Button } from '@v1/ui/button';`).

### Next.js (App Router)

- **Structure**: Organize routes inside the `app/` directory. Use `page.tsx`, `layout.tsx`, `loading.tsx`, and `error.tsx` conventions.
- **Data Fetching**: Perform data fetching inside Server Components, preferably using our tRPC client.
- **Client Components**: A component is a client component **only if** it uses event handlers, React hooks, or browser-specific APIs. Keep them small and push them down the component tree.

### tRPC

- **Routers**: Organize routers by feature in `apps/app/src/lib/trpc/`.
- **Procedures**: Use the established procedure types: `publicProcedure` (no auth), `protectedProcedure` (auth required), and `loggedProcedure` (includes logging).
- **Validation**: **Always** validate inputs using **Zod**.
- **Error Handling**: Use `TRPCError` to throw structured, type-safe errors from the API.

### Database (Drizzle ORM)

- **Schema**: Define tables and relations in `packages/database/src/schema`.
- **Queries/Mutations**: Follow the existing patterns for queries and mutations.
- **Migrations**: Use Drizzle Kit to generate and manage schema migrations.
- **Type Safety**: Leverage Drizzle's generated types to ensure type safety in database operations.

### UI Components (Shadcn UI & Tailwind CSS)

- **Component Source**: All UI components should be imported from the `@v1/ui` package.
- **Styling**: Use **Tailwind CSS** utility classes. Follow a mobile-first approach.
- **Component Structure**: Use the `forwardRef` pattern for components, as established in the `@v1/ui` package.
- **Accessibility**: Ensure components are accessible (proper ARIA attributes, keyboard navigation, focus management).

## 4. Development Workflow

- **Run Development Server**: `bun run dev`
- **Linting & Formatting**: `bun run lint` (handled by Biome)
- **Type Checking**: `bun run typecheck`
