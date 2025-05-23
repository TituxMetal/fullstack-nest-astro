# Backend (NestJS)

This is the backend API for the Fullstack Nest + Astro monorepo.

See the [root README](../README.md) for monorepo setup, tech stack, and common workflows.

---

## Features

- **Authentication:** JWT-based authentication with secure HTTP-only cookies
- **User Management:** User creation, retrieval, and profile updates
- **Data Validation:** DTO-based validation with class-validator
- **Database Integration:** Prisma ORM with SQLite (configurable for other databases)

---

## API Endpoints

- **Authentication**

  - `POST /auth/register` - Register a new user
  - `POST /auth/login` - Login with email/username and password
  - `POST /auth/logout` - Logout and clear auth cookie

- **User Management**
  - `GET /users/me` - Get current user profile (authenticated)
  - `PATCH /users/me` - Update current user profile (authenticated)

---

## Development

```bash
# Install dependencies (from root)
yarn install

# Start development server
yarn workspace backend dev

# Build for production
yarn workspace backend build

# Run tests
yarn workspace backend test
```

---

## Database

The project uses Prisma ORM with SQLite by default, but can be configured for any database supported
by Prisma.

```bash
# Run migrations
yarn workspace backend prisma migrate deploy

# Generate Prisma client
yarn workspace backend prisma generate

# Open Prisma Studio
yarn workspace backend prisma studio
```

---

## Docker

```bash
# Build Docker image
yarn workspace backend docker:build

# Push to registry
yarn workspace backend docker:push
```

- Dockerfile is in the `/docker/Dockerfile.backend` file

---

## Environment

Required environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment ('development' or 'production')
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret for signing JWTs
- `JWT_EXPIRES_IN`: Token expiration (e.g., '1d', '8h')
- `AUTH_COOKIE_NAME`: Name of auth cookie (default: 'auth_token')
- `SESSION_TTL`: Cookie lifetime in milliseconds

---

For more details, see the [root README](../README.md).
