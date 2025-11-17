# Go4It Sports Platform Migration Guide
## Complete Deployment to schools.shatzii.com

### Overview
This guide provides complete information for migrating the Go4It Sports educational platform from Replit to schools.shatzii.com. The platform includes dual-market functionality (universities/high schools), self-hosted NCAA compliance AI, and comprehensive student-athlete management.

---

## 🛠️ TECHNICAL SPECIFICATIONS

### System Requirements
- **Python**: 3.11+ (recommended 3.11)
- **Database**: PostgreSQL 14+ with connection pooling
- **Web Server**: Gunicorn with nginx reverse proxy
- **Memory**: Minimum 4GB RAM (8GB recommended for AI engines)
- **Storage**: 20GB+ for application and media files
- **SSL**: Required for production deployment

### Core Dependencies
```bash
# Main Framework
flask==3.0.0
flask-sqlalchemy==3.1.1
flask-login==0.6.3
flask-cors==4.0.0
flask-wtf==1.2.1
gunicorn==21.2.0

# Database & ORM
psycopg2-binary==2.9.9
sqlalchemy==2.0.23

# Security & Authentication
werkzeug==3.0.1
wtforms==3.1.1
cryptography==41.0.8

# AI Services
anthropic==0.8.1
openai==1.6.1
requests==2.31.0

# Additional Features
pillow==10.1.0
numpy==1.24.4
python-slugify==8.0.1
email-validator==2.1.0
twilio==8.10.3
sendgrid==6.11.0

# Web Scraping & Analysis
beautifulsoup4==4.12.2
trafilatura==1.7.0

# Caching & Performance
diskcache==5.6.3
```

---

## 📁 PROJECT STRUCTURE

### Root Directory Structure
```
go4it-sports/
├── main.py                     # Main application entry point
├── app.py                      # Flask app factory
├── models.py                   # Core database models
├── ncaa_compliance_agent.py    # Self-hosted NCAA compliance AI
├── requirements.txt            # Python dependencies
├── gunicorn.conf.py           # Gunicorn configuration
├── .env                       # Environment variables
├── static/                    # Static assets
│   ├── css/
│   ├── js/
│   └── images/
│       └── go4it_logo.jpeg
├── templates/                 # Jinja2 templates
│   ├── index.html            # Landing page
│   ├── login.html            # Authentication
│   └── modules/              # Role-specific templates
│       ├── academic_advisor/
│       ├── position_coach/
│       ├── teacher/
│       ├── ncaa_compliance/
│       └── admin/
├── modules/                  # Application modules
│   ├── admin/
│   ├── coach/
│   ├── student/
│   ├── parent/
│   └── utils/
├── ai/                      # AI engine components
│   ├── engines/
│   ├── services/
│   └── cache/
└── docs/                   # Documentation
    ├── SITE_ANALYSIS_REPORT.md
    ├── PLATFORM_IMPROVEMENTS.md
    └── HOMEPAGE_IMPROVEMENTS.md
```

---

## 🔧 DEPLOYMENT CONFIGURATION

### Environment Variables (.env)
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/go4it_sports
PGHOST=localhost
PGPORT=5432
PGUSER=go4it_user
PGPASSWORD=secure_password_here
PGDATABASE=go4it_sports

# Flask Configuration
FLASK_ENV=production
FLASK_SECRET_KEY=your_super_secure_secret_key_here
SESSION_SECRET=another_secure_session_key

# AI Service Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key

# Self-Hosted AI Engines
SELF_HOSTED_AI=true
ACADEMIC_ENGINE_URL=http://localhost:8001
VIDEO_ENGINE_URL=http://localhost:8002
COMPLIANCE_ENGINE_URL=http://localhost:8003

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Domain Configuration
REPLIT_DEV_DOMAIN=schools.shatzii.com
REPLIT_DOMAINS=schools.shatzii.com
```

### Gunicorn Configuration (gunicorn.conf.py)
```python
# Gunicorn configuration for production deployment
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
preload_app = True
reload = False

# Logging
accesslog = "/var/log/go4it/access.log"
errorlog = "/var/log/go4it/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "go4it-sports"

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name schools.shatzii.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name schools.shatzii.com;

    ssl_certificate /path/to/ssl/certificate.pem;
    ssl_certificate_key /path/to/ssl/private-key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    client_max_body_size 100M;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        proxy_buffering off;
    }

    location /static/ {
        alias /var/www/go4it-sports/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /uploads/ {
        alias /var/www/go4it-sports/uploads/;
        client_max_body_size 100M;
    }
}
```

---

## 🗄️ DATABASE SETUP

### PostgreSQL Database Creation
```sql
-- Create database and user
CREATE DATABASE go4it_sports;
CREATE USER go4it_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE go4it_sports TO go4it_user;

-- Connect to the database
\c go4it_sports;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO go4it_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO go4it_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO go4it_user;
```

### Database Initialization Script (init_db.py)
```python
#!/usr/bin/env python3
"""
Database initialization script for Go4It Sports platform
"""
import os
from main import app, db
from werkzeug.security import generate_password_hash

def initialize_database():
    """Initialize database with tables and demo data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully")
        
        # Import and create demo users
        from main import User
        
        demo_users = [
            {
                'username': 'test_admin',
                'email': 'admin@schools.shatzii.com',
                'password': 'test123',
                'first_name': 'System',
                'last_name': 'Administrator',
                'role': 'admin'
            },
            {
                'username': 'test_coach',
                'email': 'coach@schools.shatzii.com',
                'password': 'test123',
                'first_name': 'Head',
                'last_name': 'Coach',
                'role': 'head_coach'
            },
            {
                'username': 'test_advisor',
                'email': 'advisor@schools.shatzii.com',
                'password': 'test123',
                'first_name': 'Dr. Sarah',
                'last_name': 'Johnson',
                'role': 'academic_advisor'
            },
            {
                'username': 'test_position_coach',
                'email': 'position@schools.shatzii.com',
                'password': 'test123',
                'first_name': 'Coach Mike',
                'last_name': 'Thompson',
                'role': 'position_coach'
            },
            {
                'username': 'test_teacher',
                'email': 'teacher@schools.shatzii.com',
                'password': 'test123',
                'first_name': 'Ms. Lisa',
                'last_name': 'Williams',
                'role': 'teacher'
            },
            {
                'username': 'test_student',
                'email': 'student@schools.shatzii.com',
                'password': 'test123',
                'first_name': 'John',
                'last_name': 'Student',
                'role': 'student'
            },
            {
                'username': 'test_parent',
                'email': 'parent@schools.shatzii.com',
                'password': 'test123',
                'first_name': 'Jane',
                'last_name': 'Parent',
                'role': 'parent'
            }
        ]
        
        for user_data in demo_users:
            existing_user = User.query.filter_by(username=user_data['username']).first()
            if not existing_user:
                user = User(
                    username=user_data['username'],
                    email=user_data['email'],
                    password_hash=generate_password_hash(user_data['password']),
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    role=user_data['role']
                )
                db.session.add(user)
        
        db.session.commit()
        print("Demo users created successfully")

if __name__ == "__main__":
    initialize_database()
```

---

## 🚀 DEPLOYMENT STEPS

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-pip python3.11-venv -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install system dependencies
sudo apt install build-essential libpq-dev -y
```

### 2. Application Deployment
```bash
# Create application directory
sudo mkdir -p /var/www/go4it-sports
cd /var/www/go4it-sports

# Clone or upload application files
# (Upload all files from the Replit project)

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set ownership
sudo chown -R www-data:www-data /var/www/go4it-sports

# Create log directories
sudo mkdir -p /var/log/go4it
sudo chown www-data:www-data /var/log/go4it
```

### 3. Database Setup
```bash
# Setup PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE go4it_sports;"
sudo -u postgres psql -c "CREATE USER go4it_user WITH ENCRYPTED PASSWORD 'secure_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it_sports TO go4it_user;"

# Initialize database
source venv/bin/activate
python init_db.py
```

### 4. Service Configuration
```bash
# Create systemd service file
sudo nano /etc/systemd/system/go4it-sports.service
```

**Service File Content:**
```ini
[Unit]
Description=Go4It Sports Educational Platform
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/go4it-sports
Environment=PATH=/var/www/go4it-sports/venv/bin
EnvironmentFile=/var/www/go4it-sports/.env
ExecStart=/var/www/go4it-sports/venv/bin/gunicorn -c gunicorn.conf.py main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### 5. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d schools.shatzii.com

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Service Startup
```bash
# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable go4it-sports
sudo systemctl start go4it-sports
sudo systemctl enable nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status go4it-sports
sudo systemctl status nginx
```

---

## 🔑 KEY FEATURES CONFIGURATION

### NCAA Compliance AI Agent
- Self-hosted on port 8003
- Requires COMPLIANCE_ENGINE_URL environment variable
- Monitors daily NCAA updates and interpretations
- Provides 1000% compliance scoring

### Dual-Market Platform
- University mode: Academic advisor replacement features
- High school mode: Teacher integration and parent communication
- Toggle system in login interface
- Role-specific dashboard routing

### Test Accounts Available
- Admin: test_admin / test123
- Head Coach: test_coach / test123
- Academic Advisor: test_advisor / test123
- Position Coach: test_position_coach / test123
- Teacher: test_teacher / test123
- Student: test_student / test123
- Parent: test_parent / test123

### Self-Hosted AI Engines
- Academic Engine (port 8001): Curriculum generation
- Video Analysis Engine (port 8002): Sports performance analysis
- Compliance Engine (port 8003): NCAA monitoring
- Complete data privacy with no external dependencies

---

## 📊 MONITORING & MAINTENANCE

### Log Monitoring
```bash
# Application logs
tail -f /var/log/go4it/access.log
tail -f /var/log/go4it/error.log

# System logs
sudo journalctl -u go4it-sports -f
sudo journalctl -u nginx -f
```

### Health Checks
- Application health endpoint: `https://schools.shatzii.com/health`
- NCAA compliance engine: `http://localhost:8003/health`
- Database connection monitoring through application logs

### Backup Strategy
```bash
# Database backup script
#!/bin/bash
pg_dump -h localhost -U go4it_user go4it_sports > /backups/go4it_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf /backups/go4it_files_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/go4it-sports/uploads/
```

---

## 🔐 SECURITY CONSIDERATIONS

### Application Security
- HTTPS enforced with SSL certificates
- CSRF protection enabled via Flask-WTF
- SQL injection prevention through SQLAlchemy ORM
- Secure session management with Flask-Login
- Input validation on all forms

### Server Security
- Regular system updates
- Firewall configuration (ports 80, 443, 22 only)
- SSH key-based authentication
- Regular security monitoring
- Automated backup systems

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues
1. **Database Connection Errors**: Check PostgreSQL service and credentials
2. **SSL Certificate Issues**: Verify domain DNS and Certbot configuration
3. **Static File Loading**: Ensure nginx static file serving is configured
4. **AI Engine Connectivity**: Check engine URLs and port availability

### Performance Optimization
- Enable gzip compression in nginx
- Configure database connection pooling
- Implement Redis caching for session data
- Optimize static file delivery with CDN

This comprehensive guide provides everything needed to successfully deploy the Go4It Sports platform to schools.shatzii.com with full functionality, security, and scalability.