#!/bin/bash

# Go4It Sports Deployment Package Builder
# Creates a complete deployment package with the Star Coder + Monaco integration

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Go4It Sports Deployment Package Builder ===${NC}"
echo -e "${YELLOW}Creating complete deployment package with Star Coder integration...${NC}"

# Define directories
PACKAGE_DIR="go4it_deployment_$(date +%Y%m%d_%H%M%S)"
EDITOR_DIR="$PACKAGE_DIR/editor_integration"

# Create directory structure
mkdir -p "$PACKAGE_DIR"
mkdir -p "$EDITOR_DIR"
mkdir -p "$PACKAGE_DIR/server"
mkdir -p "$PACKAGE_DIR/client"
mkdir -p "$PACKAGE_DIR/shared"
mkdir -p "$PACKAGE_DIR/public"
mkdir -p "$PACKAGE_DIR/scripts"

# Copy main deployment files
echo -e "\n${YELLOW}Copying core deployment files...${NC}"
cp -r go4it_latest_working_site/* "$PACKAGE_DIR/" 2>/dev/null || echo "No latest working site directory found"
cp -r client "$PACKAGE_DIR/" 2>/dev/null
cp -r server "$PACKAGE_DIR/" 2>/dev/null
cp -r shared "$PACKAGE_DIR/" 2>/dev/null
cp -r public "$PACKAGE_DIR/" 2>/dev/null

# Copy core configuration files
echo -e "\n${YELLOW}Copying configuration files...${NC}"
cp package.json "$PACKAGE_DIR/" 2>/dev/null
cp drizzle.config.ts "$PACKAGE_DIR/" 2>/dev/null
cp tsconfig.json "$PACKAGE_DIR/" 2>/dev/null
cp README.md "$PACKAGE_DIR/" 2>/dev/null

# Copy deployment scripts
echo -e "\n${YELLOW}Copying deployment scripts...${NC}"
cp deploy.sh "$PACKAGE_DIR/" 2>/dev/null
cp auto_deploy.sh "$PACKAGE_DIR/" 2>/dev/null
cp verify_deployment.sh "$PACKAGE_DIR/" 2>/dev/null

# Add Star Coder + Monaco Editor Integration
echo -e "\n${YELLOW}Adding Star Coder + Monaco Editor Integration...${NC}"
cp direct_integration.js "$EDITOR_DIR/"
cp monaco_integration_instructions.md "$EDITOR_DIR/"

# Create a deployment README
echo -e "\n${YELLOW}Creating deployment README...${NC}"
cat > "$PACKAGE_DIR/DEPLOYMENT_README.md" << 'EOF'
# Go4It Sports Deployment Package

This is a complete deployment package for Go4It Sports platform, including the new Star Coder + Monaco Editor integration.

## Deployment Steps

1. Upload this entire package to your server using File Browser or other file transfer method.
2. Connect to your server via SSH or use the File Browser Terminal feature.
3. Navigate to the uploaded directory and run the deployment script:
   ```
   chmod +x auto_deploy.sh
   ./auto_deploy.sh
   ```
4. The script will handle installation of dependencies and configuration of services.

## Star Coder + Monaco Editor Integration

The `/editor_integration` directory contains files needed to connect your existing Star Coder instance with Monaco Editor:

1. Follow the instructions in `monaco_integration_instructions.md` to integrate Star Coder with Monaco Editor.
2. Upload `direct_integration.js` to `/var/www/html/pharaoh/js/` on your server.
3. Update your Monaco Editor initialization in `monaco-setup.js` as described in the instructions.

## Post-Deployment Steps

After deployment, verify that:
1. The main Go4It Sports application is running correctly
2. The Star Coder integration with Monaco Editor is working
3. All database connections are functioning properly

## Troubleshooting

If you encounter issues during deployment:
1. Check the logs with `journalctl -u go4it`
2. Review database connection settings
3. Verify Star Coder API is running and accessible

For Star Coder integration issues:
1. Check browser console for JavaScript errors
2. Verify `direct_integration.js` was uploaded correctly
3. Make sure Star Coder API is running at the expected URL (default: http://localhost:11434/v1)
EOF

# Create a verification script
echo -e "\n${YELLOW}Creating verification script...${NC}"
cat > "$PACKAGE_DIR/verify_integration.sh" << 'EOF'
#!/bin/bash

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Star Coder + Monaco Editor Integration Verification ===${NC}"

# Check if Star Coder API is running
echo -e "\n${YELLOW}Checking Star Coder API...${NC}"
if curl -s http://localhost:11434/v1/models > /dev/null; then
  echo -e "${GREEN}✓ Star Coder API is running${NC}"
else
  echo -e "${RED}✗ Star Coder API is not running or not accessible${NC}"
  echo -e "  Try starting it with: systemctl start ollama"
fi

# Check Monaco Editor integration file
echo -e "\n${YELLOW}Checking Monaco Editor integration file...${NC}"
if [ -f "/var/www/html/pharaoh/js/direct_integration.js" ]; then
  echo -e "${GREEN}✓ Integration file is in place${NC}"
else
  echo -e "${RED}✗ Integration file is missing${NC}"
  echo -e "  Upload direct_integration.js to /var/www/html/pharaoh/js/"
fi

# Check monaco-setup.js for integration code
echo -e "\n${YELLOW}Checking monaco-setup.js for integration code...${NC}"
if grep -q "integrateStarCoderWithMonaco" /var/www/html/pharaoh/js/monaco-setup.js; then
  echo -e "${GREEN}✓ Integration code found in monaco-setup.js${NC}"
else
  echo -e "${RED}✗ Integration code not found in monaco-setup.js${NC}"
  echo -e "  Follow instructions in monaco_integration_instructions.md to update monaco-setup.js"
fi

echo -e "\n${GREEN}Verification complete${NC}"
EOF
chmod +x "$PACKAGE_DIR/verify_integration.sh"

# Create a zip file of the deployment package
echo -e "\n${YELLOW}Creating deployment zip file...${NC}"
zip -r "$PACKAGE_DIR.zip" "$PACKAGE_DIR"

echo -e "\n${GREEN}=== Deployment Package Created! ===${NC}"
echo -e "${YELLOW}Package directory: $PACKAGE_DIR${NC}"
echo -e "${YELLOW}Package zip file: $PACKAGE_DIR.zip${NC}"
echo -e "\n${GREEN}=== Deployment Instructions ===${NC}"
echo -e "1. Upload the zip file to your server"
echo -e "2. Extract the zip file"
echo -e "3. Follow the instructions in DEPLOYMENT_README.md"