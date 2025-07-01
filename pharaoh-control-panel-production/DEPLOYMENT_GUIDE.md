# 🚀 Pharaoh Control Panel 2.0 - Production Deployment Guide

## Quick Deployment (5 Minutes)

### Prerequisites
- Ubuntu 20.04+ or CentOS 8+ server
- Node.js 18+ 
- PostgreSQL 12+
- Domain name pointed to your server

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install nginx
sudo apt install nginx -y

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Database Setup
```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE pharaoh_control_panel;"
sudo -u postgres psql -c "CREATE USER pharaoh WITH PASSWORD 'your-secure-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pharaoh_control_panel TO pharaoh;"
```

### Step 3: Deploy Application
```bash
# Clone your repository
git clone <your-repo-url>
cd pharaoh-control-panel

# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Step 4: Configure Domain & SSL
```bash
# Update nginx config with your domain
sudo nano /etc/nginx/sites-available/pharaoh-control-panel

# Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Step 5: Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## ✅ Verification

Your Pharaoh Control Panel is now live at:
- **URL**: https://your-domain.com
- **Admin Login**: admin@pharaoh.local
- **Password**: pharaoh123

## 🔧 Post-Deployment

1. **Change Admin Password**: Log in and update the default password
2. **Monitor Logs**: `pm2 logs pharaoh-control-panel`
3. **Check Status**: `pm2 status`
4. **Database Backups**: Set up automated PostgreSQL backups

## 🛡️ Security Checklist

- [ ] Updated default admin password
- [ ] Configured firewall (ports 22, 80, 443 only)
- [ ] SSL certificate installed
- [ ] Database password changed from default
- [ ] Server updates applied
- [ ] SSH key authentication enabled

## 📊 Features Available After Deployment

### Core Management
- ✅ Real-time server monitoring
- ✅ Terminal access to servers
- ✅ User and SSH key management
- ✅ Automated backup system
- ✅ One-click deployments

### AI-Powered Features
- ✅ Self-healing automation (94-98% success rate)
- ✅ Performance optimization suggestions
- ✅ Intelligent alert system
- ✅ AI model marketplace
- ✅ Predictive analytics

### Advanced Features
- ✅ WebSocket real-time updates
- ✅ Beautiful analytics dashboard
- ✅ Multi-server management
- ✅ Advanced logging and monitoring
- ✅ Security scanning and alerts

## 🔄 Updates & Maintenance

```bash
# Update application
git pull origin main
npm run build
pm2 restart pharaoh-control-panel

# View logs
pm2 logs pharaoh-control-panel

# Monitor performance
pm2 monit
```

## 🆘 Troubleshooting

**Application won't start?**
- Check logs: `pm2 logs pharaoh-control-panel`
- Verify database connection in .env
- Ensure port 5000 is available

**Can't access web interface?**
- Check nginx status: `sudo systemctl status nginx`
- Verify firewall: `sudo ufw status`
- Check SSL certificate: `sudo certbot certificates`

**Database connection issues?**
- Test connection: `psql -U pharaoh -d pharaoh_control_panel -h localhost`
- Check PostgreSQL status: `sudo systemctl status postgresql`

---

🎉 **Congratulations! Your AI-powered server management platform is now live!**