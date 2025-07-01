# Universal One School Cybersecurity Platform - Docker Configuration
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./
COPY drizzle.config.ts ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY backend/ ./server/
COPY frontend/ ./client/
COPY database/ ./shared/

# Create necessary directories
RUN mkdir -p logs/security uploads/evidence backups && \
    chmod 700 logs/security uploads/evidence backups

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S cybersecurity -u 1001

# Change ownership of app directory
RUN chown -R cybersecurity:nodejs /app
USER cybersecurity

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]