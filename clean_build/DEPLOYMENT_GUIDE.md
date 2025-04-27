# Go4It Sports Platform Deployment Guide
## For Hetzner VPS (5.16.1.9, Port 81)

This guide provides step-by-step instructions for deploying the Go4It Sports platform on a Hetzner VPS.

## Prerequisites

- Hetzner VPS with SSH access
- Ubuntu 20.04 LTS or newer
- Root access or sudo privileges
- Domain name (optional but recommended)

## 1. Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl wget vim build-essential nginx ufw

# Set up firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 81
sudo ufw allow 443
sudo ufw enable

# Set timezone
sudo timedatectl set-timezone UTC
```

## 2. Install Node.js and npm

```bash
# Install Node.js 18.x and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v18.x.x
npm -v   # Should show 8.x.x or higher
```

## 3. Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL and enable on boot
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE go4it;"
sudo -u postgres psql -c "CREATE USER go4ituser WITH ENCRYPTED PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it TO go4ituser;"
```

## 4. Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Set up PM2 to start on boot
pm2 startup
```

## 5. Deploy the Application

### Clone or Upload the Application

```bash
# Create app directory
mkdir -p /var/www/go4it

# Extract the zip file to the app directory
unzip go4it-clean-build.zip -d /var/www/go4it

# Navigate to app directory
cd /var/www/go4it

# Set up environment variables
cp .env.template .env
```

### Edit .env File

Edit the `.env` file with your production settings:

```
DATABASE_URL=postgresql://go4ituser:your_secure_password@localhost:5432/go4it
PORT=81
NODE_ENV=production
SERVER_HOST=5.16.1.9
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
SESSION_SECRET=generate_a_random_string_here
```

### Install Dependencies and Build the Application

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Run database migrations
npm run db:push
```

## 6. Configure Nginx as Reverse Proxy (Optional but Recommended)

Create nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/go4it
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name 5.16.1.9;  # Replace with your domain if you have one

    location / {
        proxy_pass http://5.16.1.9:81;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/go4it /etc/nginx/sites-enabled/
sudo nginx -t  # Test the configuration
sudo systemctl reload nginx
```

## 7. Start the Application with PM2

```bash
# Navigate to app directory
cd /var/www/go4it

# Start the application with PM2
pm2 start production-server.js --name go4it-sports

# Save the PM2 process list
pm2 save

# Check the application status
pm2 status
```

## 8. Set Up SSL with Certbot (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Set up SSL (if you have a domain)
sudo certbot --nginx -d yourdomain.com
```

## 9. Monitor Application Logs

```bash
# View logs in real-time
pm2 logs go4it-sports

# View previous logs
pm2 logs go4it-sports --lines 200
```

## 10. Additional Configuration

### Scheduled Database Backups

Create a backup script:

```bash
sudo nano /usr/local/bin/backup-go4it-db.sh
```

Add this content:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/go4it"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump go4it > $BACKUP_DIR/go4it-$TIMESTAMP.sql
find $BACKUP_DIR -type f -mtime +7 -name "*.sql" -delete
```

Make it executable and set up cron job:

```bash
sudo chmod +x /usr/local/bin/backup-go4it-db.sh
sudo crontab -e
```

Add this line to run daily backups at 3 AM:

```
0 3 * * * /usr/local/bin/backup-go4it-db.sh
```

### Memory Optimization

For better performance, add this to your PM2 startup:

```bash
pm2 start production-server.js --name go4it-sports --node-args="--max-old-space-size=2048"
```

## 11. Restart Server After Updates

When you update the application:

```bash
cd /var/www/go4it
git pull  # If using git, otherwise upload new files
npm install
npm run build
pm2 restart go4it-sports
```

## 12. Troubleshooting

If the application doesn't start properly:

1. Check logs: `pm2 logs go4it-sports`
2. Verify database connection: `psql -h localhost -U go4ituser -d go4it`
3. Check environment variables: `cat .env`
4. Ensure the correct port is open: `sudo ufw status`
5. Check Node.js version: `node -v`

## Security Recommendations

1. Set up fail2ban for SSH brute force protection
2. Regularly update your server with `sudo apt update && sudo apt upgrade`
3. Use strong passwords for database and user accounts
4. Enable regular backups
5. Consider setting up a firewall with more restrictive rules

## Contact Support

For additional assistance, please contact support at support@go4itsports.org.