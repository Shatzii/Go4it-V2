#!/bin/bash

# ==============================================
# GO4IT SPORTS INDEX ROUTE FIX
# Version: 1.0.0
# This script fixes routing for both API and SPA routes
# ==============================================

echo "===== GO4IT SPORTS INDEX ROUTE FIX ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"
echo "Current directory: $(pwd)"

# Step 1: Fix the port conflict by stopping any process using port 5001
echo
echo "===== FIXING PORT CONFLICT ====="
PORT_PID=$(lsof -ti:5001)
if [ ! -z "$PORT_PID" ]; then
  echo "Found process using port 5001: PID $PORT_PID"
  echo "Stopping process..."
  kill -9 $PORT_PID
  echo "✅ Process stopped"
fi

# Step 2: Update NGINX configuration to support SPA routing
echo
echo "===== UPDATING NGINX CONFIGURATION ====="

# Create new NGINX config for SPA routing
cat > /etc/nginx/sites-available/go4itsports.conf << 'EOL'
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    root /var/www/go4itsports/client/dist;
    index index.html;

    # API requests
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Media files
    location /uploads/ {
        alias /var/www/go4itsports/uploads/;
        autoindex off;
    }

    # For SPA routing - all routes should serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOL

# Test and reload NGINX
echo "Testing NGINX configuration..."
if nginx -t; then
    echo "✅ NGINX configuration is valid"
    systemctl reload nginx
    echo "✅ NGINX reloaded"
else
    echo "❌ NGINX configuration test failed"
    exit 1
fi

# Step 3: Fix permissions on client directory
echo
echo "===== FIXING PERMISSIONS ====="
CLIENT_DIR="/var/www/go4itsports/client/dist"
if [ -d "$CLIENT_DIR" ]; then
    echo "Setting permissions on $CLIENT_DIR..."
    chmod -R 755 "$CLIENT_DIR"
    echo "✅ Permissions fixed"
else
    echo "❌ Client directory not found at $CLIENT_DIR"
    
    # Try to find it
    echo "Searching for client dist directory..."
    FOUND_DIR=$(find /var/www/go4itsports -type d -name "dist" | head -1)
    
    if [ ! -z "$FOUND_DIR" ]; then
        echo "Found directory at $FOUND_DIR"
        echo "Setting permissions..."
        chmod -R 755 "$FOUND_DIR"
        
        # Update NGINX root path
        sed -i "s|root .*|root $FOUND_DIR;|g" /etc/nginx/sites-available/go4itsports.conf
        
        # Reload NGINX
        nginx -t && systemctl reload nginx
        echo "✅ Updated NGINX with correct path and fixed permissions"
    else
        echo "❌ Could not find client dist directory"
    fi
fi

# Step 4: Restart the server with no port conflict
echo
echo "===== RESTARTING SERVER ====="
echo "Stopping PM2 process..."
pm2 stop go4it-api

echo "Starting PM2 process..."
SERVER_FILE="/var/www/go4itsports/server/index.js"
if [ ! -f "$SERVER_FILE" ]; then
    # Find server file
    SERVER_FILE=$(find /var/www/go4itsports -type f -name "index.js" | grep -m 1 "server")
    
    if [ -z "$SERVER_FILE" ]; then
        echo "❌ Could not find server index.js file"
        exit 1
    fi
fi

echo "Found server file: $SERVER_FILE"
pm2 start "$SERVER_FILE" --name go4it-api
pm2 save

# Step 5: Final verification
echo
echo "===== FINAL VERIFICATION ====="
echo "Checking server status..."
sleep 5
pm2 status

echo "Checking NGINX status..."
systemctl status nginx | grep "Active:"

echo "Testing API health endpoint..."
if curl -s http://localhost/api/health > /dev/null; then
    echo "✅ API health endpoint is accessible"
else
    echo "❌ API health endpoint is not accessible"
fi

echo "Testing auth route..."
if curl -s http://localhost/auth | grep -q "<!DOCTYPE html>"; then
    echo "✅ Auth route returns HTML content as expected"
else
    echo "❌ Auth route doesn't return expected content"
fi

echo
echo "===== FIX SUMMARY ====="
echo "PM2 Status: $(pm2 list | grep "go4it-api" | awk '{print $6}')"
echo "NGINX Status: $(systemctl is-active nginx)"
echo "Port 5001 in use: $(lsof -ti:5001 > /dev/null && echo "Yes" || echo "No")"
echo "API Health: $(curl -s --connect-timeout 3 http://localhost/api/health > /dev/null && echo "Accessible" || echo "Not accessible")"
echo "Auth Route: $(curl -s --connect-timeout 3 http://localhost/auth > /dev/null && echo "Accessible" || echo "Not accessible")"
echo
echo "Fix completed: $(date)"
echo "Visit http://go4itsports.org and click 'Get Started' to verify the fix."