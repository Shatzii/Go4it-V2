# Go4It Sports Platform Deployment Instructions

This document provides step-by-step instructions for deploying the Go4It Sports platform with HTTPS support.

## Deployment Scripts

We've created several scripts to automate the deployment process:

1. **`go4it-ssl-setup.sh`**: Configures NGINX with SSL for HTTPS access
2. **`deploy-ssl-to-server.sh`**: Transfers the SSL configuration to your server and applies it
3. **`check-go4it-servers.sh`**: Checks the health of your server and services

## Deployment Steps

### Step 1: Check Server Health

First, check the current status of your server:

```bash
./check-go4it-servers.sh
```

This will show you the status of all services, SSL certificates, and more.

### Step 2: Deploy SSL Configuration

To configure SSL and NGINX for HTTPS:

```bash
./deploy-ssl-to-server.sh
```

This script will:
- Transfer the SSL setup script to your server
- Execute it with necessary permissions
- Configure NGINX with your SSL certificates
- Restart services as needed

### Step 3: Verify Deployment

After deployment, verify that everything is working:

1. Check that your site is accessible at https://go4itsports.org
2. Verify that the Coach Portal API is accessible at https://go4itsports.org/api/coach-portal/
3. Run the health check script again to verify all services:

```bash
./check-go4it-servers.sh
```

## Troubleshooting

If you encounter issues during deployment:

### SSL Certificate Issues

If you face issues with SSL certificates:

```bash
# On your server
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/go4itsports.key -out /etc/nginx/ssl/go4itsports.crt -subj "/CN=go4itsports.org"
sudo systemctl restart nginx
```

### NGINX Configuration Issues

If NGINX fails to start:

```bash
# On your server
sudo nginx -t               # Test the configuration
sudo systemctl status nginx # Check the status
sudo tail -f /var/log/nginx/error.log # View the error logs
```

### Application Service Issues

If the application services aren't running:

```bash
# On your server
cd /var/www/go4itsports
pm2 list                    # Check PM2 processes
pm2 logs                    # View application logs
pm2 restart all             # Restart all processes
```

## Server Requirements

The Go4It Sports platform requires:

- Ubuntu 20.04 LTS or newer
- Node.js 14+ with NPM
- PostgreSQL 12+
- NGINX 1.18+
- PM2 (for process management)

## Security Considerations

- The deployment uses self-signed SSL certificates, which are sufficient for testing but will show security warnings in browsers
- For production, consider upgrading to Let's Encrypt certificates
- The platform is configured with secure headers and HTTPS redirection

## Next Steps

After successful deployment:

1. Set up scheduled backups for your database
2. Configure monitoring for the application
3. Consider setting up a CDN for better performance
4. Implement regular security updates

---

For any questions or support, please contact the Go4It Sports development team.