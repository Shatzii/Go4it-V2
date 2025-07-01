#!/bin/bash

# Go4It Sports Platform Deployment Script for go4itsports.org
# Server IP: 167.235.128.41

set -e

echo "🚀 Deploying Go4It Sports Platform to go4itsports.org..."

# Configuration
DOMAIN="go4itsports.org"
SERVER_IP="167.235.128.41"
APP_DIR="/var/www/go4itsports"
USER="www-data"
NODE_VERSION="20"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "This script should not be run as root for security reasons"
    exit 1
fi

# Step 1: Install Node.js and dependencies
print_status "Installing Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs

# Step 2: Install PM2 for process management
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Step 3: Install PostgreSQL if not present
if ! command -v psql &> /dev/null; then
    print_status "Installing PostgreSQL..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    
    # Create database and user
    sudo -u postgres createdb go4itsports_prod
    sudo -u postgres psql -c "CREATE USER go4itsports WITH PASSWORD 'secure_password_here';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4itsports_prod TO go4itsports;"
fi

# Step 4: Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt-get install -y nginx
fi

# Step 5: Create application directory
print_status "Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo mkdir -p $APP_DIR/uploads
sudo chown -R $USER:$USER $APP_DIR

# Step 6: Install dependencies
print_status "Installing application dependencies..."
cd $APP_DIR
npm install --production

# Step 7: Build the application
print_status "Building the application..."
npm run build

# Step 8: Set up environment variables
print_status "Configuring environment variables..."
if [ ! -f "$APP_DIR/.env" ]; then
    cp production.env $APP_DIR/.env
    print_warning "Please edit $APP_DIR/.env with your actual configuration values"
fi

# Step 9: Configure PM2
print_status "Configuring PM2..."
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'go4itsports',
    script: 'server/index.js',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '$APP_DIR/logs/err.log',
    out_file: '$APP_DIR/logs/out.log',
    log_file: '$APP_DIR/logs/combined.log',
    time: true
  }]
};
EOF

# Step 10: Create log directory
sudo mkdir -p $APP_DIR/logs
sudo chown -R $USER:$USER $APP_DIR/logs

# Step 11: Configure Nginx
print_status "Configuring Nginx..."
sudo cat > /etc/nginx/sites-available/go4itsports << EOF
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org $SERVER_IP;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name go4itsports.org www.go4itsports.org;
    
    # SSL Configuration (you'll need to add your SSL certificates)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Client upload size
    client_max_body_size 50M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files
    location /assets/ {
        alias $APP_DIR/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }
    
    # API and dynamic content
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/
sudo nginx -t

# Step 12: Set up SSL with Let's Encrypt (optional)
print_status "Setting up SSL certificate..."
if command -v certbot &> /dev/null; then
    sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org --non-interactive --agree-tos --email admin@go4itsports.org
else
    print_warning "Certbot not installed. Install with: sudo apt-get install certbot python3-certbot-nginx"
    print_warning "Then run: sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org"
fi

# Step 13: Start services
print_status "Starting services..."
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

sudo systemctl reload nginx
sudo systemctl enable nginx

# Step 14: Set up log rotation
print_status "Configuring log rotation..."
sudo cat > /etc/logrotate.d/go4itsports << EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reload go4itsports
    endscript
}
EOF

print_status "✅ Deployment completed successfully!"
print_status "Your Go4It Sports Platform is now running at:"
print_status "🌐 https://go4itsports.org"
print_status "🌐 https://www.go4itsports.org"
print_status ""
print_status "Next steps:"
print_status "1. Edit $APP_DIR/.env with your database credentials and API keys"
print_status "2. Configure SSL certificates if not using Let's Encrypt"
print_status "3. Set up your database with: cd $APP_DIR && npm run db:migrate"
print_status "4. Monitor logs with: pm2 logs go4itsports"
print_status "5. Check status with: pm2 status"
print_status ""
print_warning "Remember to:"
print_warning "- Update DNS records to point go4itsports.org to $SERVER_IP"
print_warning "- Configure firewall to allow ports 80, 443, and 22"
print_warning "- Set up regular backups for your database"
print_warning "- Monitor system resources and performance"