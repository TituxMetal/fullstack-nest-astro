# Epic 2: Backend Architectural Refactoring

- **Epic Goal**: To refactor the backend application to align with Clean Architecture principles
  within Domain-Driven Design (DDD) Bounded Contexts.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

## **Story 2.1: Establish Clean Architecture + DDD Directory Structure**

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

## **Story 2.2: Refactor Auth Bounded Context to Clean Architecture**

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

## **Story 2.3: Refactor User Bounded Context to Clean Architecture**

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

## **Story 2.4: Refactor Shared Infrastructure and Cross-Cutting Concerns**

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

## **Story 2.5: Update Application Module and Finalize Architecture**

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
