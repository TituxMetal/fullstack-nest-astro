# Source Tree

## Target Project Structure (Post-Epic Implementation)

```plaintext
project-root/
├── apps/                                    # Epic 1: Deployable applications
│   ├── backend/                            # NestJS API application
│   │   ├── src/
│   │   │   ├── auth/                       # Epic 2: Auth Module (Clean Architecture)
│   │   │   │   ├── Auth.module.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── AuthUser.entity.ts
│   │   │   │   │   ├── exceptions/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── InvalidCredentials.exception.ts
│   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── Email.vo.ts
│   │   │   │   │   │   └── Password.vo.ts
│   │   │   │   │   └── repositories/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── AuthUser.repository.ts
│   │   │   │   ├── application/
│   │   │   │   │   ├── use-cases/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── Login.uc.ts
│   │   │   │   │   │   ├── Register.uc.ts
│   │   │   │   │   │   └── Logout.uc.ts
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── Auth.service.ts
│   │   │   │   │   ├── dtos/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── Login.dto.ts
│   │   │   │   │   │   └── Register.dto.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── AuthUser.mapper.ts
│   │   │   │   │   └── exceptions/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── ApplicationError.exception.ts
│   │   │   │   └── infrastructure/
│   │   │   │       ├── controllers/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── Auth.controller.ts
│   │   │   │       ├── repositories/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── PrismaAuthUser.repository.ts
│   │   │   │       ├── mappers/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── AuthUser.mapper.ts
│   │   │   │       ├── services/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   ├── Jwt.service.ts
│   │   │   │       │   └── Password.service.ts
│   │   │   │       ├── filters/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── HttpException.filter.ts
│   │   │   │       ├── interceptors/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── Response.interceptor.ts
│   │   │   │       └── guards/
│   │   │   │           ├── index.ts
│   │   │   │           └── JwtAuth.guard.ts
│   │   │   ├── users/                      # User Module (Clean Architecture)
│   │   │   │   ├── Users.module.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── User.entity.ts
│   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── UserProfile.vo.ts
│   │   │   │   │   │   └── ContactInfo.vo.ts
│   │   │   │   │   └── repositories/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── User.repository.ts
│   │   │   │   ├── application/
│   │   │   │   │   ├── use-cases/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── GetUserProfile.uc.ts
│   │   │   │   │   │   └── UpdateUserProfile.uc.ts
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── User.service.ts
│   │   │   │   │   ├── dtos/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── UpdateUser.dto.ts
│   │   │   │   │   │   └── UserResponse.dto.ts
│   │   │   │   │   └── mappers/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── User.mapper.ts
│   │   │   │   └── infrastructure/
│   │   │   │       ├── controllers/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── User.controller.ts
│   │   │   │       ├── repositories/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── PrismaUser.repository.ts
│   │   │   │       └── mappers/
│   │   │   │           ├── index.ts
│   │   │   │           └── User.mapper.ts
│   │   │   ├── shared/                     # Shared Module
│   │   │   │   ├── Shared.module.ts
│   │   │   │   ├── domain/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── Base.entity.ts
│   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── UserId.vo.ts
│   │   │   │   │   ├── exceptions/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── Domain.exception.ts
│   │   │   │   │   │   └── NotFound.exception.ts
│   │   │   │   │   └── repositories/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── Base.repository.ts
│   │   │   │   ├── application/
│   │   │   │   │   ├── use-cases/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── dtos/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── mappers/
│   │   │   │   │       └── index.ts
│   │   │   │   └── infrastructure/
│   │   │   │       ├── controllers/
│   │   │   │       │   └── index.ts
│   │   │   │       ├── repositories/
│   │   │   │       │   └── index.ts
│   │   │   │       ├── services/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   ├── Prisma.service.ts
│   │   │   │       │   ├── Config.service.ts
│   │   │   │       │   └── Cache.service.ts
│   │   │   │       ├── filters/
│   │   │   │       │   └── index.ts
│   │   │   │       ├── interceptors/
│   │   │   │       │   ├── index.ts
│   │   │   │       │   └── Serialization.interceptor.ts
│   │   │   │       └── guards/
│   │   │   │           └── index.ts
│   │   │   ├── App.module.ts               # Root application module
│   │   │   └── main.ts                     # Application entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma               # Database schema (unchanged)
│   │   │   └── migrations/                 # Database migrations
│   │   ├── test/                           # E2E tests
│   │   ├── package.json                    # Epic 4: Uses shared configs
│   │   ├── tsconfig.json                   # Extends @repo/typescript-config
│   │   └── eslint.config.cjs               # Extends @repo/eslint-config
│   │
│   └── frontend/                           # Astro + React application
│       ├── src/
│       │   ├── components/                 # Epic 3: Component-type organization
│       │   │   ├── forms/                  # Form components
│       │   │   │   ├── AuthForm.tsx
│       │   │   │   ├── EditProfileForm.tsx
│       │   │   │   └── index.ts
│       │   │   ├── icons/                  # Icon components
│       │   │   │   ├── BackIcon.tsx
│       │   │   │   ├── CoffeeIcon.tsx
│       │   │   │   ├── CopyLeftIcon.tsx
│       │   │   │   ├── HeartIcon.tsx
│       │   │   │   └── index.ts
│       │   │   ├── layouts/                # Layout components
│       │   │   │   ├── Main.astro
│       │   │   │   └── index.ts
│       │   │   └── ui/                     # Base UI components
│       │   │       ├── Button.tsx
│       │   │       ├── Input.tsx
│       │   │       └── index.ts
│       │   ├── lib/                        # Epic 3: Shared utilities
│       │   │   ├── schemas/                # Zod validation schemas
│       │   │   │   ├── AuthSchema.ts
│       │   │   │   ├── UserSchema.ts
│       │   │   │   └── index.ts
│       │   │   ├── types/                  # TypeScript types
│       │   │   │   ├── ApiTypes.ts
│       │   │   │   ├── AuthTypes.ts
│       │   │   │   ├── UserTypes.ts
│       │   │   │   └── index.ts
│       │   │   └── utils/                  # Utility functions
│       │   │       ├── Navigation.ts
│       │   │       ├── Routes.ts
│       │   │       └── index.ts
│       │   ├── hooks/                      # React hooks
│       │   │   └── useAuthForm.tsx
│       │   ├── pages/                      # Astro pages
│       │   │   ├── auth.astro
│       │   │   ├── index.astro
│       │   │   ├── logout.astro
│       │   │   └── profile.astro
│       │   ├── services/                   # API services
│       │   │   ├── ApiService.ts
│       │   │   ├── AuthService.ts
│       │   │   └── UserService.ts
│       │   ├── styles/                     # Global styles
│       │   │   └── globals.css
│       │   └── middleware.ts               # Astro middleware
│       ├── public/                         # Static assets
│       │   └── favicon.svg
│       ├── tests/                          # Frontend tests
│       ├── package.json                    # Epic 4: Uses shared configs
│       ├── tsconfig.json                   # Extends @repo/typescript-config
│       └── eslint.config.cjs               # Extends @repo/eslint-config
│
├── packages/                               # Epic 4: Shared packages
│   ├── typescript-config/                 # Shared TypeScript configurations
│   │   ├── package.json
│   │   ├── base.json                       # Base TypeScript config
│   │   ├── node.json                       # Node.js specific config
│   │   ├── react.json                      # React/browser specific config
│   │   └── README.md
│   │
│   └── eslint-config/                      # Shared ESLint configurations
│       ├── package.json
│       ├── base.js                         # Base ESLint config
│       ├── node.js                         # Node.js specific config
│       ├── react.js                        # React specific config
│       └── README.md
│
├── docker/                                 # Epic 1: Updated paths
│   ├── Dockerfile.backend                  # References apps/backend
│   ├── Dockerfile.frontend                 # References apps/frontend
│   ├── compose.yaml                        # Production deployment (Portainer)
│   └── start.sh                            # Build scripts
│
├── docs/                                   # Documentation
│   ├── prd.md                             # Project requirements
│   └── architecture.md                    # This document
│
├── package.json                           # Epic 1: Updated workspaces
├── turbo.json                             # Epic 1: Updated pipeline paths
├── yarn.lock                              # Lockfile
└── README.md                              # Root documentation
```

**Key Organizational Principles:**

- **~/Path Aliases**: All imports use `~/` path alias pattern (existing excellent approach)
- **CamelCase Naming**: All file names use CamelCase/PascalCase (existing pattern)
- **Clean Architecture Layers**: Domain → Application → Infrastructure within each bounded context
- **Component-Type Organization**: Frontend organized by component function rather than feature
