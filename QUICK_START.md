# Go4It Sports Quick Start Guide

This guide provides a quick overview of how to deploy Go4It Sports to your new server with IP 188.245.209.124.

## 1. Upload Deployment Package

First, upload the deployment package to your server:

```bash
scp go4it-deployment-updated.zip root@188.245.209.124:/root/
```

## 2. SSH into Your Server

```bash
ssh root@188.245.209.124
```

## 3. Automated Installation (Recommended)

For a fully automated installation:

```bash
cd /root
unzip go4it-deployment-updated.zip
chmod +x deploy.sh
./deploy.sh
```

The script will guide you through the entire installation process, prompting for necessary information along the way.

## 4. Manual Installation (Alternative)

If you prefer to install manually:

1. Follow the detailed steps in `DEPLOYMENT_GUIDE.md`
2. Refer to `DNS_SETUP_GUIDE.md` for DNS configuration details

## 5. Verify Installation

After deployment:

1. Access your application via the direct IP: http://188.245.209.124:81
2. Once DNS propagation completes: https://go4itsports.org

## 6. Update API Keys

Edit the environment variables file to add your API keys:

```bash
nano /var/www/go4it/.env
```

Update these values:
```
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

Then restart the application:

```bash
pm2 restart go4it-sports
```

## 7. Important Commands

```bash
# View logs
pm2 logs go4it-sports

# Monitor application
pm2 monit

# Check application status
pm2 status

# Restart application
pm2 restart go4it-sports

# Check system resources
htop

# View nginx logs
tail -f /var/log/nginx/go4it-*.log
```

## 8. DNS Configuration

For complete DNS setup instructions, see the included `DNS_SETUP_GUIDE.md` file.

## 9. Support

If you encounter any issues during installation, please check:
- Application logs: `pm2 logs go4it-sports`
- Nginx logs: `/var/log/nginx/go4it-error.log`
- System logs: `journalctl -xe`

## Backup Information

Automated daily backups are configured to run at 3 AM and store 7 days of history in:
- `/var/backups/go4it/`

To manually create a backup anytime:
```bash
/var/scripts/backup-db.sh
```