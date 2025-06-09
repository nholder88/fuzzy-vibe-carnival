# Memory Bank

## Project Overview
This is a microservices-based home organization system with the following services:
- Chore Management Service
- Inventory Management Service
- Shopping List & Instacart Service
- Household Management Service
- Authentication Service

## Tech Stack Overview
### Frontend
- Primary: Angular (Latest LTS)
  - TypeScript
  - RxJS
  - Angular Material
  - NgRx
  - Angular Universal (SSR)
  - Angular PWA
- Secondary: React (Next.js) with TypeScript
- Package Manager: pnpm
- Testing: Karma/Jasmine, Jest, Cypress
- Code Quality: ESLint, Prettier, Husky, SonarQube

### Backend Microservices
1. Chore Management Service
   - Node.js with Express.js
   - RESTful API
   - WebSocket support
   - Task scheduling

2. Inventory Management Service
   - Python with FastAPI
   - Async operations
   - Barcode scanning
   - Real-time updates

3. Shopping List & Instacart Service
   - .NET (ASP.NET Core)
   - Instacart API integration
   - Order management
   - Price tracking

4. Household Management Service
   - Node.js with Express.js
   - User management
   - Role-based access control
   - Member management

### Infrastructure
- Containerization: Docker
- Orchestration: Kubernetes
- Message Broker: Kafka
- Caching: Redis
- Database: PostgreSQL
- IaC: Terraform
- Authentication: Auth0/Firebase
- Monitoring: Prometheus, Grafana, ELK Stack, Sentry

## Service Implementation Status

### Authentication Service
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

### Chore Management Service (Planned)
- Will handle chore creation, assignment, and tracking
- Will integrate with Notification Service for reminders
- Will support recurring chores and priority levels
- Will implement real-time updates via WebSocket

### Inventory Management Service (Planned)
- Will handle inventory tracking and management
- Will support barcode scanning
- Will provide low stock alerts
- Will track expiration dates
- Will integrate with Shopping List Service

### Shopping List & Instacart Service (Planned)
- Will handle shopping list management
- Will integrate with Instacart API
- Will support order tracking
- Will provide price comparison
- Will integrate with Inventory Service

### Household Management Service (Planned)
- Will handle household configuration
- Will manage member roles and permissions
- Will support multiple households per user
- Will integrate with all other services

## Angular Frontend Implementation
### File Structure
```
src/
├── app/
│   ├── components/
│   │   ├── chore/
│   │   ├── inventory/
│   │   ├── shopping/
│   │   ├── household/
│   │   ├── notification/
│   │   ├── calendar/
│   │   ├── authentication/
│   │   ├── shared/
│   │   └── models/
│   ├── services/
│   ├── guards/
│   ├── interceptors/
│   └── shared/
```

### Component Implementation Status
- Chore Components (Planned)
- Inventory Components (Planned)
- Shopping Components (Planned)
- Household Components (Planned)
- Notification Components (Planned)
- Calendar Components (Planned)
- Authentication Components (Planned)

### Testing Strategy
- Unit Tests: Jasmine/Karma
- Integration Tests: Angular TestBed
- E2E Tests: Cypress
- Coverage Requirements: 80% components, 90% services

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

## Backend Implementation Details

### Chore Management Service
```
src/
├── controllers/
│   ├── chore.controller.ts
│   └── chore-status.controller.ts
├── services/
│   ├── chore.service.ts
│   └── notification.service.ts
├── models/
│   ├── chore.model.ts
│   └── chore-status.model.ts
├── dto/
│   ├── create-chore.dto.ts
│   ├── update-chore.dto.ts
│   └── chore-response.dto.ts
├── interfaces/
│   └── chore.interface.ts
└── websocket/
    └── chore.gateway.ts
```

#### Endpoints
```typescript
// Base URL: /api/chores
GET /api/chores
  Query Parameters:
  - household_id: UUID (required)
  - status: string (optional) ['pending', 'in_progress', 'completed']
  - assigned_to: UUID (optional)
  - due_date_from: ISO date (optional)
  - due_date_to: ISO date (optional)

POST /api/chores
  Request Body:
  {
    title: string,
    description: string,
    assigned_to: UUID,
    household_id: UUID,
    due_date: ISO date,
    priority: string,
    recurring: string
  }

PATCH /api/chores/{chore_id}/status
  Request Body:
  {
    status: string,
    completed_at: ISO date
  }
```

### Inventory Management Service
```
src/
├── controllers/
│   ├── inventory.controller.ts
│   └── barcode.controller.ts
├── services/
│   ├── inventory.service.ts
│   └── barcode.service.ts
├── models/
│   ├── inventory.model.ts
│   └── barcode.model.ts
├── dto/
│   ├── create-inventory.dto.ts
│   ├── update-inventory.dto.ts
│   └── inventory-response.dto.ts
└── interfaces/
    └── inventory.interface.ts
```

#### Endpoints
```typescript
// Base URL: /api/inventory
GET /api/inventory
  Query Parameters:
  - household_id: UUID (required)
  - category: string (optional)
  - location: string (optional)
  - low_stock: boolean (optional)
  - expiring_soon: boolean (optional)

PUT /api/inventory/{item_id}
  Request Body:
  {
    quantity: number,
    threshold: number,
    location: string,
    expiration_date: ISO date
  }

POST /api/inventory/scan
  Request Body:
  {
    barcode: string,
    household_id: UUID
  }
```

### Shopping List & Instacart Service
```
src/
├── controllers/
│   ├── shopping-list.controller.ts
│   └── instacart.controller.ts
├── services/
│   ├── shopping-list.service.ts
│   └── instacart.service.ts
├── models/
│   ├── shopping-item.model.ts
│   └── instacart-order.model.ts
├── dto/
│   ├── create-shopping-item.dto.ts
│   ├── update-shopping-item.dto.ts
│   └── shopping-item-response.dto.ts
└── interfaces/
    └── shopping.interface.ts
```

#### Endpoints
```typescript
// Base URL: /api/shopping
GET /api/shopping/list
  Query Parameters:
  - household_id: UUID (required)
  - status: string (optional) ['active', 'completed']

POST /api/shopping/list
  Request Body:
  {
    item_name: string,
    quantity: number,
    unit: string,
    category: string,
    priority: string,
    notes: string,
    estimated_price: number
  }

POST /api/shopping/instacart/order
  Request Body:
  {
    items: [
      {
        item_name: string,
        quantity: number,
        unit: string,
        notes: string
      }
    ],
    delivery_time: ISO date,
    delivery_instructions: string
  }
```

### Household Management Service
```
src/
├── controllers/
│   ├── household.controller.ts
│   └── member.controller.ts
├── services/
│   ├── household.service.ts
│   └── member.service.ts
├── models/
│   ├── household.model.ts
│   └── member.model.ts
├── dto/
│   ├── create-household.dto.ts
│   ├── update-household.dto.ts
│   └── household-response.dto.ts
└── interfaces/
    └── household.interface.ts
```

#### Endpoints
```typescript
// Base URL: /api/households
POST /api/households
  Request Body:
  {
    name: string,
    description: string,
    rules: string
  }

POST /api/households/{household_id}/members
  Request Body:
  {
    user_id: UUID,
    role: string,
    permissions: {
      can_manage_chores: boolean,
      can_manage_inventory: boolean,
      can_manage_shopping: boolean
    }
  }
```

### WebSocket Events
```typescript
// Chore Events
{
  type: 'chore.assigned',
  data: {
    chore_id: UUID,
    assigned_to: UUID,
    due_date: ISO date
  }
}

// Inventory Events
{
  type: 'inventory.low_stock',
  data: {
    item_id: UUID,
    current_quantity: number,
    threshold: number
  }
}

// Shopping Events
{
  type: 'shopping.item_added',
  data: {
    item_id: UUID,
    item_name: string,
    added_by: UUID
  }
}

// Household Events
{
  type: 'household.member_joined',
  data: {
    household_id: UUID,
    user_id: UUID,
    joined_at: ISO date
  }
}
```

### Error Response Format
```typescript
{
  error: {
    code: string,
    message: string,
    details?: {
      field: string,
      reason: string
    }
  }
}
``` 