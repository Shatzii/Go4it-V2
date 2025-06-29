# Go4It Sports Deployment Checklist

This document outlines the necessary steps to deploy the Go4It Sports platform to a new server.

## Prerequisites

- [ ] Server with Node.js v20+ installed
- [ ] PostgreSQL database
- [ ] Required API keys (OpenAI, Anthropic, etc.)
- [ ] Domain name configuration (if applicable)
- [ ] SSL certificate (recommended for production)

## Pre-Deployment Tasks

- [ ] Build client application with `npm run build`
- [ ] Create deployment package with `node create_deployment_package.js`
- [ ] Verify all API keys and secrets are available
- [ ] Backup existing data if migrating from another server

## Server Setup

- [ ] Upload the deployment package to your server
- [ ] Extract the package: `unzip go4it-deployment.zip`
- [ ] Configure environment variables in `.env` file
- [ ] Install dependencies: `npm install`
- [ ] Set up the database: `npm run db:push`

## Configuration

- [ ] Configure environment variables:
  - [ ] `DATABASE_URL` - PostgreSQL connection string
  - [ ] `PORT` - Server port (default: 5000)
  - [ ] `SESSION_SECRET` - Random string for session encryption
  - [ ] `OPENAI_API_KEY` - API key for OpenAI services
  - [ ] `ANTHROPIC_API_KEY` - API key for Anthropic services (if used)
  - [ ] `AI_ENGINE_URL` - URL of the AI Engine microservice (if used)
  - [ ] `USE_MOCK_AI_DATA` - Set to "true" for development/testing

- [ ] Configure the database
  - [ ] Run migrations: `npm run db:push`
  - [ ] Verify database tables were created correctly
  - [ ] Seed initial data if needed

## Deployment

- [ ] Start the application in production mode: `npm run start:prod`
- [ ] Verify the server starts without errors
- [ ] Check logs for any warnings or issues
- [ ] Test all critical functionality:
  - [ ] Authentication
  - [ ] User registration
  - [ ] Video analysis
  - [ ] GAR scoring
  - [ ] Transfer portal
  - [ ] Blog content
  - [ ] Athlete management

## Post-Deployment

- [ ] Set up process management (PM2 recommended)
  - [ ] `npm install -g pm2`
  - [ ] `pm2 start server.js --name "go4it"`
  - [ ] `pm2 save`
  - [ ] `pm2 startup`

- [ ] Configure automatic backups
  - [ ] Database backups
  - [ ] File backups (uploads folder)

- [ ] Monitor application performance
  - [ ] Check server resources (CPU, memory, disk)
  - [ ] Monitor application logs
  - [ ] Set up alerts for critical errors

## Domain and SSL Configuration

- [ ] Configure domain name to point to the server
- [ ] Set up SSL certificate with Let's Encrypt
  - [ ] `sudo apt-get install certbot`
  - [ ] `sudo certbot certonly --standalone -d yourdomain.com`
  - [ ] Configure web server to use the SSL certificate

## Troubleshooting

- If the server fails to start, check the logs for errors
- For database connection issues, verify the DATABASE_URL environment variable
- For API errors, check that all required API keys are set correctly
- For file permission errors, ensure the application has write access to uploads and logs directories

## Contact

For assistance with deployment, please contact the Go4It Sports technical team at admin@go4itsports.org.

---

Last updated: May 2, 2025