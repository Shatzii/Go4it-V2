#!/bin/bash

# Go4It Sports Installation Script for Hetzner VPS
# Server IP: 5.16.1.9, Port: 81

# Exit on error
set -e

echo "Go4It Sports Platform Installation"
echo "=================================="
echo ""

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# Configuration Variables
APP_DIR="/var/www/go4it"
DB_NAME="go4it"
DB_USER="go4ituser"
DB_PASS="$(openssl rand -base64 12)"  # Generate secure random password
SESSION_SECRET="$(openssl rand -base64 32)"  # Generate secure session secret

echo "Installing system dependencies..."
apt update
apt install -y git curl wget vim build-essential nginx ufw postgresql postgresql-contrib

echo "Setting up firewall..."
ufw allow 22
ufw allow 80
ufw allow 81
ufw allow 443
echo "y" | ufw enable

echo "Do you want to set up SSL with Let's Encrypt for go4itsports.org? (y/n)"
read setup_ssl

if [ "$setup_ssl" = "y" ]; then
  echo "Installing Certbot for SSL..."
  apt install -y certbot python3-certbot-nginx
  mkdir -p /var/www/letsencrypt
  
  echo "Obtaining SSL certificate for go4itsports.org..."
  certbot --nginx -d go4itsports.org -d www.go4itsports.org
  
  echo "Setting up auto-renewal of SSL certificates..."
  certbot renew --dry-run
  echo "0 0,12 * * * root python3 -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" > /etc/cron.d/certbot-renewal
fi

echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo "Setting up PostgreSQL database..."
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Installing PM2..."
npm install -g pm2
pm2 startup

echo "Setting up application directory..."
mkdir -p $APP_DIR
cp -r ./* $APP_DIR/
chown -R www-data:www-data $APP_DIR

echo "Configuring environment variables..."
cat > $APP_DIR/.env << EOF
# Go4It Sports Production Configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
PORT=81
NODE_ENV=production
SERVER_HOST=localhost
DOMAIN=go4itsports.org
BASE_URL=https://go4itsports.org
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
SESSION_SECRET=$SESSION_SECRET
MAX_FILE_UPLOAD_SIZE=524288000
EOF

echo "Installing application dependencies..."
cd $APP_DIR
npm install

echo "Building application..."
npm run build

echo "Running database migrations..."
npm run db:push

echo "Setting up Nginx..."
cp nginx-go4it.conf /etc/nginx/sites-available/go4it
ln -sf /etc/nginx/sites-available/go4it /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo "Starting application with PM2..."
pm2 start production-server.js --name go4it-sports
pm2 save

echo "Setting up systemd service (alternative to PM2)..."
cp go4it.service /etc/systemd/system/
systemctl daemon-reload
# Not enabling by default since we're using PM2
# systemctl enable go4it.service

echo "Creating backup directory..."
mkdir -p $APP_DIR/backups
chown www-data:www-data $APP_DIR/backups

echo ""
echo "Installation Complete!"
echo "======================="
echo ""
echo "Database Information:"
echo "  Database Name: $DB_NAME"
echo "  Database User: $DB_USER"
echo "  Database Password: $DB_PASS"
echo ""
echo "Application URLs:"
echo "  - Main domain: https://go4itsports.org"
echo "  - Direct access: http://188.245.209.124:81"
echo ""
echo "Next Steps:"
echo "1. Update the OPENAI_API_KEY and ANTHROPIC_API_KEY in $APP_DIR/.env"
echo "2. Check application status with: pm2 status"
echo "3. View logs with: pm2 logs go4it-sports"
echo "4. Set up domain DNS to point to 188.245.209.124 (if not already done)"
echo ""
echo "To manage the application:"
echo "- Restart: pm2 restart go4it-sports"
echo "- Stop: pm2 stop go4it-sports"
echo "- View logs: pm2 logs go4it-sports"
echo ""
echo "Configuration files:"
echo "- Nginx: /etc/nginx/sites-available/go4it"
echo "- Environment: $APP_DIR/.env"
echo "- Systemd service: /etc/systemd/system/go4it.service"