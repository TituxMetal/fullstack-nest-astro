# Backend Architecture: Clean Architecture + Domain-Driven Design

## Overview

This backend implements **Clean Architecture principles within Domain-Driven Design (DDD) Bounded
Contexts**. The architecture ensures business logic independence from infrastructure concerns while
organizing code around business domains.

## Clean Architecture Principles

### The Dependency Rule

**CRITICAL**: Dependencies always point inward. No inner layer should know about outer layers.

```treeview
Infrastructure → Application → Domain
```

- **Domain Layer**: Contains business logic, entities, value objects, and repository interfaces
- **Application Layer**: Contains use cases, application services, and DTOs
- **Infrastructure Layer**: Contains external concerns (controllers, repositories, database,
  external APIs)

### Layer Responsibilities

#### Domain Layer (`*/domain/`)

- **Entities**: Core business objects with behavior and identity
- **Value Objects**: Immutable objects representing concepts (Email, Password, etc.)
- **Repository Interfaces**: Contracts for data access (no implementation)
- **Domain Services**: Business logic that doesn't belong to a single entity
- **Domain Events**: Business events for future implementation

**Rules:**

- ✅ NO dependencies on outer layers
- ✅ Contains pure business logic
- ✅ Framework-agnostic
- ✅ Highly testable

#### Application Layer (`*/application/`)

- **Use Cases**: Orchestrate business workflows (LoginUseCase, UpdateProfileUseCase)
- **Application Services**: Coordinate between use cases and infrastructure
- **DTOs**: Data transfer objects for application boundaries
- **Interfaces**: Application-specific contracts

**Rules:**

- ✅ May depend on Domain layer
- ✅ NO dependencies on Infrastructure layer
- ✅ Orchestrates business logic
- ✅ Framework-agnostic

#### Infrastructure Layer (`*/infrastructure/`)

- **Controllers**: HTTP request/response handling (NestJS controllers)
- **Repository Implementations**: Data access implementations (Prisma)
- **Adapters**: External service integrations
- **Mappers**: Convert between domain and persistence models
- **Configuration**: Framework-specific setup

**Rules:**

- ✅ May depend on Application and Domain layers
- ✅ Contains framework-specific code
- ✅ Handles external concerns

## Domain-Driven Design Implementation

### Bounded Contexts

The backend is organized into three bounded contexts, each representing a distinct business area:

#### Auth Context (`contexts/auth/`)

**Responsibility**: Authentication and authorization

**Business Domain**:

- User registration and login
- Password management
- Account status validation (confirmed, blocked)
- JWT token generation and validation

**Data Model**: Uses `id`, `email`, `username`, `hash`, `confirmed`, `blocked`, `createdAt` from
User table

**Key Entities**:

- `AuthUser`: Represents a user from authentication perspective
- `Email`, `Password`: Value objects ensuring validation

#### User Context (`contexts/user/`)

**Responsibility**: User profile management

**Business Domain**:

- Profile viewing and editing
- User information management
- Profile updates and validation

**Data Model**: Uses `id`, `email`, `username`, `firstName`, `lastName`, `createdAt`, `updatedAt`
from User table

**Key Entities**:

- `UserProfile`: Represents a user from profile management perspective
- `FullName`: Value object for name handling

#### Shared Context (`contexts/shared/`)

**Responsibility**: Cross-cutting concerns and common utilities

**Business Domain**:

- Common value objects
- Shared infrastructure services
- Cross-context utilities

**Key Components**:

- Common value objects (`UserId`, etc.)
- Database services (Prisma)
- Configuration services
- Validation utilities

### Context Isolation

**Important**: Each bounded context maintains its own view of the data:

- **Same Database Table**: Both Auth and User contexts use the Prisma `User` model
- **Different Domain Models**: Each context creates its own domain entities with relevant fields
- **Context-Specific Behavior**: Each entity contains behavior specific to its context

Example:

```typescript
// Auth Context
class AuthUser {
  constructor(
    private id: UserId,
    private email: Email,
    private username: Username,
    private password: Password,
    private confirmed: boolean,
    private blocked: boolean
  ) {}

  login(password: string): boolean {
    return this.password.verify(password) && this.isActive()
  }

  isActive(): boolean {
    return this.confirmed && !this.blocked
  }
}

// User Context
class UserProfile {
  constructor(
    private id: UserId,
    private email: Email,
    private username: Username,
    private firstName?: string,
    private lastName?: string
  ) {}

  updateProfile(data: ProfileUpdateData): void {
    // Profile-specific validation and updates
  }

  getDisplayName(): string {
    return this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : this.username
  }
}
```

## Directory Structure

```treeview
apps/backend/src/contexts/
├── auth/                    # Authentication bounded context
│   ├── domain/             # Auth business logic
│   ├── application/        # Auth use cases
│   └── infrastructure/     # Auth controllers & repos
├── user/                    # User profile bounded context
│   ├── domain/             # User business logic
│   ├── application/        # User use cases
│   └── infrastructure/     # User controllers & repos
└── shared/                  # Cross-cutting concerns
    ├── domain/             # Common domain objects
    └── infrastructure/     # Shared infrastructure
```

## Implementation Patterns

### Repository Pattern

**Domain Layer** defines interfaces:

```typescript
// contexts/auth/domain/repositories/AuthRepository.ts
export interface AuthRepository {
  findByEmail(email: Email): Promise<AuthUser | null>
  findByUsername(username: Username): Promise<AuthUser | null>
  save(user: AuthUser): Promise<void>
}
```

**Infrastructure Layer** provides implementations:

```typescript
// contexts/auth/infrastructure/repositories/PrismaAuthRepository.ts
export class PrismaAuthRepository implements AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: Email): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value }
    })
    return user ? AuthUserMapper.toDomain(user) : null
  }
}
```

### Use Case Pattern

```typescript
// contexts/auth/application/useCases/LoginUseCase.ts
export class LoginUseCase {
  constructor(
    private authRepository: AuthRepository,
    private tokenService: TokenService
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    const user = await this.authRepository.findByEmail(new Email(email))

    if (!user || !user.login(password)) {
      throw new InvalidCredentialsException()
    }

    const token = this.tokenService.generateToken(user.id)
    return new LoginResult(token, user)
  }
}
```

### Dependency Injection (NestJS)

```typescript
// contexts/auth/infrastructure/AuthModule.ts
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginUseCase,
    {
      provide: 'AuthRepository',
      useClass: PrismaAuthRepository
    }
  ]
})
export class AuthModule {}
```

## Migration Strategy

This architecture exists **alongside** the current code structure. The migration will be
incremental:

1. **Phase 1** (Current Story): Directory structure and templates created
2. **Phase 2** (Future Stories): Gradually move existing modules into Clean Architecture
3. **Phase 3** (Future Stories): Remove old structure once migration complete

**Zero Breaking Changes**: All existing endpoints and functionality remain intact during migration.

## Testing Strategy

### Domain Layer Testing

- Pure unit tests (no frameworks)
- Test business logic in isolation
- High coverage through TDD

### Application Layer Testing

- Test use case orchestration
- Mock repository interfaces
- Verify business workflows

### Infrastructure Layer Testing

- Integration tests with actual database
- Test framework-specific implementations
- Verify data mapping and persistence

## Key Benefits

1. **Business Logic Independence**: Domain layer has no framework dependencies
2. **Testability**: Each layer can be tested in isolation
3. **Flexibility**: Easy to change databases, frameworks, or external services
4. **Maintainability**: Clear separation of concerns
5. **Domain Focus**: Code organized around business concepts
6. **Incremental Migration**: Can be adopted gradually without breaking changes

## Next Steps

1. Create template files for each layer
2. Implement first use case following Clean Architecture
3. Gradually migrate existing modules
4. Establish testing patterns for each layer
5. Document specific implementation patterns as they emerge

This architecture provides a solid foundation for long-term maintainability while supporting the
BMAD-driven development process.
