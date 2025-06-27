/**
 * Go4It Sports Self-Hosted Package Creator
 * 
 * This script creates a complete downloadable package that users can self-host,
 * reducing infrastructure costs and giving users complete control.
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Package configuration
const config = {
  packageName: 'go4it-sports-self-hosted',
  version: '2.0.0',
  outputDir: './self-hosted-packages',
  
  // Package tiers
  tiers: {
    starter: {
      name: 'Go4It Sports Starter',
      price: '$497',
      maxAthletes: 50,
      aiPackage: 'lightweight',
      features: ['Basic GAR Analysis', 'Team Management', 'Performance Tracking']
    },
    professional: {
      name: 'Go4It Sports Professional', 
      price: '$997',
      maxAthletes: 200,
      aiPackage: 'full',
      features: ['Full AI Analysis', 'Advanced Coaching', 'Recruitment Tools', 'Academic Tracking']
    },
    enterprise: {
      name: 'Go4It Sports Enterprise',
      price: '$2,997',
      maxAthletes: 'unlimited',
      aiPackage: 'premium',
      features: ['Premium AI Models', 'White Label', 'Custom Branding', 'Priority Support']
    }
  }
};

async function createSelfHostedPackage() {
  console.log('Creating Go4It Sports Self-Hosted Packages...');
  
  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  // Create packages for each tier
  for (const [tierKey, tierConfig] of Object.entries(config.tiers)) {
    await createTierPackage(tierKey, tierConfig);
  }
  
  console.log('All self-hosted packages created successfully!');
}

async function createTierPackage(tierKey, tierConfig) {
  const packageDir = path.join(config.outputDir, `${config.packageName}-${tierKey}`);
  
  console.log(`Creating ${tierConfig.name} package...`);
  
  // Create package directory structure
  createPackageStructure(packageDir);
  
  // Copy application files based on tier
  await copyApplicationFiles(packageDir, tierKey);
  
  // Create Docker configuration
  createDockerConfig(packageDir, tierConfig);
  
  // Create installation scripts
  createInstallationScripts(packageDir, tierConfig);
  
  // Create documentation
  createDocumentation(packageDir, tierConfig);
  
  // Create license and configuration files
  createLicenseConfig(packageDir, tierConfig);
  
  // Package everything into a ZIP file
  await createZipPackage(packageDir, tierKey);
  
  console.log(`✓ ${tierConfig.name} package created`);
}

function createPackageStructure(packageDir) {
  const dirs = [
    'app',
    'config',
    'scripts',
    'docs',
    'ai-models',
    'database',
    'nginx',
    'licenses'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(packageDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

async function copyApplicationFiles(packageDir, tierKey) {
  // Copy core application files
  const appDir = path.join(packageDir, 'app');
  
  // Copy essential directories
  const sourceDirs = [
    'app',
    'components', 
    'lib',
    'shared',
    'public',
    'server'
  ];
  
  sourceDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      copyDirectoryRecursive(dir, path.join(appDir, dir));
    }
  });
  
  // Copy essential files
  const essentialFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'drizzle.config.ts'
  ];
  
  essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(appDir, file));
    }
  });
  
  // Create tier-specific package.json
  createTierSpecificPackageJson(appDir, tierKey);
}

function createTierSpecificPackageJson(appDir, tierKey) {
  const packageJsonPath = path.join(appDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Update package configuration for self-hosting
  packageJson.name = `go4it-sports-${tierKey}`;
  packageJson.version = config.version;
  packageJson.description = `Go4It Sports Platform - ${tierKey.charAt(0).toUpperCase() + tierKey.slice(1)} Edition`;
  
  // Add self-hosting specific scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'docker:build': 'docker-compose build',
    'docker:up': 'docker-compose up -d',
    'docker:down': 'docker-compose down',
    'setup': 'chmod +x scripts/setup.sh && ./scripts/setup.sh',
    'backup': 'chmod +x scripts/backup.sh && ./scripts/backup.sh',
    'update': 'chmod +x scripts/update.sh && ./scripts/update.sh'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function createDockerConfig(packageDir, tierConfig) {
  // Create docker-compose.yml
  const dockerCompose = `
version: '3.8'

services:
  app:
    build: 
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://go4it:go4it123@postgres:5432/go4it_sports
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./config/app.env:/app/.env
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=go4it_sports
      - POSTGRES_USER=go4it
      - POSTGRES_PASSWORD=go4it123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

${tierConfig.aiPackage !== 'lightweight' ? `
  ai-server:
    build:
      context: ./ai-models
      dockerfile: Dockerfile
    ports:
      - "3456:3456"
    environment:
      - AI_PACKAGE=${tierConfig.aiPackage}
    volumes:
      - ai_models_data:/app/models
    restart: unless-stopped
` : ''}

volumes:
  postgres_data:
  redis_data:
${tierConfig.aiPackage !== 'lightweight' ? '  ai_models_data:' : ''}
`;

  fs.writeFileSync(path.join(packageDir, 'docker-compose.yml'), dockerCompose);
  
  // Create Dockerfile for the app
  const dockerfile = `
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
`;

  fs.writeFileSync(path.join(packageDir, 'app', 'Dockerfile'), dockerfile);
}

function createInstallationScripts(packageDir, tierConfig) {
  // Main installation script
  const setupScript = `#!/bin/bash

echo "Setting up Go4It Sports ${tierConfig.name}..."

# Check requirements
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Please install Docker first."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required but not installed. Please install Docker Compose first."; exit 1; }

# Create necessary directories
mkdir -p uploads
mkdir -p logs
mkdir -p backups

# Copy environment template
if [ ! -f config/app.env ]; then
    cp config/environment.template config/app.env
    echo "Environment file created at config/app.env"
    echo "Please edit this file with your configuration before starting the application."
fi

# Generate SSL certificate (self-signed)
if [ ! -f nginx/ssl/server.crt ]; then
    mkdir -p nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
        -keyout nginx/ssl/server.key \\
        -out nginx/ssl/server.crt \\
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    echo "Self-signed SSL certificate generated."
fi

# Build and start services
docker-compose build
docker-compose up -d

echo ""
echo "Go4It Sports ${tierConfig.name} is starting up..."
echo "Please wait a few minutes for all services to initialize."
echo ""
echo "Access your application at:"
echo "  HTTP:  http://localhost"
echo "  HTTPS: https://localhost"
echo ""
echo "Admin login:"
echo "  Username: admin"
echo "  Password: MyTime$$"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
`;

  fs.writeFileSync(path.join(packageDir, 'scripts', 'setup.sh'), setupScript);
  
  // Backup script
  const backupScript = `#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="go4it_backup_$TIMESTAMP.tar.gz"

echo "Creating backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U go4it go4it_sports > $BACKUP_DIR/database_$TIMESTAMP.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz uploads/

# Create complete backup
tar -czf $BACKUP_DIR/$BACKUP_FILE \\
    $BACKUP_DIR/database_$TIMESTAMP.sql \\
    $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz \\
    config/app.env

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE"

# Cleanup temporary files
rm $BACKUP_DIR/database_$TIMESTAMP.sql
rm $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz
`;

  fs.writeFileSync(path.join(packageDir, 'scripts', 'backup.sh'), backupScript);
  
  // Update script
  const updateScript = `#!/bin/bash

echo "Updating Go4It Sports ${tierConfig.name}..."

# Pull latest images
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d

echo "Update completed!"
`;

  fs.writeFileSync(path.join(packageDir, 'scripts', 'update.sh'), updateScript);
  
  // Make scripts executable
  fs.chmodSync(path.join(packageDir, 'scripts', 'setup.sh'), 0o755);
  fs.chmodSync(path.join(packageDir, 'scripts', 'backup.sh'), 0o755);
  fs.chmodSync(path.join(packageDir, 'scripts', 'update.sh'), 0o755);
}

function createDocumentation(packageDir, tierConfig) {
  // Main README
  const readme = `# ${tierConfig.name}

A complete self-hosted sports analytics platform for neurodivergent student athletes.

## Features
${tierConfig.features.map(feature => `- ${feature}`).join('\n')}

## Maximum Athletes: ${tierConfig.maxAthletes}
## AI Package: ${tierConfig.aiPackage}

## Quick Start

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Minimum 4GB RAM (8GB recommended)
   - 20GB free disk space

2. **Installation**
   \`\`\`bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   \`\`\`

3. **Configuration**
   Edit \`config/app.env\` with your settings

4. **Access**
   - Web Interface: http://localhost
   - Admin User: admin / MyTime$$

## System Requirements

### Minimum
- 2 CPU cores
- 4GB RAM
- 20GB disk space

### Recommended  
- 4 CPU cores
- 8GB RAM
- 50GB disk space

### Optimal
- 8 CPU cores
- 16GB RAM
- 100GB SSD

## Support

- Documentation: ./docs/
- License: See LICENSE file
- Support: Contact your license provider

## License

This software is licensed under a commercial license.
See LICENSE file for details.
`;

  fs.writeFileSync(path.join(packageDir, 'README.md'), readme);
  
  // Installation guide
  const installGuide = `# Installation Guide

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
\`\`\`bash
./scripts/setup.sh
\`\`\`

### 5. Verify Installation
- Check all services are running: \`docker-compose ps\`
- Access the web interface
- Login with admin credentials

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in docker-compose.yml
2. **Permission issues**: Run with sudo if needed
3. **Memory issues**: Increase RAM or disable AI features

### Logs
\`\`\`bash
docker-compose logs -f
\`\`\`

### Reset Installation
\`\`\`bash
docker-compose down -v
./scripts/setup.sh
\`\`\`
`;

  fs.writeFileSync(path.join(packageDir, 'docs', 'INSTALL.md'), installGuide);
}

function createLicenseConfig(packageDir, tierConfig) {
  // Environment template
  const envTemplate = `# Go4It Sports Configuration

# Application Settings
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost

# Database Configuration
DATABASE_URL=postgresql://go4it:go4it123@postgres:5432/go4it_sports

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Secret (change this!)
JWT_SECRET=your-very-secure-jwt-secret-here

# License Configuration
LICENSE_TIER=${tierConfig.name.toLowerCase()}
MAX_ATHLETES=${tierConfig.maxAthletes}
AI_PACKAGE=${tierConfig.aiPackage}

# Optional: AI API Keys (for enhanced features)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Settings
UPLOAD_MAX_SIZE=2147483648
UPLOAD_DIR=./uploads
`;

  fs.writeFileSync(path.join(packageDir, 'config', 'environment.template'), envTemplate);
  
  // Nginx configuration
  const nginxConfig = `
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name localhost;

        ssl_certificate /etc/nginx/ssl/server.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;

        client_max_body_size 2G;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /uploads {
            alias /app/uploads;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
`;

  fs.writeFileSync(path.join(packageDir, 'nginx', 'nginx.conf'), nginxConfig);
  
  // License file
  const licenseText = `
COMMERCIAL LICENSE AGREEMENT

${tierConfig.name}

This software is licensed, not sold. This license grants you the right to:
- Install and use the software on one server/instance
- Use up to ${tierConfig.maxAthletes} athlete profiles
- Access ${tierConfig.aiPackage} AI features

Restrictions:
- No redistribution or sharing of software
- No reverse engineering or modification
- No commercial resale without written permission

Support: 1 year of updates included
License expires: Never (perpetual license)

© 2024 Go4It Sports. All rights reserved.
`;

  fs.writeFileSync(path.join(packageDir, 'LICENSE'), licenseText);
}

function copyDirectoryRecursive(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

async function createZipPackage(packageDir, tierKey) {
  const zipPath = path.join(config.outputDir, `${config.packageName}-${tierKey}.zip`);
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      console.log(`Package created: ${zipPath} (${archive.pointer()} bytes)`);
      resolve();
    });
    
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(packageDir, false);
    archive.finalize();
  });
}

// Execute the package creation
if (require.main === module) {
  createSelfHostedPackage().catch(console.error);
}

module.exports = { createSelfHostedPackage };