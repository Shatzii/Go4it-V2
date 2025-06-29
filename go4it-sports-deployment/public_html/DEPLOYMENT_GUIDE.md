# Go4It Sports Platform - Deployment Guide

This guide will help you deploy the Go4It Sports platform with the StarPath™ feature to go4itsports.org.

## Overview

The Go4It Sports platform includes:
- Mobile-first authentication system with black/blue theme
- StarPath™ PlayStation 5-quality interactive experience for athlete development
- Video analysis with GAR (Growth and Ability Rating) scoring
- Academic tracking for NCAA eligibility
- Sentinel cybersecurity integration
- Supabase database integration

## Prerequisites

Before deploying, make sure you have:
- A Hetzner server with at least:
  - 4 vCPU
  - 16GB RAM
  - 160GB SSD
- Domain name (go4itsports.org) with DNS configured to point to your server
- SSH access to your server
- Supabase database credentials
- Sentinel security API key (if using Sentinel)

## Step 1: Server Preparation

Connect to your Hetzner server via SSH:

```bash
ssh deploy@go4itsports.org
```

Update the server and install dependencies:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx
```

Install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:

```bash
node -v  # Should show v18.x.x
npm -v   # Should show 8.x.x or higher
```

## Step 2: Deploy the Go4It Sports Platform

Create a deployment directory:

```bash
mkdir -p /var/www/go4itsports
```

Extract the deployment package (created using the deploy.sh script):

```bash
unzip go4it_deployment_*.zip -d /var/www/go4itsports
cd /var/www/go4itsports
```

Install dependencies:

```bash
npm install --production
```

## Step 3: Environment Configuration

Create an environment file:

```bash
touch .env
```

Edit the .env file with the following values:

```
PORT=5000
NODE_ENV=production
DATABASE_URL=your_supabase_database_url
SENTINEL_API_KEY=your_sentinel_api_key
JWT_SECRET=your_secure_jwt_secret
```

## Step 4: Configure Nginx

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/go4itsports
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Setup SSL with Let's Encrypt

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain SSL certificate:

```bash
sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org
```

Follow the prompts to complete the SSL setup.

## Step 6: Run the Application

Set up the application as a service:

```bash
sudo nano /etc/systemd/system/go4itsports.service
```

Add the following configuration:

```
[Unit]
Description=Go4It Sports Platform
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/go4itsports
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable go4itsports
sudo systemctl start go4itsports
```

Check the status:

```bash
sudo systemctl status go4itsports
```

## Monitoring & Maintenance

Check the application logs:

```bash
sudo journalctl -u go4itsports -f
```

## StarPath™ Feature Configuration

The StarPath™ feature is already integrated with the PlayStation 5-quality interactive experience. To customize it for your specific sports and athlete progression paths:

1. Access the StarPath configuration through the admin portal
2. Create skill trees and achievements for your sport
3. Set up progression paths for different age groups
4. Define rewards and unlockable content

## Video Analysis with GAR Scoring

The GAR scoring system is pre-configured to analyze videos for:
- Physical attributes
- Technical skills
- Tactical awareness
- Mental aspects

You can customize the scoring weights and thresholds in the admin settings.

## Troubleshooting

If you encounter any issues:

1. Check the application logs: `sudo journalctl -u go4itsports -f`
2. Verify the Nginx configuration: `sudo nginx -t`
3. Check the Supabase database connection: `curl -I http://localhost:5000/api/health`

## Contact Support

For additional assistance, contact support@go4itsports.org