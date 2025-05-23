# Active Context

## Current Work Focus

- User profile functionality has been successfully implemented and is working correctly in the
  frontend
- All core authentication and user management features are complete and functional
- Form validation with Zod schemas is implemented and tested
- API integration between frontend and backend is complete and working
- Type safety is maintained across all components and services
- Environment variable usage is standardized across the application
- Testing coverage follows AAA pattern and is comprehensive for implemented features

## Recent Changes

- Successfully completed user profile page implementation with edit functionality
- Created comprehensive user service for profile data fetching and updating
- Implemented robust Zod validation schemas for user data with proper handling of optional fields
- Added comprehensive unit tests for user profile components following AAA pattern
- Established proper error handling and form state management patterns
- Fully integrated authentication system with backend user endpoints
- Implemented proper environment variable handling for API URLs (server vs client)
- Established commit message standards following conventional commit format
- Successfully implemented and tested Docker configuration for the monorepo
- All core functionality is now working and tested

## Next Steps

- Consider adding user avatar upload functionality
- Consider enhancing the dashboard with additional user-related features
- Implement password change functionality in a dedicated flow
- Add more comprehensive error handling and user feedback
- Enhance test coverage for edge cases and error scenarios
- Consider adding user preferences or settings management
- Evaluate adding real-time features or notifications
- Review and potentially improve Docker Compose configuration for development

## Active Decisions

- Keep backend and frontend codebases cleanly separated
- Use React Hook Form with Zod for all form management and validation
- Follow the AAA pattern (Arrange-Act-Assert) for all frontend tests
- Maintain type safety across all API interactions
- Use local component state for optimistic UI updates
- Follow semantic HTML structure (using dl/dt/dd for user data display)
- Maintain consistent visual style with zinc-based colors
- Use environment variables correctly: API_URL for server-side, PUBLIC_API_URL for client-side
- Implement comprehensive testing for all services and components

## Important Patterns

- User profile updates:
  - Display mode shows user information in semantic HTML structure
  - Edit mode enables form fields with comprehensive validation
  - Local state management for instant UI updates
  - Server communication with proper error handling and loading states
- Form validation:
  - Base schemas for required fields (registration)
  - Extended schemas for optional/partial updates (profile editing)
  - Reuse of validation logic between schemas
  - Proper handling of empty strings and null values
- API services:
  - Type-safe request and response handling
  - Environment-aware URL configuration for server/client contexts
  - Consistent error handling patterns across all services
  - Comprehensive test coverage with proper mocking
- Authentication:
  - Cookie-based JWT authentication with secure HTTP-only cookies
  - Backend sets auth cookie on login/register
  - API_URL used for server-side requests in Astro pages
  - PUBLIC_API_URL used for client-side requests in React components

## Learnings

- Form state management with React Hook Form provides excellent UX and developer experience
- Testing React components requires careful mocking of API services and proper import ordering
- Proper separation of display/edit states significantly improves user experience
- Reusing validation logic between schemas reduces duplication and maintains consistency
- Semantic HTML structure improves accessibility and maintainability
- API environment handling must differentiate between server-side rendering and client components
- Handling empty/null values consistently between frontend and backend prevents validation issues
- Careful import ordering in tests is critical when mocking dependencies
- Conventional commit format improves project maintainability and version tracking
- Environment variables have distinct usage patterns in Astro server vs client components
- Comprehensive testing with AAA pattern makes code more reliable and maintainable
- Cookie-based authentication provides better security than localStorage for JWT tokens
