# Home Organization System

A microservices-based application designed to streamline household management, including chore tracking, inventory management, shopping list generation, household management, and Instacart integration.

## Tech Stack

- **Frontend:** React (Next.js) with TypeScript
- **Backend Services:**
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

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- .NET Core (v7+)
- Docker & Docker Compose
- Git

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/home-organization-system.git
   cd home-organization-system
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in each service directory
   - Update with your credentials

4. Start the services:
   ```
   docker-compose up
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
