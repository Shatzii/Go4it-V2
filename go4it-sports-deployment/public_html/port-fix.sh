#!/bin/bash

# ==============================================
# GO4IT SPORTS PORT CONFIGURATION FIX
# Version: 1.0.0
# Aligns NGINX and application ports
# ==============================================

echo "===== GO4IT SPORTS PORT CONFIGURATION FIX ====="
echo "Started: $(date)"

# Update NGINX configuration to point to port 5000
echo "Updating NGINX configuration..."
NGINX_CONF="/etc/nginx/sites-available/go4itsports.conf"

# Check if file exists
if [ ! -f "$NGINX_CONF" ]; then
  echo "⚠️ NGINX configuration file not found at $NGINX_CONF"
  echo "Looking for other possible locations..."
  
  # Try to find the configuration file
  FOUND_CONF=$(find /etc/nginx -name "*.conf" | grep -i "go4it\|sports" | head -1)
  
  if [ -n "$FOUND_CONF" ]; then
    echo "✅ Found configuration at: $FOUND_CONF"
    NGINX_CONF="$FOUND_CONF"
  else
    echo "❌ Could not find NGINX configuration for Go4It Sports"
    echo "Creating a new configuration file..."
    
    cat > "$NGINX_CONF" << 'EOF'
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF
    
    # Enable the site
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    echo "✅ Created new configuration file"
  fi
fi

# Make backup of existing configuration
if [ -f "$NGINX_CONF" ]; then
  cp "$NGINX_CONF" "$NGINX_CONF.backup"
  echo "✅ Backup created at $NGINX_CONF.backup"
  
  # Update port in NGINX configuration
  sed -i 's/proxy_pass http:\/\/localhost:3000/proxy_pass http:\/\/localhost:5000/g' "$NGINX_CONF"
  echo "✅ Updated port from 3000 to 5000 in NGINX configuration"
fi

# Verify NGINX config
echo "Verifying NGINX configuration..."
if nginx -t; then
  echo "✅ NGINX configuration is valid"
  
  # Restart NGINX
  echo "Restarting NGINX..."
  systemctl restart nginx
  echo "✅ NGINX restarted"
else
  echo "❌ NGINX configuration is invalid. Reverting changes..."
  if [ -f "$NGINX_CONF.backup" ]; then
    cp "$NGINX_CONF.backup" "$NGINX_CONF"
    echo "✅ Configuration reverted from backup"
  fi
fi

# Ensure application is running on port 5000
echo "Checking if application is running on port 5000..."
if lsof -i:5000 > /dev/null; then
  echo "✅ Application is running on port 5000"
else
  echo "⚠️ Application is not running on port 5000. Checking if PM2 is managing the application..."
  
  if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "go4it-api"; then
      echo "✅ Found Go4It API in PM2. Restarting..."
      pm2 restart go4it-api
      echo "✅ Application restarted with PM2"
    else
      echo "⚠️ Go4It API not found in PM2. Trying to start it..."
      
      # Try to find and start server file
      if [ -f "/var/www/go4itsports/server/index.js" ]; then
        cd /var/www/go4itsports
        pm2 start server/index.js --name go4it-api
        echo "✅ Started application with PM2"
      elif [ -f "/var/www/go4itsports/server/production-server.js" ]; then
        cd /var/www/go4itsports
        pm2 start server/production-server.js --name go4it-api
        echo "✅ Started production server with PM2"
      else
        echo "❌ Could not find server file to start"
      fi
    fi
  else
    echo "❌ PM2 not found. Please start the application manually on port 5000."
  fi
fi

echo "✅ Port configuration fix completed: $(date)"
echo "NGINX should now point to port 5000 where your application is running"
