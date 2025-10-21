#!/bin/bash

# Create deployment package for Go4it Sports

echo "🚀 Creating deployment package for go4itsports.org"

# Create deployment directory
mkdir -p deployment-package

# Copy essential files (excluding git, node_modules, etc.)
rsync -av --exclude='.git' \
          --exclude='node_modules' \
          --exclude='*.log' \
          --exclude='deployment-package' \
          --exclude='.env' \
          . deployment-package/

# Create server setup script
cat > deployment-package/server-setup.sh << 'EOF'
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
EOF

# Make the server setup script executable
chmod +x deployment-package/server-setup.sh

# Create update script
cat > deployment-package/update-site.sh << 'EOF'
#!/bin/bash

# Update Go4it Sports from GitHub

echo "🔄 Updating Go4it Sports..."

# Go to web directory
cd /var/www/go4it-sports

# Pull latest changes
sudo git pull origin main

# Set permissions
sudo chown -R www-data:www-data .
sudo find . -type d -exec chmod 755 {} \;
sudo find . -type f -exec chmod 644 {} \;

# Reload Nginx
sudo systemctl reload nginx

echo "✅ Site updated successfully!"
EOF

chmod +x deployment-package/update-site.sh

# Create archive
tar -czf go4it-sports-deployment.tar.gz deployment-package/

echo "✅ Deployment package created!"
echo "📦 Package: go4it-sports-deployment.tar.gz"
echo "📁 Directory: deployment-package/"
echo ""
echo "🚀 Next steps:"
echo "1. Upload go4it-sports-deployment.tar.gz to your server"
echo "2. Extract: tar -xzf go4it-sports-deployment.tar.gz"
echo "3. Run: cd deployment-package && ./server-setup.sh"
