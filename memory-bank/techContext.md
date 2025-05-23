# Tech Context

## Technologies Used

- **Backend**: NestJS, TypeScript, Prisma ORM
- **Frontend**: Astro, React, TypeScript, Zod, TailwindCSS
- **Forms**: React Hook Form, Zod validation schemas
- **Authentication**: JWT with HTTP-only cookies
- **Testing**: Jest (backend), Vitest (frontend), React Testing Library
- **State Management**: React hooks and local component state
- **Monorepo Tooling**: Turborepo, Yarn workspaces
- **Linting/Formatting**: ESLint, Prettier
- **Containerization**: Docker, Docker Compose

## Development Setup

- Node.js 20+
- Yarn 4+ (workspaces enabled)
- Turborepo for orchestrating tasks
- Each app/package has its own package.json and scripts
- Backend running on http://localhost:3000
- Frontend running on http://localhost:4321
- API requests proxied through Astro in frontend

## Technical Constraints

- Shared code must be isomorphic (usable in both Node and browser)
- Avoid backend/frontend-specific dependencies in shared package
- Dockerfiles must be monorepo-aware
- Forms must validate inputs with Zod schemas
- API services must be typed for both requests and responses
- Components must manage state for optimistic UI updates
- Tests must follow AAA pattern

## Dependencies

- All dependencies managed via Yarn workspaces
- Shared dependencies are hoisted to the root where possible
- **Backend**: NestJS, Prisma, JWT, Argon2
- **Frontend**: Astro, React, React Hook Form, Zod, TailwindCSS

## Tool Usage Patterns

- Run builds, tests, and linting from the root using Turborepo
- Use workspace protocol for local package dependencies
- Develop components with client:load directive in Astro
- Validate forms with Zod and React Hook Form
- Test components with React Testing Library and Vitest
- Mock API services in tests using vi.mock
- Set environment variables following app-specific conventions

## Environment Configuration

- **Backend Environment Variables**:

  - `PORT`: Server port (default: 3000)
  - `NODE_ENV`: Environment ('development' or 'production')
  - `DATABASE_URL`: Database connection string
  - `JWT_SECRET`: Secret for signing JWTs
  - `JWT_EXPIRES_IN`: Token expiration (e.g., '1d', '8h')
  - `AUTH_COOKIE_NAME`: Name of auth cookie (default: 'auth_token')
  - `SESSION_TTL`: Cookie lifetime in milliseconds

- **Frontend Environment Variables**:
  - `API_URL`: Backend URL for server-side requests (server-only)
  - `PUBLIC_API_URL`: API path for client-side requests (default: '/api')

## Authentication Flow

- **Login/Register**:

  1. User submits credentials
  2. Backend validates and generates JWT
  3. JWT stored in HTTP-only cookie
  4. User data returned to frontend

- **Authenticated Requests**:

  1. Cookies automatically included with requests
  2. Backend extracts and validates JWT
  3. User identified from token payload

- **Profile Management**:
  1. Frontend fetches user data from `/users/me` endpoint
  2. Updates submitted to backend with validation
  3. Backend updates database and returns updated user
  4. Frontend updates UI state with new data
