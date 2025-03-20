#!/bin/bash

# Development environment control script for Home Organization System

function print_usage {
  echo "Usage: ./dev-env.sh [start|stop|status|restart|logs]"
  echo ""
  echo "Commands:"
  echo "  start   - Start the development environment"
  echo "  stop    - Stop the development environment"
  echo "  status  - Show the status of all services"
  echo "  restart - Restart the development environment"
  echo "  logs    - Show logs from all services (Ctrl+C to exit)"
  echo ""
}

function start_env {
  echo "Starting development environment..."
  
  # Run docker-compose and capture the exit code
  docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml up -d
  local exit_code=$?
  
  # Check if docker-compose command was successful
  if [ $exit_code -ne 0 ]; then
    echo -e "\e[31mERROR: Failed to start development environment. Exit code: $exit_code\e[0m"
    echo -e "\e[31mPlease check the docker-compose logs for more details:\e[0m"
    echo -e "\e[31m  ./dev-env.sh logs\e[0m"
    exit $exit_code
  fi
  
  # Verify services are actually running
  local services=$(docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml ps --services)
  local failed_services=()
  
  for service in $services; do
    status=$(docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml ps --services --filter "status=running" | grep "^$service$")
    if [ -z "$status" ]; then
      failed_services+=("$service")
    fi
  done
  
  if [ ${#failed_services[@]} -gt 0 ]; then
    echo -e "\e[31mERROR: The following services failed to start:\e[0m"
    for service in "${failed_services[@]}"; do
      echo -e "\e[31m  - $service\e[0m"
    done
    echo -e "\e[31mPlease check the logs for these services:\e[0m"
    echo -e "\e[31m  ./dev-env.sh logs\e[0m"
    exit 1
  fi
  
  echo ""
  echo -e "\e[32mDevelopment environment started successfully. Services available at:\e[0m"
  echo "- Frontend: http://localhost:3000"
  echo "- Chore Service: http://localhost:3001"
  echo "- Inventory Service: http://localhost:8000"
  echo "- Shopping Service: http://localhost:5000"
  echo "- Household Service: http://localhost:3002"
  echo "- pgAdmin: http://localhost:5050 (admin@admin.com/admin)"
  echo "- Kafka UI: http://localhost:8080"
  echo ""
}

function stop_env {
  echo "Stopping development environment..."
  docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml down
  local exit_code=$?
  
  if [ $exit_code -ne 0 ]; then
    echo -e "\e[31mERROR: Failed to stop development environment. Exit code: $exit_code\e[0m"
    exit $exit_code
  fi
  
  echo -e "\e[32mDevelopment environment stopped.\e[0m"
}

function show_status {
  echo "Development environment status:"
  docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml ps
  local exit_code=$?
  
  if [ $exit_code -ne 0 ]; then
    echo -e "\e[31mERROR: Failed to show status. Exit code: $exit_code\e[0m"
    exit $exit_code
  fi
}

function restart_env {
  stop_env
  start_env
}

function show_logs {
  echo "Showing logs from all services (Ctrl+C to exit)..."
  docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml logs -f
  local exit_code=$?
  
  # 130 is the exit code when Ctrl+C is pressed
  if [ $exit_code -ne 0 ] && [ $exit_code -ne 130 ]; then
    echo -e "\e[31mERROR: Failed to show logs. Exit code: $exit_code\e[0m"
    exit $exit_code
  fi
}

# Main script logic
case "$1" in
  start)
    start_env
    ;;
  stop)
    stop_env
    ;;
  status)
    show_status
    ;;
  restart)
    restart_env
    ;;
  logs)
    show_logs
    ;;
  *)
    print_usage
    exit 1
    ;;
esac

exit 0 