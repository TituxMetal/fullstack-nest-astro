# Error Handling Strategy

## General Approach

- **Error Model:** Exception-based error handling with typed error responses
- **Exception Hierarchy:** NestJS built-in exceptions + custom business exceptions
- **Error Propagation:** Domain → Application → Infrastructure with proper error transformation

## Logging Standards

- **Library:** NestJS built-in Logger
- **Format:** JSON structured logging for production
- **Levels:** ERROR, WARN, LOG, DEBUG, VERBOSE
- **Required Context:** Correlation ID, service context, user context (when authenticated)

## Error Handling Patterns

**Business Logic Errors:**

- **Custom Exceptions:** Domain-specific exceptions for business rule violations
- **User-Facing Errors:** Consistent error response format for frontend
- **Error Codes:** Simple string-based error codes for frontend handling

**Data Consistency:**

- **Transaction Strategy:** Single SQLite transactions (current simple approach)
- **Compensation Logic:** Not needed for single-database operations
- **Idempotency:** Handled at application layer for critical operations

**Epic 2 Implementation Pattern:**

```typescript
// Domain Layer (Auth Context)
export class AuthenticationFailedException extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message)
    this.name = 'AuthenticationFailedException'
  }
}

// Application Layer
export class AuthApplicationService {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const user = await this.authUserRepository.findByEmail(credentials.email)
      if (!user || !user.verifyPassword(credentials.password)) {
        throw new AuthenticationFailedException('Invalid email or password')
      }
      return this.generateAuthResult(user)
    } catch (error) {
      this.logger.error('Login failed', { email: credentials.email, error: error.message })
      throw error
    }
  }
}

// Infrastructure Layer
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<UserResponse> {
    try {
      return await this.authApplicationService.login(loginDto)
    } catch (error) {
      if (error instanceof AuthenticationFailedException) {
        throw new UnauthorizedException({
          message: 'Login failed',
          error: 'INVALID_CREDENTIALS',
          statusCode: 401
        })
      }
      throw new InternalServerErrorException('An unexpected error occurred')
    }
  }
}
```
