# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

### Root Level Commands

```bash
# Development
yarn dev                    # Start all apps in parallel (API on :3000, Web on :4321)
yarn build                  # Build all applications
yarn start                  # Start all applications in production mode

# Code Quality
yarn lint                   # Lint all code with ESLint
yarn typecheck              # TypeScript type checking across all apps
yarn format                 # Format code with Prettier

# Testing
yarn test                   # Run all tests (Jest for API, Vitest for Web)
yarn test:watch             # Run tests in watch mode
yarn test:coverage          # Run tests with coverage reports

# Utilities
yarn clean                  # Clean build artifacts and .turbo cache
yarn reset                  # Clean and reinstall all dependencies
```

### Workspace-Specific Commands

```bash
# API Development (NestJS)
yarn workspace @app/api dev
yarn workspace @app/api test
yarn workspace @app/api prisma generate
yarn workspace @app/api prisma db push
yarn workspace @app/api prisma migrate dev
yarn workspace @app/api prisma studio

# Web Development (Astro + React)
yarn workspace @app/web dev
yarn workspace @app/web test
yarn workspace @app/web build
```

### Single Test Files

```bash
# API tests
yarn workspace @app/api test
yarn workspace @app/api test:watch

# Web tests
yarn workspace @app/web test
yarn workspace @app/web test:watch
```

## Architecture Overview

This is a **Turbo monorepo** with **Clean Architecture**, **Domain Driven Design**, **Separation of
Concerns** and **Test Driven Development** principles:

### Backend API (`apps/api`)

- **Framework**: NestJS with TypeScript
- **Database**: Prisma ORM with SQLite
- **Architecture**: Clean Architecture with three layers:
  - **Domain**: `src/*/domain/` - Entities, exceptions, value objects, interfaces
  - **Application**: `src/*/application/` - Use cases, services (use case orchestration), dtos
    (request/response), mappers (DTO <> Domain), exceptions
  - **Infrastructure**: `src/*/infrastructure/` - Controllers, repositories, mappers (Persistence <>
    Domain), services (email, cache, etc.), filters, interceptors, guards
- **Module Structure**: Feature-based modules (e.g., `Users.module`, `Auth.module`, `Tasks.module`)
  with dependency injection
- **Shared Code**: `src/shared/` contains domain, infrastructure, application utilities
- **Testing**: Jest with unit tests for each layer, test files have `*.spec.ts` extension and are
  beside the source file
- **Barrel Files**: `src/{moduleName}/{domain,application,infrastructure}/**/index.ts` - Barrel file
  for each sub-folders in each layer (for simplest imports and reducing circular dependencies)
- **Naming Conventions**:
  - **Files**: CamelCase name + componentName in singular suffix (eg. AuthUser.entity), if
    componentName is more than 1 word, compact it with first letter of each word(eg.
    value-objects/Email -> Email.vo.ts)
  - **Folders**: always lowercase for layer folders, kebab-case in plural for component folders if
    more than 1 word (eg. use cases -> use-cases)
  - **Class Names**: Always include the full component type name (eg. `export class UserEntity`,
    `export class EmailValueObject`)
  - **Interfaces**: Always add 'I' prefix (eg. `export interface IUserRepository`)

### Frontend Web (`apps/web`)

- **Framework**: Astro with React integration
- **Styling**: TailwindCSS v4
- **Testing**: Vitest with React Testing Library
- **Architecture**:
  - **Pages**: `src/pages/` - Astro file-based routing
  - **Components**: `src/components/` - Reusable React/Astro components
  - **UI**: `src/components/ui/` - Reusable React UI components (e.g., Button, Input, Select etc.)
  - **Forms**: `src/components/forms/` - Reusable React forms (e.g., AuthForm, EditProfileForm etc.)
  - **Layouts**: `src/components/layouts/` - Page layouts
  - **Hooks**: `src/hooks/` - Reusable React hooks
  - **Lib**: `src/lib/` - Shared utilities that depends on external packages
  - **Schemas**: `src/schemas/` - Zod schemas
  - **Services**: `src/services/` - API services by features/domains
  - **Stores**: `src/stores/` - Nanostores for state management
  - **Styles**: `src/styles/` - Global styles
  - **Types**: `src/types/` - TypeScript types
  - **Utils**: `src/utils/` - Utility functions that don't depend on external packages
  - **Middleware**: `src/middleware.ts` - Astro middleware

### Shared Packages (`packages/`)

- **`@packages/types`**: Shared TypeScript types and DTOs
- **`@packages/eslint-config`**: Shared ESLint configurations
- **`@packages/ts-config`**: Shared TypeScript configurations

## Key Development Patterns

### Adding New Features

1. **API**: Create module in `apps/api/src/[feature]/` following Clean Architecture:

   ```treeview
   feature/
   ├── Feature.module.ts
   ├── domain/
   │   ├── entities/
   │   │   └── index.ts
   │   │   └── Feature.entity.ts
   │   ├── exceptions/
   │   │   └── index.ts
   │   │   └── NotFoundError.exception.ts
   │   ├── value-objects/
   │   │   └── index.ts
   │   │   └── FeatureId.vo.ts
   │   ├── repositories/
   │   │   └── index.ts
   │   │   └── Feature.repository.ts
   ├── application/
   │   ├── use-cases/
   │   │   └── index.ts
   │   │   └── GetFeature.uc.ts
   │   ├── services/
   │   │   └── index.ts
   │   │   └── Feature.service.ts
   │   ├── dtos/
   │   │   └── index.ts
   │   │   └── GetFeature.dto.ts
   │   └── mappers/
   │       └── index.ts
   │       └── GetFeature.mapper.ts
   └── infrastructure/
   │   ├── controllers/
   │   │   └── index.ts
   │   │   └── Feature.controller.ts
   │   ├── repositories/
   │   │   └── index.ts
   │   │   └── PrismaFeature.repository.ts
   │   ├── mappers/
   │   │   └── index.ts
   │   │   └── Feature.mapper.ts
   │   └── services/
   │       └── index.ts
   │       └── Feature.service.ts
   ```

### Database Changes

1. Update `apps/api/prisma/schema.prisma`
2. Run `yarn workspace @app/api prisma migrate dev` from the root directory
3. Regenerate client: `yarn workspace @app/api prisma generate` from the root directory

### Testing Strategy

- **API**: Jest with unit tests for each layer (domain, application, infrastructure)
- **Web**: Vitest with React Testing Library for component testing
- Test files use `.spec.ts` or `.spec.tsx` extension

### Environment Setup

- API requires `.env` file with `DATABASE_URL`, `JWT_SECRET`, etc.
- Environment variables are managed through NestJS ConfigModule
- Database migrations are required for fresh setup

## Important File Locations

- **Database Schema**: `apps/api/prisma/schema.prisma`
- **API Entry Point**: `apps/api/src/main.ts`
- **Web Entry Point**: `apps/web/src/pages/index.astro`
- **Shared Types**: `packages/shared-types/src/`
- **Global Styles**: `apps/web/src/styles/global.css`
- **Turbo Config**: `turbo.json` (defines task dependencies and caching)

## AI Signature Policy

**CRITICAL: NEVER add AI signatures to commits, PRs, or issues**

- Do NOT include "🤖 Generated with [Claude Code]" in commit messages
- Do NOT include "Co-Authored-By: Claude" in commits
- Do NOT add AI signatures to PR descriptions or issue content
- Keep all git commits and GitHub content free of AI attribution

## Git Flow

**CRITICAL: ALWAYS use appropriate sub agents when /git-flow command is used**

## Quality Requirements

**CRITICAL: Before any commit or PR, ensure to ALWAYS run the this command from the root
directory:**

```bash
yarn lint && yarn format && yarn typecheck && yarn test
```
