# 🚀 Rhythm-LMS Quick Start Guide

## Three Ways to Deploy Your Self-Hosted AI Education Platform

### Option 1: One-Click Script (Recommended for Beginners)
```bash
# Run this single command on your Ubuntu/Debian server:
curl -fsSL https://raw.githubusercontent.com/rhythm-lms/platform/main/scripts/install.sh | sudo bash
```

**What it does:**
- Automatically detects your system
- Installs all dependencies
- Sets up database and AI engine
- Configures web server
- Creates admin account
- Takes 10-15 minutes

### Option 2: Docker Deployment (Recommended for Production)
```bash
# Download and run the Docker installer:
wget https://raw.githubusercontent.com/rhythm-lms/platform/main/scripts/docker-setup.sh
chmod +x docker-setup.sh
sudo ./docker-setup.sh
```

**Benefits:**
- Containerized and isolated
- Easy backup and restore
- Scalable architecture
- Automatic updates
- Production-ready

### Option 3: Manual Installation (For Advanced Users)
Follow the detailed steps in `INSTALL_WIZARD.md` for complete control over the installation process.

---

## Prerequisites

**Server Requirements:**
- Ubuntu 20.04+ or CentOS 8+
- 4GB RAM minimum (8GB recommended)
- 40GB+ disk space
- Root/sudo access
- Internet connection

**What You Need:**
- Server IP address
- SSH access credentials
- Domain name (optional)

---

## After Installation

### 1. Access Your Platform
Visit: `http://YOUR_SERVER_IP`

### 2. Login with Admin Credentials
Check: `/root/rhythm-lms-credentials.txt`

### 3. Complete Setup Wizard
- Set school information
- Choose compliance state
- Configure grade levels
- Set up first curriculum

### 4. Create Users
- Add teachers and students
- Assign neurodivergent profiles
- Set up classroom groups

---

## Key Features Available

### AI-Powered Curriculum Generation
- Create personalized learning paths
- Adapt content for neurodivergent learners
- Generate assessments automatically
- Superhero-themed activities

### State Compliance Management
- Automatic standards alignment
- Progress tracking
- Reporting for administrators
- 50-state coverage

### Neurodivergent Support
- ADHD-friendly interfaces
- Autism spectrum accommodations
- Dyslexia reading supports
- Sensory processing adaptations

---

## Troubleshooting

### Installation Issues
```bash
# Check installation logs
sudo tail -f /var/log/rhythm-lms-install.log

# Restart services
sudo systemctl restart rhythm-lms

# Check service status
sudo systemctl status rhythm-lms
```

### Docker Issues
```bash
# View container logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Check container health
docker-compose ps
```

### Common Problems
1. **Port conflicts**: Ensure ports 80, 443, 5000 are available
2. **Database connection**: Verify PostgreSQL is running
3. **Permission errors**: Check file ownership and permissions
4. **Memory issues**: Ensure adequate RAM allocation

---

## Support

- **Documentation**: Complete user guides included
- **Community**: Discord server for real-time help
- **Email Support**: Technical assistance available
- **Training**: Onboarding sessions for schools

Your self-hosted AI education platform is ready to transform neurodivergent learning!