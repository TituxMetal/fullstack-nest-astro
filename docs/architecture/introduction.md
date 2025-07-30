# Introduction

This document outlines the overall project architecture for **NestJS + Astro Fullstack
Application**, including backend systems, shared services, and non-UI specific concerns. Its primary
goal is to serve as the guiding architectural blueprint for AI-driven development, ensuring
consistency and adherence to chosen patterns and technologies during the Epic 0-4 BMAD methodology
transformation.

**Relationship to Frontend Architecture:** If the project includes a significant user interface, a
separate Frontend Architecture Document will detail the frontend-specific design and MUST be used in
conjunction with this document. Core technology stack choices documented herein (see "Tech Stack")
are definitive for the entire project, including any frontend components.

## Starter Template Analysis

**Decision: Custom BMAD-Driven Architecture Evolution**

This project represents a **strategic architectural evolution** guided by BMAD methodology. The
architecture will transform from the current functional state to a highly scalable, maintainable
system through 5 sequential epics:

- **Epic 0**: BMAD methodology establishment (PREREQUISITE)
- **Epic 1**: Monorepo restructuring (apps/ and packages/ directories)
- **Epic 2**: Backend Clean Architecture + DDD refactoring
- **Epic 3**: Frontend component-type-based restructuring
- **Epic 4**: Shared configuration packages

The current functional codebase provides a solid foundation for incremental refactoring without
breaking existing functionality. This is NOT based on a starter template but rather a mature,
custom-built application with established architectural patterns that will evolve through systematic
BMAD-driven transformation.
