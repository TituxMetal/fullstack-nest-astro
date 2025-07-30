# Coding Standards

## Core Standards

- **Languages & Runtimes:** TypeScript 5.8.3+, Node.js 22.17.0 LTS
- **Style & Linting:** ESLint 9.27.0 with Prettier 3.5.3 (Epic 4: via shared packages)
- **Test Organization:** `*.spec.ts` files co-located with source files, TDD with AAA pattern

## Import Path Standards

**✅ Use ~/Path Alias (Current Excellent Pattern):**

```typescript
// ✅ CORRECT - Current approach maintained
import { ConfigService } from '~/config/config.service'
import { UserResponseDto } from '~/user/dto'
import { useAuthForm } from '~/hooks/useAuthForm'
import { authenticateUser } from '~/services/auth.service'

// Epic 2 Clean Architecture with ~/paths
import { AuthUser } from '~/contexts/auth/domain/entities/AuthUser.entity'
import { LoginUseCase } from '~/contexts/auth/application/useCases/LoginUseCase'

// Epic 3 Frontend reorganization with ~/paths
import { AuthForm } from '~/components/forms/AuthForm'
import { authSchema } from '~/lib/schemas/AuthSchema'
```

## Naming Conventions

| Element                        | Convention                             | Example                                       |
| ------------------------------ | -------------------------------------- | --------------------------------------------- |
| **Files**                      | CamelCase/PascalCase (current pattern) | `AuthUser.entity.ts`, `LoginUseCase.ts`       |
| **Domain Entities**            | PascalCase with context suffix         | `AuthUser`, `UserProfile`                     |
| **Use Cases**                  | PascalCase with UseCase suffix         | `LoginUseCase`, `UpdateProfileUseCase`        |
| **Repository Interfaces**      | PascalCase with Repository suffix      | `AuthUserRepository`, `UserProfileRepository` |
| **Repository Implementations** | PascalCase with provider prefix        | `PrismaAuthUserRepository`                    |
| **DTOs**                       | PascalCase with Dto suffix             | `LoginDto`, `UpdateUserDto`                   |

## Critical Rules

**Epic 2 Clean Architecture Rules:**

**Dependency Rule Enforcement:**

```typescript
// ✅ CORRECT - Domain layer using path alias
import { UserId } from '~/contexts/shared/domain/valueObjects/UserId'

// ❌ WRONG - Domain importing infrastructure
import { PrismaService } from '~/contexts/shared/infrastructure/database/PrismaService'
```

**Repository Pattern Compliance:**

```typescript
// ✅ CORRECT - Repository abstraction
const user = await this.userRepository.findById(id)

// ❌ WRONG - Direct Prisma usage in use case
const user = await this.prisma.user.findUnique({ where: { id } })
```

**Bounded Context Isolation:**

```typescript
// ✅ CORRECT - Each context uses its own path
import { AuthUser } from '~/contexts/auth/domain/entities/AuthUser.entity'

// ❌ WRONG - Cross-context direct imports
import { UserProfile } from '~/contexts/user/domain/entities/UserProfile.entity' // in auth context
```
