# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies)
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy entrypoint script first and set permissions
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Copy package files and install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set proper permissions for all files
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1

CMD ["./docker-entrypoint.sh"] 