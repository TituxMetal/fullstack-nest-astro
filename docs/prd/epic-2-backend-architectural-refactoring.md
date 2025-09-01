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

1. **AC2.1.1**: Create Clean Architecture structure directly in `apps/backend/src/` with feature
   modules:

   ```tree
   src/
   ├── auth/
   │   ├── Auth.module.ts
   │   ├── domain/
   │   ├── application/
   │   └── infrastructure/
   ├── users/
   │   ├── Users.module.ts
   │   ├── domain/
   │   ├── application/
   │   └── infrastructure/
   └── shared/
       ├── Shared.module.ts
       ├── domain/
       ├── application/
       └── infrastructure/
   ```

2. **AC2.1.2**: Update architectural documentation in `docs/architecture/` explaining Clean
   Architecture + DDD principles with naming conventions
3. **AC2.1.3**: Each sub-folder in every layer must have an index.ts barrel file for exports
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
   - `auth/domain/entities/` (AuthUser.entity.ts with AuthUserEntity class)
   - `auth/domain/value-objects/` (Email.vo.ts, Password.vo.ts with ValueObject classes)
   - `auth/domain/repositories/` (AuthUser.repository.ts with IAuthUserRepository interface)
   - `auth/domain/exceptions/` (domain exceptions)
   - Each folder must have index.ts barrel file
2. **AC2.2.2**: Create auth application layer:
   - `auth/application/use-cases/` (Login.uc.ts, Register.uc.ts, Logout.uc.ts)
   - `auth/application/dtos/` (Login.dto.ts, Register.dto.ts)
   - `auth/application/services/` (Auth.service.ts)
   - `auth/application/mappers/` (DTO <> Domain mapping)
   - Each folder must have index.ts barrel file
3. **AC2.2.3**: Create auth infrastructure layer:
   - `auth/infrastructure/repositories/` (PrismaAuthUser.repository.ts)
   - `auth/infrastructure/services/` (Jwt.service.ts, Password.service.ts)
   - `auth/infrastructure/controllers/` (Auth.controller.ts)
   - `auth/infrastructure/guards/` (JwtAuth.guard.ts)
   - `auth/infrastructure/mappers/` (Persistence <> Domain mapping)
   - Each folder must have index.ts barrel file
4. **AC2.2.4**: Create Auth.module.ts at auth root, configure dependency injection with proper
   providers
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
   - `users/domain/entities/User.entity.ts` (export class UserEntity)
   - `users/domain/value-objects/` (UserProfile.vo.ts, ContactInfo.vo.ts)
   - `users/domain/repositories/User.repository.ts` (export interface IUserRepository)
   - Each folder must have index.ts barrel file
2. **AC2.3.2**: Create user application layer:
   - `users/application/use-cases/` (GetUserProfile.uc.ts, UpdateUserProfile.uc.ts)
   - `users/application/dtos/` (UpdateUser.dto.ts, UserResponse.dto.ts)
   - `users/application/services/User.service.ts`
   - Each folder must have index.ts barrel file
3. **AC2.3.3**: Create user infrastructure layer:
   - `users/infrastructure/repositories/PrismaUser.repository.ts`
   - `users/infrastructure/controllers/User.controller.ts`
   - `users/infrastructure/mappers/User.mapper.ts`
   - Each folder must have index.ts barrel file
4. **AC2.3.4**: Create Users.module.ts at users root, configure dependency injection
5. **AC2.3.5**: Remove original `user/` directory, keep only new structure

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

1. **AC2.4.1**: Create shared infrastructure:
   - `shared/infrastructure/services/` (Prisma.service.ts, Config.service.ts)
   - `shared/infrastructure/interceptors/` (Serialization.interceptor.ts)
   - `shared/infrastructure/filters/` (exception filters)
   - Each folder must have index.ts barrel file
2. **AC2.4.2**: Create shared domain:
   - `shared/domain/entities/Base.entity.ts` (base entity class)
   - `shared/domain/exceptions/` (Domain.exception.ts, NotFound.exception.ts)
   - `shared/domain/value-objects/` (UserId.vo.ts and common value objects)
   - Each folder must have index.ts barrel file
3. **AC2.4.3**: Create Shared.module.ts at shared root
4. **AC2.4.4**: Update all modules to use shared infrastructure via dependency injection
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

1. **AC2.5.1**: Update `App.module.ts` to import new Clean Architecture modules (Auth.module,
   Users.module, Shared.module)
2. **AC2.5.2**: Configure dependency injection for new architecture layers
3. **AC2.5.3**: Update `main.ts` if needed for new module structure
4. **AC2.5.4**: Update all import paths throughout the application
5. **AC2.5.5**: Verify barrel files prevent circular dependencies

**Integration Verification:**

- **IV2.5.1**: Application starts successfully with new architecture
- **IV2.5.2**: All API endpoints respond correctly
- **IV2.5.3**: Authentication and user management flows work end-to-end
- **IV2.5.4**: All unit and integration tests pass
- **IV2.5.5**: Frontend integration remains unaffected
