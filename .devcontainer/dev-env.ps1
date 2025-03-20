# PowerShell script for managing the Home Organization System development environment

function Print-Usage {
    Write-Host "Usage: .\dev-env.ps1 [start|stop|status|restart|logs]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  start   - Start the development environment"
    Write-Host "  stop    - Stop the development environment"
    Write-Host "  status  - Show the status of all services"
    Write-Host "  restart - Restart the development environment"
    Write-Host "  logs    - Show logs from all services (Ctrl+C to exit)"
    Write-Host ""
}

function Start-DevEnvironment {
    Write-Host "Starting development environment..."
    docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" up -d
    Write-Host ""
    Write-Host "Development environment started. Services available at:"
    Write-Host "- Frontend: http://localhost:3000"
    Write-Host "- Chore Service: http://localhost:3001"
    Write-Host "- Inventory Service: http://localhost:8000"
    Write-Host "- Shopping Service: http://localhost:5000"
    Write-Host "- Household Service: http://localhost:3002"
    Write-Host "- pgAdmin: http://localhost:5050 (admin@admin.com/admin)"
    Write-Host "- Kafka UI: http://localhost:8080"
    Write-Host ""
}

function Stop-DevEnvironment {
    Write-Host "Stopping development environment..."
    docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" down
    Write-Host "Development environment stopped."
}

function Show-Status {
    Write-Host "Development environment status:"
    docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" ps
}

function Restart-DevEnvironment {
    Stop-DevEnvironment
    Start-DevEnvironment
}

function Show-Logs {
    Write-Host "Showing logs from all services (Ctrl+C to exit)..."
    docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" logs -f
}

# Main script logic
$command = $args[0]

switch ($command) {
    "start" {
        Start-DevEnvironment
    }
    "stop" {
        Stop-DevEnvironment
    }
    "status" {
        Show-Status
    }
    "restart" {
        Restart-DevEnvironment
    }
    "logs" {
        Show-Logs
    }
    default {
        Print-Usage
        exit 1
    }
} 