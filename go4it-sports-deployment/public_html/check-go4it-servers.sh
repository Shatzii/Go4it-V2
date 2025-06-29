#!/bin/bash
# GO4IT SPORTS: SERVER HEALTH CHECK SCRIPT
# This script checks the health of your Go4It Sports server and services

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}GO4IT SPORTS: SERVER HEALTH CHECK${NC}"
echo -e "${BLUE}============================================================${NC}"

# Server details
SERVER_USER="go4it"
SERVER_DOMAIN="go4itsports.org"
SERVER_PORT="22"

# Confirm server details before proceeding
echo -e "${YELLOW}Preparing to check server health for:${NC}"
echo -e "  Server: ${SERVER_DOMAIN}"
echo -e "  User:   ${SERVER_USER}"
echo -e "  Port:   ${SERVER_PORT}"
echo ""
read -p "Continue with health check? (y/n): " CONFIRM

if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
  echo -e "${RED}Health check canceled.${NC}"
  exit 1
fi

echo -e "\n${YELLOW}>>> Checking server accessibility...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_DOMAIN "echo 'SSH connection successful'"
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Cannot connect to server via SSH!${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Server is accessible via SSH${NC}"

echo -e "\n${YELLOW}>>> Checking server status...${NC}"
# Create a temporary health check script
cat > temp_health_check.sh << 'EOT'
#!/bin/bash
# Temporary health check script

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}System Information:${NC}"
echo -e "  Hostname: $(hostname)"
echo -e "  OS:       $(cat /etc/os-release | grep "PRETTY_NAME" | cut -d= -f2 | tr -d '"')"
echo -e "  Uptime:   $(uptime -p)"
echo -e "  Load:     $(uptime | awk '{print $10,$11,$12}')"

echo -e "\n${BLUE}Disk Usage:${NC}"
df -h | grep -v "tmpfs" | grep -v "udev"

echo -e "\n${BLUE}Memory Usage:${NC}"
free -h

echo -e "\n${BLUE}Service Status:${NC}"
echo -n "  NGINX:   "
if systemctl is-active --quiet nginx; then
  echo -e "${GREEN}Running${NC}"
else
  echo -e "${RED}Not Running${NC}"
fi

echo -n "  PostgreSQL: "
if systemctl is-active --quiet postgresql; then
  echo -e "${GREEN}Running${NC}"
else
  echo -e "${RED}Not Running${NC}"
fi

echo -e "\n${BLUE}PM2 Processes:${NC}"
if command -v pm2 &> /dev/null; then
  pm2 list
else
  echo -e "${RED}PM2 not installed${NC}"
fi

echo -e "\n${BLUE}NGINX Configuration:${NC}"
nginx -t 2>&1

echo -e "\n${BLUE}SSL Certificates:${NC}"
if [ -f /etc/nginx/ssl/go4itsports.crt ]; then
  echo -e "  Self-signed certificate: ${GREEN}Present${NC}"
  echo -e "  Expires: $(openssl x509 -in /etc/nginx/ssl/go4itsports.crt -noout -enddate)"
elif [ -f /etc/letsencrypt/live/go4itsports.org/fullchain.pem ]; then
  echo -e "  Let's Encrypt certificate: ${GREEN}Present${NC}"
  echo -e "  Expires: $(openssl x509 -in /etc/letsencrypt/live/go4itsports.org/fullchain.pem -noout -enddate)"
else
  echo -e "${RED}No SSL certificates found${NC}"
fi

echo -e "\n${BLUE}Open Ports:${NC}"
netstat -tulpn 2>/dev/null | grep -E ":80|:443|:5000|:3000" | grep LISTEN

echo -e "\n${BLUE}Recent Error Logs:${NC}"
echo -e "  NGINX Errors (last 5):"
if [ -f /var/log/nginx/error.log ]; then
  tail -n 5 /var/log/nginx/error.log
else
  echo -e "  ${RED}No NGINX error log found${NC}"
fi

echo -e "\n  Application Errors (PM2, last 5 per app):"
if command -v pm2 &> /dev/null; then
  pm2 logs --lines 5 --nostream
else
  echo -e "  ${RED}PM2 not installed${NC}"
fi
EOT

# Transfer the health check script to the server
scp -P $SERVER_PORT temp_health_check.sh $SERVER_USER@$SERVER_DOMAIN:~/
rm temp_health_check.sh

# Execute the health check script on the server
echo -e "\n${YELLOW}>>> Running comprehensive health check...${NC}"
echo -e "${BLUE}============================================================${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_DOMAIN "chmod +x ~/temp_health_check.sh && sudo bash ~/temp_health_check.sh"
echo -e "${BLUE}============================================================${NC}"

# Clean up the temporary script
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_DOMAIN "rm ~/temp_health_check.sh"

echo -e "\n${YELLOW}>>> Checking HTTPS access...${NC}"
# Check if the site is accessible over HTTPS (allowing self-signed certificate errors)
if command -v curl &> /dev/null; then
  HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" https://$SERVER_DOMAIN)
  if [[ $HTTP_CODE == "200" || $HTTP_CODE == "302" ]]; then
    echo -e "${GREEN}✓ HTTPS is accessible (HTTP Code: $HTTP_CODE)${NC}"
  else
    echo -e "${RED}✗ HTTPS returned code $HTTP_CODE${NC}"
  fi
else
  echo -e "${YELLOW}⚠ curl not found, cannot check HTTPS access${NC}"
fi

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}SERVER HEALTH CHECK COMPLETE${NC}"
echo -e "${GREEN}============================================================${NC}"
echo -e "If you need to fix any issues, here are some commands:"
echo -e ""
echo -e "  Restart NGINX:            ${YELLOW}sudo systemctl restart nginx${NC}"
echo -e "  View NGINX logs:          ${YELLOW}sudo tail -f /var/log/nginx/error.log${NC}"
echo -e "  Restart PostgreSQL:       ${YELLOW}sudo systemctl restart postgresql${NC}"
echo -e "  Restart PM2 processes:    ${YELLOW}pm2 restart all${NC}"
echo -e "  View PM2 logs:            ${YELLOW}pm2 logs${NC}"
echo -e ""
echo -e "To deploy the Go4It Sports SSL configuration, run:"
echo -e "${YELLOW}./deploy-ssl-to-server.sh${NC}"