#!/bin/bash

# Go4It Sports Production Deployment Script
# Target Server: 5.188.99.81

set -e

echo "🚀 Starting Go4It Sports deployment to 5.188.99.81..."

# Configuration
SERVER_IP="5.188.99.81"
DEPLOY_DIR="/opt/go4it-sports"
DB_NAME="go4it_production"
DB_USER="go4it_user"
DB_PASS=$(openssl rand -hex 16)
JWT_SECRET=$(openssl rand -hex 32)

# Function to run commands on remote server
run_remote() {
    ssh root@$SERVER_IP "$1"
}

# Function to copy files to remote server
copy_to_server() {
    scp -r "$1" root@$SERVER_IP:"$2"
}

echo "📋 Step 1: Preparing server environment..."
run_remote "
    apt update && apt upgrade -y
    apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx nodejs npm postgresql-client git
    systemctl start docker postgresql nginx
    systemctl enable docker postgresql nginx
"

echo "🗄️  Step 2: Setting up PostgreSQL database..."
run_remote "
    sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF
"

echo "📁 Step 3: Creating deployment directory..."
run_remote "
    mkdir -p $DEPLOY_DIR
    cd $DEPLOY_DIR
    
    # If Git repo doesn't exist, clone it
    if [ ! -d '.git' ]; then
        git clone https://github.com/Shatzii/Go4it-V2.git .
    else
        git pull origin main
    fi
"

echo "⚙️  Step 4: Creating production environment file..."
run_remote "
    cd $DEPLOY_DIR
    cat > .env << EOF
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=http://$SERVER_IP

# Database Configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME

# JWT Secret
JWT_SECRET=$JWT_SECRET

# License Configuration (will be set by customer)
GO4IT_LICENSE_KEY=demo-license-key
GO4IT_LICENSE_SERVER=https://licensing.go4itsports.com

# File Upload Settings
UPLOAD_MAX_SIZE=2147483648
UPLOAD_DIR=$DEPLOY_DIR/uploads

# Logging
LOG_LEVEL=info
EOF
"

echo "📦 Step 5: Installing application dependencies..."
run_remote "
    cd $DEPLOY_DIR
    npm ci --production
    npm run build
    
    # Create necessary directories
    mkdir -p uploads logs
    chown -R www-data:www-data uploads
"

echo "🔧 Step 6: Setting up database schema..."
run_remote "
    cd $DEPLOY_DIR
    npm run db:push || echo 'Database schema setup attempted'
"

echo "🌐 Step 7: Configuring Nginx..."
run_remote "
    cat > /etc/nginx/sites-available/go4it-sports << 'EOF'
server {
    listen 80;
    server_name $SERVER_IP;
    
    client_max_body_size 2G;
    
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    location /uploads {
        alias $DEPLOY_DIR/uploads;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
    
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
EOF

    # Enable the site
    ln -sf /etc/nginx/sites-available/go4it-sports /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl reload nginx
"

echo "🚦 Step 8: Setting up PM2 process management..."
run_remote "
    npm install -g pm2
    cd $DEPLOY_DIR
    
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'go4it-sports',
    script: 'npm',
    args: 'start',
    cwd: '$DEPLOY_DIR',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$DEPLOY_DIR/logs/error.log',
    out_file: '$DEPLOY_DIR/logs/out.log',
    log_file: '$DEPLOY_DIR/logs/combined.log',
    time: true,
    max_memory_restart: '1G'
  }]
};
EOF

    # Stop any existing PM2 processes
    pm2 stop all || true
    pm2 delete all || true
    
    # Start the application
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup systemd -u root --hp /root
"

echo "🔥 Step 9: Configuring firewall..."
run_remote "
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw allow 3000
    ufw --force enable
"

echo "🏥 Step 10: Running health checks..."
echo "Waiting for application to start..."
sleep 10

# Test if the application is responding
if run_remote "curl -f http://localhost:3000/api/health > /dev/null 2>&1"; then
    echo "✅ Application health check passed"
else
    echo "⚠️  Application might still be starting up..."
fi

# Test nginx
if run_remote "curl -f http://localhost/ > /dev/null 2>&1"; then
    echo "✅ Nginx proxy check passed"
else
    echo "⚠️  Nginx proxy check failed"
fi

echo "📊 Step 11: Deployment summary..."
run_remote "
    echo '=== Go4It Sports Deployment Status ==='
    echo 'Server IP: $SERVER_IP'
    echo 'Application URL: http://$SERVER_IP'
    echo 'Admin Login: admin / MyTime\$\$'
    echo ''
    echo '=== Service Status ==='
    systemctl is-active nginx && echo 'Nginx: Running' || echo 'Nginx: Not running'
    systemctl is-active postgresql && echo 'PostgreSQL: Running' || echo 'PostgreSQL: Not running'
    pm2 status | grep -q 'go4it-sports' && echo 'Go4It App: Running' || echo 'Go4It App: Not running'
    echo ''
    echo '=== PM2 Status ==='
    pm2 status
    echo ''
    echo '=== Disk Usage ==='
    df -h $DEPLOY_DIR
    echo ''
    echo '=== Log Files ==='
    ls -la $DEPLOY_DIR/logs/
"

echo ""
echo "🎉 Go4It Sports deployment completed!"
echo ""
echo "🌐 Access your application at: http://$SERVER_IP"
echo "🔑 Admin credentials: admin / MyTime\$\$"
echo "📊 Health check: http://$SERVER_IP/api/health"
echo "📄 License status: http://$SERVER_IP/api/license/status"
echo ""
echo "📝 Next steps:"
echo "   1. Update DNS to point to $SERVER_IP (if using domain)"
echo "   2. Configure SSL certificate with certbot (optional)"
echo "   3. Set up monitoring and backups"
echo "   4. Update GO4IT_LICENSE_KEY in .env for production license"
echo ""
echo "🔧 Management commands:"
echo "   SSH: ssh root@$SERVER_IP"
echo "   Logs: pm2 logs go4it-sports"
echo "   Restart: pm2 restart go4it-sports"
echo "   Status: pm2 status"
echo ""

# Save connection info to local file
cat > deployment-info.txt << EOF
Go4It Sports Deployment Information
==================================

Server: $SERVER_IP
Application URL: http://$SERVER_IP
Admin Login: admin / MyTime\$\$

Database:
- Name: $DB_NAME
- User: $DB_USER
- Password: $DB_PASS

JWT Secret: $JWT_SECRET

SSH Access: ssh root@$SERVER_IP
Application Directory: $DEPLOY_DIR

Health Check: http://$SERVER_IP/api/health
License Status: http://$SERVER_IP/api/license/status

Deployment Date: $(date)
EOF

echo "💾 Deployment info saved to deployment-info.txt"