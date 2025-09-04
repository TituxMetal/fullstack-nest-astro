# Data Models

## Current Schema (Maintain Existing)

The existing Prisma schema is **perfect** for Clean Architecture + DDD learning and should be
maintained:

```sql
-- SQLite Schema (Current Implementation)
-- File: api/prisma/schema.prisma

model User {
  id String @id @default(uuid())

  -- Authentication fields (Auth Context)
  email     String  @unique
  username  String  @unique
  hash      String
  confirmed Boolean @default(true)
  blocked   Boolean @default(false)

  -- Profile fields (User Context)
  firstName String?
  lastName  String?

  -- Audit fields (Shared)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Bounded Context Field Mapping

**Auth Context Usage:**

- Fields: `id`, `email`, `username`, `hash`, `confirmed`, `blocked`, `createdAt`
- Operations: Registration, Login, Account status validation
- Domain Model: `AuthUser` entity focusing on authentication behavior

**User Profile Context Usage:**

- Fields: `id`, `email`, `username`, `firstName`, `lastName`, `createdAt`, `updatedAt`
- Operations: Profile viewing, Profile editing, User management
- Domain Model: `UserProfile` entity focusing on profile management behavior

**Shared Fields:**

- Fields: `id` (entity identity), `email`/`username` (shared identifiers)
- Usage: Cross-context user identification

## Epic 2 Implementation Strategy

Instead of changing the schema, Epic 2 will:

1. **Keep exact Prisma schema**
2. **Create domain entities** that model business behavior around the same data
3. **Implement Clean Architecture layers** around existing data structure
4. **Separate contexts in code organization**, not database structure

Both Auth and User repositories will use the same Prisma User model underneath, but expose different
domain interfaces appropriate to their bounded contexts.
