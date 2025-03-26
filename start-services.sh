#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Array to track failed services
declare -a failed_services=()

echo -e "${BLUE}Starting infrastructure services (Kafka, Postgres, Redis)...${NC}"
if docker compose up -d postgres redis zookeeper kafka; then
    echo -e "${GREEN}Infrastructure services started successfully${NC}"
else
    echo -e "${RED}Failed to start infrastructure services${NC}"
    exit 1
fi

# Wait for infrastructure services to be ready
echo -e "${BLUE}Waiting for infrastructure services to be ready...${NC}"
sleep 10

# Function to start a service in a new terminal
start_service() {
    local service_name=$1
    local service_path=$2
    local start_command=$3
    
    echo -e "${BLUE}Starting $service_name...${NC}"
    if osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/$service_path && $start_command\"" 2>/dev/null || \
       start-process "wt" -ArgumentList "new-tab", "-d", "$(pwd)/$service_path", "$start_command" 2>/dev/null || \
       x-terminal-emulator -e "cd $(pwd)/$service_path && $start_command" 2>/dev/null || \
       gnome-terminal -- bash -c "cd $(pwd)/$service_path && $start_command" 2>/dev/null || \
       xterm -e "cd $(pwd)/$service_path && $start_command" 2>/dev/null; then
        echo -e "${GREEN}Successfully started $service_name${NC}"
    else
        echo -e "${RED}Failed to start $service_name${NC}"
        echo -e "${RED}Please start $service_name manually with: cd $service_path && $start_command${NC}"
        failed_services+=("$service_name")
    fi
}

# Start backend services
start_service "Auth Service" "backend/auth-service" "pnpm install && pnpm start"
start_service "Chore Service" "backend/chore-service" "pnpm install && pnpm start"
start_service "Inventory Service" "backend/inventory-service" "pnpm install && pnpm start"
start_service "Shopping Service" "backend/shopping-service" "pnpm install && pnpm start"
start_service "Household Service" "backend/household-service" "pnpm install && pnpm start"

# Start frontend service
start_service "Frontend" "frontend" "pnpm install && pnpm start"

echo
if [ ${#failed_services[@]} -eq 0 ]; then
    echo -e "${GREEN}All services have been started successfully!${NC}"
else
    echo -e "${RED}The following services failed to start and need to be started manually:${NC}"
    printf "${RED}%s${NC}\n" "${failed_services[@]}"
fi

echo -e "${BLUE}Infrastructure services are running in Docker${NC}"
if [ ${#failed_services[@]} -eq 0 ]; then
    echo -e "${BLUE}All backend and frontend services are running in separate terminal windows${NC}"
fi 