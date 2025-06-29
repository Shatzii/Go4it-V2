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

# Check for HTML script include
echo -e "\n${YELLOW}Checking HTML for script include...${NC}"
if grep -q "direct_integration.js" /var/www/html/pharaoh/command_panel.html; then
  echo -e "${GREEN}✓ Script include found in HTML${NC}"
else
  echo -e "${RED}✗ Script include not found in HTML${NC}"
  echo -e "  Add <script src=\"/pharaoh/js/direct_integration.js\"></script> to command_panel.html"
fi

echo -e "\n${GREEN}Verification complete${NC}"
echo -e "\n${YELLOW}Testing connection to Star Coder API...${NC}"

# Try to get a simple response from the API
response=$(curl -s http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Say hello"}
    ]
  }')

if [ $? -eq 0 ] && [ ! -z "$response" ]; then
  echo -e "${GREEN}✓ Successfully connected to Star Coder API${NC}"
  echo -e "  You can now use the integrated features in Monaco Editor"
else
  echo -e "${RED}✗ Could not connect to Star Coder API${NC}"
  echo -e "  Check if Ollama is running and the API is accessible"
fi

echo -e "\n${GREEN}=== Verification Complete ===${NC}"
echo -e "  To test the integration, open the Monaco Editor in your browser"
echo -e "  and try the following keyboard shortcuts:"
echo -e "    - ${YELLOW}Ctrl+Shift+A${NC} - Analyze code"
echo -e "    - ${YELLOW}Ctrl+Shift+F${NC} - Fix code issues"
echo -e "    - ${YELLOW}Ctrl+Shift+Q${NC} - Ask a question about your code"