# 3. Technical Constraints and Integration Requirements

## 3.1. Existing Technology Stack

- **Languages**: TypeScript
- **Monorepo/Tooling**: Turborepo, Yarn Workspaces
- **Backend Framework**: NestJS
- **Frontend Framework**: Astro, React
- **Database / ORM**: Prisma
- **Styling**: TailwindCSS
- **Form Management**: React Hook Form with Zod
- **Testing**: Jest (backend), Vitest with React Testing Library (frontend)
- **Containerization**: Docker

## 3.2. Code Organization and Standards

- **File Structure Approach (Backend)**: Organized by DDD Bounded Contexts first, with Clean
  Architecture layers applied within each context.

  ```tree
  backend/src/
  ├── auth/
  │   ├── domain/
  │   ├── application/
  │   └── infrastructure/
  ├── user/
  │   ├── domain/
  │   ├── application/
  │   └── infrastructure/
  └── shared/
      ├── domain/
      └── infrastructure/
  ```

- **File Structure Approach (Frontend)**: Adopt a component-type-based structure.

  ```tree
  frontend/src/
  ├── components/
  │   ├── forms/
  │   ├── icons/
  │   ├── layouts/
  │   └── ui/
  ├── hooks/
  ├── lib/
  ├── pages/
  ├── services/
  └── styles/
  ```

## 3.3. Risk Assessment and Mitigation

- **Technical Risks**: Incorrect implementation of the Dependency Rule; incorrect definition of
  Bounded Contexts.
- **Integration Risks**: Accidental modification of the API contract.
- **Mitigation Strategies**: Rely heavily on existing unit and integration tests; refactor one
  Bounded Context at a time.
