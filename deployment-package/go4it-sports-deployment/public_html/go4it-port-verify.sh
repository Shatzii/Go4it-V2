#!/bin/bash

# ==============================================
# GO4IT SPORTS PORT VERIFICATION & CONFIGURATION
# Version: 1.0.0
# - Verifies ports 5000 and 3000 are open
# - Fixes port-related issues
# - Checks all applications are running on correct ports
# ==============================================

echo "===== GO4IT SPORTS PORT VERIFICATION & CONFIGURATION ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"

# STEP 1: Check port status
echo -e "\n===== STEP 1: CHECKING CURRENT PORT STATUS ====="

# Check if ports 5000 and 3000 are listening
echo "Current port 5000 status:"
sudo lsof -i:5000 | grep LISTEN || echo "⚠️ Port 5000 is NOT in use - this is a problem!"

echo -e "\nCurrent port 3000 status:"
sudo lsof -i:3000 | grep LISTEN || echo "⚠️ Port 3000 is NOT in use - this is a problem!"

# Check if ports are open in the firewall
echo -e "\nChecking firewall status for ports 5000 and 3000:"
if command -v ufw &> /dev/null; then
  ufw status | grep -E '5000|3000' || echo "⚠️ Ports may not be open in UFW firewall"
elif command -v firewall-cmd &> /dev/null; then
  firewall-cmd --list-ports | grep -E '5000|3000' || echo "⚠️ Ports may not be open in firewalld"
else
  echo "No supported firewall detected"
fi

# STEP 2: Open ports if needed
echo -e "\n===== STEP 2: OPENING PORTS IF NEEDED ====="

if command -v ufw &> /dev/null; then
  echo "Using UFW firewall..."
  
  if ! ufw status | grep -q "5000"; then
    echo "Opening port 5000 in UFW..."
    sudo ufw allow 5000/tcp
  else
    echo "✅ Port 5000 is already open in UFW"
  fi
  
  if ! ufw status | grep -q "3000"; then
    echo "Opening port 3000 in UFW..."
    sudo ufw allow 3000/tcp
  else
    echo "✅ Port 3000 is already open in UFW"
  fi
  
  echo "Current UFW status after changes:"
  sudo ufw status
elif command -v firewall-cmd &> /dev/null; then
  echo "Using firewalld..."
  
  if ! firewall-cmd --list-ports | grep -q "5000"; then
    echo "Opening port 5000 in firewalld..."
    sudo firewall-cmd --permanent --add-port=5000/tcp
    FIREWALL_CHANGED=true
  else
    echo "✅ Port 5000 is already open in firewalld"
  fi
  
  if ! firewall-cmd --list-ports | grep -q "3000"; then
    echo "Opening port 3000 in firewalld..."
    sudo firewall-cmd --permanent --add-port=3000/tcp
    FIREWALL_CHANGED=true
  else
    echo "✅ Port 3000 is already open in firewalld"
  fi
  
  if [ "$FIREWALL_CHANGED" = true ]; then
    echo "Reloading firewalld..."
    sudo firewall-cmd --reload
  fi
  
  echo "Current firewalld status after changes:"
  sudo firewall-cmd --list-all
else
  echo "No supported firewall detected, skipping firewall configuration"
fi

# STEP 3: Check environment variables
echo -e "\n===== STEP 3: CHECKING ENVIRONMENT FILES ====="

APP_DIR="/var/www/go4itsports"
ENV_FILE="$APP_DIR/.env"
ENV_SECOND="$APP_DIR/.env.second"

# Check main .env file
if [ -f "$ENV_FILE" ]; then
  echo "Checking main .env file..."
  if grep -q "PORT=5000" "$ENV_FILE"; then
    echo "✅ Main .env file correctly set to PORT=5000"
  else
    echo "⚠️ Updating main .env file to use PORT=5000..."
    sed -i 's/^PORT=.*/PORT=5000/' "$ENV_FILE"
    grep -q "PORT=5000" "$ENV_FILE" && echo "✅ Successfully updated" || echo "❌ Failed to update"
  fi
else
  echo "⚠️ Main .env file not found. Creating it..."
  mkdir -p "$APP_DIR"
  cat > "$ENV_FILE" << EOF
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://go4it:Shatzii\$\$@localhost:5432/go4it_sports
PGUSER=go4it
PGPASSWORD=Shatzii\$\$
PGDATABASE=go4it_sports
PGHOST=localhost
PGPORT=5432
EOF
  echo "✅ Created main .env file with PORT=5000"
fi

# Check secondary .env file
if [ -f "$ENV_SECOND" ]; then
  echo "Checking secondary .env.second file..."
  if grep -q "PORT=3000" "$ENV_SECOND"; then
    echo "✅ Secondary .env.second file correctly set to PORT=3000"
  else
    echo "⚠️ Updating secondary .env.second file to use PORT=3000..."
    sed -i 's/^PORT=.*/PORT=3000/' "$ENV_SECOND"
    grep -q "PORT=3000" "$ENV_SECOND" && echo "✅ Successfully updated" || echo "❌ Failed to update"
  fi
else
  echo "⚠️ Secondary .env.second file not found. Creating it..."
  mkdir -p "$APP_DIR"
  cat > "$ENV_SECOND" << EOF
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://go4it:Shatzii\$\$@localhost:5432/go4it_sports
PGUSER=go4it
PGPASSWORD=Shatzii\$\$
PGDATABASE=go4it_sports
PGHOST=localhost
PGPORT=5432
EOF
  echo "✅ Created secondary .env.second file with PORT=3000"
fi

# STEP 4: Check NGINX configuration
echo -e "\n===== STEP 4: CHECKING NGINX CONFIGURATION ====="

NGINX_CONF="/etc/nginx/sites-available/go4itsports.conf"
if [ ! -f "$NGINX_CONF" ]; then
  FOUND_CONF=$(find /etc/nginx -name "*.conf" | grep -i "go4it\|sports" | head -1)
  if [ -n "$FOUND_CONF" ]; then
    echo "Found NGINX configuration at: $FOUND_CONF"
    NGINX_CONF="$FOUND_CONF"
  else
    echo "⚠️ No NGINX configuration found for Go4It Sports"
  fi
fi

if [ -f "$NGINX_CONF" ]; then
  echo "Checking NGINX configuration at $NGINX_CONF..."
  if grep -q "proxy_pass http://localhost:5000" "$NGINX_CONF"; then
    echo "✅ NGINX is correctly configured to proxy to port 5000"
  else
    echo "⚠️ NGINX is NOT configured to proxy to port 5000. Updating..."
    sed -i 's/proxy_pass http:\/\/localhost:[0-9]\+/proxy_pass http:\/\/localhost:5000/g' "$NGINX_CONF"
    
    if grep -q "proxy_pass http://localhost:5000" "$NGINX_CONF"; then
      echo "✅ Successfully updated NGINX to proxy to port 5000"
      
      echo "Testing NGINX configuration..."
      if nginx -t; then
        echo "Reloading NGINX..."
        systemctl reload nginx
        echo "✅ NGINX reloaded successfully"
      else
        echo "❌ NGINX configuration test failed. Please check the configuration manually."
      fi
    else
      echo "❌ Failed to update NGINX configuration. Please update it manually."
    fi
  fi
else
  echo "Cannot find NGINX configuration file"
fi

# STEP 5: Verify and restart services if needed
echo -e "\n===== STEP 5: VERIFYING AND RESTARTING SERVICES ====="

if ! sudo lsof -i:5000 | grep -q LISTEN; then
  echo "Port 5000 is not in use. Checking PM2 services..."
  
  if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "go4it-api"; then
      echo "Restarting go4it-api..."
      pm2 restart go4it-api
    else
      echo "⚠️ go4it-api is not running in PM2. Attempting to start it..."
      SERVER_JS=$(find "$APP_DIR/server" -name "*.js" | head -1)
      if [ -n "$SERVER_JS" ]; then
        echo "Starting go4it-api using $SERVER_JS..."
        cd "$APP_DIR"
        pm2 start "$SERVER_JS" --name go4it-api
      else
        echo "❌ Cannot find server JS file to start"
      fi
    fi
  else
    echo "❌ PM2 is not installed or not available"
  fi
fi

if ! sudo lsof -i:3000 | grep -q LISTEN; then
  echo "Port 3000 is not in use. Checking PM2 services..."
  
  if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "go4it-sports"; then
      echo "Restarting go4it-sports..."
      pm2 restart go4it-sports
    else
      echo "⚠️ go4it-sports is not running in PM2. Attempting to start it..."
      SERVER_JS=$(find "$APP_DIR/server" -name "*.js" | head -1)
      if [ -n "$SERVER_JS" ]; then
        echo "Starting go4it-sports using $SERVER_JS..."
        cd "$APP_DIR"
        PORT=3000 pm2 start "$SERVER_JS" --name go4it-sports --env-path .env.second
      else
        echo "❌ Cannot find server JS file to start"
      fi
    fi
  else
    echo "❌ PM2 is not installed or not available"
  fi
fi

# STEP 6: Verify connectivity
echo -e "\n===== STEP 6: VERIFYING CONNECTIVITY ====="

# Test connections to the ports
echo "Testing connection to port 5000..."
if curl -s http://localhost:5000/api/health &> /dev/null; then
  echo "✅ Successfully connected to port 5000"
else
  echo "❌ Failed to connect to port 5000"
fi

echo "Testing connection to port 3000..."
if curl -s http://localhost:3000/api/health &> /dev/null; then
  echo "✅ Successfully connected to port 3000"
else
  echo "❌ Failed to connect to port 3000"
fi

echo "Testing API status (through NGINX)..."
if curl -s http://localhost/api/health &> /dev/null; then
  echo "✅ Successfully connected to API through NGINX"
else
  echo "❌ Failed to connect to API through NGINX"
fi

echo -e "\n===== SUMMARY ====="
echo "1. Firewall: Ports 5000 and 3000 should now be open"
echo "2. Environment files: .env (PORT=5000) and .env.second (PORT=3000) have been verified/created"
echo "3. NGINX configuration: Should now be pointing to port 5000"
echo "4. Services: PM2 processes should be running on correct ports"
echo "5. Connectivity: Verified connections to all endpoints"

echo -e "\n✅ Port verification and configuration completed: $(date)"
echo "If you're still experiencing issues, please check the logs:"
echo "  - NGINX logs: tail -f /var/log/nginx/error.log"
echo "  - Application logs: pm2 logs"
echo "  - System ports: sudo netstat -tuln | grep -E '5000|3000'"