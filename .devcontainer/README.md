# Development Container for Home Organization System

This directory contains configuration for a Development Container setup that allows for consistent development environments across all microservices in the Home Organization System.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

1. Install the prerequisites listed above
2. Clone the repository to your local machine
3. Open the repository in Visual Studio Code
4. When prompted to "Reopen in Container", click "Reopen in Container"
   - Alternatively, press F1, type "Remote-Containers: Reopen in Container" and press Enter

VS Code will build and start the development containers defined in the docker-compose files. This might take a few minutes the first time.

## Starting Without VS Code

You can also start the development environment without VS Code:

### Windows (Batch File)

From the root of the repository:

```cmd
# Start the environment
.devcontainer\dev-env.bat start

# Check status
.devcontainer\dev-env.bat status

# View logs
.devcontainer\dev-env.bat logs

# Stop the environment
.devcontainer\dev-env.bat stop
```

### Windows (PowerShell)

From the root of the repository:

```powershell
# Start the environment
.\devcontainer\dev-env.ps1 start

# Check status
.\devcontainer\dev-env.ps1 status

# View logs
.\devcontainer\dev-env.ps1 logs

# Stop the environment
.\devcontainer\dev-env.ps1 stop
```

### Linux/macOS (Bash)

From the root of the repository:

```bash
# Make the script executable (first time only)
chmod +x .devcontainer/dev-env.sh

# Start the environment
./.devcontainer/dev-env.sh start

# Check status
./.devcontainer/dev-env.sh status

# View logs
./.devcontainer/dev-env.sh logs

# Stop the environment
./.devcontainer/dev-env.sh stop
```

## What's Included

The development environment includes:

- All microservices defined in the main docker-compose.yml
- Development-specific configurations in docker-compose.extend.yml
- Additional development tools:
  - pgAdmin (PostgreSQL administration tool) accessible at http://localhost:5050
  - Kafka UI (Kafka monitoring tool) accessible at http://localhost:8080
- VS Code extensions for:
  - JavaScript/TypeScript development
  - Python development
  - C# development
  - YAML editing
  - Docker management
  - Terraform development
  - Git integration

## Accessing Services

| Service           | URL                   | Description                    |
| ----------------- | --------------------- | ------------------------------ |
| Frontend          | http://localhost:3000 | Next.js React frontend         |
| Chore Service     | http://localhost:3001 | Node.js/Express service        |
| Inventory Service | http://localhost:8000 | Python/FastAPI service         |
| Shopping Service  | http://localhost:5000 | .NET/ASP.NET Core service      |
| Household Service | http://localhost:3002 | Node.js/Express service        |
| pgAdmin           | http://localhost:5050 | PostgreSQL administration tool |
| Kafka UI          | http://localhost:8080 | Kafka monitoring tool          |

Default pgAdmin credentials:

- Email: admin@admin.com
- Password: admin

## Working with the Development Container

- You can open terminals directly to any service using the "Remote Explorer" sidebar in VS Code
- Changes to the code are automatically detected and services will reload (using development mode)
- Database data is persisted in Docker volumes even when containers are stopped
- You can add additional VS Code extensions in the devcontainer.json file

## Stopping the Environment

To stop the development environment:

1. Press F1
2. Type "Remote-Containers: Reopen Folder Locally" and press Enter

This will stop all containers and return you to working locally.
