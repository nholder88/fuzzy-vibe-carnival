# Memory Bank

## Project Overview
This is a microservices-based home organization system with the following services:
- Authentication Service (In Progress)
- Task Management Service (Planned)
- Calendar Service (Planned)
- Notification Service (Planned)
- File Storage Service (Planned)

## Authentication Service Progress
- Created entity models:
  - User
  - Role
  - Permission
  - Session
  - OAuthProvider
- Set up database configuration with TypeORM
- Created initial migration file with all entity tables
- Installed necessary dependencies:
  - typeorm
  - @nestjs/typeorm
  - pg (PostgreSQL client)
  - @nestjs/jwt
  - @nestjs/passport
  - passport
  - passport-jwt
  - passport-local
  - class-validator
  - class-transformer
  - @nestjs/config

- Implemented User Management:
  - Created DTOs (CreateUserDto, LoginDto, UpdateUserDto, UserResponseDto)
  - Implemented UsersService with CRUD operations
  - Created UsersController with endpoints
  - Set up UsersModule

- Implemented Authentication:
  - Created JWT and Local authentication strategies
  - Implemented AuthService for login and validation
  - Created AuthController with login endpoint
  - Set up AuthModule with JWT configuration
  - Created guards for protected routes

Next steps:
1. Set up environment variables
2. Implement role-based access control
3. Add OAuth2 integration
4. Implement session management
5. Add security features (rate limiting, password policies)

## Task Management Service (Planned)
- Will handle task creation, assignment, and tracking
- Will integrate with Calendar Service for scheduling
- Will use Notification Service for reminders

## Calendar Service (Planned)
- Will handle event scheduling and management
- Will integrate with Task Management Service
- Will support recurring events and reminders

## Notification Service (Planned)
- Will handle all system notifications
- Will support multiple notification channels (email, push, in-app)
- Will integrate with all other services

## File Storage Service (Planned)
- Will handle file uploads and management
- Will support multiple storage backends
- Will integrate with other services for file attachments 