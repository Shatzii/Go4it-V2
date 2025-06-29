#!/bin/bash

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Preparing Files for File Browser Deployment ===${NC}"

# Create deployment directory
DEPLOY_DIR="star_coder_editor_files"
mkdir -p $DEPLOY_DIR
mkdir -p $DEPLOY_DIR/public

# Copy files to deployment directory
echo -e "${YELLOW}Copying files to deployment folder...${NC}"
cp star_coder_integration.js $DEPLOY_DIR/
cp setup_star_coder_editor.sh $DEPLOY_DIR/
cp client/editor.html $DEPLOY_DIR/public/index.html

# Copy deployment instructions
cp file_browser_deployment_instructions.md $DEPLOY_DIR/INSTRUCTIONS.md

# Update permissions
chmod +x $DEPLOY_DIR/setup_star_coder_editor.sh

# Create a configuration file
echo -e "${YELLOW}Creating configuration file...${NC}"
cat > $DEPLOY_DIR/config.js << 'EOF'
/**
 * Go4It Sports Star Coder Editor Integration Configuration
 */

module.exports = {
  // Star Coder API endpoint
  starCoderApiUrl: 'http://localhost:11434/v1',
  
  // Monaco Editor service port
  editorPort: 8090,
  
  // API service port
  apiPort: 8091,
  
  // Projects root directory
  projectsRoot: '/var/www/go4itsports',
  
  // Domain for the editor
  editorDomain: 'editor.go4itsports.org'
};
EOF

# Create a zip file for easy download
echo -e "${YELLOW}Creating zip file for easy download...${NC}"
zip -r star_coder_editor_files.zip $DEPLOY_DIR

echo -e "${GREEN}=== Files Ready for Deployment! ===${NC}"
echo -e "${YELLOW}You can now:${NC}"
echo -e "1. Download individual files from the '$DEPLOY_DIR' directory"
echo -e "2. Download the 'star_coder_editor_files.zip' file (recommended)"
echo -e "3. Upload to your server using File Browser following the instructions in INSTRUCTIONS.md"