# Installation Guide

## Step-by-Step Installation

### 1. System Preparation
- Install Docker
- Install Docker Compose
- Ensure ports 80, 443, 3000, 5432, 6379 are available

### 2. Download and Extract
- Extract the package to your desired directory
- Navigate to the package directory

### 3. Configuration
- Copy config/environment.template to config/app.env
- Edit config/app.env with your settings
- Configure domain and SSL if needed

### 4. Run Installation
```bash
./scripts/setup.sh
```

### 5. Verify Installation
- Check all services are running: `docker-compose ps`
- Access the web interface
- Login with admin credentials

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in docker-compose.yml
2. **Permission issues**: Run with sudo if needed
3. **Memory issues**: Increase RAM or disable AI features

### Logs
```bash
docker-compose logs -f
```

### Reset Installation
```bash
docker-compose down -v
./scripts/setup.sh
```
