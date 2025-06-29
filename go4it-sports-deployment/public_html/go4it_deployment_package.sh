#!/bin/bash

# Go4It Sports - All-in-One Deployment Package with Visual Uploader
# This script packages everything needed for deployment including the visual uploader tool

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}   Go4It Sports - All-in-One Deployment Package Creator   ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo

# Define variables
DATE_STAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="go4it_complete_package_${DATE_STAMP}"
TEMP_DIR="${PACKAGE_NAME}_temp"

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}/client"
mkdir -p "${TEMP_DIR}/server"
mkdir -p "${TEMP_DIR}/shared"
mkdir -p "${TEMP_DIR}/public"
mkdir -p "${TEMP_DIR}/tools"
mkdir -p "${TEMP_DIR}/editor_integration"
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

# Copy deployment scripts
echo -e "${YELLOW}Copying deployment scripts...${NC}"
cp deploy.sh "${TEMP_DIR}/scripts/" 2>/dev/null || echo -e "${RED}No deploy.sh found${NC}"
cp auto_deploy.sh "${TEMP_DIR}/scripts/" 2>/dev/null || echo -e "${RED}No auto_deploy.sh found${NC}"
cp create_directory_structure.sh "${TEMP_DIR}/scripts/" 2>/dev/null || echo -e "${RED}No create_directory_structure.sh found${NC}"
cp verify_deployment.sh "${TEMP_DIR}/scripts/" 2>/dev/null || echo -e "${RED}No verify_deployment.sh found${NC}"

# Add the Visual Uploader tool
echo -e "${YELLOW}Adding Visual Uploader tool...${NC}"
cp go4it_visual_uploader.js "${TEMP_DIR}/tools/" 2>/dev/null || echo -e "${RED}No go4it_visual_uploader.js found${NC}"
cp go4it_visual_uploader.html "${TEMP_DIR}/tools/" 2>/dev/null || echo -e "${RED}No go4it_visual_uploader.html found${NC}"
cp visual_monaco_integration.css "${TEMP_DIR}/tools/" 2>/dev/null || echo -e "${RED}No visual_monaco_integration.css found${NC}"

# Add Monaco Editor + StarCoder integration
echo -e "${YELLOW}Adding Monaco Editor + StarCoder integration...${NC}"
cp direct_integration.js "${TEMP_DIR}/editor_integration/" 2>/dev/null || echo -e "${RED}No direct_integration.js found${NC}"
cp monaco_integration_instructions.md "${TEMP_DIR}/editor_integration/" 2>/dev/null || echo -e "${RED}No monaco_integration_instructions.md found${NC}"
cp verify_integration.sh "${TEMP_DIR}/editor_integration/" 2>/dev/null || echo -e "${RED}No verify_integration.sh found${NC}"
cp go4it_monaco_integration.sh "${TEMP_DIR}/editor_integration/" 2>/dev/null || echo -e "${RED}No go4it_monaco_integration.sh found${NC}"

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

# Make all scripts executable
find . -name "*.sh" -exec chmod +x {} \;

# Step 1: Create Directory Structure
echo -e "${YELLOW}Step 1: Creating directory structure...${NC}"
if [ -f "./scripts/create_directory_structure.sh" ]; then
    ./scripts/create_directory_structure.sh
else
    echo -e "${RED}Directory structure script not found, creating default directories...${NC}"
    mkdir -p /var/www/go4itsports
    mkdir -p /var/www/html/pharaoh
fi

# Step 2: Deploy Application
echo -e "${YELLOW}Step 2: Deploying Go4It application...${NC}"
if [ -f "./scripts/deploy.sh" ]; then
    ./scripts/deploy.sh
else
    echo -e "${RED}Deployment script not found, copying files manually...${NC}"
    cp -r client server shared public /var/www/go4itsports/
    cp package.json package-lock.json tsconfig.json /var/www/go4itsports/
fi

# Step 3: Set up Monaco Editor + StarCoder Integration
echo -e "${YELLOW}Step 3: Setting up Monaco Editor + StarCoder integration...${NC}"
if [ -f "./editor_integration/go4it_monaco_integration.sh" ]; then
    ./editor_integration/go4it_monaco_integration.sh
else
    echo -e "${RED}Monaco integration script not found, copying files manually...${NC}"
    cp ./editor_integration/direct_integration.js /var/www/html/pharaoh/js/
    echo -e "${YELLOW}Please manually update monaco-setup.js according to the instructions${NC}"
fi

# Step 4: Set up Visual Uploader Tool
echo -e "${YELLOW}Step 4: Setting up Visual Uploader tool...${NC}"
mkdir -p /var/www/html/tools
cp ./tools/go4it_visual_uploader.js /var/www/html/tools/
cp ./tools/go4it_visual_uploader.html /var/www/html/tools/
cp ./tools/visual_monaco_integration.css /var/www/html/tools/

# Step 5: Verify Deployment
echo -e "${YELLOW}Step 5: Verifying deployment...${NC}"
if [ -f "./scripts/verify_deployment.sh" ]; then
    ./scripts/verify_deployment.sh
else
    echo -e "${YELLOW}Performing basic verification...${NC}"
    
    # Check application files
    if [ -d "/var/www/go4itsports/client" ] && [ -d "/var/www/go4itsports/server" ]; then
        echo -e "${GREEN}✓ Application files deployed${NC}"
    else
        echo -e "${RED}✗ Application files missing${NC}"
    fi
    
    # Check Monaco integration
    if [ -f "/var/www/html/pharaoh/js/direct_integration.js" ]; then
        echo -e "${GREEN}✓ Monaco Editor integration files deployed${NC}"
    else
        echo -e "${RED}✗ Monaco Editor integration files missing${NC}"
    fi
    
    # Check Visual Uploader
    if [ -f "/var/www/html/tools/go4it_visual_uploader.js" ]; then
        echo -e "${GREEN}✓ Visual Uploader tool deployed${NC}"
    else
        echo -e "${RED}✗ Visual Uploader tool missing${NC}"
    fi
fi

# Step 6: Display completion message
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}      Go4It Sports Deployment Complete!                   ${NC}"
echo -e "${GREEN}============================================================${NC}"
echo
echo -e "${YELLOW}Main application:${NC} http://your-domain.com/"
echo -e "${YELLOW}Visual Uploader:${NC} http://your-domain.com/tools/go4it_visual_uploader.html"
echo
echo -e "${BLUE}If you need further assistance, refer to the documentation or contact support.${NC}"
EOL

# Make the script executable
chmod +x "${TEMP_DIR}/deploy_all.sh"

# Create README file
echo -e "${YELLOW}Creating README file...${NC}"
cat > "${TEMP_DIR}/README.md" << 'EOL'
# Go4It Sports - Complete Deployment Package

This package contains everything you need to deploy the Go4It Sports platform, including:

1. The main Go4It Sports application
2. Monaco Editor + StarCoder AI integration
3. Visual Uploader & Deployment Tool
4. All necessary scripts and configuration files

## Quick Start

For a complete automated deployment, simply run:

```bash
chmod +x deploy_all.sh
./deploy_all.sh
```

This will:
- Create the necessary directory structure
- Deploy the main application
- Set up Monaco Editor with StarCoder AI integration
- Install the Visual Uploader tool
- Verify the deployment

## Package Contents

### Main Application
- `/client/` - Frontend React application
- `/server/` - Backend Node.js application
- `/shared/` - Shared code between client and server
- `/public/` - Static public assets

### Tools
- `/tools/go4it_visual_uploader.js` - Visual Uploader JavaScript
- `/tools/go4it_visual_uploader.html` - Visual Uploader HTML
- `/tools/visual_monaco_integration.css` - CSS styles for Monaco integration

### Editor Integration
- `/editor_integration/direct_integration.js` - StarCoder integration for Monaco
- `/editor_integration/monaco_integration_instructions.md` - Setup instructions
- `/editor_integration/go4it_monaco_integration.sh` - Integration script

### Scripts
- `/scripts/` - Various deployment and utility scripts
- `/deploy_all.sh` - Main deployment script

## Manual Deployment

If you prefer to deploy components individually:

1. **Deploy Main Application**:
   ```bash
   ./scripts/deploy.sh
   ```

2. **Set up Monaco Editor + StarCoder**:
   ```bash
   ./editor_integration/go4it_monaco_integration.sh
   ```

3. **Install Visual Uploader**:
   ```bash
   mkdir -p /var/www/html/tools
   cp ./tools/go4it_visual_uploader.* /var/www/html/tools/
   ```

## After Deployment

After deployment, you can access:

- Main application: `http://your-domain.com/`
- Visual Uploader: `http://your-domain.com/tools/go4it_visual_uploader.html`

## Troubleshooting

If you encounter issues:

1. Check the deployment logs
2. Verify file permissions
3. Ensure all services are running (Node.js, database, StarCoder API)
4. Run the verification script: `./scripts/verify_deployment.sh`

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
echo -e "${YELLOW}To deploy:${NC}"
echo -e "1. Upload the zip file to your server"
echo -e "2. Extract the zip file: unzip ${PACKAGE_NAME}.zip"
echo -e "3. Navigate to the extracted directory: cd ${TEMP_DIR}"
echo -e "4. Run the deployment script: ./deploy_all.sh"
echo
echo -e "${GREEN}Done!${NC}"