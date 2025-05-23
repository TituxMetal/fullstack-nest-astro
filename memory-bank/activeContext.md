# Active Context

## Current Work Focus

- Implementing user profile functionality in the frontend, allowing users to view and update their
  information.
- Ensuring proper API integration between frontend and backend for user data management.
- Implementing robust form validation with Zod schemas.
- Creating maintainable and testable React components with proper state management.
- Maintaining type safety between frontend and backend interfaces.
- Standardizing environment variable usage across the application.

## Recent Changes

- Implemented user profile page with edit functionality
- Created user service for profile data fetching and updating
- Implemented Zod validation schemas for user data
- Added unit tests for user profile components following AAA pattern
- Set up proper error handling and form state management
- Integrated with backend authentication and user endpoints
- Implemented proper environment variable handling for API URLs
- Refined commit message standards for better version control
- Successfully implemented Docker configuration for the monorepo

## Next Steps

- Consider adding user avatar upload functionality
- Consider enhancing the dashboard with additional user-related features
- Implement password change functionality in a dedicated flow
- Review and potentially improve Docker Compose configuration
- Enhance test coverage for API services
- Ensure consistent environment variable documentation

## Active Decisions

- Keep backend and frontend codebases cleanly separated
- Use React Hook Form with Zod for form management and validation
- Follow the AAA pattern (Arrange-Act-Assert) for all frontend tests
- Maintain type safety across all API interactions
- Use local component state for optimistic UI updates
- Follow a semantic HTML structure (using dl/dt/dd for user data display)
- Maintain a consistent visual style with zinc-based colors
- Use environment variables correctly: API_URL for server-side, PUBLIC_API_URL for client-side

## Important Patterns

- User profile updates:
  - Display mode shows user information
  - Edit mode enables form fields with validation
  - Local state management for instant UI updates
  - Server communication with proper error handling
- Form validation:
  - Base schemas for required fields (registration)
  - Extended schemas for optional/partial updates (profile editing)
  - Reuse of validation logic between schemas
- API services:
  - Type-safe request and response handling
  - Environment-aware URL configuration for server/client
  - Consistent error handling patterns
- Authentication:
  - Cookie-based JWT authentication
  - Backend sets auth cookie on login
  - API_URL used for server-side requests
  - PUBLIC_API_URL used for client-side requests

## Learnings

- When working with forms, maintaining local state is essential for immediate UI feedback
- Testing React components requires careful mocking of API services
- Proper separation of display/edit states provides a better user experience
- Reusing validation logic between schemas reduces duplication
- Using semantic HTML improves accessibility
- API environment handling differs between server-side rendering and client components
- The importance of handling empty/null values consistently between frontend and backend
- Careful import ordering in tests is needed when mocking dependencies
- Commits should follow conventional commit format with descriptive messages
- Environment variables have different usage patterns in Astro server vs client components
