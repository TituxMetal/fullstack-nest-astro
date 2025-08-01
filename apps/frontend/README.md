# Frontend (Astro + React)

This is the frontend for the Fullstack Nest + Astro monorepo.

See the [root README](../../README.md) for monorepo setup, tech stack, and common workflows.

> **Architectural Note:** This frontend is currently undergoing a transition to a component-type
> organization as outlined in **Epic 3**. The future structure will be organized by component
> function (`forms`, `icons`, `layouts`, `ui`) and a unified `lib` directory for schemas, types, and
> utils, as defined in
> [`/docs/architecture/source-tree.md`](../../docs/architecture/source-tree.md).

---

## Features

- **Authentication:** Secure login and registration with JWT stored in HTTP-only cookies
- **User Profile:** View and edit user profile information
- **Form Handling:** Type-safe forms with React Hook Form and Zod validation
- **Component Testing:** Unit tests with React Testing Library following AAA pattern

---

## Directory Structure

The directory structure is being reorganized to group files by their type and purpose, improving
maintainability.

```tree
src/
├── components/    # Component-type organization
│   ├── forms/
│   ├── icons/
│   ├── layouts/
│   └── ui/
├── lib/           # Shared utilities
│   ├── schemas/   # Zod validation schemas
│   ├── types/     # TypeScript types
│   └── utils/     # Utility functions
├── hooks/         # Custom React hooks
├── pages/         # Astro pages (file-based routing)
├── services/      # API services
├── styles/        # Global styles
└── middleware.ts  # Astro middleware
```

---

## Pages

- **`/`**: Homepage
- **`/auth`**: Authentication page (login/signup)
  - Query param `?mode=login` or `?mode=signup`
  - Optional redirect with `?redirectPath=/some-path`
- **`/profile`**: User profile page (protected)
- **`/logout`**: Logout and redirect to home

---

## Development

```bash
# Install dependencies (from root)
yarn install

# Start development server
yarn workspace frontend dev

# Build for production
yarn workspace frontend build

# Run tests
yarn workspace frontend test
```

---

## Docker

```bash
# Build Docker image
yarn workspace frontend docker:build

# Push to registry
yarn workspace frontend docker:push
```

- Dockerfile is in the `/docker/Dockerfile.frontend` file

---

## Environment

The frontend uses environment variables for configuration:

- `API_URL`: Backend URL for server-side requests (server-only)
- `PUBLIC_API_URL`: API proxy path for client-side requests (e.g., `/api`)
- Public environment variables (exposed to the browser) use the `PUBLIC_` prefix
- `SESSION_TTL`: Cookie lifetime in milliseconds

---

For more details, see the [root README](../../README.md).
