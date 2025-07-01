#!/bin/bash

# GitHub Copilot Optimized Deployment Script for schools.shatzii.com
# Universal One School - Complete Production Deployment

set -e

echo "🚀 Starting GitHub Copilot optimized deployment for Universal One School"
echo "Target: schools.shatzii.com (178.156.185.43)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root or with sudo"
    exit 1
fi

# Set deployment directory
DEPLOY_DIR="/var/www/schools.shatzii.com"
BACKUP_DIR="/var/backups/schools.shatzii.com-$(date +%Y%m%d-%H%M%S)"

print_status "Creating deployment directory: $DEPLOY_DIR"
mkdir -p $DEPLOY_DIR

# Backup existing deployment if it exists
if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
    print_warning "Backing up existing deployment to $BACKUP_DIR"
    mkdir -p $(dirname $BACKUP_DIR)
    cp -r $DEPLOY_DIR $BACKUP_DIR
fi

# Install Node.js 18 if not installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_warning "Node.js version $NODE_VERSION detected. Upgrading to Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    else
        print_success "Node.js $(node -v) is already installed"
    fi
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 process manager..."
    npm install -g pm2
else
    print_success "PM2 $(pm2 -v) is already installed"
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx web server..."
    apt-get update
    apt-get install -y nginx
else
    print_success "Nginx is already installed"
fi

# Copy application files to deployment directory
print_status "Copying application files to $DEPLOY_DIR"
cp -r app $DEPLOY_DIR/
cp -r components $DEPLOY_DIR/
cp -r lib $DEPLOY_DIR/
cp -r hooks $DEPLOY_DIR/
cp -r shared $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/
cp next.config.js $DEPLOY_DIR/
cp tailwind.config.ts $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp globals.css $DEPLOY_DIR/app/globals.css

# Copy environment template
cp .env.template $DEPLOY_DIR/.env.production

# Set proper ownership
chown -R www-data:www-data $DEPLOY_DIR

print_status "Installing application dependencies..."
cd $DEPLOY_DIR
npm install --production

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    print_warning "Environment file .env.local not found!"
    print_warning "Please copy .env.production to .env.local and add your API keys:"
    print_warning "- ANTHROPIC_API_KEY"
    print_warning "- OPENAI_API_KEY" 
    print_warning "- DATABASE_URL"
    print_warning "- SESSION_SECRET"
    
    read -p "Do you want to create .env.local now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.production .env.local
        print_status "Created .env.local from template. Please edit it with your values:"
        nano .env.local
    else
        print_error "Deployment cannot continue without environment variables"
        exit 1
    fi
fi

print_status "Building Next.js application for production..."
npm run build

# Stop existing PM2 process if running
if pm2 list | grep -q "schools-shatzii"; then
    print_status "Stopping existing schools-shatzii process..."
    pm2 stop schools-shatzii
    pm2 delete schools-shatzii
fi

print_status "Starting application with PM2..."
pm2 start npm --name "schools-shatzii" -- start
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u www-data --hp /var/www

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/schools.shatzii.com << 'EOF'
server {
    listen 80;
    server_name schools.shatzii.com www.schools.shatzii.com;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Static files optimization
    location /_next/static {
        alias /var/www/schools.shatzii.com/.next/static;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }
    
    # Public files
    location /favicon.ico {
        alias /var/www/schools.shatzii.com/public/favicon.ico;
        expires 365d;
        access_log off;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/schools.shatzii.com /etc/nginx/sites-enabled/

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "Testing Nginx configuration..."
if nginx -t; then
    print_success "Nginx configuration is valid"
    systemctl reload nginx
    systemctl enable nginx
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot for SSL certificates..."
    apt-get install -y certbot python3-certbot-nginx
fi

# Setup firewall rules
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

print_success "Deployment completed successfully!"
print_status "Next steps:"
echo "1. Verify the site is running: curl -I http://schools.shatzii.com"
echo "2. Setup SSL certificate: certbot --nginx -d schools.shatzii.com -d www.schools.shatzii.com"
echo "3. Check PM2 status: pm2 status"
echo "4. View logs: pm2 logs schools-shatzii"

print_status "Application Status:"
pm2 status
print_status "Nginx Status:"
systemctl status nginx --no-pager -l

print_success "Universal One School is now deployed at http://schools.shatzii.com"
print_warning "Don't forget to setup SSL with: certbot --nginx -d schools.shatzii.com"