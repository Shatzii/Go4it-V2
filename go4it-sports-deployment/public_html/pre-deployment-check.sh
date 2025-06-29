#!/bin/bash
# Go4It Sports Pre-Deployment Environment Check
# Run this script before deploying to verify your environment

echo "===== Go4It Sports Pre-Deployment Check ====="
echo "Checking environment for compatibility..."

# Check required commands
echo -e "\n📋 Checking required tools..."
REQUIRED_COMMANDS=("node" "npm" "psql" "nginx" "zip" "unzip" "curl")
MISSING_COMMANDS=()

for cmd in "${REQUIRED_COMMANDS[@]}"; do
  if ! command -v $cmd &> /dev/null; then
    MISSING_COMMANDS+=($cmd)
    echo "❌ $cmd is not installed"
  else
    echo "✅ $cmd is installed"
    
    # Check versions of key tools
    if [ "$cmd" == "node" ]; then
      VERSION=$(node -v)
      echo "   Node.js version: $VERSION"
      
      # Check if Node.js version is >= 20.0.0
      NODE_MAJOR=$(echo $VERSION | cut -d. -f1 | sed 's/v//')
      if [ $NODE_MAJOR -lt 20 ]; then
        echo "   ⚠️ Warning: Node.js version should be 20.x or higher"
      fi
    fi
    
    if [ "$cmd" == "nginx" ]; then
      VERSION=$(nginx -v 2>&1 | grep -o "nginx/[0-9.]*" | cut -d/ -f2)
      echo "   Nginx version: $VERSION"
    fi
  fi
done

if [ ${#MISSING_COMMANDS[@]} -gt 0 ]; then
  echo -e "\n⚠️ Missing required tools. Please install them before proceeding:"
  for cmd in "${MISSING_COMMANDS[@]}"; do
    echo "   - $cmd"
  done
fi

# Check Node.js environment
echo -e "\n📦 Checking Node.js environment..."
NODE_VERSION=$(node -v 2>/dev/null || echo "Not installed")
NPM_VERSION=$(npm -v 2>/dev/null || echo "Not installed")

echo "Node.js version: $NODE_VERSION"
echo "NPM version: $NPM_VERSION"

# Check if Node.js has required dependencies
echo -e "\n🔍 Checking if Node.js can load required modules..."
NODE_MODULES=("fs" "path" "crypto" "http" "https" "zlib" "stream" "util")
for module in "${NODE_MODULES[@]}"; do
  if node -e "try{require('$module');console.log('✅ $module')}catch(e){console.error('❌ $module')}" 2>/dev/null; then
    :
  else
    echo "❌ Node.js cannot load '$module'"
  fi
done

# Check PostgreSQL
echo -e "\n🗄️ Checking PostgreSQL..."
if command -v psql &> /dev/null; then
  PG_VERSION=$(psql --version | grep -o "psql (PostgreSQL) [0-9.]*" | cut -d" " -f3)
  echo "PostgreSQL client version: $PG_VERSION"
  
  # Check if PostgreSQL server is running
  if pg_isready &> /dev/null; then
    echo "✅ PostgreSQL server is running"
  else
    echo "⚠️ PostgreSQL server is not running or not accessible"
  fi
else
  echo "❌ PostgreSQL client is not installed"
fi

# Check Nginx configuration
echo -e "\n🌐 Checking Nginx..."
if command -v nginx &> /dev/null; then
  # Test Nginx configuration syntax
  if nginx -t &> /dev/null; then
    echo "✅ Nginx configuration syntax is valid"
  else
    echo "⚠️ Nginx configuration has syntax errors"
  fi
  
  # Check if Nginx is running
  if systemctl is-active --quiet nginx 2>/dev/null || pgrep -x nginx &>/dev/null; then
    echo "✅ Nginx is running"
  else
    echo "⚠️ Nginx is not running"
  fi
  
  # Check if SSL modules are available
  if nginx -V 2>&1 | grep -q "with-http_ssl_module"; then
    echo "✅ Nginx has SSL support"
  else
    echo "⚠️ Nginx is missing SSL support (http_ssl_module)"
  fi
else
  echo "❌ Nginx is not installed"
fi

# Check disk space
echo -e "\n💾 Checking disk space..."
AVAILABLE_DISK=$(df -h / | awk 'NR==2 {print $4}')
echo "Available disk space: $AVAILABLE_DISK"

if df -k / | awk 'NR==2 {exit ($4 < 5000000)}'; then
  echo "✅ Sufficient disk space available (>5GB)"
else
  echo "⚠️ Low disk space warning. Recommended: at least 5GB free space"
fi

# Check memory
echo -e "\n🧠 Checking system memory..."
TOTAL_MEM=$(free -m | awk 'NR==2 {print $2}')
AVAIL_MEM=$(free -m | awk 'NR==2 {print $7}')

echo "Total memory: $TOTAL_MEM MB"
echo "Available memory: $AVAIL_MEM MB"

if [ $AVAIL_MEM -lt 1024 ]; then
  echo "⚠️ Low available memory. Recommended: at least 1GB of free memory"
else
  echo "✅ Sufficient memory available"
fi

# Check network connectivity
echo -e "\n🔌 Checking network connectivity..."
if ping -c 1 google.com &> /dev/null; then
  echo "✅ Internet connectivity is available"
else
  echo "⚠️ No internet connectivity detected"
fi

# Check system limits
echo -e "\n🔧 Checking system limits..."
MAX_FILES=$(ulimit -n)
echo "Maximum open files: $MAX_FILES"

if [ $MAX_FILES -lt 1024 ]; then
  echo "⚠️ Low limit for open files. Recommended: at least a limit of 1024"
else
  echo "✅ Sufficient file descriptor limit"
fi

# Summary
echo -e "\n===== Environment Check Summary ====="
if [ ${#MISSING_COMMANDS[@]} -gt 0 ]; then
  echo "❌ Some required tools are missing. Please install them before proceeding."
elif [ $AVAIL_MEM -lt 1024 ] || ! ping -c 1 google.com &> /dev/null; then
  echo "⚠️ Your environment has some warnings. Review them above before proceeding."
else
  echo "✅ Your environment appears compatible with Go4It Sports requirements!"
fi

echo -e "\nIf all checks passed, you can proceed with deployment."
echo "To install, run: ./create-deployment.sh"