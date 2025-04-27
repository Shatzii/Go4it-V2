#!/bin/bash
# Go4It Sports Deployment Script for new server (188.245.209.124)
# This script automates the deployment process on a fresh Ubuntu server

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration variables - MODIFY THESE
APP_DIR="/var/www/go4it"
DB_NAME="go4it"
DB_USER="go4ituser"
DB_PASS="CHANGE_THIS_PASSWORD" # IMPORTANT: Change this!
DOMAIN="go4itsports.org"
SERVER_IP="188.245.209.124"
ADMIN_EMAIL="your@email.com" # Change to your email

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}This script must be run as root${NC}"
    exit 1
fi

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Go4It Sports Deployment Script${NC}"
echo -e "${GREEN}Server IP: ${SERVER_IP}${NC}"
echo -e "${GREEN}Domain: ${DOMAIN}${NC}"
echo -e "${GREEN}=========================================${NC}"

# Ask confirmation before proceeding
echo -e "${YELLOW}This script will install Go4It Sports on this server.${NC}"
echo -e "${YELLOW}All existing configurations might be overwritten.${NC}"
read -p "Do you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 1
fi

# Step 1: Update system packages
echo -e "\n${GREEN}Step 1: Updating system packages...${NC}"
apt update && apt upgrade -y

# Step 2: Install required dependencies
echo -e "\n${GREEN}Step 2: Installing required dependencies...${NC}"
apt install -y git curl wget vim build-essential nginx ufw certbot python3-certbot-nginx \
    fail2ban postfix mailutils htop iotop vnstat

# Step 3: Configure firewall
echo -e "\n${GREEN}Step 3: Configuring firewall...${NC}"
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 81    # Go4It Sports application
ufw allow 25    # SMTP (for email)
ufw allow 587   # Secure SMTP (for email)
ufw allow 465   # SMTPS (for email)
ufw --force enable

# Step 4: Install Node.js and npm
echo -e "\n${GREEN}Step 4: Installing Node.js and npm...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node -v
npm -v

# Step 5: Install PostgreSQL
echo -e "\n${GREEN}Step 5: Installing PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Step 6: Create database and user
echo -e "\n${GREEN}Step 6: Creating database and user...${NC}"
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASS}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -c "ALTER ROLE ${DB_USER} WITH CREATEDB CREATEROLE;"

# Step 7: Install PM2
echo -e "\n${GREEN}Step 7: Installing PM2...${NC}"
npm install -g pm2
pm2 startup

# Step 8: Create application directory
echo -e "\n${GREEN}Step 8: Creating application directory...${NC}"
mkdir -p ${APP_DIR}

# Step 9: Extract application files
echo -e "\n${GREEN}Step 9: Extracting application files...${NC}"
echo -e "${YELLOW}NOTE: You need to upload go4it-deployment-2025-04-27.zip to the server first${NC}"
echo -e "${YELLOW}If you haven't done so, press Ctrl+C and upload the file, then run this script again${NC}"
read -p "Have you uploaded the deployment package? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Please upload the deployment package and run the script again.${NC}"
    exit 1
fi

read -p "Enter the path to the deployment package: " PACKAGE_PATH
if [ ! -f "$PACKAGE_PATH" ]; then
    echo -e "${RED}File not found: ${PACKAGE_PATH}${NC}"
    exit 1
fi

unzip -q "$PACKAGE_PATH" -d ${APP_DIR}
cd ${APP_DIR}

# Step 10: Set up environment variables
echo -e "\n${GREEN}Step 10: Setting up environment variables...${NC}"
cp .env.template .env

# Generate a random string for SESSION_SECRET
SESSION_SECRET=$(openssl rand -hex 32)

# Update the .env file
sed -i "s/your_db_password/${DB_PASS}/g" .env
sed -i "s/your_openai_api_key/CHANGE_THIS/g" .env
sed -i "s/your_anthropic_api_key/CHANGE_THIS/g" .env
sed -i "s/random_secret_string_for_session_encryption/${SESSION_SECRET}/g" .env

echo -e "${YELLOW}Please update the OpenAI and Anthropic API keys in ${APP_DIR}/.env${NC}"

# Step 11: Configure Nginx
echo -e "\n${GREEN}Step 11: Configuring Nginx...${NC}"
mv nginx-go4it.conf /etc/nginx/sites-available/go4it
ln -s /etc/nginx/sites-available/go4it /etc/nginx/sites-enabled/
# Create directory for Let's Encrypt verification
mkdir -p /var/www/letsencrypt
nginx -t
systemctl reload nginx

# Step 12: Create backups directory
echo -e "\n${GREEN}Step 12: Creating backups directory...${NC}"
mkdir -p /var/backups/go4it
chmod 755 /var/backups/go4it

# Step 13: Create database backup script
echo -e "\n${GREEN}Step 13: Creating database backup script...${NC}"
mkdir -p /var/scripts
cat > /var/scripts/backup-db.sh << EOF
#!/bin/bash
TIMESTAMP=\$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="/var/backups/go4it"
mkdir -p \$BACKUP_DIR
sudo -u postgres pg_dump ${DB_NAME} > \$BACKUP_DIR/go4it-\$TIMESTAMP.sql
find \$BACKUP_DIR -type f -mtime +7 -name "*.sql" -delete
EOF
chmod +x /var/scripts/backup-db.sh

# Step 14: Create health check script
echo -e "\n${GREEN}Step 14: Creating health check script...${NC}"
cat > /var/scripts/healthcheck.sh << EOF
#!/bin/bash
LOG_FILE="/var/log/go4it-health.log"
EMAIL="${ADMIN_EMAIL}"

echo "--- Go4It Sports Health Check: \$(date) ---" >> \$LOG_FILE

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
  echo "✓ Nginx is running" >> \$LOG_FILE
else
  echo "✗ Nginx is DOWN" >> \$LOG_FILE
  echo "Nginx is down on ${DOMAIN} server" | mail -s "ALERT: Nginx Down" \$EMAIL
  systemctl restart nginx
fi

# Check if PostgreSQL is running
if systemctl is-active --quiet postgresql; then
  echo "✓ PostgreSQL is running" >> \$LOG_FILE
else
  echo "✗ PostgreSQL is DOWN" >> \$LOG_FILE
  echo "PostgreSQL is down on ${DOMAIN} server" | mail -s "ALERT: Database Down" \$EMAIL
  systemctl restart postgresql
fi

# Check if application is running
if pm2 show go4it-sports | grep -q "online"; then
  echo "✓ Application is running" >> \$LOG_FILE
else
  echo "✗ Application is DOWN" >> \$LOG_FILE
  echo "Go4It Sports application is down" | mail -s "ALERT: Application Down" \$EMAIL
  cd ${APP_DIR} && pm2 restart go4it-sports
fi

# Check disk space
DISK_USAGE=\$(df -h / | awk 'NR==2 {print \$5}' | sed 's/%//')
if [ \$DISK_USAGE -gt 90 ]; then
  echo "✗ Disk space critical: \$DISK_USAGE%" >> \$LOG_FILE
  echo "Critical disk space on ${DOMAIN} server: \$DISK_USAGE% used" | mail -s "ALERT: Disk Space" \$EMAIL
else
  echo "✓ Disk space OK: \$DISK_USAGE%" >> \$LOG_FILE
fi

# Check memory usage
MEM_USAGE=\$(free | grep Mem | awk '{print int(\$3/\$2 * 100)}')
if [ \$MEM_USAGE -gt 90 ]; then
  echo "✗ Memory usage critical: \$MEM_USAGE%" >> \$LOG_FILE
  echo "Critical memory usage on ${DOMAIN} server: \$MEM_USAGE% used" | mail -s "ALERT: Memory Usage" \$EMAIL
else
  echo "✓ Memory usage OK: \$MEM_USAGE%" >> \$LOG_FILE
fi

echo "--- End of Health Check ---" >> \$LOG_FILE
EOF
chmod +x /var/scripts/healthcheck.sh

# Step 15: Set up cron jobs
echo -e "\n${GREEN}Step 15: Setting up cron jobs...${NC}"
(crontab -l 2>/dev/null; echo "0 3 * * * /var/scripts/backup-db.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/15 * * * * /var/scripts/healthcheck.sh") | crontab -

# Step 16: Install dependencies and build the application
echo -e "\n${GREEN}Step 16: Installing dependencies and building the application...${NC}"
cd ${APP_DIR}
npm install
echo -e "${YELLOW}Building application (this may take a while)...${NC}"
npm run build

# Step 17: Run database migrations
echo -e "\n${GREEN}Step 17: Running database migrations...${NC}"
npm run db:push

# Step 18: Configure fail2ban
echo -e "\n${GREEN}Step 18: Configuring fail2ban...${NC}"
cat > /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 5
bantime = 3600
EOF
systemctl restart fail2ban

# Step 19: Set up SSL with Let's Encrypt
echo -e "\n${GREEN}Step 19: Setting up SSL with Let's Encrypt...${NC}"
echo -e "${YELLOW}NOTE: Make sure your DNS is configured to point ${DOMAIN} to ${SERVER_IP} before proceeding${NC}"
read -p "Has DNS propagation completed? (If unsure, type 'n') (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}
    
    # Restart services
    systemctl restart nginx
    echo -e "${GREEN}SSL certificate installed successfully!${NC}"
else
    echo -e "${YELLOW}Skipping SSL setup for now.${NC}"
    echo -e "${YELLOW}You can run the following command later:${NC}"
    echo -e "${YELLOW}certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${NC}"
fi

# Step 20: Start the application with PM2
echo -e "\n${GREEN}Step 20: Starting the application with PM2...${NC}"
cd ${APP_DIR}
pm2 start production-server.js --name go4it-sports --node-args="--max-old-space-size=4096"
pm2 save

# Step 21: Optimize Nginx configuration for high traffic
echo -e "\n${GREEN}Step 21: Optimizing Nginx for high traffic...${NC}"
cat > /etc/nginx/conf.d/optimization.conf << EOF
# Optimization settings for high traffic
worker_rlimit_nofile 30000;

events {
    worker_connections 10000;
    multi_accept on;
}

http {
    # File caching settings
    open_file_cache max=5000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
    
    # Gzip compression
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.geo+json
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/bmp
        image/svg+xml
        image/x-icon
        text/cache-manifest
        text/css
        text/plain
        text/vcard
        text/vnd.rim.location.xloc
        text/vtt
        text/x-component
        text/x-cross-domain-policy;
}
EOF

# Reload Nginx with new configuration
systemctl reload nginx

# Final step: Display summary
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Go4It Sports Deployment Completed!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo
echo -e "${YELLOW}Server IP:${NC} ${SERVER_IP}"
echo -e "${YELLOW}Domain:${NC} ${DOMAIN}"
echo
echo -e "${YELLOW}Database Information:${NC}"
echo -e "  Database Name: ${DB_NAME}"
echo -e "  Database User: ${DB_USER}"
echo -e "  Database Password: ${DB_PASS}"
echo
echo -e "${YELLOW}Application URL:${NC}"
echo -e "  - Main domain: https://${DOMAIN} (when DNS propagation completes)"
echo -e "  - Direct access: http://${SERVER_IP}:81"
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Update the API keys in ${APP_DIR}/.env:"
echo -e "   - OPENAI_API_KEY=your_key_here"
echo -e "   - ANTHROPIC_API_KEY=your_key_here"
echo -e "2. Ensure DNS is properly configured (see DNS_SETUP_GUIDE.md)"
echo -e "3. If you skipped SSL setup, run: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo
echo -e "${YELLOW}Important Commands:${NC}"
echo -e "- Restart application: pm2 restart go4it-sports"
echo -e "- View logs: pm2 logs go4it-sports"
echo -e "- Monitor application: pm2 monit"
echo -e "- Start/stop application: pm2 start/stop go4it-sports"
echo -e "- View server stats: htop"
echo
echo -e "${GREEN}Enjoy your Go4It Sports platform!${NC}"