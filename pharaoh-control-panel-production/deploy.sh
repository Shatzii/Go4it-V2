#!/bin/bash

# Pharaoh Control Panel 2.0 - Production Deployment Script
# This script will deploy your AI-powered server management platform

set -e

echo "🚀 PHARAOH CONTROL PANEL 2.0 - DEPLOYMENT SCRIPT"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

print_header "🔍 SYSTEM REQUIREMENTS CHECK"
echo "============================================"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ first"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm found: $NPM_VERSION"
else
    print_error "npm not found. Please install npm first"
    exit 1
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    print_status "PostgreSQL found: $PSQL_VERSION"
else
    print_warning "PostgreSQL not found. Please install PostgreSQL 12+ or provide external database URL"
fi

# Check PM2
if command -v pm2 &> /dev/null; then
    print_status "PM2 found - will use for process management"
    HAS_PM2=true
else
    print_warning "PM2 not found - installing globally"
    sudo npm install -g pm2
    HAS_PM2=true
fi

print_header "📝 ENVIRONMENT CONFIGURATION"
echo "============================================"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating environment configuration..."
    
    # Prompt for database URL if not set
    if [ -z "$DATABASE_URL" ]; then
        echo "Enter your PostgreSQL database URL:"
        echo "Format: postgresql://username:password@host:port/database"
        read -p "DATABASE_URL: " DATABASE_URL
    fi
    
    # Generate session secret
    SESSION_SECRET=$(openssl rand -base64 32)
    
    # Create .env file
    cat > .env << EOF
# Pharaoh Control Panel Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=$DATABASE_URL

# Session Configuration
SESSION_SECRET=$SESSION_SECRET

# Application Configuration
APP_NAME=Pharaoh Control Panel
APP_VERSION=2.0.0
APP_URL=https://your-domain.com

# Optional: Stripe Configuration (for billing)
# STRIPE_PUBLIC_KEY=pk_live_...
# STRIPE_SECRET_KEY=sk_live_...

# Optional: Email Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
EOF
    
    print_status "Environment file created successfully"
else
    print_status "Environment file already exists"
fi

print_header "📦 DEPENDENCY INSTALLATION"
echo "============================================"

print_status "Installing production dependencies..."
npm ci --only=production

print_header "🏗️  APPLICATION BUILD"
echo "============================================"

print_status "Building application for production..."
npm run build

print_header "🗄️  DATABASE SETUP"
echo "============================================"

print_status "Setting up database schema..."
npm run db:push

# Create default admin user
print_status "Creating default admin user..."
node -e "
const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createAdmin() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  const hashedPassword = await bcrypt.hash('pharaoh123', 10);
  const adminId = 'admin-' + Date.now();
  
  try {
    await client.query(\`
      INSERT INTO users (id, email, password, first_name, last_name, plan)
      VALUES (\$1, \$2, \$3, \$4, \$5, \$6)
      ON CONFLICT (email) DO NOTHING
    \`, [adminId, 'admin@pharaoh.local', hashedPassword, 'Admin', 'User', 'pro']);
    
    console.log('✅ Default admin user created');
    console.log('Email: admin@pharaoh.local');
    console.log('Password: pharaoh123');
  } catch (error) {
    console.log('ℹ️  Admin user may already exist');
  }
  
  await client.end();
}

createAdmin().catch(console.error);
"

print_header "🔧 REVERSE PROXY SETUP"
echo "============================================"

# Create nginx configuration
print_status "Creating nginx configuration..."
sudo tee /etc/nginx/sites-available/pharaoh-control-panel << EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;  # Replace with your domain
    
    # SSL Configuration (you'll need to add your certificates)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Main application
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
    }
    
    # WebSocket support for real-time features
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/pharaoh-control-panel /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

print_header "🔄 PROCESS MANAGEMENT SETUP"
echo "============================================"

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'pharaoh-control-panel',
    script: 'npm',
    args: 'start',
    cwd: '$(pwd)',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start the application with PM2
print_status "Starting Pharaoh Control Panel with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_header "🔒 SECURITY SETUP"
echo "============================================"

# Setup firewall rules
print_status "Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

print_header "📊 MONITORING SETUP"
echo "============================================"

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/pharaoh-control-panel << EOF
$(pwd)/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $(whoami) $(whoami)
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

print_header "✅ DEPLOYMENT COMPLETE!"
echo "============================================"

print_status "Pharaoh Control Panel 2.0 has been successfully deployed!"
echo ""
echo -e "${GREEN}🎉 DEPLOYMENT SUMMARY:${NC}"
echo "----------------------------------------"
echo "• Application URL: http://your-domain.com"
echo "• Admin Login: admin@pharaoh.local"
echo "• Admin Password: pharaoh123"
echo "• Process Status: $(pm2 status pharaoh-control-panel --no-colors)"
echo "• Logs Location: $(pwd)/logs/"
echo ""
echo -e "${BLUE}📋 NEXT STEPS:${NC}"
echo "----------------------------------------"
echo "1. Update your domain in nginx config: /etc/nginx/sites-available/pharaoh-control-panel"
echo "2. Install SSL certificate (recommended: Let's Encrypt)"
echo "3. Change default admin password after first login"
echo "4. Configure email settings in .env for notifications"
echo "5. Set up database backups"
echo ""
echo -e "${GREEN}🚀 Your AI-powered server management platform is now live!${NC}"
EOF