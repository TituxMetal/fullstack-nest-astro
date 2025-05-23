# Progress

## What Works

- Backend and frontend apps are functional as separate entities in the monorepo.
- Turborepo orchestrates builds, tests, and other tasks efficiently.
- Docker builds are managed through workspace scripts.
- Documentation follows a DRY, developer-friendly structure.
- Environment configuration follows security best practices.
- Prisma migrations and database setup are properly documented.
- Authentication system with JWT cookies is implemented and working.
- User profile page with view and edit capabilities is working.
- Form validation with Zod schemas is functioning correctly.
- Unit tests for React components follow the AAA pattern.
- API services for user data are integrated and working.
- Environment variable handling is properly implemented for both server and client components.
- Docker and Docker Compose configurations are working correctly.
- Commit message formatting follows conventional commit standards.

## What's Left to Build

- User avatar upload functionality.
- Password change functionality in a dedicated flow.
- Additional user dashboard features and data visualization.
- Enhanced form error messaging and UX improvements.
- More comprehensive frontend test coverage.
- Add more detailed environment setup guides.
- Review and improve Docker Compose configuration.
- Consider adding development troubleshooting guides.

## Current Status

- Documentation has been improved to be more DRY and developer-friendly.
- Docker builds are working correctly through workspace scripts.
- Environment configuration is properly secured and documented.
- Project structure and workflows are clearly documented.
- User profile management is fully implemented.
- Backend-frontend API integration is working correctly.
- Environment variable handling is correctly implemented with different patterns for server and
  client.
- Commit message conventions are established and followed.

## Known Issues

- Empty strings in form fields need careful handling due to validation constraints.
- API service mocking in tests requires specific order of imports.
- Docker Compose configuration might need review.
- Some documentation sections could be more detailed.
- No .env.example files visible in the repository (may exist but not visible for security reasons).

## Evolution of Project Decisions

- Moved from direct Docker commands to workspace scripts.
- Adopted a DRY approach to documentation.
- Centralized common information in root README.
- Focused app-specific READMEs on unique aspects.
- Maintained clear separation between backend and frontend.
- Followed secure practices for environment configuration.
- Implemented cookie-based JWT authentication.
- Used React Hook Form with Zod for reliable form handling.
- Adopted local state management for optimistic UI updates.
- Used semantic HTML structure for accessibility.
- Established consistent testing patterns using AAA format.
- Implemented conventional commit standards for version control.
- Created separate environment variable patterns for server-side and client-side code.
- Properly managed cookie-based authentication in both frontend and backend.
