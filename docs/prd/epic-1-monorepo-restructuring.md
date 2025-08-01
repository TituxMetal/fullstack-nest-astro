# Epic 1: Monorepo Restructuring

- **Epic Goal**: To restructure the monorepo's directory layout to follow modern best practices by
  separating `apps` and `packages`, improving clarity and scalability.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

## **Story 1.1: Complete Monorepo Restructuring**

As a **developer working in the monorepo**, I want **the complete monorepo restructured to use
`apps` and `packages` directories with all configurations updated**, so that **I can work with a
fully functional, modern monorepo structure that is commitable and testable as a complete unit**.

**Acceptance Criteria:**

**Directory Structure:**

1. **AC1.1.1**: Root directory contains `apps/` directory
2. **AC1.1.2**: Root directory contains `packages/` directory
3. **AC1.1.3**: `backend/` directory is moved to `apps/backend/` with all files intact
4. **AC1.1.4**: `frontend/` directory is moved to `apps/frontend/` with all files intact
5. **AC1.1.5**: Git history is preserved for moved files (using `git mv` commands)

**Configuration Updates:** 6. **AC1.1.6**: `turbo.json` pipeline configurations updated to use
`apps/backend` and `apps/frontend` paths 7. **AC1.1.7**: Root `package.json` workspace
configurations updated to include `apps/*` pattern 8. **AC1.1.8**: `docker/Dockerfile.backend`
updated to use `apps/backend` as build context 9. **AC1.1.9**: `docker/Dockerfile.frontend` updated
to use `apps/frontend` as build context 10. **AC1.1.10**: `docker/compose.yaml` updated to reference
new application paths 11. **AC1.1.11**: `docker/start.sh` script updated for new directory structure

**System Functionality:** 12. **AC1.1.12**: All Turborepo commands (`yarn build`, `yarn test`,
`yarn lint`, `yarn dev`) work from root directory 13. **AC1.1.13**: Yarn workspace commands
correctly identify both applications 14. **AC1.1.14**: Both applications can be built independently
from new locations 15. **AC1.1.15**: All import paths within applications continue to work 16.
**AC1.1.16**: Environment variables and configuration loading still functions

**Integration Verification:**

- **IV1.1.1**: `yarn build` builds both applications successfully
- **IV1.1.2**: `yarn test` runs tests for both applications without errors
- **IV1.1.3**: `yarn lint` lints both applications without errors
- **IV1.1.4**: `yarn dev` starts both applications in development mode
- **IV1.1.5**: Docker builds complete successfully for both applications
- **IV1.1.6**: Docker Compose can start the full stack
- **IV1.1.7**: Container networking and communication remains functional
- **IV1.1.8**: Production deployment process works with new structure
- **IV1.1.9**: No breaking changes to existing development workflow
- **IV1.1.10**: All existing functionality preserved and testable
