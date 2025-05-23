# Project Brief

## Project Overview

This project is a fullstack web application structured as a monorepo. It consists of:

- A **backend** built with NestJS, responsible for API, authentication, and business logic.
- A **frontend** built with Astro and React, responsible for the user interface and client-side
  logic.
- Clean separation between frontend and backend to maintain clear boundaries between concerns.

## Monorepo & Tooling

- Managed as a monorepo using **Turborepo** for orchestrating builds, tests, linting, and
  deployments across all apps.
- Uses Yarn workspaces for dependency management.
- Docker containers for production deployment with multi-stage builds.

## Core Requirements

- Type safety within each application stack.
- Clean API contracts between backend and frontend.
- Maintainable validation logic in each application.
- Efficient, maintainable Docker and deployment workflows for each stack.
- Scalable structure for future development.

## Goals

- Maintain clean separation of concerns between frontend and backend.
- Ensure robust, type-safe communication within each application.
- Streamline development, testing, and deployment with monorepo tooling.
- Provide a clear, documented architecture for future contributors.
- Implement secure, cookie-based authentication between services.
- Maintain clear patterns for environment variable management.
