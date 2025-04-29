# Go4It Sports Platform - Site Map & Directory Structure

This document provides a complete directory structure for the Go4It Sports platform, showing how all files and folders should be organized on your production server.

```
/var/www/go4itsports/                  # Main application directory
│
├── client/                            # Frontend code
│   ├── dist/                          # Built frontend files (created during deployment)
│   │   ├── assets/                    # Compiled CSS, JS, images
│   │   └── index.html                 # Main HTML file
│   ├── public/                        # Static files
│   │   ├── favicon.ico                # Site favicon
│   │   ├── images/                    # Static images
│   │   └── fonts/                     # Font files
│   ├── src/                           # Frontend source code
│   │   ├── components/                # React components
│   │   ├── contexts/                  # React contexts
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── lib/                       # Utility functions
│   │   ├── pages/                     # Page components
│   │   └── services/                  # API services
│   ├── index.html                     # Entry HTML file
│   ├── vite.config.ts                 # Vite configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── tailwind.config.ts             # Tailwind CSS configuration
│   └── postcss.config.js              # PostCSS configuration
│
├── server/                            # Backend code
│   ├── middleware/                    # Express middleware
│   │   ├── auth-middleware.ts         # Authentication middleware
│   │   ├── cache-middleware.ts        # Caching middleware
│   │   └── error-handler.ts           # Error handling middleware
│   ├── routes/                        # API routes
│   │   ├── auth-routes.ts             # Authentication routes
│   │   ├── user-routes.ts             # User management routes
│   │   ├── video-routes.ts            # Video upload/processing routes
│   │   ├── skill-tree-routes.ts       # Skill tree routes
│   │   ├── health-routes.ts           # Health check endpoints
│   │   └── ...                        # Other route files
│   ├── services/                      # Business logic
│   │   ├── auth-service.ts            # Authentication service
│   │   ├── user-service.ts            # User management service
│   │   ├── video-service.ts           # Video processing service
│   │   ├── email-service.ts           # Email sending service
│   │   ├── transfer-portal-service.ts # Transfer portal service
│   │   └── ...                        # Other service files
│   ├── types/                         # TypeScript type definitions
│   ├── utils/                         # Utility functions
│   ├── db.ts                          # Database connection
│   ├── storage.ts                     # Storage interface
│   ├── auth.ts                        # Authentication setup
│   ├── routes.ts                      # Route registration
│   ├── vite.ts                        # Vite integration
│   └── index.ts                       # Main server entry point
│
├── shared/                            # Shared code between client and server
│   ├── schema.ts                      # Database schema definitions
│   ├── types.ts                       # Shared type definitions
│   └── validation.ts                  # Shared validation rules
│
├── uploads/                           # File uploads directory
│   ├── videos/                        # Uploaded videos
│   ├── images/                        # Uploaded images
│   ├── highlights/                    # Generated highlight clips
│   └── temp/                          # Temporary files
│
├── public/                            # Static files served directly
│   ├── assets/                        # Static assets
│   ├── docs/                          # Documentation files
│   └── landing/                       # Landing page files
│
├── logs/                              # Application logs
│   ├── access.log                     # Nginx access logs
│   ├── error.log                      # Nginx error logs
│   ├── app.log                        # Application logs
│   └── pm2/                           # PM2 process logs
│
├── api_locker/                        # Secure API key storage
│   └── api_keys.json                  # API keys file (restricted access)
│
├── migrations/                        # Database migration files
│
├── node_modules/                      # Node.js dependencies (created during deployment)
│
├── .env                               # Environment variables
├── .env.production                    # Production environment template
├── package.json                       # Node.js package configuration
├── package-lock.json                  # Dependency lock file
├── tsconfig.json                      # TypeScript configuration
├── drizzle.config.ts                  # Drizzle ORM configuration
├── ecosystem.config.js                # PM2 configuration
└── deploy.sh                          # Deployment script
```

## Key Directories to Create Manually

If you're setting up the directory structure manually, ensure these critical directories exist:

```bash
# Create main application directory
mkdir -p /var/www/go4itsports

# Create essential directories
mkdir -p /var/www/go4itsports/{client,server,shared,public,uploads,logs,api_locker,migrations}

# Create client subdirectories
mkdir -p /var/www/go4itsports/client/{dist,public,src}

# Create server subdirectories
mkdir -p /var/www/go4itsports/server/{middleware,routes,services,types,utils}

# Create upload subdirectories
mkdir -p /var/www/go4itsports/uploads/{videos,images,highlights,temp}

# Create log directories
mkdir -p /var/www/go4itsports/logs/pm2

# Set proper permissions
chmod 755 /var/www/go4itsports
chmod 700 /var/www/go4itsports/api_locker
chmod -R 755 /var/www/go4itsports/public
chmod -R 755 /var/www/go4itsports/uploads
```

## Nginx Configuration Directory

The Nginx configuration will be stored in the system directory:

```
/etc/nginx/sites-available/go4itsports  # Nginx site configuration
/etc/nginx/sites-enabled/go4itsports    # Symbolic link to the configuration
```

## SSL Certificate Location

Let's Encrypt will store SSL certificates in:

```
/etc/letsencrypt/live/go4itsports.org/  # SSL certificates
```

## Database Backup Directory

Database backups will be stored in:

```
/var/backups/go4itsports/  # PostgreSQL database backups
```