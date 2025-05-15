#!/bin/bash
set -e

# Install common tools
apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
npm install -g pnpm

# Frontend setup
cd /app/frontend/angular
pnpm install

# Auth Service setup
cd /app/backend/auth-service
pnpm install

# Chore Service setup
cd /app/backend/chore-service
pnpm install

# Household Service setup
cd /app/backend/household-service
pnpm install

# Inventory Service setup
cd /app/backend/inventory-service
python -m pip install --upgrade pip
pip install -r requirements.txt

# Shopping Service setup
cd /app/backend/shopping-service
dotnet restore

# Create necessary directories for persistent data
mkdir -p /app/data/postgres
mkdir -p /app/data/redis
mkdir -p /app/data/kafka
mkdir -p /app/data/pgadmin

# Set proper permissions
chown -R node:node /app

echo "Development environment setup completed!" 