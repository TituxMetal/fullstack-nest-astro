# 1. Intro Project Analysis and Context

## 1.1. Existing Project Overview

- **Analysis Source**: IDE-based fresh analysis of the codebase.
- **Current Project State**: The project is a Turborepo monorepo containing a NestJS backend and an
  Astro/React frontend. Key features include JWT-based authentication via HTTP-only cookies, Prisma
  as the ORM, and Docker support for deployment. The project lacks formal architectural
  documentation.

## 1.2. Enhancement Scope Definition

- **Enhancement Type**: Methodology Introduction & Technology Stack Upgrade.
- **Enhancement Description**: This enhancement introduces the BMAD
  (Business-Model-Architecture-Development) methodology to the project, replacing memory bank
  documentation with systematic BMAD artifacts. Once BMAD processes are established, the methodology
  will guide a deep architectural refactoring of the entire monorepo. Key objectives include
  creating centralized, shared TypeScript (`tsconfig`) and ESLint configuration packages.
  Additionally, the plan is to restructure the monorepo directory, refactor the NestJS backend to a
  Clean Architecture + DDD pattern, and improve the folder/file structure of the Astro/React
  frontend.
- **Impact Assessment**: Major Impact (architectural changes required).

## 1.3. Goals and Background Context

- **Goals**:
  - **Primary**: Introduce BMAD methodology and establish systematic development processes
  - **Secondary**: Establish a highly scalable and maintainable backend architecture (Clean
    Architecture + DDD)
  - Improve frontend code organization and scalability.
  - Centralize TypeScript and ESLint configurations into shared packages to improve consistency and
    leverage the monorepo structure.
  - Optimize the monorepo structure for better developer experience and clarity.
- **Background Context**: The project has reached a solid functional state. To ensure long-term
  scalability and maintainability, the current structure needs to evolve. Creating shared
  configuration packages will enforce consistency. Adopting Clean Architecture and DDD will create a
  more robust backend. Refining the monorepo and frontend structure will improve the overall
  development workflow.
