# Epic 1: Monorepo Restructuring

- **Epic Goal**: To restructure the monorepo's directory layout to follow modern best practices by
  separating `apps` and `packages`, improving clarity and scalability.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

## **Story 1.1: Create Apps and Packages Directory Structure**

As a **developer working in the monorepo**, I want **the root directory to have dedicated `apps` and
`packages` folders**, so that **I can clearly distinguish between deployable applications and
reusable packages**.

**Acceptance Criteria:**

1. **AC1.1.1**: Root directory contains new empty `apps/` directory
2. **AC1.1.2**: Root directory contains new empty `packages/` directory
3. **AC1.1.3**: Existing `backend/` and `frontend/` directories remain untouched during this story
4. **AC1.1.4**: All existing Turborepo commands (`yarn build`, `yarn test`, `yarn lint`) continue to
   work without changes

**Integration Verification:**

- **IV1.1.1**: Existing project structure continues to function normally
- **IV1.1.2**: No breaking changes to current development workflow
- **IV1.1.3**: Directory creation does not affect existing Docker builds

## **Story 1.2: Move Applications to Apps Directory**

As a **developer working with the monorepo applications**, I want **the backend and frontend moved
into the apps directory**, so that **the monorepo structure clearly indicates what are deployable
applications**.

**Acceptance Criteria:**

1. **AC1.2.1**: `backend/` directory is moved to `apps/backend/` with all files intact
2. **AC1.2.2**: `frontend/` directory is moved to `apps/frontend/` with all files intact
3. **AC1.2.3**: All source code, configuration files, and package.json files are preserved exactly
4. **AC1.2.4**: Git history is preserved for moved files (using `git mv` commands)

**Integration Verification:**

- **IV1.2.1**: Both applications can be built independently from new locations
- **IV1.2.2**: All import paths within applications continue to work
- **IV1.2.3**: Environment variables and configuration loading still functions

## **Story 1.3: Update Root Configuration for New Structure**

As a **developer using monorepo tooling**, I want **root configuration files updated to reference
the new app locations**, so that **Turborepo orchestration continues to work seamlessly**.

**Acceptance Criteria:**

1. **AC1.3.1**: `turbo.json` pipeline configurations updated to use `apps/backend` and
   `apps/frontend` paths
2. **AC1.3.2**: Root `package.json` workspace configurations updated to include `apps/*` pattern
3. **AC1.3.3**: All Turborepo commands (`build`, `test`, `lint`, `dev`) work from root directory
4. **AC1.3.4**: Yarn workspace commands correctly identify both applications

**Integration Verification:**

- **IV1.3.1**: `yarn build` builds both applications successfully
- **IV1.3.2**: `yarn test` runs tests for both applications
- **IV1.3.3**: `yarn lint` lints both applications
- **IV1.3.4**: `yarn dev` starts both applications in development mode

## **Story 1.4: Update Docker and Deployment Configuration**

As a **developer deploying the application**, I want **Docker configurations updated for the new
monorepo structure**, so that **containerized deployments continue to work without disruption**.

**Acceptance Criteria:**

1. **AC1.4.1**: `docker/Dockerfile.backend` updated to use `apps/backend` as build context
2. **AC1.4.2**: `docker/Dockerfile.frontend` updated to use `apps/frontend` as build context
3. **AC1.4.3**: `docker/compose.yaml` updated to reference new application paths
4. **AC1.4.4**: `docker/start.sh` script updated for new directory structure

**Integration Verification:**

- **IV1.4.1**: Docker builds complete successfully for both applications
- **IV1.4.2**: Docker Compose can start the full stack
- **IV1.4.3**: Container networking and communication remains functional
- **IV1.4.4**: Production deployment process works with new structure
