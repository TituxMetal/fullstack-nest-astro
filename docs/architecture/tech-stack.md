# Tech Stack

## Cloud Infrastructure

- **Provider:** Self-hosted (Debian 12 server)
- **Key Services:** Docker containers, local networking, Portainer management, NginxProxyManager
- **Deployment Regions:** Single server deployment

## Technology Stack Table

| Category                   | Technology              | Version            | Purpose                      | Rationale                                                                             |
| -------------------------- | ----------------------- | ------------------ | ---------------------------- | ------------------------------------------------------------------------------------- |
| **Runtime**                | Node.js                 | 22.17.0            | JavaScript runtime           | Latest LTS version, optimal performance, long-term support                            |
| **Language**               | TypeScript              | 5.8.3+             | Primary development language | Strong typing, excellent tooling, team expertise, already using latest stable         |
| **Package Manager**        | Yarn                    | 4.9.1              | Dependency management        | Workspaces support, performance, already configured                                   |
| **Monorepo**               | Turborepo               | 2.5.3              | Task orchestration           | Build caching, parallel execution, monorepo optimization                              |
| **Backend Framework**      | NestJS                  | 11.1.1             | API framework                | Enterprise-ready, dependency injection, TypeScript-first, Clean Architecture friendly |
| **Frontend Framework**     | Astro                   | 5.8.0              | Meta-framework               | SSR/SSG capabilities, component flexibility, performance-focused                      |
| **UI Library**             | React                   | 19.1.0             | Component library            | Rich ecosystem, team familiarity, Astro integration                                   |
| **Database**               | SQLite                  | Latest             | Development database         | Lightweight, zero-config, file-based                                                  |
| **Future Database**        | PostgreSQL              | 15+                | Production database          | ACID compliance, scalability, enterprise features                                     |
| **ORM**                    | Prisma                  | 6.8.2              | Database toolkit             | Type-safe queries, migrations, excellent DX                                           |
| **Authentication**         | JWT + Cookies           | @nestjs/jwt 11.0.0 | Auth mechanism               | Secure, stateless, HTTP-only cookie storage                                           |
| **Password Hashing**       | Argon2                  | 0.43.0             | Password security            | Modern, secure, winner of password hashing competition                                |
| **Validation**             | Zod                     | 3.25.23            | Schema validation            | TypeScript-first, runtime safety, frontend validation                                 |
| **Backend Validation**     | class-validator         | Latest             | DTO validation               | NestJS integration, decorator-based, server-side validation                           |
| **Form Management**        | React Hook Form         | 7.56.4             | Form state                   | Performance, minimal re-renders, excellent DX                                         |
| **Styling**                | TailwindCSS             | 4.1.7              | CSS framework                | Utility-first, performance, design system consistency                                 |
| **Testing (Backend)**      | Jest                    | 29.7.0             | Unit/integration testing     | Mature ecosystem, mocking capabilities, NestJS integration                            |
| **Testing (Frontend)**     | Vitest                  | 3.1.4              | Unit testing                 | Fast, Vite integration, Jest-compatible API                                           |
| **Testing Utils**          | React Testing Library   | 16.3.0             | Component testing            | Best practices, accessibility-focused, user-centric                                   |
| **Containerization**       | Docker                  | Latest             | Deployment                   | Consistent environments, isolation, Debian 12 compatibility                           |
| **Linting**                | ESLint                  | 9.27.0             | Code quality                 | Code consistency, error prevention                                                    |
| **Formatting**             | Prettier                | 3.5.3              | Code formatting              | Consistent code style, automated formatting                                           |
| **Type Checking**          | TypeScript Compiler     | 5.8.3+             | Static analysis              | Compile-time error detection, IDE support                                             |
| **Shared Config (TS)**     | @repo/typescript-config | workspace:\*       | Centralized TS config        | Epic 4 requirement, consistency across apps                                           |
| **Shared Config (ESLint)** | @repo/eslint-config     | workspace:\*       | Centralized linting          | Epic 4 requirement, unified code standards                                            |

**Database Evolution Strategy:**

- **Phase 1**: Continue with SQLite for development and initial deployment
- **Phase 2**: PostgreSQL migration when scaling requirements justify the complexity
- **Prisma Schema**: Design to be database-agnostic from the start
