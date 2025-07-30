# Components

## Auth Context Component

**Responsibility:** Handles user authentication, authorization, and account security operations
while maintaining JWT cookie-based auth flow.

**Key Interfaces:**

- `POST /auth/login` - User authentication endpoint
- `POST /auth/register` - User registration endpoint
- `POST /auth/logout` - Session termination endpoint
- `AuthApplicationService` - Application service for auth operations
- `AuthUserRepository` - Data access focused on auth concerns

**Dependencies:**

- Shared Prisma service for database access
- JWT service for token generation/validation
- Argon2 service for password hashing
- Cookie handling middleware

**Technology Stack:**

- NestJS modules for DI and organization
- Prisma Client for User table access (focusing on auth fields)
- JWT library for token operations
- Argon2 for password security

## User Context Component

**Responsibility:** Manages user profile information, account details, and user-facing operations
separate from authentication concerns.

**Key Interfaces:**

- `GET /users/me` - Retrieve current user profile
- `PUT /users/me` - Update user profile information
- `UserApplicationService` - Application service for profile operations
- `UserProfileRepository` - Data access focused on profile management

**Dependencies:**

- Shared Prisma service for database access
- Validation services for profile data
- Auth context for user identity verification

**Technology Stack:**

- NestJS modules for service organization
- Prisma Client for User table access (focusing on profile fields)
- class-validator for input validation
- Zod schemas for frontend validation alignment

## Shared Infrastructure Component

**Responsibility:** Provides common services, configuration, database access, and cross-cutting
concerns used by all bounded contexts.

**Key Interfaces:**

- `PrismaService` - Database connection and client management
- `ConfigService` - Environment variable and configuration management
- `ValidationPipe` - Request validation middleware
- `SerializationInterceptor` - Response formatting

**Dependencies:**

- Prisma Client for database operations
- NestJS Config module for environment handling
- class-transformer for response serialization

**Technology Stack:**

- Prisma ORM with SQLite (current) to PostgreSQL (future) migration path
- NestJS configuration module for env var management
- Shared validation and serialization logic

## Frontend Integration Component

**Responsibility:** Handles API communication, authentication state management, and form validation
on the client side using component-type organization.

**Key Interfaces:**

- `AuthService` (frontend) - API calls for authentication
- `UserService` (frontend) - API calls for profile management
- Form components in `components/forms/` directory
- API utilities in `lib/utils/` directory

**Dependencies:**

- Backend API endpoints (unchanged contracts)
- Zod schemas for frontend validation (separate from backend class-validator)
- React Hook Form for form state management

**Technology Stack:**

- Astro for server-side rendering and API proxying
- React components for interactive UI elements
- Zod for client-side validation
- React Hook Form for form management
