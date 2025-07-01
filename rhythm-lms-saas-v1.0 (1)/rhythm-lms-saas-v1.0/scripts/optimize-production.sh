#!/bin/bash

# Production Optimization Script for Rhythm-LMS
# Prepares the platform for server deployment

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[OPTIMIZE]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Install production dependencies
install_production_deps() {
    log "Installing production dependencies..."
    
    npm install --only=production \
        compression \
        helmet \
        express-rate-limit \
        cors \
        winston \
        pm2 \
        node-cache \
        express-session \
        connect-pg-simple
    
    success "Production dependencies installed"
}

# Build the application
build_application() {
    log "Building application for production..."
    
    # Build frontend
    npm run build:client
    
    # Create optimized server bundle
    npm run build:server
    
    success "Application built"
}

# Optimize database connections
optimize_database() {
    log "Creating optimized database configuration..."
    
    cat > config/database.prod.js << 'EOF'
module.exports = {
  client: 'postgresql',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
EOF
    
    success "Database configuration optimized"
}

# Create systemd service
create_systemd_service() {
    log "Creating systemd service file..."
    
    cat > rhythm-lms.service << 'EOF'
[Unit]
Description=Rhythm-LMS AI Education Platform
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=rhythm
Group=rhythm
WorkingDirectory=/opt/rhythm-lms
ExecStart=/usr/bin/node server/production-server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=rhythm-lms

# Environment
Environment=NODE_ENV=production
Environment=PORT=5000
EnvironmentFile=/opt/rhythm-lms/.env

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/rhythm-lms

# Resource limits
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
EOF
    
    success "Systemd service created"
}

# Create nginx configuration
create_nginx_config() {
    log "Creating nginx configuration..."
    
    cat > nginx.rhythm-lms.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Main application
    location / {
        proxy_pass http://127.0.0.1:5000;
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
        
        # Rate limiting
        limit_req zone=app burst=10 nodelay;
    }
    
    # API endpoints with stricter rate limiting
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Stricter rate limiting for API
        limit_req zone=api burst=5 nodelay;
    }
    
    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000;
        access_log off;
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=app:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=2r/s;
EOF
    
    success "Nginx configuration created"
}

# Create PM2 ecosystem file
create_pm2_config() {
    log "Creating PM2 configuration..."
    
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'rhythm-lms',
    script: './server/production-server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
    
    success "PM2 configuration created"
}

# Create monitoring script
create_monitoring() {
    log "Creating monitoring script..."
    
    cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

# Rhythm-LMS Monitoring Script

LOG_FILE="/var/log/rhythm-lms/monitor.log"
mkdir -p "$(dirname "$LOG_FILE")"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Check if service is running
if ! systemctl is-active --quiet rhythm-lms; then
    log_message "ERROR: Rhythm-LMS service is not running"
    systemctl restart rhythm-lms
    log_message "INFO: Attempted to restart Rhythm-LMS service"
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
    log_message "WARNING: High memory usage: ${MEMORY_USAGE}%"
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    log_message "WARNING: High disk usage: ${DISK_USAGE}%"
fi

# Check application health
if ! curl -f http://localhost:5000/health >/dev/null 2>&1; then
    log_message "ERROR: Health check failed"
    systemctl restart rhythm-lms
    log_message "INFO: Restarted service due to health check failure"
fi

log_message "INFO: Monitoring check completed"
EOF
    
    chmod +x scripts/monitor.sh
    success "Monitoring script created"
}

# Create environment template
create_env_template() {
    log "Creating production environment template..."
    
    cat > .env.production << 'EOF'
# Rhythm-LMS Production Configuration

# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://username:password@localhost:5432/rhythm_lms
PGHOST=localhost
PGPORT=5432
PGUSER=rhythm_user
PGDATABASE=rhythm_lms
PGPASSWORD=your_secure_password

# Session Configuration (REQUIRED - Generate secure secret)
SESSION_SECRET=your_super_secure_session_secret_here

# Security Configuration
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# AI Engine Configuration
AI_ENGINE_URL=http://localhost:3030
AI_ENGINE_ENABLED=true

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=/var/log/rhythm-lms/app.log

# Performance Configuration
CLUSTER_MODE=true
CACHE_TTL=300

# SSL Configuration (if using HTTPS)
SSL_ENABLED=false
SSL_CERT_PATH=/path/to/certificate.crt
SSL_KEY_PATH=/path/to/private.key

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS=30
EOF
    
    success "Environment template created"
}

# Create deployment checklist
create_deployment_checklist() {
    log "Creating deployment checklist..."
    
    cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# Rhythm-LMS Production Deployment Checklist

## Pre-Deployment

- [ ] Server meets minimum requirements (4GB RAM, 40GB disk)
- [ ] PostgreSQL database installed and configured
- [ ] Node.js 18+ installed
- [ ] Nginx installed (optional but recommended)
- [ ] SSL certificates obtained (if using HTTPS)

## Environment Setup

- [ ] Copy .env.production to .env and configure all variables
- [ ] Set secure SESSION_SECRET (use: openssl rand -base64 32)
- [ ] Configure DATABASE_URL with actual credentials
- [ ] Set appropriate CORS_ORIGIN for your domain
- [ ] Configure logging paths and permissions

## Database Setup

- [ ] Create database user: `createuser -P rhythm_user`
- [ ] Create database: `createdb -O rhythm_user rhythm_lms`
- [ ] Test database connection
- [ ] Run database migrations: `npm run db:push`

## Application Deployment

- [ ] Copy application files to /opt/rhythm-lms
- [ ] Install dependencies: `npm install --production`
- [ ] Build application: `npm run build`
- [ ] Set file permissions: `chown -R rhythm:rhythm /opt/rhythm-lms`
- [ ] Test application: `node server/production-server.js`

## Service Configuration

- [ ] Copy systemd service file to /etc/systemd/system/
- [ ] Reload systemd: `systemctl daemon-reload`
- [ ] Enable service: `systemctl enable rhythm-lms`
- [ ] Start service: `systemctl start rhythm-lms`
- [ ] Check status: `systemctl status rhythm-lms`

## Web Server Setup (Optional)

- [ ] Copy nginx configuration to /etc/nginx/sites-available/
- [ ] Enable site: `ln -s /etc/nginx/sites-available/rhythm-lms /etc/nginx/sites-enabled/`
- [ ] Test nginx config: `nginx -t`
- [ ] Reload nginx: `systemctl reload nginx`

## Security Configuration

- [ ] Configure firewall to allow only necessary ports
- [ ] Set up SSL certificates (if using HTTPS)
- [ ] Configure fail2ban for intrusion detection
- [ ] Set up log rotation
- [ ] Create backup strategy

## Monitoring Setup

- [ ] Set up monitoring script as cron job: `*/5 * * * * /opt/rhythm-lms/scripts/monitor.sh`
- [ ] Configure log monitoring
- [ ] Set up alerting for critical issues
- [ ] Test health check endpoint: `/health`

## Post-Deployment Testing

- [ ] Verify application loads correctly
- [ ] Test user registration and login
- [ ] Verify AI engine functionality
- [ ] Test curriculum generation features
- [ ] Check all API endpoints
- [ ] Verify database connectivity
- [ ] Test backup and restore procedures

## Performance Optimization

- [ ] Enable gzip compression
- [ ] Configure static file caching
- [ ] Set up CDN (if needed)
- [ ] Monitor resource usage
- [ ] Optimize database queries
- [ ] Configure connection pooling

## Documentation

- [ ] Document server configuration
- [ ] Create admin procedures
- [ ] Set up user training materials
- [ ] Document backup and recovery procedures
EOF
    
    success "Deployment checklist created"
}

# Main optimization function
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                      ║"
    echo "║               🚀 RHYTHM-LMS PRODUCTION OPTIMIZER 🚀                 ║"
    echo "║                                                                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
    
    install_production_deps
    build_application
    optimize_database
    create_systemd_service
    create_nginx_config
    create_pm2_config
    create_monitoring
    create_env_template
    create_deployment_checklist
    
    echo
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                      ║"
    echo "║                   ✅ OPTIMIZATION COMPLETE! ✅                      ║"
    echo "║                                                                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Review and configure .env.production"
    echo "2. Follow DEPLOYMENT_CHECKLIST.md"
    echo "3. Test on staging environment first"
    echo "4. Deploy to production server"
    echo
    echo -e "${BLUE}🔧 Production Files Created:${NC}"
    echo "- rhythm-lms.service (systemd service)"
    echo "- nginx.rhythm-lms.conf (nginx config)"
    echo "- ecosystem.config.js (PM2 config)"
    echo "- .env.production (environment template)"
    echo "- scripts/monitor.sh (monitoring script)"
    echo "- DEPLOYMENT_CHECKLIST.md (deployment guide)"
    echo
}

# Run optimization
main "$@"