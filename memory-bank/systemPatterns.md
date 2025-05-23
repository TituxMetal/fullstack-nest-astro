# System Patterns

## System Architecture

- **Monorepo Structure**
  - Root level: Project configuration and orchestration
  - `/backend`: NestJS API with Prisma
  - `/frontend`: Astro + React UI
  - `/docker`: Containerization config
  - `/memory-bank`: Documentation and context

## Key Technical Decisions

- Use of TypeScript across all stacks for type safety
- Yarn workspaces for dependency management
- Turborepo for task orchestration
- Multi-stage Docker builds for production
- Secure environment configuration with example templates
- Separate concerns between backend and frontend
- Cookie-based JWT authentication
- Form validation with Zod schemas
- React Hook Form for form state management
- AAA pattern for frontend tests

## Design Patterns

- **Authentication**

  - JWT tokens stored in HTTP-only cookies
  - Protected routes require valid JWT
  - Login/Register endpoints set auth cookie
  - Logout endpoint clears auth cookie
  - Authenticated API calls include credentials

- **Form Handling**

  - React Hook Form for state management
  - Zod schemas for validation
  - Base schemas for required fields
  - Extended schemas for optional updates
  - Local component state for UI feedback

- **API Integration**

  - Server-side requests use direct backend URL
  - Client-side requests use proxied API URL
  - Type-safe request/response interfaces
  - Consistent error handling patterns
  - Environment-aware configuration

- **Documentation**

  - DRY approach with centralized information
  - App-specific details in respective READMEs
  - Clear separation of concerns

- **Configuration**

  - Secure environment variable management
  - Backend: Standard Node.js env vars
  - Frontend: PUBLIC\_ prefix for browser vars
  - Server-only variables accessed via getSecret()
  - Client variables accessed via import.meta.env
  - Docker: Build-time and runtime vars

- **Build & Deploy**
  - Workspace scripts for Docker builds
  - Turborepo for task orchestration
  - Multi-stage builds for production

## Component Relationships

- Backend exposes REST APIs consumed by frontend
- Authentication is cookie-based with JWT
- Frontend proxies API requests through Astro
- User forms follow consistent validation patterns
- Each app maintains its own configuration
- Docker builds reference shared workspace
- Documentation references shared context

## Critical Implementation Paths

- Secure environment setup must precede app startup
- Prisma migrations required for backend
- Yarn workspace commands for app-specific tasks
- Turborepo commands for monorepo-wide tasks
- Docker builds through workspace scripts
- Authentication flow establishes user session
- Form validation ensures data consistency

## Frontend Pages Structure

- `/auth`: Authentication page (login/signup)

  - Uses query parameter `?mode=login` or `?mode=signup`
  - Uses React components with server-side mode detection
  - Can receive redirect path for post-authentication redirection

- `/profile`: User profile management

  - Protected page requiring authentication
  - Fetches user data server-side before rendering
  - Uses EditProfileForm component for viewing/editing user data
  - Implements optimistic UI updates

- `/logout`: Logout functionality

  - Clears authentication cookies
  - Redirects to homepage

- `/`: Homepage
  - Basic landing page
  - Shows different content for authenticated/unauthenticated users
