# Go4It Sports Platform - Deployment Guide

This document provides instructions for deploying the Go4It Sports Platform to your own server. The platform uses a modern JavaScript stack with React.js frontend and Node.js backend.

## System Requirements

- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- 4GB RAM minimum (8GB+ recommended)
- 20GB storage minimum
- Linux-based OS (Ubuntu 20.04+ recommended)

## Pre-Deployment Checklist

Before deploying, ensure you have:

1. A configured PostgreSQL database with credentials
2. Domain name (optional, but recommended)
3. SSL certificate (optional, but recommended for production)
4. Required API keys:
   - OpenAI API key (for AI coaching)
   - Anthropic API key (for AI coaching fallback/alternative)
   - Twilio API keys (for SMS notifications, optional)
   - SendGrid API key (for transactional emails, optional)

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/go4it-sports.git
cd go4it-sports
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/go4it
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=go4it

# Server
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_session_secret

# API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
SENDGRID_API_KEY=your_sendgrid_key

# File Storage
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=50000000
```

Replace the placeholder values with your actual configuration.

### 4. Set Up the Database

The application uses Drizzle ORM for database management. To set up the database schema:

```bash
npm run db:push
```

### 5. Build the Application

```bash
npm run build
```

This command will:
- Build the React frontend
- Compile TypeScript files
- Optimize assets

### 6. Start the Application

For a simple deployment:

```bash
npm start
```

For a production deployment with process management:

```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the application with PM2
pm2 start npm --name "go4it-sports" -- start

# Save the PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

### 7. Configure Reverse Proxy (Optional but Recommended)

For production deployments, we recommend using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # For WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 8. SSL Configuration (Optional but Recommended)

For production, use Let's Encrypt to enable HTTPS:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain and install certificate
sudo certbot --nginx -d yourdomain.com
```

## Deployment Alternatives

### Docker Deployment

The application can also be deployed using Docker:

1. Build the Docker image:

```bash
docker build -t go4it-sports .
```

2. Run the container:

```bash
docker run -d \
  --name go4it-sports \
  -p 3000:3000 \
  --env-file .env \
  go4it-sports
```

### Cloud Deployment Options

The application is compatible with:

- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- DigitalOcean App Platform
- Heroku

Configure these services according to their specific documentation.

## Updating the Application

To update an existing deployment:

1. Pull the latest changes:

```bash
git pull
```

2. Install any new dependencies:

```bash
npm install
```

3. Apply database migrations:

```bash
npm run db:push
```

4. Rebuild the application:

```bash
npm run build
```

5. Restart the application:

```bash
# If running directly with Node.js
npm restart

# If using PM2
pm2 restart go4it-sports
```

## Troubleshooting

### Database Connectivity Issues

- Verify that PostgreSQL is running: `sudo systemctl status postgresql`
- Check database connection: `psql -U username -d go4it -c "\conninfo"`
- Verify environment variables are correctly set

### Server Not Starting

- Check logs: `pm2 logs go4it-sports`
- Verify Node.js version: `node --version`
- Ensure all dependencies are installed: `npm install`
- Check file permissions: `ls -la`

### Frontend Not Loading

- Verify the build was successful: `ls -la client/dist`
- Check for console errors in the browser
- Verify that static files are being served correctly

## Backup and Maintenance

### Database Backup

Set up regular PostgreSQL backups:

```bash
# Create a backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U username go4it > "$BACKUP_DIR/go4it_$TIMESTAMP.sql"
EOF

# Make it executable
chmod +x backup.sh

# Add to crontab to run daily at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup.sh") | crontab -
```

### Log Rotation

Configure log rotation for application logs:

```bash
# If using PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Support and Resources

If you encounter issues during deployment, please:

1. Check our FAQ section at [https://go4itsports.com/faq](https://go4itsports.com/faq)
2. Refer to the GitHub repository issues page
3. Contact support at support@go4itsports.com

## License

Please ensure your deployment complies with the Go4It Sports Platform license agreement.