# Go4It Sports Platform Deployment Guide

This document provides instructions for deploying the Go4It Sports platform to a production environment.

## Production Server Requirements

- Server IP: 5.16.1.9
- Port: 81
- Node.js version: 18 or higher
- PostgreSQL database
- Sufficient disk space for uploads and logs (recommended: 10GB+)

## Deployment Steps

### 1. Prepare the Server

First, ensure your server has the necessary components installed:

```bash
# Update package listings
sudo apt-get update

# Install Node.js 18 and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install additional dependencies
sudo apt-get install -y git build-essential
```

### 2. Setup PostgreSQL Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create a database and user (in the PostgreSQL prompt)
CREATE DATABASE go4it_sports;
CREATE USER go4it_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE go4it_sports TO go4it_admin;
\q

# Test connection
psql -U go4it_admin -h localhost -d go4it_sports
```

### 3. Clone the Repository

```bash
# Create directory for the application
mkdir -p /var/www/go4it
cd /var/www/go4it

# Clone the repository or upload files
git clone your-repository-url .

# Or unzip your deployment package
# unzip go4it-sports.zip
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cat > .env << EOF
# Database connection
DATABASE_URL=postgresql://go4it_admin:your_secure_password@localhost:5432/go4it_sports
PGHOST=localhost
PGUSER=go4it_admin
PGPASSWORD=your_secure_password
PGDATABASE=go4it_sports
PGPORT=5432

# Environment settings
NODE_ENV=production
PORT=81

# API Keys (replace with actual keys)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
EOF
```

### 5. Deploy Using the Deployment Script

```bash
# Make the deployment script executable
chmod +x deploy-production.sh

# Run the deployment script
./deploy-production.sh
```

### 6. Setup Firewall Rules

Ensure port 81 is open in your firewall:

```bash
# Open port 81 for HTTP traffic
sudo ufw allow 81/tcp

# Verify firewall status
sudo ufw status
```

### 7. Setup as a System Service (Optional)

For automatic restarts and better service management:

```bash
# Create a systemd service file
sudo cat > /etc/systemd/system/go4it.service << EOF
[Unit]
Description=Go4It Sports Platform
After=network.target postgresql.service

[Service]
Environment=NODE_ENV=production
Environment=PORT=81
WorkingDirectory=/var/www/go4it
ExecStart=/usr/bin/node server/index.js
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl enable go4it
sudo systemctl start go4it

# Check status
sudo systemctl status go4it
```

### 8. Monitoring the Application

```bash
# View logs
tail -f logs/server.log

# Monitor the process
ps aux | grep node

# Check if the service is running on port 81
sudo lsof -i :81
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Test the connection manually: `psql -U go4it_admin -h localhost -d go4it_sports`
3. Check your DATABASE_URL in the .env file

### Application Not Starting

1. Check the logs: `tail -f logs/server.log`
2. Ensure Node.js is installed correctly: `node --version`
3. Verify environment variables are set properly
4. Make sure port 81 is not being used by another service: `sudo lsof -i :81`

### Performance Optimizations

The application includes several performance optimizations:

1. **Database Connection Pooling**: Configured with 20 connections and 30-second timeouts
2. **Data Caching**: Content blocks, blog posts, and featured athletes are cached
3. **Image Optimization**: Using lazy loading and blur placeholders
4. **Server Configuration**: Production mode settings for better performance

## Backup and Maintenance

### Regular Backups

```bash
# Backup the PostgreSQL database
pg_dump -U go4it_admin go4it_sports > backup_$(date +%Y%m%d).sql

# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Updates and Maintenance

1. Pull latest changes: `git pull origin main`
2. Run the deployment script: `./deploy-production.sh`
3. Monitor logs after updates: `tail -f logs/server.log`

## Support

For further assistance, please contact the development team.