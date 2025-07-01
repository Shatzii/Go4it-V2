# Deployment Guide

This guide covers deployment options for the Shatzii AI Platform across different environments and platforms.

## 🚀 Quick Deploy Options

### Railway (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/shatzii)

**Automated Setup:**
```bash
./railway-setup.sh
```

**Manual Setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Add database
railway add postgresql

# Set environment variables
railway variables set NODE_ENV=production
railway variables set SESSION_SECRET=$(openssl rand -base64 32)

# Deploy
railway up
```

### Self-Hosted Deployment

#### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Nginx (recommended)
- SSL Certificate

#### Setup Steps

1. **Server Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

2. **Application Setup**
```bash
# Clone repository
git clone https://github.com/yourusername/shatzii-platform.git
cd shatzii-platform

# Install dependencies
npm install

# Build application
npm run build

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE shatzii;
CREATE USER shatzii_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE shatzii TO shatzii_user;
\q

# Run migrations
npm run db:push
```

## 🔧 Environment Configuration

### Required Variables

```bash
# Core Configuration
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SESSION_SECRET=your-super-secret-key

# Admin Configuration
ADMIN_EMAIL=admin@shatzii.com
ADMIN_PASSWORD=SecurePassword123!

# Optional Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@shatzii.com

# AI Configuration (Optional)
OLLAMA_URL=http://localhost:11434
QDRANT_URL=http://localhost:6333
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint

The application provides a health check at `/api/health`:

```json
{
  "status": "healthy",
  "timestamp": "2025-06-27T10:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

For detailed deployment instructions, see the main README.md file.