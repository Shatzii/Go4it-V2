#!/bin/bash

# Go4it Sports Server Setup Script
# Run this script on your server (5.188.99.81) as pharaoh user

echo "🚀 Setting up Go4it Sports on server..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx git nodejs npm php-fpm certbot python3-certbot-nginx ufw

# Create web directory
sudo mkdir -p /var/www/go4it-sports

# Copy files to web directory (run this from the upload directory)
sudo cp -r . /var/www/go4it-sports/

# Set correct permissions
sudo chown -R www-data:www-data /var/www/go4it-sports
sudo find /var/www/go4it-sports -type d -exec chmod 755 {} \;
sudo find /var/www/go4it-sports -type f -exec chmod 644 {} \;

# Create Nginx site configuration
sudo tee /etc/nginx/sites-available/go4it-sports > /dev/null << 'NGINX_EOF'
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

    # Handle PHP files
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
}
NGINX_EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/go4it-sports /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Set up firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow 'OpenSSH'
sudo ufw --force enable

# Set up SSL certificate
sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org --non-interactive --agree-tos --email media@shatzii.com

echo "✅ Server setup completed!"
echo "🌐 Your site should be available at: https://go4itsports.org"
echo ""
echo "📝 Next steps:"
echo "1. Update DNS records to point go4itsports.org to 5.188.99.81"
echo "2. Test the site: curl -I https://go4itsports.org"
echo "3. Check logs: sudo tail -f /var/log/nginx/error.log"
