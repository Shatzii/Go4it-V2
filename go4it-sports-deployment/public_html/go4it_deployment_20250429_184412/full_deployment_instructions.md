# Go4It Sports Full Deployment Instructions

This document provides complete instructions for deploying the Go4It Sports platform to your Hetzner server.

## Prerequisites

- Server: Hetzner VPS (188.245.209.124)
- Domain: go4itsports.org (configured to point to your server)
- SSH access to your server
- Root privileges

## Deployment Options

### Option 1: Full Automated Deployment

1. **Build the application locally**:
   ```bash
   npm run build
   ```

2. **Create a deployment package**:
   ```bash
   tar -czf go4it-full.tar.gz .
   ```

3. **Transfer to your server**:
   ```bash
   scp go4it-full.tar.gz root@188.245.209.124:/root/
   ```

4. **SSH to your server**:
   ```bash
   ssh root@188.245.209.124
   ```

5. **Extract and deploy**:
   ```bash
   mkdir -p /var/www/go4itsports
   tar -xzf go4it-full.tar.gz -C /var/www/go4itsports
   cd /var/www/go4itsports
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Option 2: Manual Deployment

If you prefer to deploy manually, follow these steps:

1. **Set up server environment**:
   - Update system: `apt update && apt upgrade -y`
   - Install dependencies: `apt install -y git curl wget build-essential nginx`
   - Install Node.js 20.x:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
     apt install -y nodejs
     npm install -g pm2
     ```
   - Install PostgreSQL:
     ```bash
     apt install -y postgresql postgresql-contrib
     systemctl start postgresql
     systemctl enable postgresql
     ```

2. **Set up database**:
   ```bash
   sudo -i -u postgres
   createdb go4it_production
   psql -c "CREATE USER go4it_user WITH PASSWORD 'your_strong_password';"
   psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it_production TO go4it_user;"
   psql -c "ALTER USER go4it_user WITH SUPERUSER;"
   exit
   ```

3. **Deploy application files**:
   - Transfer files to server
   - Create .env file with proper configuration
   - Install dependencies: `npm ci --production`
   - Set up PM2 configuration
   - Start with PM2: `pm2 start ecosystem.config.js`

4. **Configure Nginx and SSL**:
   - Set up Nginx configuration
   - Install certbot: `apt install -y certbot python3-certbot-nginx`
   - Obtain SSL certificate: `certbot --nginx -d go4itsports.org -d www.go4itsports.org`

5. **Configure firewall**:
   ```bash
   ufw allow ssh
   ufw allow http
   ufw allow https
   ufw --force enable
   ```

## Required Environment Variables

Create a `.env` file with:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://go4it_user:your_password@localhost:5432/go4it_production
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Verifying Deployment

After deployment:

1. Check application status: `pm2 status`
2. Check application logs: `pm2 logs go4it`
3. Visit https://go4itsports.org in your browser
4. Test login functionality
5. Test WebSocket features

## Maintenance

- Database backups: `pg_dump -U go4it_user -h localhost go4it_production > backup.sql`
- Restart application: `pm2 restart go4it`
- View logs: `pm2 logs go4it`
- Update SSL certificates: `certbot renew`