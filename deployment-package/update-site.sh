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
