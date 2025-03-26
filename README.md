# Home Organization System

A microservices-based application designed to streamline household management, including chore tracking, inventory management, shopping list generation, household management, and Instacart integration.

## Tech Stack

- **Frontend:** React (Next.js) with TypeScript
- **Backend Services:**
  - **Authentication Service:** Node.js (Express.js) with JWT, OAuth2, and RBAC
  - **Chore Management:** Node.js (Express.js)
  - **Inventory Tracking:** Python (FastAPI)
  - **Shopping List & Instacart Integration:** .NET (ASP.NET Core)
  - **Household Management:** Node.js (Express.js)
- **Infrastructure:**
  - Docker & Kubernetes for containerization and orchestration
  - Kafka for event-driven communication
  - Redis for caching frequently accessed data
  - PostgreSQL for relational data storage
  - Terraform for infrastructure as code (IaC)
- **Authentication:** Auth0 or Firebase Authentication

## Getting Started

You can run this application either using Docker exclusively or with a hybrid approach using local development tools.

### Docker-Only Deployment

If you want to run everything in Docker containers, follow these steps:

1. Install Docker and Docker Compose:

   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS)
   - [Docker Engine](https://docs.docker.com/engine/install/) (Linux)

2. Clone the repository:

   ```bash
   git clone https://github.com/your-username/home-organization-system.git
   cd home-organization-system
   ```

3. Set up environment variables:

   ```bash
   # Copy environment files for each service
   find . -name ".env.example" -exec sh -c 'cp "$1" "${1%.example}"' _ {} \;
   ```

   Update the `.env` files in each service directory with your credentials.

4. Build and start all services:

   ```bash
   # Build all services
   docker compose build

   # Start all services in detached mode
   docker compose up -d
   ```

5. Verify the deployment:

   ```bash
   # Check the status of all containers
   docker compose ps

   # View logs from all services
   docker compose logs -f

   # View logs from a specific service
   docker compose logs -f [service-name]
   ```

6. Access the services:

   - Frontend: http://localhost:3000
   - Auth Service: http://localhost:4000
   - Chore Service: http://localhost:4001
   - Inventory Service: http://localhost:4002
   - Shopping Service: http://localhost:4003
   - Household Service: http://localhost:4004

7. Stop the services:

   ```bash
   # Stop and remove containers
   docker compose down

   # Stop and remove containers, volumes, and images
   docker compose down -v --rmi all
   ```

### Local Development Setup

#### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- .NET Core (v7+)
- Docker & Docker Compose
- Git
- pnpm (v8+)
- A terminal that supports running multiple instances (Windows Terminal, iTerm2, GNOME Terminal, or similar)
- Bash shell environment (Git Bash on Windows, Terminal on macOS/Linux)

#### System Dependencies

1. Install Node.js and pnpm:

   ```bash
   # Using Node Version Manager (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18

   # Install pnpm
   npm install -g pnpm
   ```

2. Install Docker and Docker Compose:

   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS)
   - [Docker Engine](https://docs.docker.com/engine/install/) (Linux)

3. Install Python 3.10+:

   - [Python Downloads](https://www.python.org/downloads/)

4. Install .NET Core 7+:
   - [.NET Downloads](https://dotnet.microsoft.com/download)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/home-organization-system.git
   cd home-organization-system
   ```

2. Set up environment variables:

   ```bash
   # Copy environment files for each service
   find . -name ".env.example" -exec sh -c 'cp "$1" "${1%.example}"' _ {} \;
   ```

   Update the `.env` files in each service directory with your credentials.

3. Start all services using the provided script:

   ```bash
   # Make the script executable
   chmod +x start-services.sh

   # Run the start script
   ./start-services.sh
   ```

   The script will:

   - Start infrastructure services (Kafka, PostgreSQL, Redis) using Docker Compose
   - Launch each microservice in a separate terminal window
   - Install dependencies and start the frontend application

4. Verify the services:
   - Infrastructure services will run in Docker containers
   - Each backend service and the frontend will run in separate terminal windows
   - Check the terminal output for any services that failed to start
   - If any service fails to start, follow the manual start instructions provided in the error message

### Manual Service Start (if needed)

If any service fails to start automatically, you can start them manually:

1. Infrastructure services:

   ```bash
   docker compose up -d postgres redis zookeeper kafka
   ```

2. Backend services (run each in a separate terminal):

   ```bash
   # Auth Service
   cd backend/auth-service && pnpm install && pnpm start

   # Chore Service
   cd backend/chore-service && pnpm install && pnpm start

   # Inventory Service
   cd backend/inventory-service && pnpm install && pnpm start

   # Shopping Service
   cd backend/shopping-service && pnpm install && pnpm start

   # Household Service
   cd backend/household-service && pnpm install && pnpm start
   ```

3. Frontend:
   ```bash
   cd frontend && pnpm install && pnpm start
   ```

## Conventional Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages to ensure a standardized commit history.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- **type**: Describes the kind of change

  - feat: A new feature
  - fix: A bug fix
  - docs: Documentation only changes
  - style: Changes that do not affect the meaning of the code
  - refactor: A code change that neither fixes a bug nor adds a feature
  - perf: A code change that improves performance
  - test: Adding missing tests or correcting existing tests
  - chore: Changes to the build process or auxiliary tools
  - ci: Changes to CI configuration files and scripts

- **scope**: Specifies the place of the commit change (optional)

  - frontend
  - chore-service
  - inventory-service
  - shopping-service
  - household-service
  - infrastructure
  - deps (dependencies)
  - config

- **subject**: A short description of the change

### Using the Commit Tool

Instead of writing commits manually, use the provided commit script:

```
npm run commit
```

This will guide you through creating a properly formatted commit message.

## License

[MIT License](LICENSE)
