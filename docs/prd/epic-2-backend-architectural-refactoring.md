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

1. **AC2.1.1**: Create Clean Architecture structure directly in `apps/api/src/` with feature
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

## **Story 2.3: Refactor Users Bounded Context to Clean Architecture**

As a **developer working with user profile features**, I want **the users module restructured using
Clean Architecture patterns**, so that **users profile business logic is separated from
infrastructure concerns while maintaining all functionality**.

**Acceptance Criteria:**

1. **AC2.3.1**: Create users domain layer: `users/domain/entities/` (User.entity.ts with UserEntity
   class), `users/domain/value-objects/` (UserId.vo.ts with UserIdValueObject, Username.vo.ts with
   UsernameValueObject, Name.vo.ts with NameValueObject), `users/domain/repositories/`
   (User.repository.ts with IUserRepository interface), `users/domain/exceptions/`
   (UserNotFound.exception.ts, InvalidUser.exception.ts), with index.ts barrel files in each folder

2. **AC2.3.2**: Create users application layer: `users/application/use-cases/` (GetUserProfile.uc.ts
   with GetUserProfileUseCase, UpdateUserProfile.uc.ts with UpdateUserProfileUseCase,
   DeleteUserAccount.uc.ts with DeleteUserAccountUseCase, CreateUser.uc.ts with CreateUserUseCase,
   GetAllUsers.uc.ts with GetAllUsersUseCase), `users/application/dtos/` (GetUserProfile.dto.ts,
   UpdateUserProfile.dto.ts, CreateUser.dto.ts with DTOs), `users/application/services/`
   (User.service.ts with UserService), `users/application/mappers/` (User.mapper.ts), with index.ts
   barrel files in each folder

3. **AC2.3.3**: Create users infrastructure layer: `users/infrastructure/repositories/`
   (PrismaUser.repository.ts implementing IUserRepository), `users/infrastructure/controllers/`
   (User.controller.ts), `users/infrastructure/mappers/` (User.mapper.ts), with index.ts barrel
   files in each folder

4. **AC2.3.4**: Create Users.module.ts at root of users folder, configure dependency injection with
   proper providers for repositories and use cases using NestJS patterns

5. **AC2.3.5**: Remove original user/ directory structure after successful migration, preserving
   only new Clean Architecture structure in users/ directory

**Integration Verification:**

- **IV2.3.1**: GET `/users/me` endpoint works identically
- **IV2.3.2**: PATCH `/users/me` endpoint works identically
- **IV2.3.3**: DELETE `/users/me` endpoint works identically
- **IV2.3.4**: POST `/users` endpoint works identically
- **IV2.3.5**: GET `/users` endpoint works identically
- **IV2.3.6**: All user-related tests pass with updated imports

## **Story 2.4: Dissolve Token Module into Auth Infrastructure**

As a **developer working on the authentication system**, I want **the Token module dissolved and its
functionality moved into the Auth module infrastructure**, so that **we eliminate architectural debt
and maintain proper bounded context boundaries**.

**Acceptance Criteria:**

1. **AC2.4.1**: Move TokenService functionality to `auth/infrastructure/services/Token.service.ts`
   with class name TokenService (not JwtService to avoid naming conflicts), including
   `generateToken()` and `verifyToken()` methods with identical signatures and behavior

2. **AC2.4.2**: Move JwtPayload interface to `auth/domain/value-objects/JwtPayload.vo.ts` with class
   name JwtPayloadValueObject containing validation logic, and create corresponding interface
   IJwtPayload for type definitions

3. **AC2.4.3**: Update Auth.module.ts to include JwtModule configuration previously in TokenModule,
   ensuring proper ConfigService injection for JWT secret and expiration settings

4. **AC2.4.4**: Update all imports across the codebase: change "~/token" imports to
   "~/auth/infrastructure/services" for TokenService and "~/auth/domain/value-objects" for JWT
   payload types

5. **AC2.4.5**: Remove token/ directory completely after successful migration, including
   token.module.ts, token.service.ts, token.service.spec.ts, interfaces/, and index.ts

**Integration Verification:**

- **IV2.4.1**: JWT token generation works identically via Auth module
- **IV2.4.2**: JWT token verification works identically via Auth module
- **IV2.4.3**: All auth endpoints continue to function normally
- **IV2.4.4**: User controller authentication continues to work
- **IV2.4.5**: All existing tests pass with updated imports

## **Story 2.5: Infrastructure Foundation - Shared Clean Architecture Components**

As a **developer working with shared infrastructure across modules**, I want **common infrastructure
components moved to shared locations following Clean Architecture patterns**, so that **code
duplication is eliminated and all modules can access standardized infrastructure components while
maintaining proper separation of concerns**.

**Acceptance Criteria:**

1. **AC2.5.1**: Move Prisma infrastructure to `shared/infrastructure/database/` (PrismaService,
   PrismaModule), create `shared/infrastructure/database/Database.module.ts` that exports
   PrismaService, and update all existing imports to use shared location

2. **AC2.5.2**: Move authentication decorators to `shared/infrastructure/decorators/`
   (GetCurrentUser.decorator.ts) and update all imports from individual modules to shared location

3. **AC2.5.3**: Move common interceptors to `shared/infrastructure/interceptors/`
   (Serialize.interceptor.ts) and update all imports to use shared infrastructure location

4. **AC2.5.4**: Move shared domain types to `shared/domain/types/` (auth.types.ts and other common
   types) and update imports across all modules to use shared domain location

5. **AC2.5.5**: Move validation utilities to `shared/infrastructure/validation/` (constants.ts,
   decorators.ts) and update all imports to use shared validation infrastructure

6. **AC2.5.6**: Update all affected modules (auth, users) to use shared infrastructure imports,
   remove duplicated files, and verify all functionality continues to work identically with shared
   components

**Integration Verification:**

- **IV2.5.1**: All existing auth endpoints work identically with shared infrastructure components
- **IV2.5.2**: User endpoints function normally with shared decorators and interceptors
- **IV2.5.3**: Database operations maintain same performance characteristics with shared Prisma
  infrastructure
- **IV2.5.4**: All existing tests pass with updated imports to shared locations
- **IV2.5.5**: Shared validation utilities work correctly across all modules

## Epic Revision History

**2025-09-02**: Stories 2.3, 2.4, and 2.5 updated based on QA findings from Story 2.2 implementation
and architectural debt analysis documented in ADR-001. The original epic stories were replaced with
the actual stories created to address critical architectural issues discovered during Story 2.2 QA
review:

- **Story 2.3**: Updated to reflect Users module Clean Architecture refactoring per QA
  recommendations (corrected to plural naming per DDD/Clean Architecture best practices)
- **Story 2.4**: Replaced with Token module dissolution into Auth infrastructure (critical
  architectural debt)
- **Story 2.5**: Updated to reflect actual implementation of Shared Clean Architecture Components
  (foundational infrastructure consolidation completed)

See
[ADR-001: Backend Clean Architecture Refactoring Strategy](../architecture/adr/001-backend-clean-architecture-refactoring.md)
for detailed analysis and rationale.
