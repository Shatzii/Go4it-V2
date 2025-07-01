# Quick Deploy Guide

## 30-Second Setup

For immediate testing and evaluation:

```bash
# 1. Extract package
cd rhythm-lms-saas-v1.0

# 2. Quick install (Ubuntu/Debian)
sudo ./scripts/install.sh

# 3. Access platform
# Visit: http://YOUR_SERVER_IP
```

## Production Deployment

For live educational environments:

```bash
# 1. Optimize for production
./scripts/optimize-production.sh

# 2. Configure environment
cp .env.production .env
# Edit .env with your database credentials

# 3. Deploy with monitoring
sudo systemctl enable rhythm-lms
sudo systemctl start rhythm-lms
```

## Docker Deployment

For containerized environments:

```bash
# Single command deployment
sudo ./scripts/docker-setup.sh

# Platform will be available at http://YOUR_SERVER_IP
```

## Troubleshooting

**Common Issues:**
- Port 5000 already in use: Change PORT in .env
- Database connection: Verify DATABASE_URL in .env
- Permission errors: Ensure proper file ownership

**Support:**
- Check logs: `journalctl -u rhythm-lms -f`
- Health check: `curl http://localhost:5000/health`
- Restart service: `sudo systemctl restart rhythm-lms`