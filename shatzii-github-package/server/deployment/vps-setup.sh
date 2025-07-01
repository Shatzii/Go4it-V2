#!/bin/bash

# VPS Setup Script for shatzii.com
# Server: 5.161.99.81
# Optimized for production deployment with SSL and monitoring

set -e

# Server Configuration
SERVER_IP="5.161.99.81"
DOMAIN="shatzii.com"
APP_USER="shatzii"
APP_DIR="/home/shatzii/shatzii-platform"
NODE_VERSION="20"
POSTGRES_VERSION="15"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# System Updates and Security
setup_system() {
    log_info "Updating system and installing security packages..."
    
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y \
        curl wget git vim htop \
        ufw fail2ban nginx certbot python3-certbot-nginx \
        postgresql postgresql-contrib \
        software-properties-common apt-transport-https ca-certificates gnupg lsb-release \
        supervisor redis-server \
        build-essential
    
    # Configure firewall
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
    
    log_success "System setup completed"
}

# Install Node.js
install_nodejs() {
    log_info "Installing Node.js ${NODE_VERSION}..."
    
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Install PM2 for process management
    sudo npm install -g pm2
    
    log_success "Node.js ${NODE_VERSION} installed"
}

# Configure PostgreSQL
setup_postgresql() {
    log_info "Configuring PostgreSQL..."
    
    # Start PostgreSQL service
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Create database and user
    sudo -u postgres psql << EOF
CREATE DATABASE shatzii_production;
CREATE USER shatzii_user WITH ENCRYPTED PASSWORD '$(openssl rand -base64 32)';
GRANT ALL PRIVILEGES ON DATABASE shatzii_production TO shatzii_user;
ALTER USER shatzii_user CREATEDB;
\q
EOF
    
    # Save database credentials
    echo "DATABASE_URL=postgresql://shatzii_user:$(openssl rand -base64 32)@localhost:5432/shatzii_production" >> /tmp/production.env
    
    log_success "PostgreSQL configured"
}

# Create application user
create_app_user() {
    log_info "Creating application user: ${APP_USER}..."
    
    if ! id "$APP_USER" &>/dev/null; then
        sudo useradd -m -s /bin/bash $APP_USER
        sudo mkdir -p $APP_DIR
        sudo chown $APP_USER:$APP_USER $APP_DIR
        
        # Add user to sudo group for deployment
        sudo usermod -aG sudo $APP_USER
    fi
    
    log_success "User ${APP_USER} created"
}

# Configure Nginx
setup_nginx() {
    log_info "Configuring Nginx for ${DOMAIN}..."
    
    sudo tee /etc/nginx/sites-available/shatzii.com << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN} ${SERVER_IP};
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self';" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:5000;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/shatzii.com /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    sudo nginx -t
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    log_success "Nginx configured for ${DOMAIN}"
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    log_info "Setting up SSL certificate for ${DOMAIN}..."
    
    # Get SSL certificate
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect
    
    # Setup auto-renewal
    sudo systemctl enable certbot.timer
    
    log_success "SSL certificate installed for ${DOMAIN}"
}

# Configure PM2 ecosystem
setup_pm2() {
    log_info "Configuring PM2 process management..."
    
    sudo -u $APP_USER tee $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'shatzii-platform',
    script: 'server/index.ts',
    interpreter: 'tsx',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_file: '$APP_DIR/logs/combined.log',
    out_file: '$APP_DIR/logs/out.log',
    error_file: '$APP_DIR/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
    
    # Create logs directory
    sudo -u $APP_USER mkdir -p $APP_DIR/logs
    
    # Setup PM2 startup
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $APP_USER --hp $APP_DIR
    
    log_success "PM2 configured"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up system monitoring..."
    
    # Install monitoring tools
    sudo apt install -y netdata
    
    # Configure netdata
    sudo systemctl enable netdata
    sudo systemctl start netdata
    
    # Setup log rotation
    sudo tee /etc/logrotate.d/shatzii << EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 640 $APP_USER $APP_USER
    postrotate
        sudo -u $APP_USER pm2 reloadLogs
    endscript
}
EOF
    
    log_success "Monitoring configured"
}

# Setup Redis for caching
setup_redis() {
    log_info "Configuring Redis..."
    
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
    
    # Configure Redis for production
    sudo tee -a /etc/redis/redis.conf << EOF

# Production optimizations
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
EOF
    
    sudo systemctl restart redis-server
    
    log_success "Redis configured"
}

# Generate production environment file
generate_env() {
    log_info "Generating production environment configuration..."
    
    sudo -u $APP_USER tee $APP_DIR/.env.production << EOF
NODE_ENV=production
PORT=5000
DOMAIN=${DOMAIN}
DATABASE_URL=postgresql://shatzii_user:$(openssl rand -base64 32)@localhost:5432/shatzii_production
REDIS_URL=redis://localhost:6379
SESSION_SECRET=$(openssl rand -base64 64)
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Performance
MAX_FILE_SIZE=10485760
COMPRESSION_LEVEL=6

# Monitoring
LOG_LEVEL=info
EOF
    
    sudo chmod 600 $APP_DIR/.env.production
    
    log_success "Environment configuration generated"
}

# Main execution
main() {
    log_info "Starting VPS setup for shatzii.com on server ${SERVER_IP}..."
    
    setup_system
    install_nodejs
    create_app_user
    setup_postgresql
    setup_redis
    setup_nginx
    setup_pm2
    setup_monitoring
    generate_env
    
    log_success "VPS setup completed successfully!"
    log_info "Next steps:"
    log_info "1. Deploy your application code to ${APP_DIR}"
    log_info "2. Run: sudo -u ${APP_USER} pm2 start ${APP_DIR}/ecosystem.config.js --env production"
    log_info "3. Setup SSL: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
    log_info "4. Configure DNS to point ${DOMAIN} to ${SERVER_IP}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root: sudo $0"
    exit 1
fi

main "$@"