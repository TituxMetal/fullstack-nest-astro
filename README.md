# Fullstack Nest + Astro

Example of a fullstack app using Astro as frontend and NestJs as backend.

## Frontend

The frontend is built with Astro 5.6.1, a modern web framework that offers server-side rendering
capabilities. It's enhanced with React 19.1.0 integration for interactive components.

### Tech Stack

- **Astro**: Modern web framework with server-side rendering
- **React**: Library for building interactive UI components
- **TypeScript**: Strongly-typed JavaScript
- **TailwindCSS 4.1.3**: Utility-first CSS framework
- **React Hook Form 7.55.0**: Form handling with Zod validation
- **Vitest 3.1.1**: Testing framework

### Structure

- `/src/assets`: Static assets including icons
- `/src/components`: Reusable UI components
- `/src/hooks`: Custom React hooks
- `/src/layouts`: Page layout templates
- `/src/pages`: Astro pages and routes
- `/src/schemas`: Zod validation schemas
- `/src/services`: API services and data fetching
- `/src/styles`: Global styles and CSS
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions
- `/src/middleware.ts`: Server middleware functions

## Backend

The backend is built with NestJS 11.0.1, a progressive Node.js framework for building efficient and
scalable server-side applications.

### Tech Stack

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Strongly-typed JavaScript
- **Prisma 6.6.0**: Next-generation ORM with type-safety
- **SQLite**: Database (via Prisma)
- **JWT**: Authentication strategy using @nestjs/jwt
- **argon2**: Password hashing
- **Jest 29.7.0**: Testing framework

### Structure

- `/src/auth`: Authentication related modules
- `/src/config`: Application configuration
- `/src/prisma`: Prisma service and database connection
- `/src/shared`: Shared utilities and services
- `/src/token`: Token management services
- `/src/user`: User-related modules and controllers

### Database

- SQLite database with Prisma ORM
- User model with fields for authentication and profile information

## Getting Started

### Prerequisites

- Node.js
- Yarn 4.9.1

### Installation

```bash
# Install dependencies for both frontend and backend
yarn install
```

### Development

```bash
# Start backend server
cd backend
yarn start:dev

# Start frontend development server
cd frontend
yarn dev
```
