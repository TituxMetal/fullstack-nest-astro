# Security

## Input Validation

- **Validation Library:** class-validator (backend), Zod (frontend) - current approach maintained
- **Validation Location:** API boundary validation before processing + client-side UX validation
- **Required Rules:**
  - All external inputs MUST be validated at API endpoints using DTOs
  - Frontend validation for user experience only - never trust client validation
  - Whitelist approach: define allowed values, reject everything else

## Authentication & Authorization

- **Auth Method:** JWT tokens in HTTP-only cookies (current implementation)
- **Session Management:** JWT with expiration, secure cookie attributes
- **Required Patterns:**
  - HTTP-only cookies prevent XSS access to tokens
  - Secure flag in production (HTTPS only)
  - SameSite=Strict for CSRF protection
  - Token expiration validation on every request

**Current Security Pattern (Maintain):**

```typescript
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

res.cookie(AUTH_COOKIE_NAME, token, {
  httpOnly: true, // ✅ XSS protection
  secure: NODE_ENV === 'production', // ✅ HTTPS in production
  sameSite: 'strict', // ✅ CSRF protection
  maxAge: SESSION_TTL // ✅ Explicit expiration
})
```

## Secrets Management

- **Development:** Environment variables via `.env` files (current approach)
- **Production:** Environment variables via Portainer/Docker (current setup)
- **Code Requirements:**
  - NEVER hardcode secrets in source code
  - Access via ConfigService only
  - No secrets in logs or error messages

## API Security

- **CORS Policy:** Astro proxy handles this correctly
- **Security Headers:** Managed by NginxProxyManager (current setup)
- **HTTPS Enforcement:** NginxProxyManager handles SSL termination

## Data Protection

- **Encryption at Rest:** SQLite file permissions (current setup)
- **Encryption in Transit:** HTTPS via NginxProxyManager
- **PII Handling:** Hash passwords with Argon2 (current approach)
- **Logging Restrictions:** Never log passwords, tokens, or sensitive data

## Dependency Security

- **Scanning Tool:** `yarn audit` for dependency vulnerabilities
- **Update Policy:** Regular dependency updates with testing

**Epic-Specific Security:** All Epic transformations maintain existing security patterns without
changes.
