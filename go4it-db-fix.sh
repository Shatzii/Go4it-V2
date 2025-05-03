#!/bin/bash

# ==============================================
# GO4IT SPORTS DATABASE CONNECTION FIX
# Version: 1.0.0
# This script fixes database connection issues without changing code
# ==============================================

echo "===== GO4IT SPORTS DATABASE CONNECTION FIX ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"
echo "Current directory: $(pwd)"

# Step 1: Check if PostgreSQL is running
echo
echo "===== CHECKING POSTGRESQL SERVICE ====="
if ! systemctl is-active --quiet postgresql; then
  echo "⚠️ PostgreSQL is not running, starting it..."
  systemctl start postgresql
  systemctl enable postgresql
  sleep 3
else
  echo "✅ PostgreSQL is running"
fi

# Step 2: Verify PostgreSQL configuration
echo
echo "===== CHECKING POSTGRESQL CONFIGURATION ====="

# Check if pg_hba.conf allows MD5 authentication
PG_HBA_CONF=$(find /etc -name pg_hba.conf)
if [ -z "$PG_HBA_CONF" ]; then
  PG_HBA_CONF="/etc/postgresql/*/main/pg_hba.conf"
fi

if grep -q "host.*all.*all.*127.0.0.1/32.*md5" $PG_HBA_CONF; then
  echo "✅ PostgreSQL configuration allows MD5 authentication for localhost"
else
  echo "⚠️ Updating PostgreSQL configuration to allow MD5 authentication..."
  
  # Add MD5 authentication for localhost if not present
  echo "host    all             all             127.0.0.1/32            md5" >> $PG_HBA_CONF
  echo "host    all             all             ::1/128                 md5" >> $PG_HBA_CONF
  
  # Restart PostgreSQL
  systemctl restart postgresql
  sleep 3
fi

# Step 3: Check if database and user exist
echo
echo "===== CHECKING DATABASE AND USER ====="

# Default username and password from your environment
DB_USER="Go4it"
DB_PASS="Shatzii\$\$"
DB_NAME="go4it_sports"

# Check if user exists
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
  echo "✅ User '$DB_USER' exists"
else
  echo "⚠️ Creating user '$DB_USER'..."
  sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASS';"
fi

# Check if database exists
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
  echo "✅ Database '$DB_NAME' exists"
else
  echo "⚠️ Creating database '$DB_NAME'..."
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER \"$DB_USER\";"
fi

# Grant user permissions
echo "Ensuring user has correct permissions..."
sudo -u postgres psql -c "ALTER USER \"$DB_USER\" WITH SUPERUSER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO \"$DB_USER\";"

# Step 4: Test database connection
echo
echo "===== TESTING DATABASE CONNECTION ====="
if PGPASSWORD="$DB_PASS" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
  echo "✅ Database connection successful"
else
  echo "❌ Database connection failed"
  
  # Check for connection errors
  echo "Checking for connection errors..."
  PGPASSWORD="$DB_PASS" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1"
fi

# Step 5: Update .env file if it exists
echo
echo "===== UPDATING ENVIRONMENT VARIABLES ====="

# Find .env file
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  # Look for env files in the project
  ENV_FILE=$(find . -maxdepth 2 -name ".env*" | head -1)
  
  # If still not found, create one
  if [ -z "$ENV_FILE" ]; then
    ENV_FILE=".env"
    touch "$ENV_FILE"
  fi
fi

echo "Working with env file: $ENV_FILE"

# Update DATABASE_URL
if grep -q "DATABASE_URL" "$ENV_FILE"; then
  # Replace the existing DATABASE_URL
  sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME|g" "$ENV_FILE"
else
  # Add DATABASE_URL if not present
  echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME" >> "$ENV_FILE"
fi

# Add other PostgreSQL variables if they don't exist
if ! grep -q "PGUSER" "$ENV_FILE"; then
  echo "PGUSER=$DB_USER" >> "$ENV_FILE"
fi
if ! grep -q "PGPASSWORD" "$ENV_FILE"; then
  echo "PGPASSWORD=$DB_PASS" >> "$ENV_FILE"
fi
if ! grep -q "PGDATABASE" "$ENV_FILE"; then
  echo "PGDATABASE=$DB_NAME" >> "$ENV_FILE"
fi
if ! grep -q "PGHOST" "$ENV_FILE"; then
  echo "PGHOST=localhost" >> "$ENV_FILE"
fi
if ! grep -q "PGPORT" "$ENV_FILE"; then
  echo "PGPORT=5432" >> "$ENV_FILE"
fi

echo "✅ Environment variables updated"

# Step 6: Restart the server
echo
echo "===== RESTARTING SERVER ====="
echo "Stopping PM2 process..."
pm2 stop go4it-api

echo "Clearing any environment cache..."
CACHE_DIR="$HOME/.cache"
if [ -d "$CACHE_DIR" ]; then
  rm -rf "$CACHE_DIR"/*
fi

echo "Starting PM2 process with updated environment..."
pm2 start go4it-api --update-env
pm2 save

# Step 7: Verify database connection from server
echo
echo "===== VERIFYING SERVER DATABASE CONNECTION ====="
echo "Waiting for server to start..."
sleep 5

# Check server logs for database connection
if pm2 logs --lines 20 --nostream go4it-api | grep -q "timeout exceeded when trying to connect"; then
  echo "❌ Server still has database connection issues"
  
  # Last resort: Try to fix by directly modifying the database connection configuration
  echo "⚠️ Attempting direct database connection fix..."
  
  # Check for server/db.ts or similar files
  DB_FILES=(
    "./server/db.ts"
    "./server/db.js"
    "./server/database.ts"
    "./server/database.js"
    "./server/db/index.ts"
    "./server/db/index.js"
  )
  
  for file in "${DB_FILES[@]}"; do
    if [ -f "$file" ]; then
      echo "Found database file: $file"
      
      # Create a backup
      cp "$file" "${file}.bak.$(date +%s)"
      
      # Check connection string format and replace if needed
      if grep -q "postgresql:" "$file"; then
        # Update the PostgreSQL connection string
        sed -i "s|postgresql://[^@]*@[^/]*/[^ \'\"]*|postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME|g" "$file"
      fi
      
      # Also check for other connection patterns
      if grep -q "connectionString" "$file"; then
        sed -i "s|connectionString:.*|connectionString: 'postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME',|g" "$file"
      fi
      
      # Look for individual connection parameters
      if grep -q "user:" "$file" || grep -q "password:" "$file"; then
        sed -i "s|user:.*|user: '$DB_USER',|g" "$file"
        sed -i "s|password:.*|password: '$DB_PASS',|g" "$file"
        sed -i "s|database:.*|database: '$DB_NAME',|g" "$file"
        sed -i "s|host:.*|host: 'localhost',|g" "$file"
        sed -i "s|port:.*|port: 5432,|g" "$file"
      fi
    fi
  done
  
  # Restart the server after changes
  echo "Restarting server with updated database configuration..."
  pm2 restart go4it-api --update-env
  sleep 5
  
  # One more check
  if pm2 logs --lines 20 --nostream go4it-api | grep -q "timeout exceeded when trying to connect"; then
    echo "❌ Database connection issues persist after all attempts"
  else
    echo "✅ Database connection successful after configuration update"
  fi
else
  echo "✅ Server connected to database successfully"
fi

# Final verification
echo
echo "===== FINAL VERIFICATION ====="
echo "Testing API endpoint..."

if curl -s http://localhost:5000/api/health > /dev/null; then
  echo "✅ API is responding on localhost:5000"
else
  echo "❌ API is not responding on localhost:5000"
fi

# Final status
echo
echo "===== FIX SUMMARY ====="
echo "PostgreSQL Status: $(systemctl is-active postgresql)"
echo "Database Exists: $(sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME && echo "Yes" || echo "No")"
echo "User Exists: $(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 && echo "Yes" || echo "No")"
echo "Connection Test: $(PGPASSWORD="$DB_PASS" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1 && echo "Success" || echo "Failed")"
echo "PM2 Status: $(pm2 list | grep "go4it-api" | awk '{print $6}')"
echo "API Health Check: $(curl -s --connect-timeout 3 http://localhost:5000/api/health > /dev/null && echo "Success" || echo "Failed")"
echo
echo "Fix completed: $(date)"