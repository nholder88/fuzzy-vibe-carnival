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
  docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml up -d
  echo ""
  echo "Development environment started. Services available at:"
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
  echo "Development environment stopped."
}

function show_status {
  echo "Development environment status:"
  docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml ps
}

function restart_env {
  stop_env
  start_env
}

function show_logs {
  echo "Showing logs from all services (Ctrl+C to exit)..."
  docker-compose -f ../docker-compose.yml -f ./docker-compose.extend.yml logs -f
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