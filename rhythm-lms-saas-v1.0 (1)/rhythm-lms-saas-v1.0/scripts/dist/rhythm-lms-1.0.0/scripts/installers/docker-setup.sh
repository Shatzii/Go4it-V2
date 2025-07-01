#!/bin/bash

# Rhythm-LMS Docker Deployment Script
# Simplifies deployment using Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/opt/rhythm-lms"
DB_PASSWORD=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

log() {
    echo -e "$1"
}

print_header() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                      ║"
    echo "║               🐳 RHYTHM-LMS DOCKER INSTALLER 🐳                     ║"
    echo "║                                                                      ║"
    echo "║          Containerized AI Education Platform                         ║"
    echo "║                                                                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
}

check_docker() {
    log "${BLUE}🔍 Checking Docker installation...${NC}"
    
    if ! command -v docker &> /dev/null; then
        log "${YELLOW}Docker not found. Installing Docker...${NC}"
        curl -fsSL https://get.docker.com | sh
        systemctl start docker
        systemctl enable docker
        usermod -aG docker $USER
        log "${GREEN}✅ Docker installed${NC}"
    else
        log "${GREEN}✅ Docker is already installed${NC}"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log "${YELLOW}Docker Compose not found. Installing...${NC}"
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        log "${GREEN}✅ Docker Compose installed${NC}"
    else
        log "${GREEN}✅ Docker Compose is already installed${NC}"
    fi
}

create_docker_compose() {
    log "${BLUE}📝 Creating Docker Compose configuration...${NC}"
    
    mkdir -p $INSTALL_DIR
    cd $INSTALL_DIR
    
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  # PostgreSQL Database
  database:
    image: postgres:15-alpine
    container_name: rhythm-lms-db
    environment:
      POSTGRES_DB: rhythm_lms
      POSTGRES_USER: rhythm_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - rhythm-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rhythm_user -d rhythm_lms"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache (Optional)
  redis:
    image: redis:7-alpine
    container_name: rhythm-lms-redis
    volumes:
      - redis_data:/data
    networks:
      - rhythm-network
    restart: unless-stopped
    command: redis-server --appendonly yes

  # Rhythm-LMS Application
  app:
    build: .
    container_name: rhythm-lms-app
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://rhythm_user:${DB_PASSWORD}@database:5432/rhythm_lms
      REDIS_URL: redis://redis:6379
      SESSION_SECRET: ${SESSION_SECRET}
      PORT: 5000
      AI_ENGINE_ENABLED: "true"
    ports:
      - "80:5000"
      - "443:5000"
    volumes:
      - app_data:/app/data
      - ./uploads:/app/uploads
    networks:
      - rhythm-network
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: rhythm-lms-nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    networks:
      - rhythm-network
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  app_data:
    driver: local

networks:
  rhythm-network:
    driver: bridge
EOF

    log "${GREEN}✅ Docker Compose configuration created${NC}"
}

create_dockerfile() {
    log "${BLUE}📝 Creating Dockerfile...${NC}"
    
    cat > Dockerfile << 'EOF'
# Use Node.js LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client \
    curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads data

# Set permissions
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
EOF

    log "${GREEN}✅ Dockerfile created${NC}"
}

create_nginx_config() {
    log "${BLUE}📝 Creating Nginx configuration...${NC}"
    
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:5000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m;

    server {
        listen 80;
        server_name _;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Main application
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # API routes with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /ws {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # File uploads
        location /uploads {
            proxy_pass http://app;
            client_max_body_size 100M;
            proxy_request_buffering off;
        }

        # Health check
        location /health {
            proxy_pass http://app/api/health;
            access_log off;
        }
    }
}
EOF

    log "${GREEN}✅ Nginx configuration created${NC}"
}

create_env_file() {
    log "${BLUE}📝 Creating environment configuration...${NC}"
    
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://rhythm_user:${DB_PASSWORD}@database:5432/rhythm_lms
PGHOST=database
PGPORT=5432
PGUSER=rhythm_user
PGDATABASE=rhythm_lms
PGPASSWORD=${DB_PASSWORD}

# Application Configuration
NODE_ENV=production
PORT=5000
SESSION_SECRET=${SESSION_SECRET}

# Redis Configuration
REDIS_URL=redis://redis:6379

# AI Engine Configuration
AI_ENGINE_URL=http://localhost:3030
AI_ENGINE_ENABLED=true

# Security Configuration
CORS_ORIGIN=*
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# File Upload Configuration
UPLOAD_MAX_SIZE=100MB
UPLOAD_PATH=/app/uploads

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined
EOF

    chmod 600 .env
    log "${GREEN}✅ Environment file created${NC}"
}

create_production_package() {
    log "${BLUE}📝 Creating production package.json...${NC}"
    
    cat > package.json << 'EOF'
{
  "name": "rhythm-lms",
  "version": "1.0.0",
  "description": "Self-hosted AI Education Platform",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:server && npm run build:client",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=dist/server/index.js --external:pg-native",
    "build:client": "vite build",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "health-check": "curl -f http://localhost:5000/api/health"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "drizzle-orm": "^0.29.0",
    "redis": "^4.6.10",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-session": "^1.17.3",
    "connect-redis": "^7.1.0",
    "multer": "^1.4.5-lts.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "tsx": "^4.6.0",
    "esbuild": "^0.19.8",
    "vite": "^5.0.0",
    "@types/node": "^20.9.0",
    "@types/express": "^4.17.21",
    "@types/pg": "^8.10.7",
    "eslint": "^8.54.0",
    "jest": "^29.7.0",
    "drizzle-kit": "^0.20.4"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/rhythm-lms/platform.git"
  },
  "keywords": [
    "education",
    "ai",
    "neurodivergent",
    "learning",
    "curriculum",
    "self-hosted"
  ],
  "author": "Rhythm-LMS Team",
  "license": "MIT"
}
EOF

    log "${GREEN}✅ Production package.json created${NC}"
}

start_deployment() {
    log "${BLUE}🚀 Starting Docker deployment...${NC}"
    
    # Build and start containers
    docker-compose up -d --build
    
    # Wait for services to be healthy
    log "${YELLOW}⏳ Waiting for services to start...${NC}"
    sleep 30
    
    # Check service health
    if docker-compose ps | grep -q "healthy"; then
        log "${GREEN}✅ Services are running and healthy${NC}"
        
        # Get container IP
        SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
        
        log "${CYAN}🌐 Platform Access Information:${NC}"
        log "${YELLOW}   Primary URL: ${BLUE}http://$SERVER_IP${NC}"
        log "${YELLOW}   Admin Panel: ${BLUE}http://$SERVER_IP:8080${NC}"
        log "${YELLOW}   Health Check: ${BLUE}http://$SERVER_IP/health${NC}"
        
    else
        log "${RED}❌ Some services failed to start${NC}"
        log "${YELLOW}Check logs: docker-compose logs${NC}"
        exit 1
    fi
}

create_management_scripts() {
    log "${BLUE}📝 Creating management scripts...${NC}"
    
    # Create start script
    cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting Rhythm-LMS..."
docker-compose up -d
echo "Platform started. Check status with: docker-compose ps"
EOF
    
    # Create stop script
    cat > stop.sh << 'EOF'
#!/bin/bash
echo "Stopping Rhythm-LMS..."
docker-compose down
echo "Platform stopped."
EOF
    
    # Create restart script
    cat > restart.sh << 'EOF'
#!/bin/bash
echo "Restarting Rhythm-LMS..."
docker-compose restart
echo "Platform restarted."
EOF
    
    # Create backup script
    cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating backup..."
docker-compose exec -T database pg_dump -U rhythm_user rhythm_lms > "$BACKUP_DIR/database.sql"
docker cp rhythm-lms-app:/app/uploads "$BACKUP_DIR/uploads"
docker cp rhythm-lms-app:/app/data "$BACKUP_DIR/data"

echo "Backup created in $BACKUP_DIR"
EOF
    
    # Create logs script
    cat > logs.sh << 'EOF'
#!/bin/bash
if [ "$1" = "app" ]; then
    docker-compose logs -f app
elif [ "$1" = "db" ]; then
    docker-compose logs -f database
elif [ "$1" = "nginx" ]; then
    docker-compose logs -f nginx
else
    docker-compose logs -f
fi
EOF
    
    # Make scripts executable
    chmod +x *.sh
    
    log "${GREEN}✅ Management scripts created${NC}"
}

print_success() {
    clear
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                      ║"
    echo "║                🎉 DOCKER DEPLOYMENT SUCCESSFUL! 🎉                  ║"
    echo "║                                                                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
    echo -e "${CYAN}🐳 Your containerized Rhythm-LMS platform is ready!${NC}"
    echo
    echo -e "${YELLOW}📋 Access Information:${NC}"
    echo -e "   URL: ${BLUE}http://$SERVER_IP${NC}"
    echo -e "   Admin Panel: ${BLUE}http://$SERVER_IP:8080${NC}"
    echo
    echo -e "${YELLOW}🔧 Management Commands:${NC}"
    echo -e "   Start: ${BLUE}./start.sh${NC}"
    echo -e "   Stop: ${BLUE}./stop.sh${NC}"
    echo -e "   Restart: ${BLUE}./restart.sh${NC}"
    echo -e "   Logs: ${BLUE}./logs.sh [app|db|nginx]${NC}"
    echo -e "   Backup: ${BLUE}./backup.sh${NC}"
    echo -e "   Status: ${BLUE}docker-compose ps${NC}"
    echo
    echo -e "${YELLOW}📚 Next Steps:${NC}"
    echo -e "   1. Visit your platform URL"
    echo -e "   2. Complete initial setup"
    echo -e "   3. Configure SSL (optional)"
    echo -e "   4. Set up automated backups"
    echo
    echo -e "${GREEN}🚀 Enjoy your self-hosted AI education platform!${NC}"
    echo
}

main() {
    print_header
    
    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
        log "${RED}This script must be run as root. Please use sudo.${NC}"
        exit 1
    fi
    
    log "${CYAN}Starting Docker deployment of Rhythm-LMS...${NC}"
    echo
    
    check_docker
    create_docker_compose
    create_dockerfile
    create_nginx_config
    create_env_file
    create_production_package
    create_management_scripts
    start_deployment
    
    print_success
}

# Error handling
trap 'log "${RED}❌ Docker deployment failed.${NC}"; exit 1' ERR

# Run deployment
main "$@"