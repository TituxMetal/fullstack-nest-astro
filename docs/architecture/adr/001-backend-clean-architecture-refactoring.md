# ADR-001: Backend Clean Architecture Refactoring Strategy

## Status

**Proposed** - 2025-09-02

## Context

The recent refactoring of the Auth module to Clean Architecture (Story 2.2) has revealed significant
architectural inconsistencies across the backend. While Auth now follows Clean Architecture and DDD
principles, the remaining modules use various patterns that violate core architectural principles,
creating technical debt that will compound as the system grows.

### Current State Analysis

| Module     | Pattern            | Issues                                                                                       | Risk Level  |
| ---------- | ------------------ | -------------------------------------------------------------------------------------------- | ----------- |
| **Auth**   | Clean Architecture | None (recently refactored)                                                                   | ✅ Low      |
| **User**   | Traditional MVC    | • No domain layer• Direct Prisma dependency• Mixing auth concerns• No repository abstraction | 🔴 High     |
| **Token**  | Utility Service    | • Should be part of Auth• Direct Prisma access• No domain concepts                           | 🔴 Critical |
| **Prisma** | Direct ORM         | • No abstraction layer• All modules depend directly• No unit of work pattern                 | 🔴 High     |
| **Config** | Mixed Service      | • Contains business logic• Auth cookie logic• Mixed responsibilities                         | 🟡 Medium   |
| **Shared** | Dumping Ground     | • No clear ownership• Mixed concerns• Anti-pattern                                           | 🟡 Medium   |

### Problems Identified

1. **Bounded Context Violations**: User and Auth contexts directly access each other's data through
   shared Prisma models
2. **Dependency Inversion Violations**: Direct dependencies on Prisma throughout the codebase
3. **Single Responsibility Violations**: Modules handling multiple unrelated concerns
4. **No Domain Isolation**: Infrastructure concerns mixed with business logic
5. **Missing Abstractions**: No repository pattern, no interfaces for external dependencies
6. **Cross-cutting Concerns**: Scattered across modules with no clear organization

### Impact if Not Addressed

- **Short-term (3 months)**: Increased development friction, harder to test, more bugs
- **Medium-term (6 months)**: Unable to change database, difficult to add new features, performance
  issues
- **Long-term (12 months)**: Complete architectural breakdown, potential rewrite needed

## Decision

We will refactor all backend modules to follow Clean Architecture and Domain-Driven Design
principles, using the successfully refactored Auth module as a template.

### Target Architecture

```treeview
apps/api/src/
├── [bounded-contexts]/          # Auth, User, Tasks, etc.
│   ├── {Context}.module.ts     # NestJS module configuration
│   ├── domain/                 # Business logic layer
│   │   ├── entities/           # Domain entities
│   │   ├── value-objects/      # Value objects
│   │   ├── repositories/       # Repository interfaces
│   │   └── exceptions/         # Domain exceptions
│   ├── application/            # Use case layer
│   │   ├── use-cases/          # Business operations
│   │   ├── services/           # Application services
│   │   ├── dtos/               # Data transfer objects
│   │   └── mappers/            # DTO <> Domain mappers
│   └── infrastructure/         # External concerns
│       ├── controllers/        # HTTP endpoints
│       ├── repositories/       # Repository implementations
│       ├── services/           # External services
│       ├── guards/             # Authentication/authorization
│       └── mappers/            # Persistence <> Domain mappers
│
└── shared/                     # Shared Kernel (minimal)
    ├── domain/                 # Shared domain concepts
    │   ├── value-objects/      # Common VOs (Email, Money, etc.)
    │   └── exceptions/         # Base exception classes
    ├── application/            # Shared application layer
    │   └── interfaces/         # Common interfaces
    └── infrastructure/         # Shared infrastructure
        ├── database/           # Database configuration
        │   ├── prisma/         # Prisma client and migrations
        │   └── repositories/   # Base repository implementations
        ├── config/             # Application configuration
        └── http/               # HTTP utilities
            ├── interceptors/   # Global interceptors
            └── decorators/     # Custom decorators
```

### Refactoring Phases

#### Phase 1: Infrastructure Foundation (Sprint 3)

**Priority: CRITICAL**

- Move Prisma to `shared/infrastructure/database`
- Create `IRepository<T>` base interface
- Implement `BaseRepository<T>` with common CRUD operations
- Create unit of work pattern implementation
- **Deliverable**: All new features can use repository pattern

#### Phase 2: Token Module Dissolution (Sprint 3)

**Priority: CRITICAL**

- Move token logic to `auth/infrastructure/services/Token.service.ts`
- Update all imports and dependencies
- Remove token module completely
- **Deliverable**: Token module no longer exists

#### Phase 3: User Module Refactoring (Sprint 4)

**Priority: HIGH**

- Create domain layer with `UserEntity` (profile data only)
- Implement use cases: `GetUserUseCase`, `UpdateProfileUseCase`, `ListUsersUseCase`
- Remove password handling (belongs to Auth)
- Implement repository pattern
- **Deliverable**: User module follows Clean Architecture

#### Phase 4: Config Module Reorganization (Sprint 4)

**Priority: MEDIUM**

- Move auth-specific config to `auth/infrastructure/config`
- Move user-specific config to `user/infrastructure/config`
- Keep only app-level config in shared
- Remove all business logic from config
- **Deliverable**: Config is pure configuration

#### Phase 5: Shared Module Cleanup (Sprint 5)

**Priority: MEDIUM**

- Audit all shared components
- Move domain-specific items to respective contexts
- Keep only true shared kernel items
- Document ownership and usage
- **Deliverable**: Minimal, well-organized shared kernel

### Migration Strategy

1. **Parallel Implementation**: New features use new architecture, old features migrated
   incrementally
2. **Interface Compatibility**: Maintain existing API contracts during migration
3. **Test Coverage**: Write tests before refactoring, ensure they pass after
4. **Feature Flags**: Use flags to switch between old and new implementations
5. **Gradual Rollout**: Deploy refactored modules one at a time

## Consequences

### Positive

- **Maintainability**: Clear separation of concerns, easier to understand and modify
- **Testability**: Each layer can be tested independently with proper mocking
- **Flexibility**: Can change database, add caching, modify business rules without ripple effects
- **Scalability**: Can split into microservices if needed in future
- **Developer Experience**: Consistent patterns across all modules
- **Domain Integrity**: Business logic protected from infrastructure changes

### Negative

- **Initial Complexity**: More files and folders, steeper learning curve
- **Development Time**: 4-6 weeks of refactoring effort
- **Risk**: Potential for introducing bugs during refactoring
- **Team Training**: Developers need to understand Clean Architecture and DDD

### Risks and Mitigation

| Risk                            | Probability | Impact | Mitigation                                         |
| ------------------------------- | ----------- | ------ | -------------------------------------------------- |
| Breaking existing functionality | Medium      | High   | Comprehensive test coverage before refactoring     |
| Team resistance to complexity   | Medium      | Medium | Training sessions, pair programming, documentation |
| Delayed feature delivery        | High        | Medium | Parallel tracks: refactoring + new features        |
| Over-engineering                | Low         | Low    | Regular architecture reviews, pragmatic decisions  |

## Alternatives Considered

### 1. Status Quo

**Keep current mixed architecture**

- ❌ Technical debt will compound
- ❌ Harder to maintain over time
- ❌ Team already struggling with current structure

### 2. Complete Rewrite

**Start fresh with new architecture**

- ❌ Too risky for production system
- ❌ Would halt feature development
- ❌ Loss of domain knowledge in existing code

### 3. Modular Monolith

**Split into separate apps but keep monorepo**

- ✅ Could work but more complex
- ❌ Premature optimization
- ❌ Can migrate to this later if needed

### 4. Selective Refactoring

**Only refactor User module, leave others**

- ❌ Inconsistent architecture
- ❌ Token module critically flawed
- ❌ Doesn't solve root problems

## Decision Outcome

**Chosen Option**: Complete refactoring to Clean Architecture following the phased approach.

This provides the best balance of risk vs. reward, allows parallel feature development, and creates
a consistent, maintainable architecture that can evolve with the business needs.

## Implementation Checklist

- [ ] Create base repository interfaces and implementations
- [ ] Set up shared infrastructure layer
- [ ] Dissolve Token module into Auth
- [ ] Refactor User module to Clean Architecture
- [ ] Reorganize Config module
- [ ] Clean up Shared module
- [ ] Update all documentation
- [ ] Conduct team training sessions
- [ ] Create migration guide for future modules

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design by Vaughn Vernon](https://www.informit.com/store/implementing-domain-driven-design-9780321834577)
- [NestJS Documentation](https://docs.nestjs.com/)
- Story 2.2: Auth Module Clean Architecture Implementation (reference implementation)

## Review

- **Author**: Quinn (Test Architect)
- **Reviewers**: Development Team, Technical Lead
- **Approval Date**: Pending
- **Next Review**: After Phase 3 completion
