#!/bin/bash

# Go4It Sports Star Coder Editor Deployment Script
# This script prepares the deployment package for File Browser upload

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Preparing Star Coder Editor Deployment Package ===${NC}"

# Create deployment directory
DEPLOY_DIR="star_coder_editor_deploy"
mkdir -p $DEPLOY_DIR

# Copy files to deployment directory
echo -e "${YELLOW}Copying files to deployment package...${NC}"
cp star_coder_integration.js $DEPLOY_DIR/
cp client/editor.html $DEPLOY_DIR/
cp setup_star_coder_editor.sh $DEPLOY_DIR/

# Create README file
echo -e "${YELLOW}Creating README file...${NC}"
cat > $DEPLOY_DIR/README.md << 'EOF'
# Go4It Sports Star Coder Editor Deployment

This package contains all the necessary files to deploy the Star Coder Editor integration
for your Go4It Sports platform.

## Files Included

- `star_coder_integration.js` - The backend service that connects to Star Coder
- `editor.html` - The Monaco Editor frontend interface
- `setup_star_coder_editor.sh` - The installation script

## Deployment Instructions via File Browser

1. Upload this entire folder to your server using File Browser
2. Connect to your server via SSH or use the File Browser Terminal feature
3. Navigate to the uploaded directory:
   ```
   cd /path/to/uploaded/star_coder_editor_deploy
   ```
4. Make the setup script executable:
   ```
   chmod +x setup_star_coder_editor.sh
   ```
5. Run the setup script:
   ```
   ./setup_star_coder_editor.sh
   ```
6. The script will install all necessary components and configure the system
7. Once complete, access your editor at: https://editor.go4itsports.org 
   (or the domain you configured in the setup script)

## Configuration

You can edit the setup script before running it to customize:
- The domain name
- Port numbers
- File paths
- Star Coder API endpoint

## Troubleshooting

If you encounter issues:
1. Check the logs: `journalctl -u star-coder-editor`
2. Verify Star Coder is running: `systemctl status ollama` (or your Star Coder service name)
3. Check nginx configuration: `nginx -t`
4. Restart the service: `systemctl restart star-coder-editor`

## Support

For assistance, contact your Go4It Sports support team.
EOF

# Create a quick start guide
echo -e "${YELLOW}Creating quick start guide...${NC}"
cat > $DEPLOY_DIR/QUICK_START.md << 'EOF'
# Star Coder Editor Quick Start Guide

After deploying the Star Coder Editor, follow these steps to get started:

## Accessing the Editor

1. Open your web browser and navigate to: https://editor.go4itsports.org
   (or the domain you configured during setup)

2. You'll see the editor interface with:
   - File explorer on the left
   - Monaco Editor in the center
   - Output panels at the bottom

## Basic Usage

1. **Browse Files**: 
   - Use the file explorer to navigate through your project
   - Enter a path in the input box and press Enter to jump to a specific directory

2. **Edit Files**:
   - Click on any file to open it in the editor
   - Multiple files can be opened in tabs
   - Changes are saved when you click the Save button

3. **Code Analysis**:
   - Click the "Analyze" button to run Star Coder analysis on the current file
   - Errors and warnings will be highlighted in the editor
   - Diagnostics will appear in the bottom panel

4. **AI Assistance**:
   - Switch to the "StarCoder" tab in the bottom panel
   - Type your query in the input field
   - Get AI assistance with your code

5. **Auto Fix**:
   - Click the "Auto Fix" button to let Star Coder suggest fixes for issues
   - Review the suggested changes before applying them

## Advanced Features

1. **Editor Settings**: 
   - Click the gear icon to access editor settings
   - Customize theme, font size, and other options

2. **Code Run**:
   - For supported file types, a "Run" button will appear
   - This allows you to execute scripts directly from the editor

3. **Multiple Diagnostics Sources**:
   - The editor uses both basic static analysis and Star Coder AI
   - This provides comprehensive error detection and suggestions

Enjoy your enhanced coding experience with Star Coder and Monaco Editor!
EOF

# Create an installation verification script
echo -e "${YELLOW}Creating verification script...${NC}"
cat > $DEPLOY_DIR/verify_installation.sh << 'EOF'
#!/bin/bash

# Set color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Verifying Star Coder Editor installation...${NC}"

# Check if required files exist
echo -e "Checking required files..."
if [ -f "/var/www/editor/star_coder_integration.js" ] && \
   [ -f "/var/www/editor/public/index.html" ] && \
   [ -f "/var/www/editor/config.js" ]; then
  echo -e "${GREEN}✓ Required files are in place${NC}"
else
  echo -e "${RED}✗ Some required files are missing${NC}"
fi

# Check if service is running
echo -e "\nChecking service status..."
if systemctl is-active --quiet star-coder-editor; then
  echo -e "${GREEN}✓ Star Coder Editor service is running${NC}"
else
  echo -e "${RED}✗ Star Coder Editor service is not running${NC}"
fi

# Check if nginx configuration exists
echo -e "\nChecking nginx configuration..."
if [ -f "/etc/nginx/sites-enabled/star-coder-editor" ]; then
  echo -e "${GREEN}✓ Nginx configuration is in place${NC}"
else
  echo -e "${RED}✗ Nginx configuration is missing${NC}"
fi

# Check if Star Coder API is accessible
echo -e "\nChecking Star Coder API accessibility..."
STAR_CODER_HOST=$(grep "starCoderApiUrl" /var/www/editor/config.js | cut -d "'" -f 2 | cut -d "/" -f 3 | cut -d ":" -f 1)
STAR_CODER_PORT=$(grep "starCoderApiUrl" /var/www/editor/config.js | cut -d "'" -f 2 | cut -d "/" -f 3 | cut -d ":" -f 2)

if nc -z $STAR_CODER_HOST $STAR_CODER_PORT 2>/dev/null; then
  echo -e "${GREEN}✓ Star Coder API is accessible${NC}"
else
  echo -e "${RED}✗ Cannot connect to Star Coder API at $STAR_CODER_HOST:$STAR_CODER_PORT${NC}"
fi

# Final status message
echo -e "\n==== Star Coder Editor Status ====\n"
if systemctl is-active --quiet star-coder-editor; then
  echo -e "${GREEN}✓ Star Coder Editor is properly installed and running${NC}"
  echo -e "${YELLOW}You can access it at:${NC} https://$(grep "editorDomain" /var/www/editor/config.js | cut -d "'" -f 2)"
else
  echo -e "${RED}✗ Star Coder Editor installation has issues${NC}"
  echo -e "${YELLOW}Check the logs with:${NC} journalctl -u star-coder-editor"
fi
EOF
chmod +x $DEPLOY_DIR/verify_installation.sh

# Create a run script to manually start the service without installation
echo -e "${YELLOW}Creating manual run script...${NC}"
cat > $DEPLOY_DIR/run_manual.js << 'EOF'
/**
 * Go4It Sports Star Coder Editor Manual Runner
 * 
 * This script allows you to run the Star Coder Editor without full installation
 * Useful for testing or temporary deployments
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Read the integration module
const integrationCode = fs.readFileSync('./star_coder_integration.js', 'utf8');

// Create a modified version for manual execution
const modifiedCode = `
// Manual configuration
const config = {
  starCoderApiUrl: 'http://localhost:11434/v1',
  editorPort: 8090,
  projectsRoot: '${process.cwd()}',
  diagnosticsPort: 8091,
  editorDomain: 'localhost'
};

${integrationCode}
`;

// Write the modified file
fs.writeFileSync('./temp_integration.js', modifiedCode);

// Create public directory and copy editor file
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}
fs.copyFileSync('./editor.html', './public/index.html');

// Display instructions
console.log('\x1b[32m%s\x1b[0m', '=== Go4It Sports Star Coder Editor Manual Runner ===');
console.log('\x1b[33m%s\x1b[0m', 'Starting temporary installation...');
console.log('\x1b[33m%s\x1b[0m', 'Installing required modules...');

// Run the npm install command
const { execSync } = require('child_process');
try {
  execSync('npm install express cors axios body-parser', { stdio: 'inherit' });
  console.log('\x1b[32m%s\x1b[0m', 'Dependencies installed successfully.');
  
  console.log('\x1b[33m%s\x1b[0m', 'Starting the editor service...');
  console.log('\x1b[33m%s\x1b[0m', 'You can access the editor at: http://localhost:8090');
  
  // Execute the temporary integration file
  require('./temp_integration.js');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Error setting up manual run:', error.message);
}
EOF

# Create package.json for the manual runner
echo -e "${YELLOW}Creating package.json for manual runner...${NC}"
cat > $DEPLOY_DIR/package.json << 'EOF'
{
  "name": "star-coder-editor",
  "version": "1.0.0",
  "description": "Go4It Sports Star Coder Editor Integration",
  "main": "star_coder_integration.js",
  "scripts": {
    "start": "node star_coder_integration.js",
    "manual": "node run_manual.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.4.0",
    "body-parser": "^1.20.2"
  }
}
EOF

# Create a zip file of the deployment package
echo -e "${YELLOW}Creating deployment zip file...${NC}"
zip -r star_coder_editor_deploy.zip $DEPLOY_DIR

echo -e "${GREEN}=== Deployment Package Created! ===${NC}"
echo -e "${YELLOW}Files are in the '$DEPLOY_DIR' directory${NC}"
echo -e "${YELLOW}A zip file 'star_coder_editor_deploy.zip' is also available${NC}"
echo -e "${YELLOW}Upload these files to your server using File Browser${NC}"
echo -e "${YELLOW}Then run the setup script as described in the README${NC}"
echo -e "\n${GREEN}=== Deployment Instructions ===${NC}"
echo -e "1. Log in to File Browser at your server's address"
echo -e "2. Upload the 'star_coder_editor_deploy' folder or the .zip file"
echo -e "3. If you uploaded the zip, extract it on the server"
echo -e "4. Navigate to the folder in File Browser"
echo -e "5. Use the terminal feature in File Browser or SSH to run:"
echo -e "   chmod +x setup_star_coder_editor.sh"
echo -e "   ./setup_star_coder_editor.sh"
echo -e "6. Follow the on-screen instructions to complete setup"
echo -e "7. Access your new editor at https://editor.go4itsports.org"