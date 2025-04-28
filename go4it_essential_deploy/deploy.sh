#!/bin/bash

# Go4It Sports Deployment Script
# For deploying to Hetzner server (188.245.209.124)
# Domain: go4itsports.org

# Exit on any error
set -e

echo "=== Go4It Sports Deployment Script ==="
echo "Starting deployment process..."

# 1. Update system packages
echo "Updating system packages..."
apt update && apt upgrade -y

# 2. Install required dependencies
echo "Installing system dependencies..."
apt install -y git curl wget build-essential nginx certbot python3-certbot-nginx

# 3. Install Node.js
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

# 4. Install PostgreSQL
echo "Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# 5. Create PostgreSQL database and user
echo "Setting up database..."
DB_USER=${DATABASE_USER:-go4it_user}
DB_PASSWORD=${DATABASE_PASSWORD:-$(openssl rand -base64 16)}

echo "Using database credentials:"
echo "Username: $DB_USER"
echo "Password: $DB_PASSWORD (save this securely!)"

sudo -i -u postgres psql -c "CREATE DATABASE go4it_production;"
sudo -i -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it_production TO $DB_USER;"
sudo -i -u postgres psql -c "ALTER USER $DB_USER WITH SUPERUSER;"

# 6. Application setup
echo "Setting up application files..."
mkdir -p /var/www/go4itsports
# If this script is run from the deployment package directory
cp -r . /var/www/go4itsports/ || echo "Error copying files, please manually copy files to /var/www/go4itsports/"
cd /var/www/go4itsports

# 7. Environment configuration
echo "Creating environment file..."
OPENAI_KEY=${OPENAI_API_KEY:-"your_openai_api_key_here"}
ANTHROPIC_KEY=${ANTHROPIC_API_KEY:-"your_anthropic_api_key_here"}

cat > .env << EOL
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/go4it_production
OPENAI_API_KEY=$OPENAI_KEY
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
EOL

# 8. Install dependencies and build
echo "Installing dependencies..."
npm ci --production

# 9. PM2 Configuration
echo "Configuring PM2..."
cat > ecosystem.config.js << EOL
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
EOL

# 10. Start application with PM2
echo "Starting application..."
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# 11. Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/go4itsports << EOL
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

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
EOL

ln -s /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 12. Set up SSL with Let's Encrypt
echo "Setting up SSL..."
certbot --nginx -d go4itsports.org -d www.go4itsports.org --non-interactive --agree-tos --email a.barrett@go4itsports.org

# 13. Configure firewall
echo "Configuring firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# 14. Set up database backups
echo "Setting up database backups..."
mkdir -p /var/backups/go4itsports
cat > /usr/local/bin/backup-go4it.sh << EOL
#!/bin/bash
DATE=\$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/var/backups/go4itsports"
PGPASSWORD="$DB_PASSWORD" pg_dump -U $DB_USER -h localhost go4it_production > \$BACKUP_DIR/go4it_\$DATE.sql
find \$BACKUP_DIR -type f -name "go4it_*.sql" -mtime +7 -delete
EOL

chmod +x /usr/local/bin/backup-go4it.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-go4it.sh") | crontab -

# 15. Create API key locker
echo "Creating API key locker..."
mkdir -p /var/www/go4itsports/api_locker
chmod 700 /var/www/go4itsports/api_locker

cat > /var/www/go4itsports/api_locker/api_keys.json << EOL
{
  "openai": "$OPENAI_KEY",
  "anthropic": "$ANTHROPIC_KEY",
  "database": {
    "user": "$DB_USER",
    "password": "$DB_PASSWORD"
  }
}
EOL

chmod 600 /var/www/go4itsports/api_locker/api_keys.json

echo "===================================="
echo "Deployment complete!"
echo "Visit https://go4itsports.org to verify."
echo "Database credentials are saved in /var/www/go4itsports/api_locker/api_keys.json"
echo "===================================="