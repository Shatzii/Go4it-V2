#!/bin/bash

# Server-side deployment script for Go4it Sports
# Run this script on the server as pharaoh user

SERVER_IP="5.188.99.81"
DOMAIN="go4itsports.org"
PROJECT_NAME="go4it-sports"
DEPLOY_PATH="/var/www/$PROJECT_NAME"

echo "🚀 Starting deployment on server for domain $DOMAIN"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as pharaoh user
if [ "$USER" != "pharaoh" ]; then
    print_warning "This script should be run as the pharaoh user"
    print_status "Current user: $USER"
fi

# Create deployment directory
print_status "Creating deployment directory..."
sudo mkdir -p $DEPLOY_PATH

# Copy application files (assuming they're in the current directory)
print_status "Copying application files..."
if [ -d "app" ]; then
    sudo cp -r app/* $DEPLOY_PATH/
else
    print_warning "No 'app' directory found. Please ensure application files are in the correct location."
    print_status "Current directory contents:"
    ls -la
fi

# Install dependencies (if package.json exists)
if [ -f "$DEPLOY_PATH/package.json" ]; then
    print_status "Installing dependencies..."
    cd $DEPLOY_PATH
    sudo npm install --production
else
    print_status "No package.json found, skipping npm install"
fi

# Set up Nginx configuration
print_status "Setting up Nginx configuration..."
sudo cat > /etc/nginx/sites-available/$PROJECT_NAME << 'NGINXEOF'
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    root /var/www/go4it-sports;
    index index.html index.php index.htm;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Handle static files
    location / {
        try_files $uri $uri/ /index.html;
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
        add_header Cache-Control "public, immutable";
    }

    # Security for uploads (if any)
    location /uploads/ {
        location ~ \.php$ {
            deny all;
        }
    }
}
NGINXEOF

# Enable the site
print_status "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
if sudo nginx -t; then
    sudo systemctl reload nginx
    print_status "Nginx configuration updated successfully"
else
    print_error "Nginx configuration test failed"
fi

# Set correct permissions
print_status "Setting file permissions..."
sudo chown -R www-data:www-data $DEPLOY_PATH
sudo find $DEPLOY_PATH -type d -exec chmod 755 {} \;
sudo find $DEPLOY_PATH -type f -exec chmod 644 {} \;

# Install SSL certificate (Let's Encrypt)
print_status "Setting up SSL certificate..."
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
if sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email media@shatzii.com; then
    print_status "SSL certificate installed successfully"
else
    print_warning "SSL certificate installation failed. You may need to run this manually:"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

print_status "✅ Deployment completed successfully!"
print_status "🌐 Your site should be available at: https://$DOMAIN"
print_status "📊 Check status: systemctl status nginx"

echo ""
echo "🔧 Manual steps if needed:"
echo "1. Update DNS records to point $DOMAIN to $SERVER_IP"
echo "2. Check Nginx logs: tail -f /var/log/nginx/error.log"
echo "3. Restart services: systemctl restart nginx"
echo "4. Test website: curl -I https://$DOMAIN"
