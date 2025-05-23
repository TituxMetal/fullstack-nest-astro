# Fullstack Nest + Astro Monorepo

A modern fullstack monorepo using [NestJS](https://nestjs.com/) for the backend and
[Astro](https://astro.build/) + [React](https://react.dev/) for the frontend. Managed with
[Turborepo](https://turbo.build/) and [Yarn Workspaces](https://yarnpkg.com/features/workspaces) for
fast, scalable development.

---

## Tech Stack

- **Backend:** NestJS 11, TypeScript, Prisma (SQLite), JWT, argon2, Jest
- **Frontend:** Astro 5, React 19, TypeScript, TailwindCSS 4, React Hook Form + Zod, Vitest
- **Monorepo Tooling:** Turborepo, Yarn 4 Workspaces
- **Containerization:** Docker (monorepo-aware, production-ready)

---

## Features

- **Authentication:** JWT-based authentication with secure HTTP-only cookies
- **User Management:** Registration, login, profile management
- **Form Validation:** Zod schemas with React Hook Form
- **Type Safety:** Full TypeScript support across the stack

---

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn 4+
- Docker (optional, for containerized development)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fullstack-nest-astro.git
cd fullstack-nest-astro

# Install dependencies
yarn install

# Setup database for backend
yarn workspace backend prisma migrate deploy
```

### Development

```bash
# Start all apps in development mode
yarn turbo run dev

# Start only the backend
yarn workspace backend dev

# Start only the frontend
yarn workspace frontend dev
```

---

## Environment Variables

### Backend

Create a `.env` file in the `backend` directory with:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d

# Cookie Configuration
AUTH_COOKIE_NAME=auth_token
SESSION_TTL=86400000
```

### Frontend

Create a `.env` file in the `frontend` directory with:

```bash
# For server-side API calls (not exposed to browser)
API_URL=http://localhost:3000

# For client-side API calls (exposed to browser)
PUBLIC_API_URL=/api
```

---

## Project Structure

```
.
├── backend/               # NestJS API
│   ├── prisma/            # Database migrations and schema
│   └── src/               # Backend source code
├── frontend/              # Astro + React UI
│   ├── public/            # Static assets
│   └── src/               # Frontend source code
├── docker/                # Docker configuration
└── memory-bank/           # Project documentation
```

---

## Docker

Build Docker images:

```bash
# Build backend
yarn workspace backend docker:build

# Build frontend
yarn workspace frontend docker:build
```

---

## Testing

```bash
# Run all tests
yarn turbo run test

# Run backend tests
yarn workspace backend test

# Run frontend tests
yarn workspace frontend test
```

---

## Documentation

See the `memory-bank/` directory for detailed project documentation. Each app also has its own
README with specific details.

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

## Contributing

1. Follow the code style guidelines
2. Write tests for new features
3. Use conventional commits for your commit messages
4. Create pull requests for review
