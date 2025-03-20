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
    
    # Run docker-compose and capture the exit code
    docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" up -d
    $exitCode = $LASTEXITCODE
    
    # Check if docker-compose command was successful
    if ($exitCode -ne 0) {
        Write-Host "ERROR: Failed to start development environment. Exit code: $exitCode" -ForegroundColor Red
        Write-Host "Please check the docker-compose logs for more details:" -ForegroundColor Red
        Write-Host "  .\dev-env.ps1 logs" -ForegroundColor Red
        exit $exitCode
    }
    
    # Verify services are actually running
    $services = docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" ps --services
    $failedServices = @()
    
    foreach ($service in $services) {
        $status = docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" ps --services --filter "status=running" | Select-String -Pattern "^$service$"
        if (-not $status) {
            $failedServices += $service
        }
    }
    
    if ($failedServices.Count -gt 0) {
        Write-Host "ERROR: The following services failed to start:" -ForegroundColor Red
        foreach ($service in $failedServices) {
            Write-Host "  - $service" -ForegroundColor Red
        }
        Write-Host "Please check the logs for these services:" -ForegroundColor Red
        Write-Host "  .\dev-env.ps1 logs" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Development environment started successfully. Services available at:" -ForegroundColor Green
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
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -ne 0) {
        Write-Host "ERROR: Failed to stop development environment. Exit code: $exitCode" -ForegroundColor Red
        exit $exitCode
    }
    
    Write-Host "Development environment stopped." -ForegroundColor Green
}

function Show-Status {
    Write-Host "Development environment status:"
    docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" ps
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -ne 0) {
        Write-Host "ERROR: Failed to show status. Exit code: $exitCode" -ForegroundColor Red
        exit $exitCode
    }
}

function Restart-DevEnvironment {
    Stop-DevEnvironment
    Start-DevEnvironment
}

function Show-Logs {
    Write-Host "Showing logs from all services (Ctrl+C to exit)..."
    docker-compose -f "$PSScriptRoot/../docker-compose.yml" -f "$PSScriptRoot/docker-compose.extend.yml" logs -f
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -ne 0 -and $exitCode -ne 130) {
        # 130 is the exit code when Ctrl+C is pressed
        Write-Host "ERROR: Failed to show logs. Exit code: $exitCode" -ForegroundColor Red
        exit $exitCode
    }
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