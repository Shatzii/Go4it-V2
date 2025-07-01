#!/bin/bash

# Shatzii Production Server Setup Script
# Optimizes Ubuntu server for AI-powered SaaS deployment

set -e

echo "🚀 Starting Shatzii Production Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    nginx \
    postgresql \
    postgresql-contrib \
    redis-server \
    fail2ban \
    ufw \
    htop \
    certbot \
    python3-certbot-nginx

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔨 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js 18
echo "📗 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Ollama for local AI
echo "🤖 Installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /opt/shatzii
sudo chown $USER:$USER /opt/shatzii

# Setup SSL directory
sudo mkdir -p /etc/ssl/shatzii
sudo chown $USER:$USER /etc/ssl/shatzii

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Configure fail2ban
echo "🛡️ Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Setup PostgreSQL
echo "🗄️ Configuring PostgreSQL..."
sudo -u postgres createuser --createdb shatzii_user
sudo -u postgres createdb shatzii_db -O shatzii_user

# Configure Redis
echo "📝 Configuring Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Setup log directories
echo "📊 Setting up logging..."
sudo mkdir -p /var/log/shatzii
sudo chown $USER:$USER /var/log/shatzii

# Install PM2 for process management
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# Setup PM2 startup
pm2 startup
pm2 save

# Create systemd service for Ollama
echo "🤖 Setting up Ollama service..."
sudo tee /etc/systemd/system/ollama.service > /dev/null <<EOF
[Unit]
Description=Ollama Server
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="OLLAMA_ORIGINS=*"

[Install]
WantedBy=default.target
EOF

# Create ollama user
sudo useradd -r -s /bin/false -d /usr/share/ollama ollama

# Start Ollama service
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama

# Pull AI models
echo "🧠 Downloading AI models..."
ollama pull llama3.1:8b

# Setup monitoring
echo "📈 Setting up monitoring..."
sudo mkdir -p /opt/monitoring
sudo chown $USER:$USER /opt/monitoring

# Create environment template
echo "📝 Creating environment template..."
cat > /opt/shatzii/.env.production << 'EOF'
# Production Environment Variables
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://shatzii_user:YOUR_DB_PASSWORD@localhost:5432/shatzii_db
PGHOST=localhost
PGPORT=5432
PGDATABASE=shatzii_db
PGUSER=shatzii_user
PGPASSWORD=YOUR_DB_PASSWORD

# Redis
REDIS_URL=redis://localhost:6379

# Security
SESSION_SECRET=YOUR_SESSION_SECRET

# AI Engine
OLLAMA_URL=http://localhost:11434

# Domain
FRONTEND_URL=https://shatzii.com
REPLIT_DOMAINS=shatzii.com

# Monitoring
GRAFANA_PASSWORD=YOUR_GRAFANA_PASSWORD

# Optional: External APIs (if needed)
# ANTHROPIC_API_KEY=your_key_here
# PERPLEXITY_API_KEY=your_key_here
EOF

echo "✅ Production setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your Shatzii repository to /opt/shatzii"
echo "2. Configure environment variables in /opt/shatzii/.env.production"
echo "3. Set up SSL certificates with: sudo certbot --nginx -d shatzii.com"
echo "4. Deploy with: cd /opt/shatzii && docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "🎉 Your server is ready for Shatzii deployment!"