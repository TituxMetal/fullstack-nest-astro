# REST API Spec

```yaml
openapi: 3.0.0
info:
  title: Fullstack NestJS + Astro Application API
  version: 1.0.0
  description: |
    REST API for user authentication and profile management.
    This API contract must remain stable during Epic 2 Clean Architecture + DDD refactoring.
servers:
  - url: http://localhost:3000
    description: Development server
  - url: http://localhost:4321/api
    description: Frontend proxy (Astro dev server)

security:
  - cookieAuth: []

paths:
  /auth/register:
    post:
      tags:
        - Authentication
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - username
                - password
              properties:
                email:
                  type: string
                  format: email
                username:
                  type: string
                  minLength: 3
                password:
                  type: string
                  minLength: 8
                firstName:
                  type: string
                lastName:
                  type: string
      responses:
        '201':
          description: User registered successfully
          headers:
            Set-Cookie:
              schema:
                type: string
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

  /auth/login:
    post:
      tags:
        - Authentication
      summary: Login user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - emailOrUsername
                - password
              properties:
                emailOrUsername:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Login successful
          headers:
            Set-Cookie:
              schema:
                type: string
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

  /auth/logout:
    post:
      tags:
        - Authentication
      summary: Logout user
      responses:
        '200':
          description: Logout successful

  /users/me:
    get:
      tags:
        - User Profile
      summary: Get current user profile
      security:
        - cookieAuth: []
      responses:
        '200':
          description: User profile retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

    put:
      tags:
        - User Profile
      summary: Update current user profile
      security:
        - cookieAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                username:
                  type: string
                firstName:
                  type: string
                lastName:
                  type: string
      responses:
        '200':
          description: Profile updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

components:
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: auth_token

  schemas:
    UserResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        username:
          type: string
        firstName:
          type: string
          nullable: true
        lastName:
          type: string
          nullable: true
        confirmed:
          type: boolean
        blocked:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

**Epic 2 Implementation Guarantee:** Exact same HTTP endpoints, request/response schemas, and
authentication mechanisms will be maintained throughout Clean Architecture + DDD refactoring.
