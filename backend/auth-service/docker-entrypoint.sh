#!/bin/sh
set -e

# Function to check if a service is ready
wait_for_service() {
    local host=$1
    local port=$2
    local service=$3
    
    echo "Waiting for $service to be ready..."
    while ! nc -z $host $port; do
        sleep 1
    done
    echo "$service is ready!"
}

# Wait for database if needed
if [ "$WAIT_FOR_DB" = "true" ]; then
    wait_for_service $POSTGRES_HOST $POSTGRES_PORT "PostgreSQL"
fi

# Only run seeding if SEED_DATABASE environment variable is set
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Running database seeding..."
    pnpm run seed
fi

# Start the application
echo "Starting auth service..."
exec pnpm run start:prod 