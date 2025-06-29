#!/bin/bash

# ==============================================
# GO4IT SPORTS API CONNECTION FIX
# Version: 1.0.0
# This script fixes API connection issues without changing any code
# ==============================================

echo "===== GO4IT SPORTS API CONNECTION FIX ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"
echo "Current directory: $(pwd)"

# Step 1: Verify PM2 process is running
echo
echo "===== CHECKING PM2 PROCESS ====="
if ! pm2 list | grep -q "go4it-api"; then
  echo "⚠️ PM2 process not found, starting server..."
  
  # Find server file
  SERVER_FILE=""
  if [ -f "server/index.js" ]; then
    SERVER_FILE="server/index.js"
  elif [ -f "server.js" ]; then
    SERVER_FILE="server.js"
  elif [ -f "server/production-server.js" ]; then
    SERVER_FILE="server/production-server.js"
  else
    echo "⚠️ Could not find server file. Looking in subdirectories..."
    SERVER_FILE=$(find . -type f -name "index.js" | grep -m 1 "server")
    if [ -z "$SERVER_FILE" ]; then
      echo "❌ No server file found!"
      exit 1
    fi
  fi
  
  echo "✅ Found server file: $SERVER_FILE"
  
  # Start the server with PM2
  pm2 start $SERVER_FILE --name go4it-api --max-memory-restart 500M
  pm2 save
else
  echo "✅ PM2 process exists, checking status..."
  
  # Check if the process is online
  if pm2 list | grep "go4it-api" | grep -q "online"; then
    echo "✅ PM2 process is online"
  else
    echo "⚠️ PM2 process exists but is not online, restarting..."
    pm2 restart go4it-api
  fi
fi

# Step 2: Verify server is running on port 5000
echo
echo "===== CHECKING SERVER PORT ====="
if ! netstat -tulpn | grep -q ":5000"; then
  echo "❌ Server is not running on port 5000"
  
  # Check if something else is using port 5000
  if netstat -tulpn | grep ":5000"; then
    echo "⚠️ Another process is using port 5000, killing it..."
    PID=$(netstat -tulpn | grep ":5000" | awk '{print $7}' | cut -d'/' -f1)
    kill -9 $PID
    
    echo "Restarting go4it-api..."
    pm2 restart go4it-api
  else
    echo "⚠️ No process found on port 5000, restarting go4it-api with port 5000..."
    pm2 delete go4it-api
    
    # Find server file again
    SERVER_FILE=""
    if [ -f "server/index.js" ]; then
      SERVER_FILE="server/index.js"
    elif [ -f "server.js" ]; then
      SERVER_FILE="server.js"
    elif [ -f "server/production-server.js" ]; then
      SERVER_FILE="server/production-server.js"
    else
      SERVER_FILE=$(find . -type f -name "index.js" | grep -m 1 "server")
    fi
    
    # Start with explicitly set PORT env variable
    PORT=5000 pm2 start $SERVER_FILE --name go4it-api --max-memory-restart 500M --env production
    pm2 save
  fi
else
  echo "✅ Server is running on port 5000"
fi

# Step 3: Check NGINX configuration
echo
echo "===== CHECKING NGINX CONFIGURATION ====="

# Check if NGINX is running
if ! systemctl is-active --quiet nginx; then
  echo "⚠️ NGINX is not running, starting it..."
  systemctl start nginx
  systemctl enable nginx
else
  echo "✅ NGINX is running"
fi

# Check if NGINX configuration is correct
if [ -f "/etc/nginx/sites-available/go4itsports.conf" ]; then
  echo "Checking NGINX configuration..."
  
  # Check if the API proxy is correctly configured
  if ! grep -q "proxy_pass http://localhost:5000" "/etc/nginx/sites-available/go4itsports.conf"; then
    echo "❌ NGINX configuration is missing proper API proxy, fixing..."
    
    # Get current root directory from NGINX config
    ROOT_DIR=$(grep "root" "/etc/nginx/sites-available/go4itsports.conf" | head -1 | awk '{print $2}' | sed 's/;//')
    
    # Update NGINX configuration
    cat > "/etc/nginx/sites-available/go4itsports.conf" << EOL
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    root ${ROOT_DIR};
    index index.html;

    # Frontend static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API requests
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }

    # Media files
    location /uploads/ {
        alias $(pwd)/uploads/;
        autoindex off;
    }
}
EOL
    
    # Test NGINX configuration
    if nginx -t; then
      echo "✅ NGINX configuration updated successfully"
      systemctl restart nginx
    else
      echo "❌ NGINX configuration test failed, please check manually"
    fi
  else
    echo "✅ NGINX configuration looks good"
  fi
else
  echo "❌ NGINX configuration file not found, creating it..."
  
  # Create NGINX configuration
  mkdir -p /etc/nginx/sites-available
  
  cat > /etc/nginx/sites-available/go4itsports.conf << EOL
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    root $(pwd)/client/dist;
    index index.html;

    # Frontend static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API requests
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }

    # Media files
    location /uploads/ {
        alias $(pwd)/uploads/;
        autoindex off;
    }
}
EOL
  
  # Create symbolic link
  ln -sf /etc/nginx/sites-available/go4itsports.conf /etc/nginx/sites-enabled/
  
  # Remove default site if it exists
  rm -f /etc/nginx/sites-enabled/default
  
  # Test NGINX configuration
  if nginx -t; then
    echo "✅ NGINX configuration created successfully"
    systemctl restart nginx
  else
    echo "❌ NGINX configuration test failed, please check manually"
  fi
fi

# Step 4: Check firewall rules
echo
echo "===== CHECKING FIREWALL RULES ====="

# Check if UFW is installed and active
if command -v ufw &> /dev/null && ufw status | grep -q "active"; then
  echo "UFW firewall is active, checking rules..."
  
  # Check if port 80 is allowed
  if ! ufw status | grep -q "80/tcp.*ALLOW"; then
    echo "⚠️ Port 80 not allowed in firewall, adding rule..."
    ufw allow 80/tcp
  else
    echo "✅ Port 80 is allowed in firewall"
  fi
  
  # Check if port 5000 is allowed for internal traffic
  if ! ufw status | grep -q "5000/tcp.*ALLOW"; then
    echo "⚠️ Port 5000 not allowed in firewall, adding rule for localhost..."
    ufw allow from 127.0.0.1 to any port 5000 proto tcp
  else
    echo "✅ Port 5000 is allowed in firewall"
  fi
else
  echo "UFW firewall not active or not installed, skipping firewall checks"
fi

# Step 5: Verify API connectivity
echo
echo "===== TESTING API CONNECTIVITY ====="

# Wait for server to fully start
echo "Waiting for server to fully start..."
sleep 5

# Test API endpoint
if curl -s http://localhost:5000/api/health > /dev/null; then
  echo "✅ API is responding on localhost:5000"
else
  echo "❌ API is not responding on localhost:5000"
fi

# Test API through NGINX
if curl -s http://localhost/api/health > /dev/null; then
  echo "✅ API is responding through NGINX on localhost"
else
  echo "❌ API is not responding through NGINX on localhost"
  
  # Check NGINX error logs
  echo "Checking NGINX error logs..."
  tail -n 20 /var/log/nginx/error.log
fi

# Final restart of services
echo
echo "===== FINAL RESTART OF SERVICES ====="
echo "Restarting PM2..."
pm2 restart go4it-api

echo "Restarting NGINX..."
systemctl restart nginx

# Verify one last time
echo
echo "===== FINAL VERIFICATION ====="
sleep 5

if curl -s http://localhost/api/health > /dev/null; then
  echo "✅ API is now responding through NGINX"
else
  echo "❌ API is still not responding through NGINX"
  
  # Last resort: bypass NGINX
  echo "⚠️ Trying direct API port exposure as last resort..."
  
  # Update firewall to allow external access to port 5000
  if command -v ufw &> /dev/null && ufw status | grep -q "active"; then
    ufw allow 5000/tcp
  fi
  
  echo "Restarting server with PORT=80..."
  pm2 delete go4it-api
  
  # Find server file again
  SERVER_FILE=""
  if [ -f "server/index.js" ]; then
    SERVER_FILE="server/index.js"
  elif [ -f "server.js" ]; then
    SERVER_FILE="server.js"
  elif [ -f "server/production-server.js" ]; then
    SERVER_FILE="server/production-server.js"
  else
    SERVER_FILE=$(find . -type f -name "index.js" | grep -m 1 "server")
  fi
  
  # Try running on port 80 directly
  PORT=80 pm2 start $SERVER_FILE --name go4it-api --max-memory-restart 500M
  pm2 save
  
  echo "⚠️ Server now running directly on port 80, bypassing NGINX"
fi

# Create a fix summary
echo
echo "===== FIX SUMMARY ====="
echo "PM2 Status: $(pm2 list | grep "go4it-api" | awk '{print $6}')"
echo "NGINX Status: $(systemctl is-active nginx)"
echo "API on localhost:5000: $(curl -s --connect-timeout 3 http://localhost:5000/api/health > /dev/null && echo "Connected" || echo "Disconnected")"
echo "API through NGINX: $(curl -s --connect-timeout 3 http://localhost/api/health > /dev/null && echo "Connected" || echo "Disconnected")"
echo
echo "Fix completed: $(date)"