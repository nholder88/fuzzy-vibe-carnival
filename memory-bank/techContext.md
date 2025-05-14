# Technical Context

## Technology Stack

### Frontend
- **Framework**: React (Next.js)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Build Tool**: Webpack
- **Package Manager**: pnpm

### Backend Services

#### Authentication Service
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT, OAuth2
- **Testing**: Jest

#### Chore Management Service
- **Framework**: Express.js
- **Language**: Node.js
- **Database**: PostgreSQL
- **Message Queue**: Kafka
- **Testing**: Jest

#### Inventory Service
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Database**: PostgreSQL
- **Cache**: Redis
- **Testing**: Pytest

#### Shopping Service
- **Framework**: ASP.NET Core
- **Language**: C#
- **Database**: PostgreSQL
- **Integration**: Instacart API
- **Testing**: xUnit

#### Household Service
- **Framework**: Express.js
- **Language**: Node.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Testing**: Jest

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Message Broker**: Kafka
- **Database**: PostgreSQL
- **Cache**: Redis
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack
- **CI/CD**: GitHub Actions

## Development Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- .NET Core 7+
- Docker & Docker Compose
- pnpm v8+
- Git
- PostgreSQL 14+
- Redis 6+

### Environment Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/home-organization-system.git
   cd home-organization-system
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   pnpm install

   # Backend Services
   cd ../backend
   pnpm install
   ```

3. **Environment Variables**
   ```bash
   # Copy environment files
   find . -name ".env.example" -exec sh -c 'cp "$1" "${1%.example}"' _ {} \;
   ```

4. **Start Services**
   ```bash
   # Start infrastructure
   docker compose up -d postgres redis kafka

   # Start services
   ./start-services.sh
   ```

## Technical Constraints

### Performance Requirements
- API response time < 200ms
- Page load time < 2s
- Real-time updates < 100ms
- 99.9% uptime
- Support for 1000+ concurrent users

### Security Requirements
- HTTPS everywhere
- JWT token expiration
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

### Scalability Requirements
- Horizontal scaling
- Load balancing
- Database sharding
- Caching strategy
- CDN integration

## Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^4.9.0",
    "tailwindcss": "^3.0.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.0"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "nestjs": "^9.0.0",
    "fastapi": "^0.95.0",
    "kafka-node": "^5.0.0",
    "redis": "^4.6.0",
    "pg": "^8.10.0"
  }
}
```

## Development Workflow

### 1. Code Organization
- Feature-based directory structure
- Shared components library
- Service-specific modules
- Common utilities

### 2. Version Control
- Git flow branching
- Conventional commits
- Pull request reviews
- Automated checks

### 3. Testing Strategy
- Unit tests
- Integration tests
- E2E tests
- Performance tests
- Security tests

### 4. Deployment Process
- CI/CD pipeline
- Environment promotion
- Automated testing
- Deployment verification
- Rollback procedures

## Monitoring & Logging

### 1. Application Monitoring
- Prometheus metrics
- Grafana dashboards
- Health checks
- Performance metrics
- Error tracking

### 2. Logging
- Structured logging
- Log aggregation
- Error tracking
- Audit logging
- Performance logging

### 3. Alerting
- Error alerts
- Performance alerts
- Security alerts
- Capacity alerts
- Business metrics 