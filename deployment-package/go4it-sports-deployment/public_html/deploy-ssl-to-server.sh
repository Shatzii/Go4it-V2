#!/bin/bash
# GO4IT SPORTS: SSL DEPLOYMENT SCRIPT
# This script transfers the SSL/NGINX configuration to your server and executes it

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}GO4IT SPORTS: DEPLOYING SSL/NGINX CONFIGURATION${NC}"
echo -e "${BLUE}============================================================${NC}"

# Server details
SERVER_USER="go4it"
SERVER_DOMAIN="go4itsports.org"
SERVER_PORT="22"

# Confirm server details before proceeding
echo -e "${YELLOW}Preparing to deploy SSL configuration to:${NC}"
echo -e "  Server: ${SERVER_DOMAIN}"
echo -e "  User:   ${SERVER_USER}"
echo -e "  Port:   ${SERVER_PORT}"
echo ""
echo -e "${YELLOW}This will configure NGINX with SSL certificates for HTTPS access.${NC}"
echo ""
read -p "Continue with deployment? (y/n): " CONFIRM

if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
  echo -e "${RED}Deployment canceled.${NC}"
  exit 1
fi

echo -e "\n${YELLOW}>>> Transferring configuration to server...${NC}"
# Check if the SSL setup script exists
if [ ! -f "go4it-ssl-setup.sh" ]; then
  echo -e "${RED}Error: go4it-ssl-setup.sh not found!${NC}"
  exit 1
fi

# Transfer the SSL setup script to the server
scp -P $SERVER_PORT go4it-ssl-setup.sh $SERVER_USER@$SERVER_DOMAIN:~/
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to transfer files to server!${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Files transferred successfully to server${NC}"

echo -e "\n${YELLOW}>>> Executing configuration on server...${NC}"
# Execute the SSL setup script on the server with sudo
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_DOMAIN "chmod +x ~/go4it-ssl-setup.sh && sudo bash ~/go4it-ssl-setup.sh"
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to execute configuration on server!${NC}"
  exit 1
fi

echo -e "\n${YELLOW}>>> Verifying HTTPS access...${NC}"
# Check if the site is accessible over HTTPS (allowing self-signed certificate errors)
curl -k -s -o /dev/null -w "%{http_code}" https://$SERVER_DOMAIN > /dev/null
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ HTTPS is accessible (with certificate warnings)${NC}"
else
  echo -e "${RED}✗ HTTPS is not accessible${NC}"
fi

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}SSL/NGINX DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}============================================================${NC}"
echo -e "Your Go4It Sports platform should now be accessible at:"
echo -e "${BLUE}https://$SERVER_DOMAIN${NC}"
echo -e ""
echo -e "${YELLOW}NOTE:${NC} Since we're using self-signed certificates, browsers will"
echo -e "      show a security warning. This is expected. You can safely proceed"
echo -e "      through this warning during testing."
echo -e ""
echo -e "For production use, consider upgrading to Let's Encrypt certificates"
echo -e "once the site is fully tested and working correctly."