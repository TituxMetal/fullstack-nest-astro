# Epic 4: Shared Configuration Packages

- **Epic Goal**: To create and integrate centralized ESLint and TypeScript configuration packages
  (`@repo/eslint-config`, `@repo/typescript-config`) to be used by all applications in the monorepo.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

## **Story 4.1: Create Shared TypeScript Configuration Package**

As a **developer working across multiple applications in the monorepo**, I want **a centralized
TypeScript configuration package**, so that **TypeScript compiler settings are consistent and
maintainable across all applications**.

**Acceptance Criteria:**

1. **AC4.1.1**: Create `packages/typescript-config/` directory structure:

   ```tree
   packages/typescript-config/
   ├── package.json
   ├── base.json          # Base TypeScript config
   ├── node.json          # Node.js specific config
   ├── react.json         # React/browser specific config
   └── README.md
   ```

2. **AC4.1.2**: Configure package.json with proper name `@repo/typescript-config`
3. **AC4.1.3**: Create base.json with common TypeScript compiler options
4. **AC4.1.4**: Create node.json extending base.json with Node.js specific settings
5. **AC4.1.5**: Create react.json extending base.json with React/browser specific settings
6. **AC4.1.6**: Document usage patterns in README.md

**Integration Verification:**

- **IV4.1.1**: Package builds successfully as part of monorepo
- **IV4.1.2**: TypeScript configurations are valid JSON
- **IV4.1.3**: No circular dependencies in configuration extends
- **IV4.1.4**: Package is discoverable via yarn workspace commands

## **Story 4.2: Create Shared ESLint Configuration Package**

As a **developer ensuring code quality across the monorepo**, I want **a centralized ESLint
configuration package**, so that **linting rules are consistent and maintainable across all
applications**.

**Acceptance Criteria:**

1. **AC4.2.1**: Create `packages/eslint-config/` directory structure:

   ```tree
   packages/eslint-config/
   ├── package.json
   ├── base.js            # Base ESLint config
   ├── node.js            # Node.js specific config
   ├── react.js           # React specific config
   └── README.md
   ```

2. **AC4.2.2**: Configure package.json with proper name `@repo/eslint-config`
3. **AC4.2.3**: Create base.js with common ESLint rules and parser settings
4. **AC4.2.4**: Create node.js extending base with Node.js specific rules
5. **AC4.2.5**: Create react.js extending base with React and JSX specific rules
6. **AC4.2.6**: Include all necessary peer dependencies for ESLint plugins
7. **AC4.2.7**: Document configuration usage in README.md

**Integration Verification:**

- **IV4.2.1**: Package builds and installs correctly in monorepo
- **IV4.2.2**: ESLint configurations load without errors
- **IV4.2.3**: All referenced ESLint plugins are available
- **IV4.2.4**: Configuration extends work properly

## **Story 4.3: Migrate Backend to Use Shared Configuration Packages**

As a **backend developer**, I want **the backend application to use shared TypeScript and ESLint
configurations**, so that **configuration management is centralized while maintaining
backend-specific needs**.

**Acceptance Criteria:**

1. **AC4.3.1**: Update `apps/backend/package.json` to include dependencies:
   - `@repo/typescript-config: "workspace:*"`
   - `@repo/eslint-config: "workspace:*"`
2. **AC4.3.2**: Replace `apps/backend/tsconfig.json` to extend from shared config:

   ```json
   {
     "extends": "@repo/typescript-config/node.json",
     "compilerOptions": {
       "outDir": "./dist"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

3. **AC4.3.3**: Replace `apps/backend/eslint.config.cjs` to extend from shared config
4. **AC4.3.4**: Preserve any backend-specific TypeScript and ESLint overrides
5. **AC4.3.5**: Remove redundant configuration from backend files

**Integration Verification:**

- **IV4.3.1**: Backend builds successfully with new TypeScript config
- **IV4.3.2**: `yarn lint` works correctly for backend with new ESLint config
- **IV4.3.3**: All backend tests continue to pass
- **IV4.3.4**: NestJS framework functionality remains unaffected
- **IV4.3.5**: VS Code/IDE TypeScript support works normally

## **Story 4.4: Migrate Frontend to Use Shared Configuration Packages**

As a **frontend developer**, I want **the frontend application to use shared TypeScript and ESLint
configurations**, so that **configuration is consistent with backend while supporting React-specific
needs**.

**Acceptance Criteria:**

1. **AC4.4.1**: Update `apps/frontend/package.json` to include dependencies:
   - `@repo/typescript-config: "workspace:*"`
   - `@repo/eslint-config: "workspace:*"`
2. **AC4.4.2**: Replace `apps/frontend/tsconfig.json` to extend from shared config:

   ```json
   {
     "extends": "@repo/typescript-config/react.json",
     "compilerOptions": {
       "outDir": "./dist"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

3. **AC4.4.3**: Replace `apps/frontend/eslint.config.cjs` to extend from shared config
4. **AC4.4.4**: Preserve Astro and React specific configurations
5. **AC4.4.5**: Remove redundant configuration from frontend files

**Integration Verification:**

- **IV4.4.1**: Frontend builds successfully with new TypeScript config
- **IV4.4.2**: `yarn lint` works correctly for frontend with new ESLint config
- **IV4.4.3**: All frontend tests continue to pass
- **IV4.4.4**: Astro and React components compile correctly
- **IV4.4.5**: Development server starts and hot reloading works
- **IV4.4.6**: VS Code/IDE support works for React and Astro files

## **Story 4.5: Update Root Configuration and Finalize Package Integration**

As a **developer working with monorepo tooling**, I want **root-level configurations updated to work
with shared packages**, so that **Turborepo orchestration and workspace commands work seamlessly**.

**Acceptance Criteria:**

1. **AC4.5.1**: Update root `package.json` workspace configuration to include `packages/*`
2. **AC4.5.2**: Update `turbo.json` to include package build dependencies:

   ```json
   {
     "pipeline": {
       "build": {
         "dependsOn": ["@repo/typescript-config#build", "@repo/eslint-config#build"]
       }
     }
   }
   ```

3. **AC4.5.3**: Create build scripts for configuration packages if needed
4. **AC4.5.4**: Update root README.md to document shared configuration packages
5. **AC4.5.5**: Verify dependency resolution works correctly across workspace

**Integration Verification:**

- **IV4.5.1**: `yarn build` builds all packages and applications in correct order
- **IV4.5.2**: `yarn lint` applies consistent rules across all applications
- **IV4.5.3**: `yarn test` runs all tests successfully
- **IV4.5.4**: Shared packages are properly discoverable by applications
- **IV4.5.5**: Docker builds work with new package structure
