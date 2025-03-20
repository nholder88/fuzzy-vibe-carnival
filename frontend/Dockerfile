FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install

# Development mode - no build step
FROM base AS runner
WORKDIR /app

# Copy node_modules and rest of the code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create the public directory if it doesn't exist
RUN mkdir -p /app/public

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV development
# Uncomment the following line to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "dev"] 