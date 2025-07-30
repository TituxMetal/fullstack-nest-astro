# Database Schema

## Current Schema (Keep As-Is)

```sql
-- SQLite Schema (Current Implementation)
-- File: backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

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

## Epic 2 Implementation Strategy

**Domain Models (Different Views of Same Data):**

- **AuthUser Entity**: Focuses on authentication behavior, uses auth-related fields
- **UserProfile Entity**: Focuses on profile management, uses profile-related fields
- **Repository Pattern**: Both contexts access same User table through different repository
  interfaces

**Migration Path: SQLite → PostgreSQL**

- **Phase 1 (Current)**: SQLite development with simple schema
- **Phase 2 (Future)**: PostgreSQL with enhanced constraints and indexing when scaling needs justify
  complexity
