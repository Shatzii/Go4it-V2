# Go4It Sports Production Deployment Checklist

This document outlines the essential files needed for deploying the Go4It Sports platform on your Hetzner server (188.245.209.124) with the domain go4itsports.org.

## Essential Files and Directories

### Server-Side
- `server/*.ts` - All server TypeScript files
- `server/middleware/` - Express middleware
- `server/routes/` - API routes
- `server/services/` - Business logic services
- `server/utils/` - Utility functions
- `server/types/` - TypeScript type definitions

### Client-Side
- `client/dist/` - Built frontend files (create with `npm run build`)
- `client/src/` - Source frontend files
- `client/public/` - Static assets

### Shared Code
- `shared/` - Shared types and utilities between client and server

### Configuration Files
- `package.json` - Dependencies and scripts
- `package-lock.json` - Dependency tree
- `tsconfig.json` - TypeScript configuration
- `drizzle.config.ts` - Database ORM configuration
- `.env.production` - Template for environment variables

## Deployment Script

Create a `deploy.sh` script that will:

1. Update and install system dependencies
2. Set up Node.js 20.x
3. Set up PostgreSQL and create the database
4. Copy application files
5. Set up environment variables
6. Install npm dependencies
7. Build the client
8. Configure PM2 for process management
9. Configure Nginx as a reverse proxy
10. Set up SSL with Let's Encrypt
11. Configure firewall rules
12. Set up database backups
13. Create an API key locker

## Environment Variables

Create a `.env` file on the server with:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://[DATABASE_USER]:[DATABASE_PASSWORD]@localhost:5432/go4it_production
OPENAI_API_KEY=[Your OpenAI API Key]
ANTHROPIC_API_KEY=[Your Anthropic API Key]
```

## Nginx Configuration

Create an Nginx configuration at `/etc/nginx/sites-available/go4itsports` with:

```nginx
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## SSL Configuration

Use Let's Encrypt with:

```bash
certbot --nginx -d go4itsports.org -d www.go4itsports.org --non-interactive --agree-tos --email a.barrett@go4itsports.org
```

## Database Backup

Set up a daily backup script at `/usr/local/bin/backup-go4it.sh` that runs via cron.

## Recommended Deployment Method

1. **Create a full deployment package locally**:
   ```bash
   npm run build
   tar -czf go4it-deploy.tar.gz .
   ```

2. **Transfer to server**:
   ```bash
   scp go4it-deploy.tar.gz root@188.245.209.124:/root/
   ```

3. **SSH to server and extract**:
   ```bash
   ssh root@188.245.209.124
   mkdir -p /var/www/go4itsports
   tar -xzf go4it-deploy.tar.gz -C /var/www/go4itsports
   cd /var/www/go4itsports
   ```

4. **Create environment file and deploy**:
   ```bash
   # Create .env file with your credentials
   # Run your deployment script or follow the steps manually
   ```