# Shatzii AI Agents - Self-Hosted Deployment Blueprint

## Overview
This blueprint deploys fully functional AI marketing and sales agents that autonomously generate leads, create campaigns, qualify prospects, conduct demos, negotiate deals, and close sales - exactly how Shatzii operates its own business.

## Prerequisites

### Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- 16GB RAM minimum (32GB recommended)
- 100GB SSD storage (500GB recommended)
- 4 CPU cores minimum (8 cores recommended)
- Public IP with ports 80, 443, 22 open

### Required API Keys
```bash
# Lead Generation APIs
export APOLLO_API_KEY="your_apollo_api_key"
export ZOOMINFO_API_KEY="your_zoominfo_api_key"

# AI Content Generation
export OPENAI_API_KEY="your_openai_api_key"

# Communication Services
export SENDGRID_API_KEY="your_sendgrid_api_key"
export TWILIO_ACCOUNT_SID="your_twilio_sid"
export TWILIO_AUTH_TOKEN="your_twilio_token"
export TWILIO_PHONE_NUMBER="your_twilio_number"
```

## Installation Steps

### 1. Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git and Node.js
sudo apt install -y git nodejs npm

# Clone repository
git clone https://github.com/your-org/shatzii-agents.git
cd shatzii-agents
```

### 2. Environment Configuration
```bash
# Create production environment file
cp .env.example .env.production

# Edit with your API keys
nano .env.production
```

### 3. Database Setup
```bash
# Initialize PostgreSQL database
docker-compose up -d db

# Wait for database to be ready
sleep 30

# Run database migrations
npm run db:push

# Seed with initial data
npm run db:seed
```

### 4. AI Engine Deployment
```bash
# Build and deploy all services
docker-compose up -d

# Verify all services are running
docker-compose ps

# Check AI engines are operational
curl http://localhost:5000/api/engines/status
```

### 5. SSL Configuration
```bash
# Install Certbot for SSL certificates
sudo apt install -y certbot

# Generate SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/your-domain.com/* ./ssl/
```

## API Integration Setup

### Apollo.io Lead Generation
1. Sign up at https://apollo.io
2. Get API key from dashboard
3. Configure lead search parameters:
```javascript
const apolloConfig = {
  person_titles: ['CTO', 'Chief Technology Officer', 'VP Engineering'],
  organization_industry_tag_ids: ['Technology', 'Software'],
  per_page: 25
};
```

### ZoomInfo Integration
1. Register at https://zoominfo.com
2. Obtain API credentials
3. Set up company database access

### OpenAI Content Generation
1. Create account at https://openai.com
2. Generate API key
3. Configure for GPT-4 access

### SendGrid Email Automation
1. Sign up at https://sendgrid.com
2. Verify sender domain
3. Create API key with full access

### Twilio Voice/SMS
1. Register at https://twilio.com
2. Purchase phone number
3. Configure webhook endpoints

## Agent Configuration

### Marketing Engine Settings
```javascript
// Lead generation targets
const targets = {
  industries: ['Technology', 'Healthcare', 'Finance'],
  companySize: '1000+',
  roles: ['CTO', 'VP Engineering', 'Head of AI'],
  technologies: ['AI', 'Machine Learning', 'Cloud']
};

// Campaign parameters
const campaigns = {
  emailFrequency: '3x per week',
  linkedinOutreach: 'enabled',
  contentGeneration: 'daily',
  abTesting: 'enabled'
};
```

### Sales Engine Configuration
```javascript
// Pipeline stages and automation
const salesConfig = {
  prospectingCriteria: {
    minCompanySize: 500,
    budget: '$100K+',
    urgency: ['Q1', 'Q2', 'immediate']
  },
  
  qualificationThresholds: {
    bant_score: 70,
    engagement_level: 'high',
    decision_maker: true
  },
  
  negotiationLimits: {
    maxDiscount: 0.15,
    paymentTerms: 'Net 60',
    minimumDealSize: 50000
  }
};
```

## Monitoring and Analytics

### Grafana Dashboard Setup
```bash
# Access Grafana at http://your-domain:3000
# Login: admin / admin

# Import dashboard configuration
curl -X POST http://admin:admin@localhost:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @grafana-dashboard.json
```

### Key Metrics to Monitor
- Lead generation rate (target: 50+ leads/day)
- Campaign conversion rates (target: 25%+)
- Sales pipeline velocity (target: 45 days)
- Deal win rate (target: 80%+)
- Revenue per agent (target: $100K/month)

## Security Configuration

### Firewall Setup
```bash
# Configure UFW
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5432/tcp  # Database access only internal
sudo ufw deny 6379/tcp  # Redis access only internal
```

### SSL/TLS Configuration
```nginx
# nginx.conf SSL settings
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
```

### Database Security
```sql
-- Create restricted database user
CREATE USER shatzii_app WITH ENCRYPTED PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE shatzii_prod TO shatzii_app;
GRANT USAGE ON SCHEMA public TO shatzii_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO shatzii_app;
```

## Backup and Recovery

### Automated Backups
```bash
#!/bin/bash
# backup.sh - Run daily via cron

# Database backup
docker exec shatzii_db pg_dump -U postgres shatzii_prod > /backups/db_$(date +%Y%m%d).sql

# File system backup
tar -czf /backups/files_$(date +%Y%m%d).tar.gz /app/data /app/logs

# Upload to cloud storage (AWS S3, Google Cloud, etc.)
aws s3 sync /backups/ s3://your-backup-bucket/shatzii/
```

### Recovery Procedures
```bash
# Restore database
docker exec -i shatzii_db psql -U postgres shatzii_prod < /backups/db_20241210.sql

# Restore files
tar -xzf /backups/files_20241210.tar.gz -C /

# Restart services
docker-compose restart
```

## Performance Optimization

### Database Tuning
```sql
-- PostgreSQL optimization
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
SELECT pg_reload_conf();
```

### Application Scaling
```yaml
# docker-compose.scale.yml
services:
  shatzii-app:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
```

## Operational Commands

### Start/Stop Services
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart shatzii-app

# View logs
docker-compose logs -f shatzii-app
```

### Health Checks
```bash
# Check engine status
curl http://localhost:5000/api/engines/status

# View current metrics
curl http://localhost:5000/api/engines/metrics

# Test lead generation
curl -X POST http://localhost:5000/api/marketing/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","type":"email","criteria":{"industry":"Technology"}}'
```

### Scaling Operations
```bash
# Scale application instances
docker-compose up -d --scale shatzii-app=3

# Add additional database replicas
docker-compose -f docker-compose.yml -f docker-compose.replica.yml up -d
```

## Troubleshooting

### Common Issues

#### AI Engines Not Starting
```bash
# Check logs
docker-compose logs ai-engine

# Verify API keys
docker exec shatzii-app env | grep API_KEY

# Test API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

#### Database Connection Issues
```bash
# Check database status
docker-compose ps db

# Test connection
docker exec shatzii_db psql -U postgres -c "SELECT 1"

# Reset database
docker-compose down db
docker volume rm shatzii_postgres_data
docker-compose up -d db
```

#### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check database performance
docker exec shatzii_db psql -U postgres -c "SELECT * FROM pg_stat_activity"

# Analyze slow queries
docker exec shatzii_db psql -U postgres -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10"
```

## Production Deployment Checklist

- [ ] Server meets minimum requirements
- [ ] All API keys configured and tested
- [ ] Database initialized and migrated
- [ ] SSL certificates installed
- [ ] Monitoring dashboards configured
- [ ] Backup system operational
- [ ] Security policies implemented
- [ ] Load balancing configured (if needed)
- [ ] DNS pointing to server
- [ ] Health checks passing

## Support and Maintenance

### Regular Maintenance Tasks
- Weekly: Review agent performance metrics
- Monthly: Update API keys and certificates
- Quarterly: Database optimization and cleanup
- Annually: Security audit and updates

### Performance Targets
- 99.9% uptime
- Sub-100ms API response times
- 50+ leads generated daily
- 80%+ sales conversion rate
- 24/7 autonomous operation

For support, monitor the logs and metrics dashboards. The AI agents are designed to operate autonomously but should be monitored for optimal performance.