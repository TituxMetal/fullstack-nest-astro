# Fullstack Nest + Astro Monorepo

A modern fullstack monorepo using [NestJS](https://nestjs.com/) for the backend and
[Astro](https://astro.build/) + [React](https://react.dev/) for the frontend. Managed with
[Turborepo](https://turbo.build/) and [Yarn Workspaces](https://yarnpkg.com/features/workspaces) for
fast, scalable development.

This project follows the **BMAD (Breakthrough Method for Agile Ai Driven Development)** methodology,
using AI agents for structured development, story management, and code generation. All development
work is guided by detailed stories and architectural documents located in the `docs/` directory.

---

## Tech Stack

- **Backend:** NestJS 11, TypeScript, Prisma (SQLite), JWT, argon2, Jest
- **Frontend:** Astro 5, React 19, TypeScript, TailwindCSS 4, React Hook Form + Zod, Vitest
- **Monorepo Tooling:** Turborepo, Yarn 4 Workspaces
- **Containerization:** Docker (monorepo-aware, production-ready)
- **Development Methodology:** BMAD (AI-assisted development)

---

## Getting Started

### Prerequisites

- Node.js 22+
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

Create a `.env` file in the `apps/backend` directory with:

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

Create a `.env` file in the `apps/frontend` directory with:

```bash
# For server-side API calls (not exposed to browser)
API_URL=http://localhost:3000

# For client-side API calls (exposed to browser)
PUBLIC_API_URL=/api
```

---

## Project Structure

The project is organized into `apps` and `packages` to distinguish between deployable applications
and shared code.

```tree
.
├── apps/                  # Deployable applications
│   ├── backend/           # NestJS API
│   └── frontend/          # Astro + React UI
├── packages/              # Shared packages (e.g., configs)
├── docs/                  # Project documentation (PRD, Architecture)
│   ├── prd/
│   └── architecture/
├── docker/                # Docker configuration
└── ...
```

For a detailed view of the project structure, see
[`docs/architecture/source-tree.md`](./docs/architecture/source-tree.md).

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

## Documentation & Methodology

This project uses the **BMAD (Breakthrough Method for Agile Ai Driven Development)** methodology.
All project requirements, architecture, and development stories are located in the `docs/`
directory.

- **Product Requirements:** [`docs/prd.md`](./docs/prd.md)
- **Architecture:** [`docs/architecture.md`](./docs/architecture.md)
- **Development Stories:** [`docs/stories/`](./docs/stories/)

Each app also has its own README with specific details:

- [Backend README](./apps/backend/README.md)
- [Frontend README](./apps/frontend/README.md)

---

## Contributing

1. Follow the coding and testing standards defined in `docs/architecture/`.
2. All work must be done against a story from `docs/stories/`.
3. Use conventional commits for your commit messages.
4. Create pull requests for review.
