# 🚀 Rhythm-LMS Self-Hosted AI Education Platform - Installation Wizard

## Overview
This wizard will guide you through setting up your own self-hosted AI education platform with zero technical knowledge required. The entire process is automated and takes about 15-20 minutes.

## What You'll Get
- Complete AI-powered education platform
- Self-hosted with full data control
- 255+ education laws integrated
- Neurodivergent-optimized curricula
- Superhero-themed learning experiences
- State compliance for all 50 US states

## Prerequisites
✅ **Server Requirements:**
- Ubuntu 20.04+ or CentOS 8+ VPS
- Minimum 4GB RAM (8GB recommended)
- 40GB+ disk space
- Root or sudo access

✅ **What You Need:**
- Server IP address
- SSH access (username/password or key)
- Domain name (optional but recommended)

## Installation Methods

### Method 1: One-Click Installer (Recommended)
The easiest way - just run one command and the wizard handles everything.

### Method 2: Interactive Web Installer
Use our web-based installer that runs in your browser.

### Method 3: Manual Setup
Step-by-step instructions for advanced users.

---

## 🎯 Method 1: One-Click Installer

### Step 1: Connect to Your Server
```bash
ssh root@YOUR_SERVER_IP
# or
ssh username@YOUR_SERVER_IP
```

### Step 2: Run the Magic Command
```bash
curl -fsSL https://install.rhythm-lms.com/setup.sh | bash
```

**That's it!** The installer will:
1. Detect your system automatically
2. Install all required dependencies
3. Set up the database
4. Configure the AI engine
5. Install the web application
6. Set up SSL certificates
7. Configure firewall rules
8. Start all services

### What Happens Next:
- The installer will ask you a few simple questions
- Takes 10-15 minutes to complete
- You'll get a URL to access your platform
- Admin credentials will be displayed at the end

---

## 🌐 Method 2: Interactive Web Installer

If you prefer a graphical interface:

### Step 1: Download the Web Installer
```bash
wget https://install.rhythm-lms.com/web-installer.tar.gz
tar -xzf web-installer.tar.gz
cd rhythm-lms-installer
```

### Step 2: Start the Web Interface
```bash
sudo ./start-web-installer.sh
```

### Step 3: Open Your Browser
Navigate to: `http://YOUR_SERVER_IP:8080`

The web installer provides:
- Visual progress indicators
- Real-time log viewing
- Error detection and fixes
- System compatibility checks
- Automatic troubleshooting

---

## 🔧 Method 3: Manual Setup (Advanced)

For users who want full control over the installation process.

### Step 1: System Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git unzip nginx postgresql-14 nodejs npm
```

### Step 2: Database Setup
```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE rhythm_lms;"
sudo -u postgres psql -c "CREATE USER rhythm_user WITH PASSWORD 'secure_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE rhythm_lms TO rhythm_user;"
```

### Step 3: Application Installation
```bash
# Clone the repository
git clone https://github.com/rhythm-lms/platform.git /opt/rhythm-lms
cd /opt/rhythm-lms

# Install dependencies
npm install

# Set up environment
cp .env.example .env
nano .env  # Edit configuration
```

### Step 4: Build and Deploy
```bash
# Build the application
npm run build

# Set up systemd service
sudo cp scripts/rhythm-lms.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rhythm-lms
sudo systemctl start rhythm-lms
```

### Step 5: Web Server Configuration
```bash
# Configure Nginx
sudo cp scripts/nginx.conf /etc/nginx/sites-available/rhythm-lms
sudo ln -s /etc/nginx/sites-available/rhythm-lms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🧠 AI-Powered Setup Assistant

Our installation includes an intelligent setup assistant that:

### Automatic System Detection
- Detects your operating system
- Checks hardware requirements
- Identifies existing software conflicts
- Suggests optimal configurations

### Smart Dependency Management
- Installs only required packages
- Handles version conflicts automatically
- Updates existing software safely
- Manages service dependencies

### Intelligent Error Recovery
- Detects common installation issues
- Provides automatic fixes
- Suggests manual solutions
- Logs everything for support

### Configuration Optimization
- Optimizes for your hardware
- Sets up performance monitoring
- Configures automatic backups
- Enables security best practices

---

## 📋 Configuration Wizard

During installation, you'll be asked:

### Basic Settings
- **Domain Name**: Your website URL (optional)
- **Admin Email**: For SSL certificates and notifications
- **Time Zone**: For scheduling and logs

### Database Configuration
- **Database Password**: Auto-generated secure password
- **Backup Schedule**: Automatic daily backups
- **Storage Location**: Where to store data

### AI Engine Setup
- **Model Selection**: Choose AI capabilities
- **Performance Mode**: Optimize for speed or accuracy
- **Resource Allocation**: CPU/memory usage

### Educational Settings
- **Primary State**: Your main compliance jurisdiction
- **Grade Levels**: K-12, higher education, or both
- **Subjects**: Core subjects to enable
- **Neurodivergent Profiles**: Default accommodations

### Security Configuration
- **SSL Certificate**: Automatic Let's Encrypt setup
- **Firewall Rules**: Secure default configuration
- **Access Control**: Admin and user permissions
- **Backup Encryption**: Secure data protection

---

## 🔍 Troubleshooting Guide

### Common Issues and Solutions

#### Installation Fails
```bash
# Check system requirements
./check-requirements.sh

# View detailed logs
tail -f /var/log/rhythm-lms-install.log

# Restart installation
./install.sh --resume
```

#### Database Connection Issues
```bash
# Check database status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U rhythm_user -d rhythm_lms

# Reset database
./scripts/reset-database.sh
```

#### Web Server Problems
```bash
# Check nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

#### AI Engine Not Starting
```bash
# Check AI service status
sudo systemctl status rhythm-ai

# View AI logs
sudo journalctl -u rhythm-ai -f

# Restart AI engine
sudo systemctl restart rhythm-ai
```

### Getting Help

#### Automatic Diagnostics
```bash
# Run system diagnostics
./scripts/diagnose.sh

# Generate support report
./scripts/support-report.sh
```

#### Log Analysis
```bash
# View all logs
./scripts/view-logs.sh

# Search for errors
./scripts/find-errors.sh

# Export logs for support
./scripts/export-logs.sh
```

---

## 🎉 Post-Installation

### Verification Steps
1. **Access Your Platform**: Open `https://your-domain.com`
2. **Login as Admin**: Use the credentials provided
3. **Run System Test**: Built-in diagnostics page
4. **Create First Student**: Test the user creation
5. **Generate Sample Curriculum**: Test AI functionality

### Initial Configuration
1. **Update Admin Profile**: Set your information
2. **Configure School Settings**: Add your institution details
3. **Import State Standards**: Select your compliance requirements
4. **Set Up User Roles**: Create teacher and student accounts
5. **Customize Themes**: Brand your platform

### Performance Optimization
1. **Enable Caching**: Automatic performance boost
2. **Configure CDN**: Optional content delivery
3. **Set Up Monitoring**: Track system health
4. **Schedule Maintenance**: Automatic updates
5. **Backup Verification**: Test restore procedures

---

## 🔒 Security Checklist

### Automatic Security Features
- ✅ SSL/TLS encryption enabled
- ✅ Firewall configured and active
- ✅ Database access restricted
- ✅ Admin password complexity enforced
- ✅ Session security implemented
- ✅ Input validation activated
- ✅ Rate limiting configured
- ✅ Security headers enabled

### Recommended Additional Steps
- [ ] Change default SSH port
- [ ] Set up fail2ban for intrusion detection
- [ ] Configure automated security updates
- [ ] Set up log monitoring alerts
- [ ] Enable two-factor authentication
- [ ] Schedule security scans
- [ ] Review user access regularly
- [ ] Set up backup verification

---

## 📞 Support and Resources

### Documentation
- **User Manual**: Complete guide for educators
- **API Documentation**: For developers and integrations
- **Video Tutorials**: Step-by-step visual guides
- **FAQ**: Common questions and answers

### Community Support
- **Discord Server**: Real-time help and discussion
- **GitHub Issues**: Bug reports and feature requests
- **User Forums**: Community-driven support
- **Monthly Webinars**: Training and updates

### Professional Support
- **Email Support**: Direct technical assistance
- **Priority Support**: Faster response times
- **Custom Installation**: White-glove setup service
- **Training Sessions**: Staff onboarding help

---

## 🚀 Next Steps

After successful installation:

1. **Complete the Setup Wizard** in your browser
2. **Review the User Manual** for your role
3. **Join our Community** for ongoing support
4. **Schedule a Demo Call** if you need assistance
5. **Start Creating** your first neurodivergent-friendly curriculum!

---

**Need Help?** Contact our installation support team:
- 📧 Email: install-support@rhythm-lms.com
- 💬 Live Chat: Available on our website
- 📞 Phone: 1-800-RHYTHM-LMS
- 🎫 Support Portal: https://support.rhythm-lms.com

**Remember**: This platform is designed to work perfectly out of the box. The AI will handle the complex parts automatically!