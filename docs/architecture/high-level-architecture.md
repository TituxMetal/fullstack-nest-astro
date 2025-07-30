# High Level Architecture

## Technical Summary

The system follows a **Turborepo monorepo architecture** with clear separation between deployable
applications (`apps/`) and reusable packages (`packages/`). The backend implements **Clean
Architecture principles within Domain-Driven Design (DDD) Bounded Contexts**, ensuring business
logic independence from infrastructure concerns. The frontend adopts a **component-type-based
organization** with Astro's hybrid SSR/SPA approach for optimal performance. **Shared configuration
packages** enforce consistency across all applications, while **Docker containerization** enables
scalable deployment. This architecture directly supports the PRD's goals of long-term
maintainability, developer experience optimization, and systematic BMAD-driven development
processes.

## High Level Overview

**Architectural Style**: **Modular Monorepo with Clean Architecture + DDD**

- **Repository Structure**: Monorepo (Turborepo + Yarn Workspaces) transitioning to `apps/` and
  `packages/` separation
- **Service Architecture**: Logical service separation within monorepo (Auth Context, User Context,
  Shared Context)
- **Primary User Flow**:
  1. User accesses Astro frontend (SSR for initial load, hydrated React components for
     interactivity)
  2. Authentication via JWT HTTP-only cookies
  3. API calls routed through Astro proxy to NestJS backend
  4. Backend processes requests through Clean Architecture layers (Controller → Use Case → Domain →
     Repository)
  5. Data persistence via Prisma ORM to SQLite database

**Key Architectural Decisions**:

- **Clean Architecture + DDD**: Separates business logic from infrastructure, organized by bounded
  contexts
- **Monorepo Structure**: Apps and packages separation for clear distinction between deployable and
  reusable code
- **Component-Type Organization**: Frontend organized by component function rather than feature for
  better reusability
- **Shared Configuration**: Centralized TypeScript and ESLint configs via workspace packages
- **Cookie-Based Authentication**: HTTP-only cookies for enhanced security over localStorage JWT
  storage

## Architectural and Design Patterns

**Domain-Driven Design (DDD) with Bounded Contexts**

- **Pattern**: Organize backend code by business domains (Auth, User, Shared) rather than technical
  layers
- **Rationale**: Aligns code structure with business concepts, reduces coupling between domains,
  enables independent evolution of business logic

**Clean Architecture Layers**

- **Pattern**: Domain → Application → Infrastructure dependency flow within each bounded context
- **Rationale**: Ensures business logic independence from frameworks and external concerns, enables
  easier testing and technology changes

**Component-Type Organization (Frontend)**

- **Pattern**: Organize React components by functional type (forms/, icons/, layouts/, ui/) rather
  than by feature
- **Rationale**: Improves component reusability across features, reduces duplication, makes
  components easier to locate and maintain

**Repository Pattern with Interface Segregation**

- **Pattern**: Abstract data access behind interfaces in domain layer, implement in infrastructure
  layer
- **Rationale**: Enables easy testing with mocks, supports future database technology changes,
  maintains Clean Architecture principles

**Shared Configuration via Workspace Packages**

- **Pattern**: Centralize TypeScript and ESLint configurations in dedicated packages
  (`@repo/typescript-config`, `@repo/eslint-config`)
- **Rationale**: Enforces consistency across all applications, leverages monorepo structure, reduces
  configuration drift

**Hybrid SSR/SPA with Astro**

- **Pattern**: Server-side render initial page load, hydrate with React for client-side
  interactivity
- **Rationale**: Optimal performance (fast initial load) while maintaining rich user experience, SEO
  benefits

**JWT with HTTP-Only Cookies**

- **Pattern**: Store authentication tokens in secure HTTP-only cookies rather than localStorage
- **Rationale**: Enhanced security against XSS attacks, automatic cookie handling, better mobile app
  integration potential
