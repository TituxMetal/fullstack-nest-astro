# fullstack-nest-astro BMAD Methodology Introduction & Technical Enhancement PRD

| Change        | Date       | Version | Description                               | Author      |
| :------------ | :--------- | :------ | :---------------------------------------- | :---------- |
| Initial Draft | 2025-07-28 | 1.0     | Initial PRD for architectural refactoring | BMad Master |

## 1. Intro Project Analysis and Context

### 1.1. Existing Project Overview

- **Analysis Source**: IDE-based fresh analysis of the codebase.
- **Current Project State**: The project is a Turborepo monorepo containing a NestJS backend and an
  Astro/React frontend. Key features include JWT-based authentication via HTTP-only cookies, Prisma
  as the ORM, and Docker support for deployment. The project lacks formal architectural
  documentation.

### 1.2. Enhancement Scope Definition

- **Enhancement Type**: Methodology Introduction & Technology Stack Upgrade.
- **Enhancement Description**: This enhancement introduces the BMAD
  (Business-Model-Architecture-Development) methodology to the project, replacing memory bank
  documentation with systematic BMAD artifacts. Once BMAD processes are established, the methodology
  will guide a deep architectural refactoring of the entire monorepo. Key objectives include
  creating centralized, shared TypeScript (`tsconfig`) and ESLint configuration packages.
  Additionally, the plan is to restructure the monorepo directory, refactor the NestJS backend to a
  Clean Architecture + DDD pattern, and improve the folder/file structure of the Astro/React
  frontend.
- **Impact Assessment**: Major Impact (architectural changes required).

### 1.3. Goals and Background Context

- **Goals**:
  - **Primary**: Introduce BMAD methodology and establish systematic development processes
  - **Secondary**: Establish a highly scalable and maintainable backend architecture (Clean
    Architecture + DDD)
  - Improve frontend code organization and scalability.
  - Centralize TypeScript and ESLint configurations into shared packages to improve consistency and
    leverage the monorepo structure.
  - Optimize the monorepo structure for better developer experience and clarity.
- **Background Context**: The project has reached a solid functional state. To ensure long-term
  scalability and maintainability, the current structure needs to evolve. Creating shared
  configuration packages will enforce consistency. Adopting Clean Architecture and DDD will create a
  more robust backend. Refining the monorepo and frontend structure will improve the overall
  development workflow.

## 2. Requirements

### 2.1. Functional Requirements

- **FR0.1**: BMAD methodology documentation and templates shall be established in the project
- **FR0.2**: All memory bank documentation files shall be removed from the repository
- **FR0.3**: Project README files shall be updated to include BMAD methodology references and
  workflows
- **FR0.4**: Epic 1-4 stories shall be restructured to include proper BMAD acceptance criteria and
  user value statements
- **FR1**: A new monorepo package named `@repo/eslint-config` shall be created. It must contain
  base, Node.js, and browser-specific ESLint configurations.
- **FR2**: A new monorepo package named `@repo/typescript-config` shall be created. It must contain
  base, Node.js, and browser-specific `tsconfig.json` configurations.
- **FR3**: The `backend` application must extend its ESLint and TypeScript configurations from the
  new shared packages.
- **FR4**: The `frontend` application must extend its ESLint and TypeScript configurations from the
  new shared packages.
- **FR5**: The `backend` application's source code shall be restructured to follow Clean
  Architecture principles combined with DDD Bounded Contexts.
- **FR6**: The `frontend` application's source code shall be reorganized into the agreed-upon
  component-type-based structure.
- **FR7**: All existing functionality (user registration, login, logout, profile view/edit) must
  remain fully operational after the refactoring.

### 2.2. Non-Functional Requirements

- **NFR1**: The refactoring must not introduce any breaking changes to the external API contract.
- **NFR2**: The new architectural patterns must be clearly documented in the project's READMEs.
- **NFR3**: The changes should not negatively impact the existing unit and integration test
  coverage. All tests must pass after the refactor.
- **NFR4**: The monorepo's build, test, and linting scripts orchestrated by Turborepo must be
  updated to work with the new structure and packages.

## 3. Technical Constraints and Integration Requirements

### 3.1. Existing Technology Stack

- **Languages**: TypeScript
- **Monorepo/Tooling**: Turborepo, Yarn Workspaces
- **Backend Framework**: NestJS
- **Frontend Framework**: Astro, React
- **Database / ORM**: Prisma
- **Styling**: TailwindCSS
- **Form Management**: React Hook Form with Zod
- **Testing**: Jest (backend), Vitest with React Testing Library (frontend)
- **Containerization**: Docker

### 3.2. Code Organization and Standards

- **File Structure Approach (Backend)**: Organized by DDD Bounded Contexts first, with Clean
  Architecture layers applied within each context.

  ```tree
  backend/src/
  ├── auth/
  │   ├── domain/
  │   ├── application/
  │   └── infrastructure/
  ├── user/
  │   ├── domain/
  │   ├── application/
  │   └── infrastructure/
  └── shared/
      ├── domain/
      └── infrastructure/
  ```

- **File Structure Approach (Frontend)**: Adopt a component-type-based structure.

  ```tree
  frontend/src/
  ├── components/
  │   ├── forms/
  │   ├── icons/
  │   ├── layouts/
  │   └── ui/
  ├── hooks/
  ├── lib/
  ├── pages/
  ├── services/
  └── styles/
  ```

### 3.3. Risk Assessment and Mitigation

- **Technical Risks**: Incorrect implementation of the Dependency Rule; incorrect definition of
  Bounded Contexts.
- **Integration Risks**: Accidental modification of the API contract.
- **Mitigation Strategies**: Rely heavily on existing unit and integration tests; refactor one
  Bounded Context at a time.

## 4. Epic and Story Structure

### 4.1. Epic Approach

This enhancement will be broken down into five distinct, sequential epics to allow for incremental,
verifiable changes:

0. BMAD Methodology Introduction & Setup (PREREQUISITE)
1. Monorepo Restructuring
2. Backend Architectural Refactoring
3. Frontend Architectural Refactoring
4. Shared Configuration Packages

**Note**: Epic 0 must be completed before Epics 1-4 can begin, as it establishes the BMAD
methodology that will guide the technical implementation.

---

### **Epic 0: BMAD Methodology Introduction & Setup**

- **Epic Goal**: To introduce BMAD methodology to the project, establish proper documentation
  artifacts, and eliminate the memory bank approach, creating the foundation for systematic
  technical enhancement.
- **Status**: In Progress

#### Completed Stories

- **Story 0.1**: Set up BMAD process templates and documentation structure. **[DONE]**
- **Story 0.2**: Create Epic 0-4 story breakdowns with proper acceptance criteria. **[DONE]**
- **Story 0.3**: Establish BMAD quality gates and validation processes. **[DONE]**

#### Remaining Story

- **Story 0.4: Finalize Project Cleanup and Documentation**

  - **User Story**: As a developer joining the project, I need the legacy `memory-bank`
    documentation removed and the `README.md` files updated so that I can quickly understand the
    current project structure and methodology.
  - **Acceptance Criteria**:
    1. The `memory-bank/` directory at the project root MUST be deleted.
    2. The main `README.md` at the project root MUST be updated to accurately reflect the new
       project structure and development methodology.
    3. All other `README.md` files (e.g., in `backend/`, `frontend/`) MUST be reviewed and updated
       to be consistent with the new project standards.

- **Integration Verification**: BMAD documentation structure is in place, memory bank files removed,
  and the team can follow a clear, documented workflow for story validation.

---

### **Epic 1: Monorepo Restructuring**

- **Epic Goal**: To restructure the monorepo's directory layout to follow modern best practices by
  separating `apps` and `packages`, improving clarity and scalability.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

#### **Story 1.1: Create Apps and Packages Directory Structure**

As a **developer working in the monorepo**, I want **the root directory to have dedicated `apps` and
`packages` folders**, so that **I can clearly distinguish between deployable applications and
reusable packages**.

**Acceptance Criteria:**

1. **AC1.1.1**: Root directory contains new empty `apps/` directory
2. **AC1.1.2**: Root directory contains new empty `packages/` directory
3. **AC1.1.3**: Existing `backend/` and `frontend/` directories remain untouched during this story
4. **AC1.1.4**: All existing Turborepo commands (`yarn build`, `yarn test`, `yarn lint`) continue to
   work without changes

**Integration Verification:**

- **IV1.1.1**: Existing project structure continues to function normally
- **IV1.1.2**: No breaking changes to current development workflow
- **IV1.1.3**: Directory creation does not affect existing Docker builds

#### **Story 1.2: Move Applications to Apps Directory**

As a **developer working with the monorepo applications**, I want **the backend and frontend moved
into the apps directory**, so that **the monorepo structure clearly indicates what are deployable
applications**.

**Acceptance Criteria:**

1. **AC1.2.1**: `backend/` directory is moved to `apps/backend/` with all files intact
2. **AC1.2.2**: `frontend/` directory is moved to `apps/frontend/` with all files intact
3. **AC1.2.3**: All source code, configuration files, and package.json files are preserved exactly
4. **AC1.2.4**: Git history is preserved for moved files (using `git mv` commands)

**Integration Verification:**

- **IV1.2.1**: Both applications can be built independently from new locations
- **IV1.2.2**: All import paths within applications continue to work
- **IV1.2.3**: Environment variables and configuration loading still functions

#### **Story 1.3: Update Root Configuration for New Structure**

As a **developer using monorepo tooling**, I want **root configuration files updated to reference
the new app locations**, so that **Turborepo orchestration continues to work seamlessly**.

**Acceptance Criteria:**

1. **AC1.3.1**: `turbo.json` pipeline configurations updated to use `apps/backend` and
   `apps/frontend` paths
2. **AC1.3.2**: Root `package.json` workspace configurations updated to include `apps/*` pattern
3. **AC1.3.3**: All Turborepo commands (`build`, `test`, `lint`, `dev`) work from root directory
4. **AC1.3.4**: Yarn workspace commands correctly identify both applications

**Integration Verification:**

- **IV1.3.1**: `yarn build` builds both applications successfully
- **IV1.3.2**: `yarn test` runs tests for both applications
- **IV1.3.3**: `yarn lint` lints both applications
- **IV1.3.4**: `yarn dev` starts both applications in development mode

#### **Story 1.4: Update Docker and Deployment Configuration**

As a **developer deploying the application**, I want **Docker configurations updated for the new
monorepo structure**, so that **containerized deployments continue to work without disruption**.

**Acceptance Criteria:**

1. **AC1.4.1**: `docker/Dockerfile.backend` updated to use `apps/backend` as build context
2. **AC1.4.2**: `docker/Dockerfile.frontend` updated to use `apps/frontend` as build context
3. **AC1.4.3**: `docker/compose.yaml` updated to reference new application paths
4. **AC1.4.4**: `docker/start.sh` script updated for new directory structure

**Integration Verification:**

- **IV1.4.1**: Docker builds complete successfully for both applications
- **IV1.4.2**: Docker Compose can start the full stack
- **IV1.4.3**: Container networking and communication remains functional
- **IV1.4.4**: Production deployment process works with new structure

---

### **Epic 2: Backend Architectural Refactoring**

- **Epic Goal**: To refactor the backend application to align with Clean Architecture principles
  within Domain-Driven Design (DDD) Bounded Contexts.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

#### **Story 2.1: Establish Clean Architecture + DDD Directory Structure**

As a **developer working on backend architecture**, I want **the new Clean Architecture directory
structure created alongside existing code**, so that **I can incrementally migrate modules without
breaking existing functionality**.

**Acceptance Criteria:**

1. **AC2.1.1**: Create `apps/backend/src/contexts/` directory structure:

   ```tree
   contexts/
   ├── auth/
   │   ├── domain/
   │   ├── application/
   │   └── infrastructure/
   ├── user/
   │   ├── domain/
   │   ├── application/
   │   └── infrastructure/
   └── shared/
       ├── domain/
       └── infrastructure/
   ```

2. **AC2.1.2**: Add architectural documentation in `apps/backend/docs/architecture.md` explaining
   Clean Architecture + DDD principles
3. **AC2.1.3**: Create template files showing expected patterns for each layer
4. **AC2.1.4**: All existing modules (`auth/`, `user/`, etc.) remain untouched and functional

**Integration Verification:**

- **IV2.1.1**: Existing API endpoints continue to work normally
- **IV2.1.2**: All authentication flows remain functional
- **IV2.1.3**: User profile operations work without changes
- **IV2.1.4**: All existing tests pass

#### **Story 2.2: Refactor Auth Bounded Context to Clean Architecture**

As a **developer working with authentication features**, I want **the auth module restructured using
Clean Architecture patterns**, so that **business logic is separated from infrastructure concerns
while maintaining all functionality**.

**Acceptance Criteria:**

1. **AC2.2.1**: Create auth domain layer:
   - `contexts/auth/domain/entities/` (User entity for auth purposes)
   - `contexts/auth/domain/value-objects/` (Email, Password value objects)
   - `contexts/auth/domain/repositories/` (Auth repository interfaces)
2. **AC2.2.2**: Create auth application layer:
   - `contexts/auth/application/use-cases/` (LoginUseCase, RegisterUseCase, LogoutUseCase)
   - `contexts/auth/application/dto/` (moved from current auth/dto/)
   - `contexts/auth/application/services/` (AuthApplicationService)
3. **AC2.2.3**: Create auth infrastructure layer:
   - `contexts/auth/infrastructure/repositories/` (AuthRepository implementation)
   - `contexts/auth/infrastructure/adapters/` (JWT, password hashing)
   - `contexts/auth/infrastructure/controllers/` (moved from auth.controller.ts)
4. **AC2.2.4**: Update auth module imports and dependency injection
5. **AC2.2.5**: Remove original `auth/` directory after successful migration

**Integration Verification:**

- **IV2.2.1**: POST `/auth/login` endpoint works identically
- **IV2.2.2**: POST `/auth/register` endpoint works identically
- **IV2.2.3**: POST `/auth/logout` endpoint works identically
- **IV2.2.4**: JWT authentication middleware functions normally
- **IV2.2.5**: All auth-related tests pass with updated imports

#### **Story 2.3: Refactor User Bounded Context to Clean Architecture**

As a **developer working with user management features**, I want **the user module restructured
using Clean Architecture patterns**, so that **user business logic is cleanly separated while
preserving all existing functionality**.

**Acceptance Criteria:**

1. **AC2.3.1**: Create user domain layer:
   - `contexts/user/domain/entities/User.ts` (rich domain entity)
   - `contexts/user/domain/value-objects/` (UserProfile, ContactInfo)
   - `contexts/user/domain/repositories/UserRepository.ts` (interface)
2. **AC2.3.2**: Create user application layer:
   - `contexts/user/application/use-cases/` (GetUserProfile, UpdateUserProfile)
   - `contexts/user/application/dto/` (moved from current user/dto/)
   - `contexts/user/application/services/UserApplicationService.ts`
3. **AC2.3.3**: Create user infrastructure layer:
   - `contexts/user/infrastructure/repositories/PrismaUserRepository.ts`
   - `contexts/user/infrastructure/controllers/` (moved from user.controller.ts)
   - `contexts/user/infrastructure/mappers/` (domain ↔ persistence mapping)
4. **AC2.3.4**: Update user module configuration and dependency injection
5. **AC2.3.5**: Remove original `user/` directory after successful migration

**Integration Verification:**

- **IV2.3.1**: GET `/users/me` endpoint returns identical response structure
- **IV2.3.2**: PUT `/users/me` endpoint accepts same input and returns same output
- **IV2.3.3**: User profile page continues to work without frontend changes
- **IV2.3.4**: All user-related tests pass with updated imports
- **IV2.3.5**: Authentication integration with user data remains functional

#### **Story 2.4: Refactor Shared Infrastructure and Cross-Cutting Concerns**

As a **developer working with shared backend services**, I want **shared services and infrastructure
moved to the shared context**, so that **cross-cutting concerns are properly organized while
maintaining functionality**.

**Acceptance Criteria:**

1. **AC2.4.1**: Move shared infrastructure:
   - `contexts/shared/infrastructure/database/` (Prisma service and module)
   - `contexts/shared/infrastructure/config/` (moved from config/)
   - `contexts/shared/infrastructure/validation/` (moved from shared/validation/)
   - `contexts/shared/infrastructure/serialization/` (moved from shared/interceptors/)
2. **AC2.4.2**: Move shared domain:
   - `contexts/shared/domain/events/` (for future domain events)
   - `contexts/shared/domain/exceptions/` (custom exceptions)
   - `contexts/shared/domain/value-objects/` (common value objects)
3. **AC2.4.3**: Update token service as shared infrastructure
4. **AC2.4.4**: Update all context modules to use shared infrastructure
5. **AC2.4.5**: Remove original `shared/`, `config/`, `prisma/`, `token/` directories

**Integration Verification:**

- **IV2.4.1**: Database connections and Prisma operations work normally
- **IV2.4.2**: Configuration loading functions correctly
- **IV2.4.3**: JWT token generation and validation continues working
- **IV2.4.4**: Request validation and serialization work unchanged
- **IV2.4.5**: All integration tests pass

#### **Story 2.5: Update Application Module and Finalize Architecture**

As a **developer working with the application startup**, I want **the main app module updated to use
the new architecture**, so that **the application boots correctly with the new Clean Architecture
structure**.

**Acceptance Criteria:**

1. **AC2.5.1**: Update `app.module.ts` to import context modules instead of feature modules
2. **AC2.5.2**: Configure dependency injection for new architecture layers
3. **AC2.5.3**: Update `main.ts` if needed for new module structure
4. **AC2.5.4**: Update all import paths throughout the application
5. **AC2.5.5**: Verify no circular dependencies exist in new structure

**Integration Verification:**

- **IV2.5.1**: Application starts successfully with new architecture
- **IV2.5.2**: All API endpoints respond correctly
- **IV2.5.3**: Authentication and user management flows work end-to-end
- **IV2.5.4**: All unit and integration tests pass
- **IV2.5.5**: Frontend integration remains unaffected

---

### **Epic 3: Frontend Architectural Refactoring**

- **Epic Goal**: To restructure the frontend application to use the defined component-type-based
  architecture, improving modularity and reusability.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

#### **Story 3.1: Create Component-Type-Based Directory Structure**

As a **frontend developer working with React components**, I want **component directories organized
by component type rather than feature**, so that **I can easily locate and reuse components based on
their functional role**.

**Acceptance Criteria:**

1. **AC3.1.1**: Create new component type directories:

   ```tree
   apps/frontend/src/components/
   ├── forms/          # Form components
   ├── icons/          # Icon components
   ├── layouts/        # Layout components
   └── ui/             # Base UI components (existing)
   ```

2. **AC3.1.2**: Create new `lib/` directory structure:

   ```tree
   apps/frontend/src/lib/
   ├── schemas/        # Zod schemas
   ├── types/          # TypeScript types
   └── utils/          # Utility functions
   ```

3. **AC3.1.3**: All existing files remain in current locations and functional
4. **AC3.1.4**: No import path changes during this story

**Integration Verification:**

- **IV3.1.1**: All pages continue to render correctly
- **IV3.1.2**: Authentication flow works normally
- **IV3.1.3**: User profile functionality remains intact
- **IV3.1.4**: All frontend tests pass

#### **Story 3.2: Migrate Form Components to Dedicated Directory**

As a **developer working with form components**, I want **all form-related components organized in a
forms directory**, so that **form components are easily discoverable and maintainable**.

**Acceptance Criteria:**

1. **AC3.2.1**: Move `AuthForm.tsx` to `components/forms/AuthForm.tsx`
2. **AC3.2.2**: Move `EditProfileForm.tsx` and `EditProfileForm.spec.tsx` to `components/forms/`
3. **AC3.2.3**: Update all import statements in pages and other components
4. **AC3.2.4**: Update test files to reference new locations
5. **AC3.2.5**: Remove original component files after successful migration

**Integration Verification:**

- **IV3.2.1**: `/auth` page renders AuthForm correctly
- **IV3.2.2**: `/profile` page renders EditProfileForm correctly
- **IV3.2.3**: Form validation and submission work unchanged
- **IV3.2.4**: All form-related tests pass with updated imports

#### **Story 3.3: Create Icons Directory and Migrate Assets**

As a **developer working with icon components**, I want **icon assets organized as reusable
components in a dedicated directory**, so that **icons can be easily imported and used consistently
across the application**.

**Acceptance Criteria:**

1. **AC3.3.1**: Create React components for existing SVG icons:
   - `components/icons/BackIcon.tsx` (from assets/icons/back.svg)
   - `components/icons/CoffeeIcon.tsx` (from assets/icons/coffee.svg)
   - `components/icons/CopyLeftIcon.tsx` (from assets/icons/copy-left.svg)
   - `components/icons/HeartIcon.tsx` (from assets/icons/heart.svg)
2. **AC3.3.2**: Create `components/icons/index.ts` for centralized exports
3. **AC3.3.3**: Replace any existing SVG imports with new icon components
4. **AC3.3.4**: Keep original SVG files in assets for reference during migration

**Integration Verification:**

- **IV3.3.1**: Any pages using icons display correctly
- **IV3.3.2**: Icon components render with proper styling
- **IV3.3.3**: No broken image references or missing icons
- **IV3.3.4**: Build process works with new icon components

#### **Story 3.4: Migrate Layouts to Components Directory**

As a **developer working with layout components**, I want **layout components organized within the
components directory**, so that **all reusable UI components follow consistent organizational
patterns**.

**Acceptance Criteria:**

1. **AC3.4.1**: Move `layouts/Main.astro` to `components/layouts/Main.astro`
2. **AC3.4.2**: Update all page imports to reference new layout location
3. **AC3.4.3**: Verify layout props and slots continue working correctly
4. **AC3.4.4**: Remove original `layouts/` directory after successful migration

**Integration Verification:**

- **IV3.4.1**: All pages (auth, index, logout, profile) render with correct layout
- **IV3.4.2**: Layout styling and structure remain unchanged
- **IV3.4.3**: Astro's layout system continues to function normally
- **IV3.4.4**: No broken layout references in any page

#### **Story 3.5: Migrate Schemas, Types, and Utils to Lib Directory**

As a **developer working with shared utilities and types**, I want **schemas, types, and utility
functions organized in a lib directory**, so that **shared code is clearly separated from components
and easily importable**.

**Acceptance Criteria:**

1. **AC3.5.1**: Move schema files:
   - `schemas/auth.schema.ts` → `lib/schemas/auth.schema.ts`
   - `schemas/user.schema.ts` → `lib/schemas/user.schema.ts`
   - Include corresponding `.spec.ts` files
2. **AC3.5.2**: Move type files:
   - `types/` directory contents → `lib/types/`
   - Preserve all type definitions exactly
3. **AC3.5.3**: Move utility files:
   - `utils/navigation.ts` → `lib/utils/navigation.ts`
   - `utils/routes.ts` → `lib/utils/routes.ts`
4. **AC3.5.4**: Create index files for easier imports:
   - `lib/schemas/index.ts`
   - `lib/types/index.ts`
   - `lib/utils/index.ts`
5. **AC3.5.5**: Update all import statements throughout the application

**Integration Verification:**

- **IV3.5.1**: Form validation with Zod schemas works unchanged
- **IV3.5.2**: TypeScript compilation succeeds with new import paths
- **IV3.5.3**: Navigation and routing utilities function correctly
- **IV3.5.4**: All services continue to use types correctly
- **IV3.5.5**: All tests pass with updated imports

#### **Story 3.6: Finalize Frontend Architecture and Cleanup**

As a **developer working in the refactored frontend**, I want **the frontend architecture finalized
with proper documentation**, so that **the new structure is clear and maintainable for future
development**.

**Acceptance Criteria:**

1. **AC3.6.1**: Remove all original directories that have been migrated
2. **AC3.6.2**: Update `apps/frontend/README.md` with new architecture documentation
3. **AC3.6.3**: Create architecture diagrams showing component organization
4. **AC3.6.4**: Verify no dead imports or circular dependencies exist
5. **AC3.6.5**: Update any build configurations if needed for new structure

**Integration Verification:**

- **IV3.6.1**: Complete frontend application works end-to-end
- **IV3.6.2**: All user flows (auth, profile, navigation) function normally
- **IV3.6.3**: Build and test commands work with new structure
- **IV3.6.4**: Development server starts and hot reloading works
- **IV3.6.5**: Production build generates correctly

---

### **Epic 4: Shared Configuration Packages**

- **Epic Goal**: To create and integrate centralized ESLint and TypeScript configuration packages
  (`@repo/eslint-config`, `@repo/typescript-config`) to be used by all applications in the monorepo.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

#### **Story 4.1: Create Shared TypeScript Configuration Package**

As a **developer working across multiple applications in the monorepo**, I want **a centralized
TypeScript configuration package**, so that **TypeScript compiler settings are consistent and
maintainable across all applications**.

**Acceptance Criteria:**

1. **AC4.1.1**: Create `packages/typescript-config/` directory structure:

   ```tree
   packages/typescript-config/
   ├── package.json
   ├── base.json          # Base TypeScript config
   ├── node.json          # Node.js specific config
   ├── react.json         # React/browser specific config
   └── README.md
   ```

2. **AC4.1.2**: Configure package.json with proper name `@repo/typescript-config`
3. **AC4.1.3**: Create base.json with common TypeScript compiler options
4. **AC4.1.4**: Create node.json extending base.json with Node.js specific settings
5. **AC4.1.5**: Create react.json extending base.json with React/browser specific settings
6. **AC4.1.6**: Document usage patterns in README.md

**Integration Verification:**

- **IV4.1.1**: Package builds successfully as part of monorepo
- **IV4.1.2**: TypeScript configurations are valid JSON
- **IV4.1.3**: No circular dependencies in configuration extends
- **IV4.1.4**: Package is discoverable via yarn workspace commands

#### **Story 4.2: Create Shared ESLint Configuration Package**

As a **developer ensuring code quality across the monorepo**, I want **a centralized ESLint
configuration package**, so that **linting rules are consistent and maintainable across all
applications**.

**Acceptance Criteria:**

1. **AC4.2.1**: Create `packages/eslint-config/` directory structure:

   ```tree
   packages/eslint-config/
   ├── package.json
   ├── base.js            # Base ESLint config
   ├── node.js            # Node.js specific config
   ├── react.js           # React specific config
   └── README.md
   ```

2. **AC4.2.2**: Configure package.json with proper name `@repo/eslint-config`
3. **AC4.2.3**: Create base.js with common ESLint rules and parser settings
4. **AC4.2.4**: Create node.js extending base with Node.js specific rules
5. **AC4.2.5**: Create react.js extending base with React and JSX specific rules
6. **AC4.2.6**: Include all necessary peer dependencies for ESLint plugins
7. **AC4.2.7**: Document configuration usage in README.md

**Integration Verification:**

- **IV4.2.1**: Package builds and installs correctly in monorepo
- **IV4.2.2**: ESLint configurations load without errors
- **IV4.2.3**: All referenced ESLint plugins are available
- **IV4.2.4**: Configuration extends work properly

#### **Story 4.3: Migrate Backend to Use Shared Configuration Packages**

As a **backend developer**, I want **the backend application to use shared TypeScript and ESLint
configurations**, so that **configuration management is centralized while maintaining
backend-specific needs**.

**Acceptance Criteria:**

1. **AC4.3.1**: Update `apps/backend/package.json` to include dependencies:
   - `@repo/typescript-config: "workspace:*"`
   - `@repo/eslint-config: "workspace:*"`
2. **AC4.3.2**: Replace `apps/backend/tsconfig.json` to extend from shared config:

   ```json
   {
     "extends": "@repo/typescript-config/node.json",
     "compilerOptions": {
       "outDir": "./dist"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

3. **AC4.3.3**: Replace `apps/backend/eslint.config.cjs` to extend from shared config
4. **AC4.3.4**: Preserve any backend-specific TypeScript and ESLint overrides
5. **AC4.3.5**: Remove redundant configuration from backend files

**Integration Verification:**

- **IV4.3.1**: Backend builds successfully with new TypeScript config
- **IV4.3.2**: `yarn lint` works correctly for backend with new ESLint config
- **IV4.3.3**: All backend tests continue to pass
- **IV4.3.4**: NestJS framework functionality remains unaffected
- **IV4.3.5**: VS Code/IDE TypeScript support works normally

#### **Story 4.4: Migrate Frontend to Use Shared Configuration Packages**

As a **frontend developer**, I want **the frontend application to use shared TypeScript and ESLint
configurations**, so that **configuration is consistent with backend while supporting React-specific
needs**.

**Acceptance Criteria:**

1. **AC4.4.1**: Update `apps/frontend/package.json` to include dependencies:
   - `@repo/typescript-config: "workspace:*"`
   - `@repo/eslint-config: "workspace:*"`
2. **AC4.4.2**: Replace `apps/frontend/tsconfig.json` to extend from shared config:

   ```json
   {
     "extends": "@repo/typescript-config/react.json",
     "compilerOptions": {
       "outDir": "./dist"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

3. **AC4.4.3**: Replace `apps/frontend/eslint.config.cjs` to extend from shared config
4. **AC4.4.4**: Preserve Astro and React specific configurations
5. **AC4.4.5**: Remove redundant configuration from frontend files

**Integration Verification:**

- **IV4.4.1**: Frontend builds successfully with new TypeScript config
- **IV4.4.2**: `yarn lint` works correctly for frontend with new ESLint config
- **IV4.4.3**: All frontend tests continue to pass
- **IV4.4.4**: Astro and React components compile correctly
- **IV4.4.5**: Development server starts and hot reloading works
- **IV4.4.6**: VS Code/IDE support works for React and Astro files

#### **Story 4.5: Update Root Configuration and Finalize Package Integration**

As a **developer working with monorepo tooling**, I want **root-level configurations updated to work
with shared packages**, so that **Turborepo orchestration and workspace commands work seamlessly**.

**Acceptance Criteria:**

1. **AC4.5.1**: Update root `package.json` workspace configuration to include `packages/*`
2. **AC4.5.2**: Update `turbo.json` to include package build dependencies:

   ```json
   {
     "pipeline": {
       "build": {
         "dependsOn": ["@repo/typescript-config#build", "@repo/eslint-config#build"]
       }
     }
   }
   ```

3. **AC4.5.3**: Create build scripts for configuration packages if needed
4. **AC4.5.4**: Update root README.md to document shared configuration packages
5. **AC4.5.5**: Verify dependency resolution works correctly across workspace

**Integration Verification:**

- **IV4.5.1**: `yarn build` builds all packages and applications in correct order
- **IV4.5.2**: `yarn lint` applies consistent rules across all applications
- **IV4.5.3**: `yarn test` runs all tests successfully
- **IV4.5.4**: Shared packages are properly discoverable by applications
- **IV4.5.5**: Docker builds work with new package structure

---

## **PRD Status: Story Breakdown Complete**

This PRD now contains comprehensive detailed story breakdowns for all 5 epics (Epic 0 + Epics 1-4),
including:

- **20 user stories** with clear value statements
- **100+ acceptance criteria** for detailed execution guidance
- **100+ integration verification** steps for brownfield safety
- **Risk-aware sequencing** with dependencies identified
- **Backward compatibility** considerations throughout

**Ready for Epic 0 (BMAD Setup) execution to begin the transformation process.**
