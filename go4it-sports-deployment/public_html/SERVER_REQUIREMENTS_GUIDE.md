# Go4It Sports Self-Hosted - Server Requirements & Management

## Server Requirements by Package Tier

### Starter Edition ($497)
**Minimum Server Specs:**
- **CPU**: 2 cores (2.0 GHz+)
- **RAM**: 4GB 
- **Storage**: 20GB SSD
- **Network**: 10 Mbps upload/download
- **OS**: Ubuntu 20.04+, CentOS 8+, or Docker-compatible

**Supported Platforms:**
- DigitalOcean Droplet ($20/month)
- AWS EC2 t3.medium ($30/month)
- Linode Standard ($20/month)
- Hetzner CX21 ($15/month)
- Local server/desktop

### Professional Edition ($997)
**Recommended Server Specs:**
- **CPU**: 4 cores (2.5 GHz+)
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: 25 Mbps upload/download
- **OS**: Ubuntu 20.04+, CentOS 8+

**Supported Platforms:**
- DigitalOcean Droplet ($40/month)
- AWS EC2 t3.large ($60/month)
- Linode Dedicated ($40/month)
- Hetzner CX31 ($30/month)
- Your current server (188.245.209.124)

### Enterprise Edition ($2,997)
**Optimal Server Specs:**
- **CPU**: 8 cores (3.0 GHz+)
- **RAM**: 16GB+
- **Storage**: 100GB SSD
- **Network**: 50 Mbps upload/download
- **OS**: Ubuntu 20.04+, CentOS 8+

**Supported Platforms:**
- DigitalOcean CPU-optimized ($80/month)
- AWS EC2 c5.2xlarge ($120/month)
- Hetzner CX41 ($60/month)
- Dedicated server hardware

## License & Subscription Control

### After Purchase License Management
Once a customer purchases a self-hosted package, they get:

1. **Perpetual License**: No expiration, runs forever
2. **License Key**: Unique activation code for their tier
3. **1 Year Updates**: Free updates and patches included
4. **Community Support**: Access to documentation and forums

### Optional Annual Support ($197/year)
After the first year, customers can purchase:
- **Software Updates**: New features and improvements
- **Security Patches**: Critical security updates
- **Priority Support**: Email/chat technical assistance
- **Advanced Features**: Premium AI models and tools

### License Enforcement
```javascript
// Built into the application
const licenseManager = {
  tier: 'professional', // starter, professional, enterprise
  maxAthletes: 200,
  aiPackage: 'full',
  expiresAt: null, // null = perpetual
  supportExpiresAt: '2025-06-27', // Support expiration
  features: ['teams', 'gar_analysis', 'ai_coaching', 'academic_tracking']
};
```

## Post-Purchase Customer Relationship

### Year 1 (Included Support)
- **Free Updates**: All platform improvements
- **Technical Support**: Installation and configuration help
- **Documentation Access**: Complete guides and tutorials
- **Community Forum**: User discussions and tips

### After Year 1 (Optional Renewal)
- **Basic Tier**: No cost, basic security updates only
- **Support Renewal**: $197/year for full support and features
- **Enterprise Support**: Custom pricing for priority assistance

### Revenue Continuity
- **30-40% renewal rate** on annual support
- **Upgrade sales** from Starter to Professional/Enterprise
- **New feature packages** as add-on purchases
- **White-label licensing** for coaching businesses

## Server Management After Installation

### Built-in Management Dashboard
The self-hosted package includes:

```
https://your-domain.com/admin/
├── System Status       # Server health monitoring
├── License Management  # View license details and limits
├── User Management     # Athlete and coach accounts
├── Backup System       # Automated database backups
├── Update Manager      # Install updates and patches
├── Performance Metrics # Server performance monitoring
└── Support Center      # Contact support and documentation
```

### Remote Management Options

#### 1. Web-based Admin Panel
- Monitor server health and performance
- Manage user accounts and permissions
- View system logs and diagnostics
- Configure backup schedules
- Install updates remotely

#### 2. SSH Access (Advanced Users)
```bash
# Connect to customer's server
ssh admin@customer-server.com

# View application status
docker-compose ps

# Check logs
docker-compose logs -f

# Update application
./scripts/update.sh

# Create backup
./scripts/backup.sh
```

#### 3. API Management
```javascript
// Remote management via API
const response = await fetch('https://customer-server.com/api/admin/status', {
  headers: {
    'Authorization': 'Bearer admin-api-key',
    'X-License-Key': 'customer-license-key'
  }
});
```

## Customer Server Examples

### Budget Option: Hetzner CX21 ($15/month)
- 2 vCPU, 4GB RAM, 40GB SSD
- Perfect for Starter Edition
- Handles 20-50 athletes efficiently
- European data centers

### Balanced Option: DigitalOcean ($40/month)
- 4 vCPU, 8GB RAM, 80GB SSD
- Ideal for Professional Edition
- Handles 100-200 athletes
- Global data center locations

### High-Performance: Your Current Server
- 4+ vCPU, 16GB RAM, 160GB SSD
- Perfect for Enterprise Edition
- Handles unlimited athletes
- Custom configuration options

### On-Premises Options
- **School Servers**: Install on existing infrastructure
- **Local Machines**: Run on powerful desktop computers
- **NAS Systems**: Deploy on Synology or QNAP devices
- **Mini PCs**: Intel NUC or similar compact hardware

## Installation Process

### 1. One-Command Setup
```bash
# Extract package and run installer
unzip go4it-sports-professional.zip
cd go4it-sports-professional
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configuration
- Edit environment settings
- Configure domain and SSL
- Set up backup schedules
- Activate license key

### 3. Go Live
- Access admin panel
- Create admin account
- Import athlete data
- Start using the platform

The beauty of this model is that once customers install it, they have complete control while you maintain a revenue stream through optional support and updates without the infrastructure costs.