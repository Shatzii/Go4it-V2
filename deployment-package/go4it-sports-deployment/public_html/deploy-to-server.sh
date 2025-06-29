#!/bin/bash

# Go4it Sports Deployment Script
# Deploy to: 5.188.99.81
# Domain: go4itsports.org

SERVER_IP="5.188.99.81"
DOMAIN="go4itsports.org"
PROJECT_NAME="go4it-sports"
DEPLOY_PATH="/var/www/$PROJECT_NAME"

echo "🚀 Starting deployment to $SERVER_IP for domain $DOMAIN"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Test SSH connection
print_status "Testing SSH connection to $SERVER_IP..."
if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$SERVER_IP "echo 'SSH connection successful'"; then
    print_status "SSH connection established successfully"
else
    print_error "Failed to establish SSH connection to $SERVER_IP"
    exit 1
fi

# Create deployment directory
print_status "Creating deployment directory..."
ssh root@$SERVER_IP "mkdir -p $DEPLOY_PATH"

# Clone or update repository
print_status "Cloning/updating repository..."
ssh root@$SERVER_IP "
    cd /var/www/
    if [ -d '$PROJECT_NAME' ]; then
        cd $PROJECT_NAME
        git pull origin main
    else
        git clone https://github.com/Shatzii/Go4it-Sports.git $PROJECT_NAME
        cd $PROJECT_NAME
    fi
"

# Install dependencies (if package.json exists)
print_status "Installing dependencies..."
ssh root@$SERVER_IP "
    cd $DEPLOY_PATH
    if [ -f 'package.json' ]; then
        npm install --production
    fi
"

# Set up Nginx configuration
print_status "Setting up Nginx configuration..."
ssh root@$SERVER_IP "
cat > /etc/nginx/sites-available/$PROJECT_NAME << 'EOF'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $DEPLOY_PATH;
    index index.html index.php index.htm;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection \"1; mode=block\";

    # Handle static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Handle PHP files (if needed)
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # Security for uploads (if any)
    location /uploads/ {
        location ~ \.php$ {
            deny all;
        }
    }
}
EOF
"

# Enable the site
print_status "Enabling Nginx site..."
ssh root@$SERVER_IP "
    ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
"

# Set correct permissions
print_status "Setting file permissions..."
ssh root@$SERVER_IP "
    chown -R www-data:www-data $DEPLOY_PATH
    find $DEPLOY_PATH -type d -exec chmod 755 {} \;
    find $DEPLOY_PATH -type f -exec chmod 644 {} \;
"

# Install SSL certificate (Let's Encrypt)
print_status "Setting up SSL certificate..."
ssh root@$SERVER_IP "
    apt update && apt install -y certbot python3-certbot-nginx
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email media@shatzii.com
"

print_status "✅ Deployment completed successfully!"
print_status "🌐 Your site should be available at: https://$DOMAIN"
print_status "📊 Check status: systemctl status nginx"

echo ""
echo "🔧 Manual steps if needed:"
echo "1. Update DNS records to point $DOMAIN to $SERVER_IP"
echo "2. Check Nginx logs: tail -f /var/log/nginx/error.log"
echo "3. Restart services: systemctl restart nginx"
