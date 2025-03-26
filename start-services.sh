#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting infrastructure services (Kafka, Postgres, Redis)...${NC}"
docker compose up -d postgres redis zookeeper kafka

# Wait for infrastructure services to be ready
echo -e "${BLUE}Waiting for infrastructure services to be ready...${NC}"
sleep 10

# Function to start a service in a new terminal
start_service() {
    local service_name=$1
    local service_path=$2
    local start_command=$3
    
    echo -e "${GREEN}Starting $service_name...${NC}"
    osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/$service_path && $start_command\"" 2>/dev/null || \
    start-process "wt" -ArgumentList "new-tab", "-d", "$(pwd)/$service_path", "$start_command" 2>/dev/null || \
    x-terminal-emulator -e "cd $(pwd)/$service_path && $start_command" 2>/dev/null || \
    gnome-terminal -- bash -c "cd $(pwd)/$service_path && $start_command" 2>/dev/null || \
    xterm -e "cd $(pwd)/$service_path && $start_command" 2>/dev/null || \
    echo "Could not open a new terminal window. Please start $service_name manually: cd $service_path && $start_command"
}

# Start backend services
start_service "Auth Service" "backend/auth-service" "pnpm install && pnpm start"
start_service "Chore Service" "backend/chore-service" "pnpm install && pnpm start"
start_service "Inventory Service" "backend/inventory-service" "pnpm install && pnpm start"
start_service "Shopping Service" "backend/shopping-service" "pnpm install && pnpm start"
start_service "Household Service" "backend/household-service" "pnpm install && pnpm start"

# Start frontend service
start_service "Frontend" "frontend" "pnpm install && pnpm start"

echo -e "${GREEN}All services have been started!${NC}"
echo -e "${BLUE}Infrastructure services are running in Docker${NC}"
echo -e "${BLUE}Backend and frontend services are running in separate terminal windows${NC}" 