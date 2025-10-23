## Multi-stage Dockerfile for Go4It OS
# Builder: install dependencies and build on Linux
FROM node:20-bullseye AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Use CI-style install (will use package-lock.json if present)
RUN npm ci --omit=dev || npm install --omit=dev

# Copy rest of the source
COPY . .

# Build the Next.js app
RUN npm run build --if-present

# Runtime image
FROM node:20-slim AS runtime
WORKDIR /app

# Use non-root user (optional)
RUN useradd -m appuser || true
USER appuser

# Copy production files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000
ENV PORT=5000 NODE_ENV=production

# Use start script (ensure package.json provides a production start)
CMD ["npm","run","start"]
