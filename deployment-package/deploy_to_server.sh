#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server details
SERVER_IP="188.245.209.124"
SERVER_USER="root"
TARGET_DIR="/var/www/go4itsports"

# Package selection
PACKAGE_FILE="go4it_deployment_20250429_184412.zip"
echo -e "${BLUE}[INFO]${NC} Using package: ${PACKAGE_FILE}"

# Ensure the package exists
if [ ! -f "${PACKAGE_FILE}" ]; then
  echo -e "${RED}[ERROR]${NC} Package file ${PACKAGE_FILE} not found!"
  
  # Try to find the package in subdirectories
  FOUND_PACKAGE=$(find . -name "${PACKAGE_FILE}" -type f | head -n 1)
  
  if [ -n "${FOUND_PACKAGE}" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Found package at ${FOUND_PACKAGE}"
    PACKAGE_FILE="${FOUND_PACKAGE}"
  else
    echo -e "${YELLOW}[WARNING]${NC} Looking for alternative packages..."
    
    # Look for other deployment packages
    for alt_package in "go4it_latest_working_site.zip" "go4it_complete_package.zip" "go4it-deployment-20250427-205343.zip" "complete-go4it-package.zip"; do
      if [ -f "${alt_package}" ]; then
        echo -e "${GREEN}[SUCCESS]${NC} Found alternative package: ${alt_package}"
        PACKAGE_FILE="${alt_package}"
        break
      fi
      
      # Check subdirectories
      FOUND_ALT=$(find . -name "${alt_package}" -type f | head -n 1)
      if [ -n "${FOUND_ALT}" ]; then
        echo -e "${GREEN}[SUCCESS]${NC} Found alternative package at: ${FOUND_ALT}"
        PACKAGE_FILE="${FOUND_ALT}"
        break
      fi
    done
  fi
fi

if [ ! -f "${PACKAGE_FILE}" ]; then
  echo -e "${RED}[ERROR]${NC} No suitable package found. Deployment aborted."
  exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Using package: ${PACKAGE_FILE}"

# Create a temporary directory for extraction
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}[INFO]${NC} Extracting package to ${TEMP_DIR}..."

# Extract the package
unzip -q "${PACKAGE_FILE}" -d "${TEMP_DIR}"

# Ensure client files are properly located
if [ -d "${TEMP_DIR}/client/dist" ]; then
  echo -e "${GREEN}[SUCCESS]${NC} Found client dist directory"
  CLIENT_DIR="${TEMP_DIR}/client/dist"
elif [ -d "${TEMP_DIR}/client/build" ]; then
  echo -e "${GREEN}[SUCCESS]${NC} Found client build directory"
  CLIENT_DIR="${TEMP_DIR}/client/build"
else
  # Look for index.html to find client files
  INDEX_HTML=$(find "${TEMP_DIR}" -name "index.html" | grep -v "node_modules" | head -n 1)
  if [ -n "${INDEX_HTML}" ]; then
    CLIENT_DIR=$(dirname "${INDEX_HTML}")
    echo -e "${YELLOW}[WARNING]${NC} Using directory with index.html: ${CLIENT_DIR}"
  else
    echo -e "${RED}[ERROR]${NC} Could not find client files in the package."
    exit 1
  fi
fi

echo -e "${BLUE}[INFO]${NC} Found client directory at: ${CLIENT_DIR}"

# Upload to server using scp
echo -e "${BLUE}[INFO]${NC} Uploading files to server ${SERVER_IP}..."

# Create a script to run on the server
cat > "${TEMP_DIR}/deploy.sh" << EOL
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\${BLUE}[INFO]\${NC} Starting Go4It deployment..."

# Ensure target directory exists
mkdir -p ${TARGET_DIR}/client/dist

# Backup existing files
if [ -d "${TARGET_DIR}/client/dist" ] && [ "\$(ls -A ${TARGET_DIR}/client/dist)" ]; then
  echo -e "\${YELLOW}[WARNING]\${NC} Backing up existing client files..."
  BACKUP_DIR="${TARGET_DIR}/client/dist_backup_\$(date +%Y%m%d_%H%M%S)"
  mkdir -p "\${BACKUP_DIR}"
  cp -r ${TARGET_DIR}/client/dist/* "\${BACKUP_DIR}/"
fi

# Copy new client files
echo -e "\${BLUE}[INFO]\${NC} Deploying new client files..."
rm -rf ${TARGET_DIR}/client/dist/*
cp -r ./client_files/* ${TARGET_DIR}/client/dist/

# Check if index.html exists
if [ -f "${TARGET_DIR}/client/dist/index.html" ]; then
  echo -e "\${GREEN}[SUCCESS]\${NC} Client files deployed successfully."
else
  echo -e "\${RED}[ERROR]\${NC} Failed to deploy client files. index.html not found."
  exit 1
fi

# Check and update Nginx configuration
echo -e "\${BLUE}[INFO]\${NC} Checking Nginx configuration..."
if ! grep -q "root ${TARGET_DIR}/client/dist" /etc/nginx/sites-available/go4itsports.org; then
  echo -e "\${YELLOW}[WARNING]\${NC} Updating Nginx configuration..."
  sed -i "s|root .*;|root ${TARGET_DIR}/client/dist;|g" /etc/nginx/sites-available/go4itsports.org
  
  # Test and reload Nginx
  nginx -t && systemctl reload nginx
  echo -e "\${GREEN}[SUCCESS]\${NC} Nginx configuration updated."
else
  echo -e "\${GREEN}[SUCCESS]\${NC} Nginx already configured correctly."
fi

echo -e "\${GREEN}[SUCCESS]\${NC} Deployment complete."
echo -e "\${BLUE}[INFO]\${NC} You can now access your site at http://go4itsports.org"
EOL

chmod +x "${TEMP_DIR}/deploy.sh"

# Create a client_files directory with the extracted client files
mkdir -p "${TEMP_DIR}/client_files"
cp -r "${CLIENT_DIR}"/* "${TEMP_DIR}/client_files/"

# Now upload everything to the server
echo -e "${BLUE}[INFO]${NC} Uploading to server. This may take a few minutes..."

# Use SSH to create the target directory
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${TARGET_DIR}/uploads/temp/"

# Use SCP to upload the files
scp -r "${TEMP_DIR}/client_files" "${TEMP_DIR}/deploy.sh" ${SERVER_USER}@${SERVER_IP}:${TARGET_DIR}/uploads/temp/

if [ $? -ne 0 ]; then
  echo -e "${RED}[ERROR]${NC} Failed to upload files to server."
  exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Files uploaded successfully."

# Execute the deployment script on the server
echo -e "${BLUE}[INFO]${NC} Executing deployment script on server..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${TARGET_DIR}/uploads/temp && ./deploy.sh"

if [ $? -ne 0 ]; then
  echo -e "${RED}[ERROR]${NC} Failed to execute deployment script on server."
  exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Deployment completed successfully."
echo -e "${BLUE}[INFO]${NC} Your site should now be accessible at http://go4itsports.org"

# Clean up
rm -rf "${TEMP_DIR}"
echo -e "${BLUE}[INFO]${NC} Cleaned up temporary files."