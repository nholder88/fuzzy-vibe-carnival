# Frontend Context

## Primary Frontend: Angular

### Angular Project Location
- Path: `/frontend/angular`
- Framework: Angular (Latest version)
- Package Manager: pnpm

### Key Directories
```
frontend/angular/
├── src/
│   ├── app/
│   │   ├── components/     # UI components
│   │   ├── services/       # API and business logic services
│   │   ├── guards/         # Route guards
│   │   ├── store/          # State management
│   │   ├── models/         # Type definitions
│   │   └── app.routes.ts   # Application routing
│   └── environments/       # Environment configurations
```

## Secondary Frontend: Next.js

### Next.js Project Location
- Path: `/frontend/next`
- Framework: Next.js
- Package Manager: pnpm
- Styling: Tailwind CSS

### Key Directories
```
frontend/next/
├── app/                    # App router pages and layouts
├── components/             # Reusable UI components
├── context/               # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── styles/                # Global styles and Tailwind config
├── types/                 # TypeScript type definitions
└── tests/                 # Test files
```

### Next.js Features
- App Router implementation
- Server-side rendering (SSR)
- API routes
- Middleware for auth
- Storybook integration
- Jest testing setup
- E2E testing configuration

### Authentication Implementation

#### Angular (Primary)
1. **AuthService** (`services/auth.service.ts`)
   - Handles user authentication
   - Manages JWT tokens
   - Provides user state management
   - Implements login/logout functionality
   - Handles user registration

2. **AuthInterceptor** (`services/auth.interceptor.ts`)
   - Adds authentication headers to requests
   - Handles token management
   - Manages request/response flow

#### Next.js (Secondary)
1. **Middleware** (`middleware.ts`)
   - Handles authentication at the edge
   - Protects routes
   - Manages session validation

2. **Auth Context** (`context/auth.tsx`)
   - Provides authentication state
   - Manages user session
   - Handles login/logout

### Key Features (Both Implementations)
- JWT-based authentication
- Secure token storage
- Cookie-based token management
- User state persistence
- Error handling
- Loading state management

### Integration Points
- Auth Service Backend URL: `http://localhost:3003/api`
- Endpoints:
  - Login: `POST /auth/login`
  - Register: `POST /auth/register`
  - Profile: `GET /users/profile`

## Security Measures
- Secure cookie configuration
- Token expiration handling
- XSS protection
- CSRF protection
- Secure HTTP headers
- Edge middleware protection (Next.js)

## State Management
- User authentication state
- Loading states
- Error states
- Session management
- React Context (Next.js)
- RxJS (Angular)

## Environment Configuration
- Development and production settings
- API endpoint configuration
- Security settings
- Feature flags

## Testing
- Unit tests for services
- Integration tests
- E2E testing setup
- Jest configuration
- Storybook (Next.js)

## Dependencies

### Angular
- Angular Core
- Angular Common
- Angular Router
- Angular Forms
- Angular HTTP Client
- js-cookie
- RxJS

### Next.js
- Next.js
- React
- Tailwind CSS
- Jest
- Storybook
- Testing Library
- TypeScript

## Future Considerations
1. Token refresh mechanism
2. Role-based access control
3. OAuth integration
4. Multi-factor authentication
5. Session management improvements
6. Performance optimizations
7. Error handling enhancements
8. Feature parity between implementations
9. Shared component library
10. Unified authentication strategy 