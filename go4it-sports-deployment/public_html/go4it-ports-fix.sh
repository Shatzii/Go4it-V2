#!/bin/bash

# ==============================================
# GO4IT SPORTS COMPREHENSIVE PORTS & PROCESSES FIX
# Version: 1.0.0
# - Restores all required processes
# - Opens necessary ports
# - Aligns all configurations
# ==============================================

echo "===== GO4IT SPORTS COMPREHENSIVE PORTS & PROCESSES FIX ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"

# Base directory
APP_DIR="/var/www/go4itsports"
SERVER_DIR="$APP_DIR/server"
cd "$APP_DIR" || { echo "Cannot find app directory"; exit 1; }

# STEP 1: OPEN FIREWALL PORTS
echo
echo "===== STEP 1: OPENING FIREWALL PORTS ====="

if command -v ufw &> /dev/null; then
  echo "Using UFW firewall..."
  
  # Check if ports are already open
  if ! ufw status | grep -q "5000"; then
    echo "Opening port 5000 in UFW..."
    ufw allow 5000/tcp
  fi
  
  if ! ufw status | grep -q "3000"; then
    echo "Opening port 3000 in UFW..."
    ufw allow 3000/tcp
  fi
  
  echo "Current UFW status:"
  ufw status
elif command -v firewall-cmd &> /dev/null; then
  echo "Using firewalld..."
  
  # Check if firewalld is running
  if systemctl is-active --quiet firewalld; then
    echo "Opening ports in firewalld..."
    firewall-cmd --permanent --add-port=5000/tcp
    firewall-cmd --permanent --add-port=3000/tcp
    firewall-cmd --reload
    
    echo "Current firewalld status:"
    firewall-cmd --list-all
  else
    echo "Firewalld is not running"
  fi
else
  echo "No supported firewall detected"
fi

# STEP 2: UPDATE NGINX CONFIGURATION
echo
echo "===== STEP 2: UPDATING NGINX CONFIGURATION ====="

# Find NGINX configuration
NGINX_CONF="/etc/nginx/sites-available/go4itsports.conf"
if [ ! -f "$NGINX_CONF" ]; then
  FOUND_CONF=$(find /etc/nginx -name "*.conf" | grep -i "go4it\|sports" | head -1)
  if [ -n "$FOUND_CONF" ]; then
    echo "Found NGINX configuration at: $FOUND_CONF"
    NGINX_CONF="$FOUND_CONF"
  else
    echo "Creating new NGINX configuration..."
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
    
    # Create symbolic link if sites-enabled directory exists
    if [ -d "/etc/nginx/sites-enabled" ]; then
      ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    fi
  fi
fi

# Update NGINX configuration to point to port 5000
if [ -f "$NGINX_CONF" ]; then
  echo "Backing up NGINX configuration..."
  cp "$NGINX_CONF" "$NGINX_CONF.backup.$(date +%Y%m%d%H%M%S)"
  
  echo "Updating NGINX configuration to use port 5000..."
  sed -i 's/proxy_pass http:\/\/localhost:3000/proxy_pass http:\/\/localhost:5000/g' "$NGINX_CONF"
  
  echo "Checking NGINX configuration..."
  nginx -t
  
  if [ $? -eq 0 ]; then
    echo "Reloading NGINX..."
    systemctl reload nginx
  else
    echo "NGINX configuration is invalid. Check the error above."
  fi
else
  echo "No NGINX configuration found to update"
fi

# STEP 3: SET UP ENVIRONMENT FILES
echo
echo "===== STEP 3: SETTING UP ENVIRONMENT FILES ====="

# Create main .env file for port 5000
echo "Creating main environment file (.env)..."
cat > "$APP_DIR/.env" << 'EOF'
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://go4it:Shatzii$$@localhost:5432/go4it_sports
PGUSER=go4it
PGPASSWORD=Shatzii$$
PGDATABASE=go4it_sports
PGHOST=localhost
PGPORT=5432
EOF

# Create secondary .env file for port 3000
echo "Creating secondary environment file (.env.second)..."
cat > "$APP_DIR/.env.second" << 'EOF'
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://go4it:Shatzii$$@localhost:5432/go4it_sports
PGUSER=go4it
PGPASSWORD=Shatzii$$
PGDATABASE=go4it_sports
PGHOST=localhost
PGPORT=5432
EOF

# STEP 4: RESTORE PROCESSES
echo
echo "===== STEP 4: RESTORING PROCESSES ====="

# Find server files
echo "Looking for server files..."
if [ -f "$SERVER_DIR/production-server.js" ]; then
  echo "Found production-server.js"
  MAIN_SERVER="$SERVER_DIR/production-server.js"
elif [ -f "$SERVER_DIR/index.js" ]; then
  echo "Found index.js"
  MAIN_SERVER="$SERVER_DIR/index.js"
else
  echo "No standard server file found, searching for alternatives..."
  MAIN_SERVER=$(find "$SERVER_DIR" -name "*.js" | head -1)
  
  if [ -n "$MAIN_SERVER" ]; then
    echo "Using $MAIN_SERVER as server file"
  else
    echo "No server file found! Cannot continue."
    exit 1
  fi
fi

# Stop existing processes
echo "Stopping existing PM2 processes..."
pm2 stop go4it-api 2>/dev/null || true
pm2 stop go4it-sports 2>/dev/null || true
pm2 delete go4it-api 2>/dev/null || true
pm2 delete go4it-sports 2>/dev/null || true

# Start main process (port 5000)
echo "Starting main process on port 5000..."
cd "$APP_DIR"
pm2 start "$MAIN_SERVER" --name go4it-api

# Start secondary process (port 3000)
echo "Starting secondary process on port 3000..."
cd "$APP_DIR"
PORT=3000 pm2 start "$MAIN_SERVER" --name go4it-sports --env-path .env.second

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

# STEP 5: VERIFY EVERYTHING
echo
echo "===== STEP 5: VERIFYING SETUP ====="

# Check if processes are running
echo "Checking PM2 processes..."
pm2 list

# Check if ports are listening
echo "Checking listening ports..."
if command -v lsof &> /dev/null; then
  echo "Port 5000:"
  lsof -i:5000 || echo "Not listening on port 5000"
  
  echo "Port 3000:"
  lsof -i:3000 || echo "Not listening on port 3000"
else
  echo "Port 5000:"
  netstat -tuln | grep 5000 || echo "Not listening on port 5000"
  
  echo "Port 3000:"
  netstat -tuln | grep 3000 || echo "Not listening on port 3000"
fi

# Check health endpoints
echo "Checking health endpoints..."
if command -v curl &> /dev/null; then
  echo "Health of port 5000:"
  curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "Failed to reach port 5000"
  
  echo "Health of port 3000:"
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "Failed to reach port 3000"
else
  echo "curl not available, skipping health check"
fi

echo
echo "✅ Go4It Sports ports and processes fix completed: $(date)"
echo "   Main API: Port 5000 (NGINX points here)"
echo "   Secondary API: Port 3000"
echo
echo "Troubleshooting:"
echo "- Check PM2 logs: pm2 logs"
echo "- Check specific process logs: pm2 logs go4it-api"
echo "- Restart processes: pm2 restart go4it-api go4it-sports"
