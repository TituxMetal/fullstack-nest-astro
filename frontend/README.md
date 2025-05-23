# Frontend (Astro + React)

This is the frontend for the Fullstack Nest + Astro monorepo.

See the [root README](../README.md) for monorepo setup, tech stack, and common workflows.

---

## Features

- **Authentication:** Secure login and registration with JWT stored in HTTP-only cookies
- **User Profile:** View and edit user profile information
- **Form Handling:** Type-safe forms with React Hook Form and Zod validation
- **Component Testing:** Unit tests with React Testing Library following AAA pattern

---

## Directory Structure

```
src/
├── assets/        # Static assets (images, icons)
├── components/    # UI components (React & Astro)
│   └── ui/        # Reusable UI components
├── hooks/         # Custom React hooks
├── layouts/       # Page layout templates
├── pages/         # Astro pages (file-based routing)
├── schemas/       # Zod validation schemas
├── services/      # API services
├── styles/        # Global styles
├── types/         # TypeScript types/interfaces
└── utils/         # Utility functions
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

---

For more details, see the [root README](../README.md).
