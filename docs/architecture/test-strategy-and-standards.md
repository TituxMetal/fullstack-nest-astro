# Test Strategy and Standards

## Testing Philosophy

- **Approach:** **Test-Driven Development (TDD)** for learning Clean Architecture + DDD
- **Coverage Goals:** 90%+ through TDD red-green-refactor cycle
- **Test Pyramid:** Unit tests (85%), Integration tests (15%)

**Current Testing Stack:**

- ✅ **Backend:** Jest 29.7.0 with `*.spec.ts` files co-located
- ✅ **Frontend:** Vitest 3.1.4 with React Testing Library
- ✅ **Pattern:** AAA (Arrange-Act-Assert) structure
- ✅ **No E2E tests** (not needed for Clean Architecture learning)

## TDD Workflow for Epic 2

**Domain Entity Development:**

```typescript
// 1. RED - Write failing test first
describe('AuthUser', () => {
  it('should verify correct password', () => {
    // Arrange
    const userData = AuthUserFactory.create()

    // Act & Assert - This will fail because AuthUser doesn't exist yet
    expect(userData.verifyPassword('correct')).toBe(true)
  })
})

// 2. GREEN - Write minimal AuthUser to make test pass
export class AuthUser {
  verifyPassword(password: string): boolean {
    return true // Minimal implementation
  }
}

// 3. REFACTOR - Improve implementation while keeping tests green
export class AuthUser {
  constructor(private passwordHash: string) {}

  verifyPassword(password: string): boolean {
    return argon2.verify(this.passwordHash, password)
  }
}
```

## Test Configuration (Maintain Current)

**Backend Jest Setup:**

```json
{
  "moduleNameMapper": {
    "~/(.*)$": "<rootDir>/src/$1"
  },
  "testRegex": ".*\\.spec\\.ts$",
  "testEnvironment": "node"
}
```

**Frontend Vitest Setup:**

```typescript
{
  "test": {
    "globals": true,
    "environment": "jsdom"
  },
  "resolve": {
    "alias": { "~": path.resolve(__dirname, "./src") }
  }
}
```

**TDD Learning Benefits:**

- **Interface Discovery**: Tests help define repository interfaces before implementation
- **Dependency Direction**: Tests force proper dependency injection design
- **Business Logic Focus**: Domain tests validate business rules without infrastructure
- **Refactoring Safety**: Clean Architecture refactoring supported by comprehensive tests
