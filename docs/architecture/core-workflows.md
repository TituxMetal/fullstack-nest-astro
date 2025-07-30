# Core Workflows

## User Registration Workflow

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Astro Frontend
    participant AuthForm as AuthForm Component
    participant AuthAPI as Auth Controller
    participant AuthService as Auth Service
    participant UserRepo as User Repository
    participant DB as SQLite Database

    User->>Frontend: Navigate to /auth?mode=signup
    Frontend->>AuthForm: Render registration form
    AuthForm->>User: Display form fields

    User->>AuthForm: Submit registration data
    AuthForm->>AuthForm: Validate with Zod schema

    alt Validation Success
        AuthForm->>AuthAPI: POST /auth/register
        AuthAPI->>AuthAPI: Validate DTO with class-validator
        AuthAPI->>AuthService: register(userData)
        AuthService->>AuthService: Hash password with Argon2
        AuthService->>UserRepo: createUser(hashedData)
        UserRepo->>DB: INSERT User record
        DB-->>UserRepo: User created
        UserRepo-->>AuthService: User entity
        AuthService->>AuthService: Generate JWT token
        AuthService-->>AuthAPI: JWT + user data
        AuthAPI->>AuthAPI: Set HTTP-only cookie
        AuthAPI-->>AuthForm: Success response
        AuthForm->>Frontend: Redirect to dashboard
    else Validation Error
        AuthAPI-->>AuthForm: Validation errors
        AuthForm->>User: Display error messages
    end
```

## User Login Workflow

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Astro Frontend
    participant AuthForm as AuthForm Component
    participant AuthAPI as Auth Controller
    participant AuthService as Auth Service
    participant UserRepo as User Repository
    participant DB as SQLite Database

    User->>Frontend: Navigate to /auth?mode=login
    Frontend->>AuthForm: Render login form
    AuthForm->>User: Display login fields

    User->>AuthForm: Submit credentials
    AuthForm->>AuthForm: Validate with Zod schema

    alt Validation Success
        AuthForm->>AuthAPI: POST /auth/login
        AuthAPI->>AuthAPI: Validate DTO with class-validator
        AuthAPI->>AuthService: login(credentials)
        AuthService->>UserRepo: findByEmail(email)
        UserRepo->>DB: SELECT User by email
        DB-->>UserRepo: User record
        UserRepo-->>AuthService: User entity
        AuthService->>AuthService: Verify password with Argon2

        alt Password Valid
            AuthService->>AuthService: Generate JWT token
            AuthService-->>AuthAPI: JWT + user data
            AuthAPI->>AuthAPI: Set HTTP-only cookie
            AuthAPI-->>AuthForm: Success response
            AuthForm->>Frontend: Redirect to dashboard
        else Password Invalid
            AuthService-->>AuthAPI: Authentication error
            AuthAPI-->>AuthForm: Login failed
            AuthForm->>User: Display error message
        end
    else Validation Error
        AuthAPI-->>AuthForm: Validation errors
        AuthForm->>User: Display error messages
    end
```

## User Profile Management Workflow

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Astro Frontend
    participant ProfileForm as EditProfileForm
    participant UserAPI as User Controller
    participant UserService as User Service
    participant UserRepo as User Repository
    participant DB as SQLite Database

    User->>Frontend: Navigate to /profile
    Frontend->>Frontend: Check auth cookie (SSR)
    Frontend->>UserAPI: GET /users/me
    UserAPI->>UserAPI: Verify JWT from cookie
    UserAPI->>UserService: getCurrentUser(userId)
    UserService->>UserRepo: findById(userId)
    UserRepo->>DB: SELECT User by ID
    DB-->>UserRepo: User record
    UserRepo-->>UserService: User entity
    UserService-->>UserAPI: User data
    UserAPI-->>Frontend: User profile data
    Frontend->>ProfileForm: Render profile with data
    ProfileForm->>User: Display profile form

    User->>ProfileForm: Edit profile fields
    User->>ProfileForm: Submit changes
    ProfileForm->>ProfileForm: Validate with Zod schema

    alt Validation Success
        ProfileForm->>UserAPI: PUT /users/me
        UserAPI->>UserAPI: Verify JWT from cookie
        UserAPI->>UserAPI: Validate DTO with class-validator
        UserAPI->>UserService: updateProfile(userId, data)
        UserService->>UserRepo: updateUser(userId, data)
        UserRepo->>DB: UPDATE User record
        DB-->>UserRepo: Updated user
        UserRepo-->>UserService: User entity
        UserService-->>UserAPI: Updated user data
        UserAPI-->>ProfileForm: Success response
        ProfileForm->>ProfileForm: Update local state (optimistic UI)
        ProfileForm->>User: Show success feedback
    else Validation Error
        UserAPI-->>ProfileForm: Validation errors
        ProfileForm->>User: Display error messages
    end
```

**API Compatibility Guarantee:** All HTTP endpoints remain identical during Epic 2 transformation,
ensuring frontend integration is unaffected by internal Clean Architecture + DDD refactoring.
