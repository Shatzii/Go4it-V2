#!/bin/bash

# Go4It Sports Deployment Verification and Correction Script
# This script verifies the file structure and corrects any issues

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Root directory
ROOT_DIR="/var/www/go4itsports"
cd $ROOT_DIR

echo -e "${GREEN}=== Go4It Sports Deployment Verification Script ===${NC}"
echo "Running from directory: $(pwd)"
echo

# Function to check and create directory if not exists
check_dir() {
  if [ ! -d "$1" ]; then
    echo -e "${YELLOW}Creating missing directory: $1${NC}"
    mkdir -p "$1"
    return 1
  else
    echo -e "${GREEN}✓ Directory exists: $1${NC}"
    return 0
  fi
}

# Function to check if file exists
check_file() {
  if [ ! -f "$1" ]; then
    echo -e "${RED}✗ Missing file: $1${NC}"
    return 1
  else
    echo -e "${GREEN}✓ File exists: $1${NC}"
    return 0
  fi
}

# Function to move files if they're in wrong location
move_if_exists() {
  src="$1"
  dest="$2"
  
  if [ -e "$src" ] && [ "$src" != "$dest" ]; then
    echo -e "${YELLOW}Moving from $src to $dest${NC}"
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$dest")"
    mv "$src" "$dest"
    return 0
  fi
  return 1
}

echo -e "\n${GREEN}1. Checking core directories...${NC}"
# Check core directories
check_dir "$ROOT_DIR/client"
check_dir "$ROOT_DIR/server"
check_dir "$ROOT_DIR/shared"
check_dir "$ROOT_DIR/public"
check_dir "$ROOT_DIR/uploads"
check_dir "$ROOT_DIR/uploads/videos"
check_dir "$ROOT_DIR/uploads/images"
check_dir "$ROOT_DIR/uploads/highlights"
check_dir "$ROOT_DIR/logs"
check_dir "$ROOT_DIR/api_locker"
check_dir "$ROOT_DIR/migrations"

echo -e "\n${GREEN}2. Checking client subdirectories...${NC}"
# Check client subdirectories
check_dir "$ROOT_DIR/client/src"
check_dir "$ROOT_DIR/client/src/components"
check_dir "$ROOT_DIR/client/src/contexts"
check_dir "$ROOT_DIR/client/src/hooks"
check_dir "$ROOT_DIR/client/src/lib"
check_dir "$ROOT_DIR/client/src/pages"
check_dir "$ROOT_DIR/client/src/services"
check_dir "$ROOT_DIR/client/public"
check_dir "$ROOT_DIR/client/public/images"
check_dir "$ROOT_DIR/client/public/fonts"

echo -e "\n${GREEN}3. Checking server subdirectories...${NC}"
# Check server subdirectories
check_dir "$ROOT_DIR/server/middleware"
check_dir "$ROOT_DIR/server/routes"
check_dir "$ROOT_DIR/server/services"
check_dir "$ROOT_DIR/server/types"
check_dir "$ROOT_DIR/server/utils"

echo -e "\n${GREEN}4. Checking critical files...${NC}"
# Check critical configuration files
check_file "$ROOT_DIR/package.json"
check_file "$ROOT_DIR/tsconfig.json"
check_file "$ROOT_DIR/drizzle.config.ts"
check_file "$ROOT_DIR/.env" || {
  if [ -f "$ROOT_DIR/.env.template" ]; then
    echo -e "${YELLOW}Creating .env from template${NC}"
    cp "$ROOT_DIR/.env.template" "$ROOT_DIR/.env"
    echo -e "${RED}! Remember to edit .env with real values${NC}"
  else
    echo -e "${RED}! No .env or .env.template found! You'll need to create .env manually.${NC}"
  fi
}

echo -e "\n${GREEN}5. Checking server files...${NC}"
# Check server files
check_file "$ROOT_DIR/server/index.ts" || {
  if [ -f "$ROOT_DIR/src/server/index.ts" ]; then
    echo -e "${YELLOW}Moving server files to correct location${NC}"
    mkdir -p "$ROOT_DIR/server"
    cp -r "$ROOT_DIR/src/server"/* "$ROOT_DIR/server/"
  fi
}
check_file "$ROOT_DIR/server/routes.ts"
check_file "$ROOT_DIR/server/vite.ts"
check_file "$ROOT_DIR/server/db.ts"
check_file "$ROOT_DIR/server/storage.ts"

echo -e "\n${GREEN}6. Checking client files...${NC}"
# Check client files
check_file "$ROOT_DIR/client/src/App.tsx" || {
  if [ -f "$ROOT_DIR/src/client/App.tsx" ]; then
    echo -e "${YELLOW}Moving client files to correct location${NC}"
    mkdir -p "$ROOT_DIR/client/src"
    cp -r "$ROOT_DIR/src/client"/* "$ROOT_DIR/client/src/"
  fi
}
check_file "$ROOT_DIR/client/index.html" || {
  if [ -f "$ROOT_DIR/index.html" ]; then
    echo -e "${YELLOW}Moving index.html to correct location${NC}"
    cp "$ROOT_DIR/index.html" "$ROOT_DIR/client/index.html"
  fi
}

echo -e "\n${GREEN}7. Checking shared files...${NC}"
# Check shared files
check_file "$ROOT_DIR/shared/schema.ts" || {
  if [ -f "$ROOT_DIR/src/shared/schema.ts" ]; then
    echo -e "${YELLOW}Moving shared files to correct location${NC}"
    mkdir -p "$ROOT_DIR/shared"
    cp -r "$ROOT_DIR/src/shared"/* "$ROOT_DIR/shared/"
  fi
}

echo -e "\n${GREEN}8. Fixing any potential file misplacements...${NC}"
# Check for common misplaced files/directories and move them
move_if_exists "$ROOT_DIR/go4it_latest_working_site" "$ROOT_DIR"
move_if_exists "$ROOT_DIR/src/client" "$ROOT_DIR/client/src"
move_if_exists "$ROOT_DIR/src/server" "$ROOT_DIR/server"
move_if_exists "$ROOT_DIR/src/shared" "$ROOT_DIR/shared"

# Check if directories are empty and might need merging
if [ -d "$ROOT_DIR/client/src" ] && [ "$(ls -A "$ROOT_DIR/client/src" 2>/dev/null)" = "" ]; then
  if [ -d "$ROOT_DIR/client/src/components" ]; then
    echo -e "${YELLOW}Client src directory is empty but subdirectories exist, fixing structure...${NC}"
    find "$ROOT_DIR/client" -mindepth 2 -type d -name "src" -exec mv {}/* "$ROOT_DIR/client/src/" \; 2>/dev/null
  fi
fi

echo -e "\n${GREEN}9. Setting proper permissions...${NC}"
# Set appropriate permissions
echo "Setting directory permissions to 755..."
find "$ROOT_DIR" -type d -exec chmod 755 {} \;

echo "Setting file permissions to 644..."
find "$ROOT_DIR" -type f -exec chmod 644 {} \;

echo "Making shell scripts executable..."
find "$ROOT_DIR" -type f -name "*.sh" -exec chmod 755 {} \;

echo "Securing sensitive directories and files..."
chmod 700 "$ROOT_DIR/api_locker"
chmod 600 "$ROOT_DIR/.env" 2>/dev/null

echo -e "\n${GREEN}10. Verifying directory structure...${NC}"
echo "Directory structure:"
find "$ROOT_DIR" -type d -maxdepth 2 | sort

echo -e "\n${GREEN}=== Verification and correction complete ===${NC}"
echo -e "${YELLOW}Note: You may still need to manually check the contents of files to ensure correctness.${NC}"
echo -e "${YELLOW}Remember to update your .env file with the correct configuration values.${NC}"
echo -e "${GREEN}To proceed with deployment, run the PM2 and Nginx setup commands.${NC}"
