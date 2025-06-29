#!/bin/bash

# Go4It Sports One-Click Auto-Deployment Script
# Just upload the zip file and run this script

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration variables - EDIT THESE
DB_PASSWORD="your_strong_password"
OPENAI_API_KEY="your_openai_api_key"
ANTHROPIC_API_KEY="your_anthropic_api_key"
DOMAIN="go4itsports.org"
EMAIL="a.barrett@go4itsports.org"

echo -e "${GREEN}=== Go4It Sports One-Click Auto-Deployment Script ===${NC}"
echo -e "${YELLOW}This script will automatically deploy Go4It Sports with minimal effort.${NC}"
echo

# Step 1: Check if the zip file exists 
echo -e "${GREEN}Step 1: Checking for deployment package...${NC}"
if [ -f go4it_complete_package.zip ]; then
    echo "Found go4it_complete_package.zip"
else
    echo -e "${RED}Error: go4it_complete_package.zip not found${NC}"
    echo "Please upload the zip file to /var/www/go4itsports/ first"
    exit 1
fi

# Step 2: Extract the zip file
echo -e "\n${GREEN}Step 2: Extracting files...${NC}"
unzip -o go4it_complete_package.zip

# Step 3: Move files from the extracted directory to the current directory
echo -e "\n${GREEN}Step 3: Organizing files...${NC}"
cp -r go4it_complete_package/* .
cp -r go4it_complete_package/.* . 2>/dev/null || true  # Copy hidden files too

# Step 4: Verify file structure
echo -e "\n${GREEN}Step 4: Verifying file structure...${NC}"
./verify_deployment.sh

# Step 5: Install system dependencies
echo -e "\n${GREEN}Step 5: Installing system dependencies...${NC}"
apt update
apt install -y curl wget build-essential nginx certbot python3-certbot-nginx postgresql postgresql-contrib

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Step 6: Set up database
echo -e "\n${GREEN}Step 6: Setting up PostgreSQL database...${NC}"
systemctl start postgresql
systemctl enable postgresql

# Check if database already exists
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw go4it_production; then
    echo "Database go4it_production already exists."
else
    echo "Creating database and user..."
    sudo -u postgres psql -c "CREATE DATABASE go4it_production;"
    sudo -u postgres psql -c "CREATE USER go4it_user WITH PASSWORD '${DB_PASSWORD}';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it_production TO go4it_user;"
    sudo -u postgres psql -c "ALTER USER go4it_user WITH SUPERUSER;"
fi

# Step 7: Create .env file with actual values
echo -e "\n${GREEN}Step 7: Creating environment configuration...${NC}"
cat > .env << EOF
# Go4It Sports Production Environment
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_USER=go4it_user
DATABASE_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgresql://go4it_user:${DB_PASSWORD}@localhost:5432/go4it_production

# API Keys
OPENAI_API_KEY=${OPENAI_API_KEY}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
EOF

echo "Created .env file with provided configuration."

# Step 8: Create PM2 configuration
echo -e "\n${GREEN}Step 8: Creating PM2 configuration...${NC}"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: "go4it",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: "3000"
    },
    instances: "max",
    exec_mode: "cluster",
    max_memory_restart: "1G",
    log_date_format: "YYYY-MM-DD HH:mm:ss"
  }]
};
EOF

# Step 9: Configure Nginx
echo -e "\n${GREEN}Step 9: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/go4itsports << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Enable site 
ln -sf /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Step 10: Set up SSL (if domain is pointing to this server)
echo -e "\n${GREEN}Step 10: Setting up SSL certificate...${NC}"
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} || {
    echo -e "${YELLOW}Warning: SSL setup failed. Your domain may not be pointing to this server yet.${NC}"
    echo -e "${YELLOW}You can run this command later: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${NC}"
}

# Step 11: Configure firewall
echo -e "\n${GREEN}Step 11: Configuring firewall...${NC}"
ufw allow ssh
ufw allow http
ufw allow https
ufw status | grep -q "Status: active" || echo "y" | ufw enable

# Step 12: Set up database backups
echo -e "\n${GREEN}Step 12: Setting up database backups...${NC}"
mkdir -p /var/backups/go4itsports

# Create backup script
cat > /usr/local/bin/backup-go4it.sh << EOF
#!/bin/bash
DATE=\$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/var/backups/go4itsports"
PGPASSWORD="${DB_PASSWORD}" pg_dump -U go4it_user -h localhost go4it_production > \$BACKUP_DIR/go4it_\$DATE.sql
find \$BACKUP_DIR -type f -name "go4it_*.sql" -mtime +7 -delete
EOF

# Make the script executable
chmod +x /usr/local/bin/backup-go4it.sh

# Set up cron job
(crontab -l 2>/dev/null | grep -v "backup-go4it.sh"; echo "0 2 * * * /usr/local/bin/backup-go4it.sh") | crontab -

# Step 13: Install dependencies and build
echo -e "\n${GREEN}Step 13: Installing dependencies and building application...${NC}"
npm ci --production
npm run build

# Step 14: Start the application
echo -e "\n${GREEN}Step 14: Starting the application...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup | bash

# Step 15: Clean up
echo -e "\n${GREEN}Step 15: Cleaning up...${NC}"
rm -rf go4it_complete_package
echo "Deployment package folder removed."

echo -e "\n${GREEN}=== Deployment Complete! ===${NC}"
echo -e "${YELLOW}Your Go4It Sports application is now deployed at:${NC}"
echo "https://${DOMAIN}"
echo
echo -e "${YELLOW}Important commands:${NC}"
echo "- Check application status: pm2 status"
echo "- View logs: pm2 logs go4it"
echo "- Restart application: pm2 restart go4it"
echo
echo -e "${YELLOW}Deployment completed at:${NC} $(date)"