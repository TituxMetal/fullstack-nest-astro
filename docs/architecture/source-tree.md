# Source Tree

## Target Project Structure (Post-Epic Implementation)

```plaintext
project-root/
├── apps/                                    # Epic 1: Deployable applications
│   ├── backend/                            # NestJS API application
│   │   ├── src/
│   │   │   ├── contexts/                   # Epic 2: Clean Architecture + DDD
│   │   │   │   ├── auth/                   # Auth Bounded Context
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   └── AuthUser.entity.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   └── AuthUserRepository.ts
│   │   │   │   │   │   └── valueObjects/
│   │   │   │   │   │       ├── Email.ts
│   │   │   │   │   │       └── Password.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── useCases/
│   │   │   │   │   │   │   ├── LoginUseCase.ts
│   │   │   │   │   │   │   ├── RegisterUseCase.ts
│   │   │   │   │   │   │   └── LogoutUseCase.ts
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   │   ├── LoginDto.ts
│   │   │   │   │   │   │   └── RegisterDto.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── AuthApplicationService.ts
│   │   │   │   │   └── infrastructure/
│   │   │   │   │       ├── controllers/
│   │   │   │   │       │   └── AuthController.ts
│   │   │   │   │       ├── repositories/
│   │   │   │   │       │   └── PrismaAuthUserRepository.ts
│   │   │   │   │       └── adapters/
│   │   │   │   │           ├── JwtAdapter.ts
│   │   │   │   │           └── PasswordAdapter.ts
│   │   │   │   ├── user/                   # User Bounded Context
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   └── UserProfile.entity.ts
│   │   │   │   │   │   └── repositories/
│   │   │   │   │   │       └── UserProfileRepository.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── useCases/
│   │   │   │   │   │   │   ├── GetUserProfileUseCase.ts
│   │   │   │   │   │   │   └── UpdateUserProfileUseCase.ts
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   │   ├── UpdateUserDto.ts
│   │   │   │   │   │   │   └── UserResponseDto.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── UserApplicationService.ts
│   │   │   │   │   └── infrastructure/
│   │   │   │   │       ├── controllers/
│   │   │   │   │       │   └── UserController.ts
│   │   │   │   │       ├── repositories/
│   │   │   │   │       │   └── PrismaUserProfileRepository.ts
│   │   │   │   │       └── mappers/
│   │   │   │   │           └── UserProfileMapper.ts
│   │   │   │   └── shared/                 # Shared Context
│   │   │   │       ├── domain/
│   │   │   │       │   ├── valueObjects/
│   │   │   │       │   │   ├── UserId.ts
│   │   │   │       │   │   └── BaseEntity.ts
│   │   │   │       │   └── exceptions/
│   │   │   │       │       ├── DomainException.ts
│   │   │   │       │       └── NotFoundException.ts
│   │   │   │       └── infrastructure/
│   │   │   │           ├── database/
│   │   │   │           │   ├── PrismaService.ts
│   │   │   │           │   └── PrismaModule.ts
│   │   │   │           ├── config/
│   │   │   │           │   ├── ConfigService.ts
│   │   │   │           │   └── ConfigModule.ts
│   │   │   │           └── validation/
│   │   │   │               ├── ValidationPipe.ts
│   │   │   │               └── SerializationInterceptor.ts
│   │   │   ├── AppModule.ts               # Root application module
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
