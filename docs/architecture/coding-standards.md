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
import { AuthUserEntity } from '~/auth/domain/entities'
import { LoginUseCase } from '~/auth/application/use-cases'

// Epic 3 Frontend reorganization with ~/paths
import { AuthForm } from '~/components/forms/AuthForm'
import { authSchema } from '~/lib/schemas/AuthSchema'
```

## Naming Conventions

| Element                        | Convention                                   | Example                                 |
| ------------------------------ | -------------------------------------------- | --------------------------------------- |
| **Files**                      | CamelCase + component suffix (singular)      | `AuthUser.entity.ts`, `Login.uc.ts`     |
| **Folders**                    | kebab-case (plural for multi-word)           | `use-cases/`, `value-objects/`, `dtos/` |
| **Classes**                    | PascalCase with full component type          | `UserEntity`, `EmailValueObject`        |
| **Interfaces**                 | PascalCase with 'I' prefix                   | `IUserRepository`, `IAuthService`       |
| **Domain Entities**            | PascalCase + Entity class suffix             | `export class UserEntity`               |
| **Value Objects**              | PascalCase + ValueObject class suffix        | `export class EmailValueObject`         |
| **Use Cases**                  | PascalCase + UseCase class suffix            | `export class LoginUseCase`             |
| **Repository Interfaces**      | 'I' prefix + PascalCase + Repository         | `export interface IUserRepository`      |
| **Repository Implementations** | PascalCase with provider prefix + Repository | `export class PrismaUserRepository`     |
| **DTOs**                       | PascalCase + Dto class suffix                | `export class LoginDto`                 |
| **Services**                   | PascalCase + Service class suffix            | `export class AuthService`              |
| **Exceptions**                 | PascalCase + Exception class suffix          | `export class NotFoundException`        |

## File Naming Standards

**Component-based naming with compact suffixes:**

- Entities: `{Name}.entity.ts` (e.g., `AuthUser.entity.ts`)
- Value Objects: `{Name}.vo.ts` (e.g., `Email.vo.ts`)
- Use Cases: `{Name}.uc.ts` (e.g., `Login.uc.ts`)
- DTOs: `{Name}.dto.ts` (e.g., `Login.dto.ts`)
- Services: `{Name}.service.ts` (e.g., `Auth.service.ts`)
- Controllers: `{Name}.controller.ts` (e.g., `Auth.controller.ts`)
- Repositories: `{Name}.repository.ts` (e.g., `AuthUser.repository.ts`)
- Mappers: `{Name}.mapper.ts` (e.g., `AuthUser.mapper.ts`)
- Exceptions: `{Name}.exception.ts` (e.g., `NotFound.exception.ts`)
- Guards: `{Name}.guard.ts` (e.g., `JwtAuth.guard.ts`)
- Filters: `{Name}.filter.ts` (e.g., `HttpException.filter.ts`)
- Interceptors: `{Name}.interceptor.ts` (e.g., `Response.interceptor.ts`)

**Barrel Files:**

- Every sub-folder in each layer MUST have an `index.ts` barrel file
- Barrel files export all public components from that folder
- Simplifies imports and reduces circular dependencies

## Critical Rules

**Epic 2 Clean Architecture Rules:**

**Dependency Rule Enforcement:**

```typescript
// ✅ CORRECT - Domain layer using barrel imports
import { UserIdValueObject } from '~/shared/domain/value-objects'

// ❌ WRONG - Domain importing infrastructure
import { PrismaService } from '~/shared/infrastructure/services'
```

**Repository Pattern Compliance:**

```typescript
// ✅ CORRECT - Repository abstraction with interface
export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<UserEntity> {
    return await this.userRepository.findByEmail(email)
  }
}

// ❌ WRONG - Direct Prisma usage in use case
export class LoginUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } })
  }
}
```

**Module Isolation:**

```typescript
// ✅ CORRECT - Using barrel imports from own module
import { AuthUserEntity } from '~/auth/domain/entities'
import { IAuthUserRepository } from '~/auth/domain/repositories'

// ❌ WRONG - Direct cross-module imports (use shared module instead)
import { UserEntity } from '~/users/domain/entities' // in auth module
```
