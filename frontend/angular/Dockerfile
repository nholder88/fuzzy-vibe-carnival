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

EXPOSE 4200

ENV NODE_ENV development

# Use ng serve with host 0.0.0.0 to allow external connections
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
