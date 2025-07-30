# Epic 3: Frontend Architectural Refactoring

- **Epic Goal**: To restructure the frontend application to use the defined component-type-based
  architecture, improving modularity and reusability.
- **BMAD Execution**: Stories will be developed using BMAD methodology with proper acceptance
  criteria, user value statements, and validation gates established in Epic 0.

## **Story 3.1: Create Component-Type-Based Directory Structure**

As a **frontend developer working with React components**, I want **component directories organized
by component type rather than feature**, so that **I can easily locate and reuse components based on
their functional role**.

**Acceptance Criteria:**

1. **AC3.1.1**: Create new component type directories:

   ```tree
   apps/frontend/src/components/
   ├── forms/          # Form components
   ├── icons/          # Icon components
   ├── layouts/        # Layout components
   └── ui/             # Base UI components (existing)
   ```

2. **AC3.1.2**: Create new `lib/` directory structure:

   ```tree
   apps/frontend/src/lib/
   ├── schemas/        # Zod schemas
   ├── types/          # TypeScript types
   └── utils/          # Utility functions
   ```

3. **AC3.1.3**: All existing files remain in current locations and functional
4. **AC3.1.4**: No import path changes during this story

**Integration Verification:**

- **IV3.1.1**: All pages continue to render correctly
- **IV3.1.2**: Authentication flow works normally
- **IV3.1.3**: User profile functionality remains intact
- **IV3.1.4**: All frontend tests pass

## **Story 3.2: Migrate Form Components to Dedicated Directory**

As a **developer working with form components**, I want **all form-related components organized in a
forms directory**, so that **form components are easily discoverable and maintainable**.

**Acceptance Criteria:**

1. **AC3.2.1**: Move `AuthForm.tsx` to `components/forms/AuthForm.tsx`
2. **AC3.2.2**: Move `EditProfileForm.tsx` and `EditProfileForm.spec.tsx` to `components/forms/`
3. **AC3.2.3**: Update all import statements in pages and other components
4. **AC3.2.4**: Update test files to reference new locations
5. **AC3.2.5**: Remove original component files after successful migration

**Integration Verification:**

- **IV3.2.1**: `/auth` page renders AuthForm correctly
- **IV3.2.2**: `/profile` page renders EditProfileForm correctly
- **IV3.2.3**: Form validation and submission work unchanged
- **IV3.2.4**: All form-related tests pass with updated imports

## **Story 3.3: Create Icons Directory and Migrate Assets**

As a **developer working with icon components**, I want **icon assets organized as reusable
components in a dedicated directory**, so that **icons can be easily imported and used consistently
across the application**.

**Acceptance Criteria:**

1. **AC3.3.1**: Create React components for existing SVG icons:
   - `components/icons/BackIcon.tsx` (from assets/icons/back.svg)
   - `components/icons/CoffeeIcon.tsx` (from assets/icons/coffee.svg)
   - `components/icons/CopyLeftIcon.tsx` (from assets/icons/copy-left.svg)
   - `components/icons/HeartIcon.tsx` (from assets/icons/heart.svg)
2. **AC3.3.2**: Create `components/icons/index.ts` for centralized exports
3. **AC3.3.3**: Replace any existing SVG imports with new icon components
4. **AC3.3.4**: Keep original SVG files in assets for reference during migration

**Integration Verification:**

- **IV3.3.1**: Any pages using icons display correctly
- **IV3.3.2**: Icon components render with proper styling
- **IV3.3.3**: No broken image references or missing icons
- **IV3.3.4**: Build process works with new icon components

## **Story 3.4: Migrate Layouts to Components Directory**

As a **developer working with layout components**, I want **layout components organized within the
components directory**, so that **all reusable UI components follow consistent organizational
patterns**.

**Acceptance Criteria:**

1. **AC3.4.1**: Move `layouts/Main.astro` to `components/layouts/Main.astro`
2. **AC3.4.2**: Update all page imports to reference new layout location
3. **AC3.4.3**: Verify layout props and slots continue working correctly
4. **AC3.4.4**: Remove original `layouts/` directory after successful migration

**Integration Verification:**

- **IV3.4.1**: All pages (auth, index, logout, profile) render with correct layout
- **IV3.4.2**: Layout styling and structure remain unchanged
- **IV3.4.3**: Astro's layout system continues to function normally
- **IV3.4.4**: No broken layout references in any page

## **Story 3.5: Migrate Schemas, Types, and Utils to Lib Directory**

As a **developer working with shared utilities and types**, I want **schemas, types, and utility
functions organized in a lib directory**, so that **shared code is clearly separated from components
and easily importable**.

**Acceptance Criteria:**

1. **AC3.5.1**: Move schema files:
   - `schemas/auth.schema.ts` → `lib/schemas/auth.schema.ts`
   - `schemas/user.schema.ts` → `lib/schemas/user.schema.ts`
   - Include corresponding `.spec.ts` files
2. **AC3.5.2**: Move type files:
   - `types/` directory contents → `lib/types/`
   - Preserve all type definitions exactly
3. **AC3.5.3**: Move utility files:
   - `utils/navigation.ts` → `lib/utils/navigation.ts`
   - `utils/routes.ts` → `lib/utils/routes.ts`
4. **AC3.5.4**: Create index files for easier imports:
   - `lib/schemas/index.ts`
   - `lib/types/index.ts`
   - `lib/utils/index.ts`
5. **AC3.5.5**: Update all import statements throughout the application

**Integration Verification:**

- **IV3.5.1**: Form validation with Zod schemas works unchanged
- **IV3.5.2**: TypeScript compilation succeeds with new import paths
- **IV3.5.3**: Navigation and routing utilities function correctly
- **IV3.5.4**: All services continue to use types correctly
- **IV3.5.5**: All tests pass with updated imports

## **Story 3.6: Finalize Frontend Architecture and Cleanup**

As a **developer working in the refactored frontend**, I want **the frontend architecture finalized
with proper documentation**, so that **the new structure is clear and maintainable for future
development**.

**Acceptance Criteria:**

1. **AC3.6.1**: Remove all original directories that have been migrated
2. **AC3.6.2**: Update `apps/frontend/README.md` with new architecture documentation
3. **AC3.6.3**: Create architecture diagrams showing component organization
4. **AC3.6.4**: Verify no dead imports or circular dependencies exist
5. **AC3.6.5**: Update any build configurations if needed for new structure

**Integration Verification:**

- **IV3.6.1**: Complete frontend application works end-to-end
- **IV3.6.2**: All user flows (auth, profile, navigation) function normally
- **IV3.6.3**: Build and test commands work with new structure
- **IV3.6.4**: Development server starts and hot reloading works
- **IV3.6.5**: Production build generates correctly
