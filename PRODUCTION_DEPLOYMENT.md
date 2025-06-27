# Go4It Sports Production Deployment - 5.188.99.81

## Server Configuration

### Target Server: 5.188.99.81
- **Purpose**: Production deployment of Go4It Sports platform
- **Architecture**: Complete subscription-based platform with licensing
- **Domain**: Configure as needed for production access

## Deployment Steps

### 1. Server Access
```bash
# Connect to production server
ssh root@5.188.99.81

# Or with specific user
ssh username@5.188.99.81
```

### 2. Environment Setup
```bash
# Update system packages
apt update && apt upgrade -y

# Install required dependencies
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx nodejs npm postgresql-client

# Start Docker service
systemctl start docker
systemctl enable docker
```

### 3. Deploy Go4It Platform
```bash
# Create deployment directory
mkdir -p /opt/go4it-sports
cd /opt/go4it-sports

# Transfer files from development
# Option 1: Git clone
git clone https://github.com/Shatzii/Go4it-V2.git .

# Option 2: Direct file transfer
scp -r . root@5.188.99.81:/opt/go4it-sports/
```

### 4. Configuration Files
Create production environment configuration:

```bash
# Production environment variables
cat > .env << EOF
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=http://5.188.99.81

# Database Configuration
DATABASE_URL=postgresql://go4it_user:secure_password@localhost:5432/go4it_production

# JWT Secret (generate secure key)
JWT_SECRET=$(openssl rand -hex 32)

# License Configuration
GO4IT_LICENSE_KEY=production-license-key
GO4IT_LICENSE_SERVER=https://licensing.go4itsports.com

# Optional AI Keys
OPENAI_API_KEY=your-production-openai-key
ANTHROPIC_API_KEY=your-production-anthropic-key

# File Upload Settings
UPLOAD_MAX_SIZE=2147483648
UPLOAD_DIR=/opt/go4it-sports/uploads

# Logging
LOG_LEVEL=info
EOF
```

### 5. Database Setup
```bash
# Install and configure PostgreSQL
apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE go4it_production;
CREATE USER go4it_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE go4it_production TO go4it_user;
ALTER USER go4it_user CREATEDB;
\q
EOF

# Run database migrations
npm run db:push
```

### 6. Application Setup
```bash
# Install dependencies
npm ci --production

# Build the application
npm run build

# Create uploads directory
mkdir -p uploads
chown -R www-data:www-data uploads
```

### 7. Nginx Configuration
```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/go4it-sports << EOF
server {
    listen 80;
    server_name 5.188.99.81;
    
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
    }
    
    location /uploads {
        alias /opt/go4it-sports/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/go4it-sports /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 8. Process Management with PM2
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'go4it-sports',
    script: 'npm',
    args: 'start',
    cwd: '/opt/go4it-sports',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/go4it-sports/error.log',
    out_file: '/var/log/go4it-sports/out.log',
    log_file: '/var/log/go4it-sports/combined.log',
    time: true
  }]
};
EOF

# Create log directory
mkdir -p /var/log/go4it-sports

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 9. SSL Certificate (Optional)
```bash
# Install SSL certificate with Let's Encrypt
certbot --nginx -d yourdomain.com

# Or create self-signed certificate for IP access
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/go4it-sports.key \
  -out /etc/ssl/certs/go4it-sports.crt \
  -subj "/C=US/ST=State/L=City/O=Go4It Sports/CN=5.188.99.81"
```

### 10. Firewall Configuration
```bash
# Configure UFW firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000
ufw --force enable
```

## Docker Deployment (Alternative)

For containerized deployment:

```bash
# Create Docker Compose file
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://go4it_user:secure_password@postgres:5432/go4it_production
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=go4it_production
      - POSTGRES_USER=go4it_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

## Access and Testing

### Application Access
- **HTTP**: http://5.188.99.81
- **Admin Login**: username: admin, password: MyTime$$
- **License Status**: http://5.188.99.81/api/license/status

### Health Checks
```bash
# Check application status
curl http://5.188.99.81/api/health

# Check PM2 processes
pm2 status

# Check logs
pm2 logs go4it-sports

# Check Nginx status
systemctl status nginx

# Check database connection
psql -h localhost -U go4it_user -d go4it_production -c "SELECT NOW();"
```

## Monitoring and Maintenance

### Log Monitoring
```bash
# Application logs
tail -f /var/log/go4it-sports/combined.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### Backup Strategy
```bash
# Database backup
pg_dump -h localhost -U go4it_user go4it_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Application backup
tar -czf go4it_backup_$(date +%Y%m%d_%H%M%S).tar.gz /opt/go4it-sports/uploads
```

### Updates and Maintenance
```bash
# Update application
cd /opt/go4it-sports
git pull origin main
npm ci --production
npm run build
pm2 restart go4it-sports

# System updates
apt update && apt upgrade -y
```

## Production Checklist

- [ ] Server access configured
- [ ] Dependencies installed
- [ ] Database setup complete
- [ ] Environment variables configured
- [ ] Application built and deployed
- [ ] Nginx configured and running
- [ ] PM2 process management setup
- [ ] Firewall configured
- [ ] SSL certificate installed (if needed)
- [ ] Health checks passing
- [ ] Monitoring setup
- [ ] Backup strategy implemented

## Support

For deployment issues or questions:
- Check logs for error details
- Verify all services are running
- Confirm environment variables are set
- Test database connectivity
- Review firewall settings

Production deployment ready at: **http://5.188.99.81**