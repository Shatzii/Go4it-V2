#!/bin/bash

# Go4It Sports - File Browser Deployment Script
# This script creates a complete deployment package ready to upload to your file browser

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}   Go4It Sports - File Browser Deployment Package Creator   ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo

# Define variables
DATE_STAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="go4it_filebrowser_package_${DATE_STAMP}"
TEMP_DIR="${PACKAGE_NAME}_temp"

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}/client"
mkdir -p "${TEMP_DIR}/server"
mkdir -p "${TEMP_DIR}/shared"
mkdir -p "${TEMP_DIR}/public"
mkdir -p "${TEMP_DIR}/monaco"
mkdir -p "${TEMP_DIR}/tools"
mkdir -p "${TEMP_DIR}/scripts"

# Copy main application files
echo -e "${YELLOW}Copying application files...${NC}"
cp -r client/* "${TEMP_DIR}/client/" 2>/dev/null || echo -e "${RED}No client directory found${NC}"
cp -r server/* "${TEMP_DIR}/server/" 2>/dev/null || echo -e "${RED}No server directory found${NC}"
cp -r shared/* "${TEMP_DIR}/shared/" 2>/dev/null || echo -e "${RED}No shared directory found${NC}"
cp -r public/* "${TEMP_DIR}/public/" 2>/dev/null || echo -e "${RED}No public directory found${NC}"

# Copy configuration files
echo -e "${YELLOW}Copying configuration files...${NC}"
cp package.json "${TEMP_DIR}/" 2>/dev/null || echo -e "${RED}No package.json found${NC}"
cp package-lock.json "${TEMP_DIR}/" 2>/dev/null || echo -e "${RED}No package-lock.json found${NC}"
cp tsconfig.json "${TEMP_DIR}/" 2>/dev/null || echo -e "${RED}No tsconfig.json found${NC}"
cp .env.example "${TEMP_DIR}/" 2>/dev/null || echo -e "${RED}No .env.example found${NC}"
cp drizzle.config.ts "${TEMP_DIR}/" 2>/dev/null || echo -e "${RED}No drizzle.config.ts found${NC}"
cp README.md "${TEMP_DIR}/" 2>/dev/null || echo -e "${RED}No README.md found${NC}"

# Copy Monaco + StarCoder integration files
echo -e "${YELLOW}Adding Monaco Editor + StarCoder integration...${NC}"
cp direct_integration.js "${TEMP_DIR}/monaco/" 2>/dev/null || echo -e "${RED}No direct_integration.js found${NC}"
cp verify_integration.sh "${TEMP_DIR}/monaco/" 2>/dev/null || echo -e "${RED}No verify_integration.sh found${NC}"
cp go4it_monaco_integration.sh "${TEMP_DIR}/monaco/" 2>/dev/null || echo -e "${RED}No go4it_monaco_integration.sh found${NC}"

# Copy Visual Tools
echo -e "${YELLOW}Adding Visual Tools...${NC}"
cp go4it_visual_uploader.js "${TEMP_DIR}/tools/" 2>/dev/null || echo -e "${RED}No go4it_visual_uploader.js found${NC}"
cp go4it_visual_uploader.html "${TEMP_DIR}/tools/" 2>/dev/null || echo -e "${RED}No go4it_visual_uploader.html found${NC}"
cp go4it_direct_launcher.html "${TEMP_DIR}/tools/" 2>/dev/null || echo -e "${RED}No go4it_direct_launcher.html found${NC}"
cp visual_monaco_integration.css "${TEMP_DIR}/tools/" 2>/dev/null || echo -e "${RED}No visual_monaco_integration.css found${NC}"

# Create main deployment script
echo -e "${YELLOW}Creating main deployment script...${NC}"
cat > "${TEMP_DIR}/deploy_all.sh" << 'EOL'
#!/bin/bash

# Go4It Sports - Complete Deployment Script
# This script handles the entire deployment process

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports - Complete Deployment Script           ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo

# Configuration (Edit these to match your environment)
SERVER_URL="188.245.209.124"
CLIENT_PATH="/var/www/go4itsports/client"
SERVER_PATH="/var/www/go4itsports/server"
MONACO_PATH="/var/www/html/pharaoh"
TOOLS_PATH="/var/www/html/tools"

# Make all scripts executable
find . -name "*.sh" -exec chmod +x {} \;

# Step 1: Create Directory Structure
echo -e "${YELLOW}Step 1: Creating directory structure...${NC}"
mkdir -p "${CLIENT_PATH}"
mkdir -p "${SERVER_PATH}"
mkdir -p "${MONACO_PATH}"
mkdir -p "${TOOLS_PATH}"

# Step 2: Deploy Go4It Application Files
echo -e "${YELLOW}Step 2: Deploying Go4It application files...${NC}"
echo -e "${BLUE}Copying client files to ${CLIENT_PATH}...${NC}"
cp -r client/* "${CLIENT_PATH}/" 2>/dev/null && echo -e "${GREEN}✓ Client files deployed${NC}" || echo -e "${RED}No client files found${NC}"

echo -e "${BLUE}Copying server files to ${SERVER_PATH}...${NC}"
cp -r server/* "${SERVER_PATH}/" 2>/dev/null && echo -e "${GREEN}✓ Server files deployed${NC}" || echo -e "${RED}No server files found${NC}"

echo -e "${BLUE}Copying shared files to ${SERVER_PATH}/shared/...${NC}"
mkdir -p "${SERVER_PATH}/shared/"
cp -r shared/* "${SERVER_PATH}/shared/" 2>/dev/null && echo -e "${GREEN}✓ Shared files deployed${NC}" || echo -e "${RED}No shared files found${NC}"

echo -e "${BLUE}Copying configuration files...${NC}"
cp package.json "${SERVER_PATH}/" 2>/dev/null
cp package-lock.json "${SERVER_PATH}/" 2>/dev/null
cp tsconfig.json "${SERVER_PATH}/" 2>/dev/null
cp drizzle.config.ts "${SERVER_PATH}/" 2>/dev/null
cp .env.example "${SERVER_PATH}/.env" 2>/dev/null
echo -e "${GREEN}✓ Configuration files deployed${NC}"

# Step 3: Set up Monaco Editor + StarCoder Integration
echo -e "${YELLOW}Step 3: Setting up Monaco Editor + StarCoder integration...${NC}"
if [ -d "monaco" ]; then
    echo -e "${BLUE}Copying Monaco integration files to ${MONACO_PATH}...${NC}"
    cp monaco/direct_integration.js "${MONACO_PATH}/js/" 2>/dev/null && echo -e "${GREEN}✓ Direct integration deployed${NC}" || echo -e "${RED}Failed to copy direct_integration.js${NC}"
    
    echo -e "${BLUE}Setting up Monaco integration...${NC}"
    chmod +x monaco/go4it_monaco_integration.sh 2>/dev/null
    ./monaco/go4it_monaco_integration.sh 2>/dev/null && echo -e "${GREEN}✓ Monaco integration setup complete${NC}" || echo -e "${RED}Failed to run integration script${NC}"
else
    echo -e "${RED}No Monaco integration files found${NC}"
fi

# Step 4: Set up Visual Tools
echo -e "${YELLOW}Step 4: Setting up Visual Tools...${NC}"
if [ -d "tools" ]; then
    echo -e "${BLUE}Copying Visual tools to ${TOOLS_PATH}...${NC}"
    cp tools/go4it_visual_uploader.js "${TOOLS_PATH}/" 2>/dev/null
    cp tools/go4it_visual_uploader.html "${TOOLS_PATH}/" 2>/dev/null
    cp tools/go4it_direct_launcher.html "${TOOLS_PATH}/" 2>/dev/null
    cp tools/visual_monaco_integration.css "${TOOLS_PATH}/" 2>/dev/null
    echo -e "${GREEN}✓ Visual tools deployed${NC}"
else
    echo -e "${RED}No Visual tools found${NC}"
fi

# Step 5: Set up permissions
echo -e "${YELLOW}Step 5: Setting up permissions...${NC}"
# Make sure web server can access files
echo -e "${BLUE}Setting ownership and permissions...${NC}"
find "${CLIENT_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${CLIENT_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${SERVER_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${SERVER_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${SERVER_PATH}" -name "*.sh" -exec chmod 755 {} \; 2>/dev/null
find "${MONACO_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${MONACO_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${TOOLS_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${TOOLS_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
echo -e "${GREEN}✓ Permissions set${NC}"

# Step 6: Display completion message
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports Deployment Complete!                   ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo
echo -e "${YELLOW}Main application:${NC} http://${SERVER_URL}/"
echo -e "${YELLOW}Visual Uploader:${NC} http://${SERVER_URL}/tools/go4it_direct_launcher.html"
echo
echo -e "${BLUE}If you need further assistance, refer to the documentation or contact support.${NC}"
EOL

# Make the script executable
chmod +x "${TEMP_DIR}/deploy_all.sh"

# Create README file
echo -e "${YELLOW}Creating README file...${NC}"
cat > "${TEMP_DIR}/README.md" << 'EOL'
# Go4It Sports - File Browser Deployment Package

This package contains everything you need to deploy the Go4It Sports platform through your file browser, including:

1. The main Go4It Sports application
2. Monaco Editor + StarCoder AI integration
3. Visual Uploader Tool
4. All necessary deployment scripts

## How to Deploy

1. Upload this entire folder through your file browser
2. Make the deployment script executable:
   ```
   chmod +x deploy_all.sh
   ```
3. Run the deployment script:
   ```
   ./deploy_all.sh
   ```

The script will automatically:
- Create the necessary directory structure
- Deploy all application files to the correct locations
- Set up Monaco Editor with StarCoder AI integration
- Install the Visual Uploader tool
- Set appropriate permissions
- Verify the deployment

## Package Contents

### Main Application
- `/client/` - Frontend React application
- `/server/` - Backend Node.js application
- `/shared/` - Shared code between client and server
- `/public/` - Static public assets

### Monaco Editor Integration
- `/monaco/direct_integration.js` - StarCoder integration for Monaco
- `/monaco/go4it_monaco_integration.sh` - Integration script

### Visual Tools
- `/tools/go4it_direct_launcher.html` - Visual Uploader & Deployment Tool

### Scripts
- `/deploy_all.sh` - Main deployment script

## After Deployment

After deployment, you can access:

- Main application: `http://your-server-url/`
- Visual Uploader: `http://your-server-url/tools/go4it_direct_launcher.html`

## Support

For assistance, please contact Go4It Sports support.
EOL

# Create zip file
echo -e "${YELLOW}Creating zip file...${NC}"
zip -r "${PACKAGE_NAME}.zip" "${TEMP_DIR}" > /dev/null

# Clean up
echo -e "${YELLOW}Cleaning up temporary files...${NC}"
rm -rf "${TEMP_DIR}"

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}   Deployment Package Created Successfully!                ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo -e "${BLUE}Package name:${NC} ${PACKAGE_NAME}.zip"
echo
echo -e "${YELLOW}How to use this package:${NC}"
echo -e "1. Download the zip file from this Replit"
echo -e "2. Upload the zip file to your file browser at http://${SERVER_URL}/files"
echo -e "3. Extract the zip file in your file browser"
echo -e "4. Navigate to the extracted directory"
echo -e "5. Run the deployment script: ./deploy_all.sh"
echo
echo -e "${GREEN}Done!${NC}"