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
