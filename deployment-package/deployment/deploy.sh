#!/bin/bash
# Go4It Sports Server Deployment Script
# For server: 188.245.209.124

# Exit on error
set -e

# Log function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   log "This script must be run as root" 
   exit 1
fi

# Variables
APP_DIR="/var/www/go4itsports"
ENGINE_DIR="/var/www/go4it-engine"
BACKUP_DIR="/var/backups/go4itsports"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
APP_USER="go4it"
APP_GROUP="go4it"
DOMAIN="go4itsports.org"

# Create necessary directories
log "Creating directories..."
mkdir -p $APP_DIR
mkdir -p $ENGINE_DIR
mkdir -p $BACKUP_DIR
mkdir -p $APP_DIR/uploads
mkdir -p $APP_DIR/logs

# Create user if not exists
if ! id "$APP_USER" &>/dev/null; then
  log "Creating user $APP_USER..."
  useradd -m -s /bin/bash $APP_USER
fi

# Install required packages
log "Installing required packages..."
apt-get update
apt-get install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx nodejs npm

# Backup existing application if it exists
if [ -d "$APP_DIR/server" ]; then
  log "Backing up existing application..."
  tar -czf $BACKUP_DIR/go4itsports-$TIMESTAMP.tar.gz -C $APP_DIR .
fi

# Deploy new application files
log "Deploying new application files..."
cp -r . $APP_DIR

# Set proper permissions
log "Setting permissions..."
chown -R $APP_USER:$APP_GROUP $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/uploads

# Setup Nginx
log "Setting up Nginx..."
cp $APP_DIR/nginx.conf /etc/nginx/nginx.conf

# Get SSL certificate if needed
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  log "Obtaining SSL certificate..."
  certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# Install Node.js dependencies
log "Installing Node.js dependencies..."
cd $APP_DIR
sudo -u $APP_USER npm install
sudo -u $APP_USER npm run build

# Setup database if needed
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw go4itsports; then
  log "Setting up database..."
  sudo -u postgres createdb go4itsports
  sudo -u postgres psql -c "CREATE USER go4it WITH PASSWORD 'password';"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4itsports TO go4it;"
  
  # Run database migrations
  cd $APP_DIR
  sudo -u $APP_USER npm run db:push
fi

# Setup systemd services
log "Setting up systemd services..."
cp $APP_DIR/go4itsports.service /etc/systemd/system/
cp $APP_DIR/go4it-engine.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable go4itsports
systemctl enable go4it-engine

# Start/restart services
log "Starting services..."
systemctl restart nginx
systemctl restart go4itsports
systemctl restart go4it-engine

log "Deployment completed successfully!"
log "Your application is now running at https://$DOMAIN"
