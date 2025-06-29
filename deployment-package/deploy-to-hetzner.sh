#!/bin/bash
# Go4It Sports Deployment Script for Hetzner Server (188.245.209.124)
# This script prepares the deployment package with engine integration

# Create deployment directory
mkdir -p deployment
rm -rf deployment/*

# Copy platform files
echo "Copying main platform files..."
cp -r client deployment/
cp -r server deployment/
cp -r shared deployment/
cp -r public deployment/
cp package.json package-lock.json tsconfig.json deployment/
cp .env.production deployment/.env

# Create engine integration directory
mkdir -p deployment/server/integrations

# Create Go4It Engine integration file
echo "Adding engine integration..."
cat > deployment/server/integrations/go4it-engine.ts << 'EOF'
/**
 * go4it-engine.ts
 * Go4It Engine Integration Module
 * Version: 2.0.0
 * 
 * This integration module enables seamless communication between the Go4It Engine 
 * and the Go4It Sports platform, connecting all critical features.
 */

import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';

// Type definitions for better code completion
export type SubscriptionTier = 'scout' | 'mvp' | 'allStar';
export type ProcessingType = 'sync' | 'async';
export type StarPathAccessLevel = 'basic' | 'standard' | 'premium';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface FeatureConfig {
  endpoint: string;
  [key: string]: any;
}

export interface GarAnalysisConfig extends FeatureConfig {
  responseFormat: 'json';
  processingType: ProcessingType;
  webhookEnabled: boolean;
  cacheTime: number;
}

export interface StarPathConfig extends FeatureConfig {
  environments: string[];
  xpSystem: boolean;
  badgeSystem: boolean;
  missionSystem: boolean;
  achievementTracking: boolean;
  visualizationApi: string;
}

export interface MediaProcessingConfig extends FeatureConfig {
  supportedFormats: string[];
  maxFileSize: number;
  highlightGeneration: boolean;
  performanceExtraction: boolean;
  bodyTracking: boolean;
  sportSpecificMetrics: boolean;
}

export interface SubscriptionConfig {
  garAnalysisLimit: number | 'unlimited';
  videoLimit: number | 'unlimited';
  starPathAccess: StarPathAccessLevel;
  mediaProcessingOptions: string[];
  academicFeatures: string[];
  messagingFeatures: string[];
}

export interface SecurityConfig {
  jwtSecret?: string;
  apiKey?: string;
  rateLimiting: boolean;
  ipWhitelist: string[];
  encryptPayloads: boolean;
}

export interface Go4ItEngineConfig {
  apiEndpoint: string;
  apiVersion: string;
  authType: 'jwt' | 'apiKey';
  retryAttempts: number;
  timeout: number;
  featureConnections: {
    garAnalysis: GarAnalysisConfig;
    starPath: StarPathConfig;
    mediaProcessing: MediaProcessingConfig;
    academics: FeatureConfig;
    combineEvents: FeatureConfig;
    recommendations: FeatureConfig;
    messaging: FeatureConfig;
    aiCoaching: FeatureConfig;
  };
  subscriptionTiers: {
    scout: SubscriptionConfig;
    mvp: SubscriptionConfig;
    allStar: SubscriptionConfig;
  };
  security: SecurityConfig;
  performance: {
    caching: boolean;
    compressionEnabled: boolean;
    batchProcessing: boolean;
    workerThreads: boolean;
    maxConcurrentJobs: number;
  };
  extensions: {
    pluginSupport: boolean;
    customMetricsEnabled: boolean;
    webhookRegistration: boolean;
    eventBroadcasting: boolean;
  };
  monitoring: {
    errorTracking: boolean;
    performanceMetrics: boolean;
    usageStatistics: boolean;
    alertingEnabled: boolean;
    logLevel: LogLevel;
  };
}

// Default configuration
export const GO4IT_ENGINE_CONFIG: Go4ItEngineConfig = {
  apiEndpoint: process.env.GO4IT_ENGINE_API || 'http://localhost:3001/api',
  apiVersion: 'v2',
  authType: 'jwt',
  retryAttempts: 3,
  timeout: 30000, // 30 seconds
  
  featureConnections: {
    garAnalysis: {
      endpoint: '/analysis/gar',
      responseFormat: 'json',
      processingType: 'async',
      webhookEnabled: true,
      cacheTime: 3600 // 1 hour cache
    },
    
    starPath: {
      endpoint: '/progression/starpath',
      environments: ['field', 'weight_room', 'locker_room'],
      xpSystem: true,
      badgeSystem: true,
      missionSystem: true,
      achievementTracking: true,
      visualizationApi: '/progression/visualize'
    },
    
    mediaProcessing: {
      endpoint: '/media/process',
      supportedFormats: ['mp4', 'mov', 'avi', 'webm'],
      maxFileSize: 2048, // MB
      highlightGeneration: true,
      performanceExtraction: true,
      bodyTracking: true,
      sportSpecificMetrics: true
    },
    
    academics: {
      endpoint: '/academics',
      gpaTracking: true,
      ncaaEligibility: true,
      courseCatalog: true,
      attendanceMonitoring: true,
      testScoreTracking: true
    },
    
    combineEvents: {
      endpoint: '/events/combine',
      registrationProcessing: true,
      resultTracking: true,
      comparativeAnalysis: true,
      recruitingInsights: true
    },
    
    recommendations: {
      endpoint: '/recommendations',
      trainingPlan: true,
      skillDevelopment: true,
      collegeMatching: true,
      performanceImprovement: true
    },
    
    messaging: {
      endpoint: '/messaging',
      sentimentAnalysis: true,
      recruitingDetection: true,
      complianceChecking: true,
      prioritization: true
    },
    
    aiCoaching: {
      endpoint: '/coaching',
      personalizedFeedback: true,
      techniqueAnalysis: true,
      adaptiveDifficulty: true,
      performanceForecast: true
    }
  },
  
  subscriptionTiers: {
    scout: {
      garAnalysisLimit: 1,
      videoLimit: 1,
      starPathAccess: 'basic',
      mediaProcessingOptions: ['basic_analysis'],
      academicFeatures: ['gpa_tracking'],
      messagingFeatures: ['basic']
    },
    mvp: {
      garAnalysisLimit: 10,
      videoLimit: 5,
      starPathAccess: 'standard',
      mediaProcessingOptions: ['basic_analysis', 'highlight_generation'],
      academicFeatures: ['gpa_tracking', 'ncaa_eligibility'],
      messagingFeatures: ['basic', 'priority']
    },
    allStar: {
      garAnalysisLimit: 'unlimited',
      videoLimit: 'unlimited',
      starPathAccess: 'premium',
      mediaProcessingOptions: ['all'],
      academicFeatures: ['all'],
      messagingFeatures: ['all']
    }
  },
  
  security: {
    jwtSecret: process.env.GO4IT_ENGINE_JWT_SECRET,
    apiKey: process.env.GO4IT_ENGINE_API_KEY,
    rateLimiting: true,
    ipWhitelist: process.env.GO4IT_ENGINE_IP_WHITELIST?.split(',') || [],
    encryptPayloads: true
  },
  
  performance: {
    caching: true,
    compressionEnabled: true,
    batchProcessing: true,
    workerThreads: true,
    maxConcurrentJobs: 10
  },
  
  extensions: {
    pluginSupport: true,
    customMetricsEnabled: true,
    webhookRegistration: true,
    eventBroadcasting: true
  },
  
  monitoring: {
    errorTracking: true,
    performanceMetrics: true,
    usageStatistics: true,
    alertingEnabled: true,
    logLevel: 'info'
  }
};

/**
 * Validate API connection to Go4It Engine
 */
async function validateApiConnection(config: Go4ItEngineConfig): Promise<boolean> {
  try {
    const response = await axios.get(`${config.apiEndpoint}/health`, {
      timeout: config.timeout,
      headers: getAuthHeaders(config)
    });
    return response.status === 200;
  } catch (error) {
    console.error('Failed to connect to Go4It Engine:', error);
    return false;
  }
}

/**
 * Get authentication headers based on config
 */
function getAuthHeaders(config: Go4ItEngineConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Version': config.apiVersion
  };

  if (config.authType === 'jwt' && config.security.jwtSecret) {
    const token = jwt.sign({ timestamp: Date.now() }, config.security.jwtSecret as string, { expiresIn: '1h' });
    headers['Authorization'] = `Bearer ${token}`;
  } else if (config.authType === 'apiKey' && config.security.apiKey) {
    headers['X-API-Key'] = config.security.apiKey;
  }

  return headers;
}

/**
 * Create HTTP client with interceptors for auth, retries, etc.
 */
function createHttpClient(config: Go4ItEngineConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.apiEndpoint,
    timeout: config.timeout,
    headers: getAuthHeaders(config)
  });

  // Request interceptor
  client.interceptors.request.use((reqConfig) => {
    // Refresh auth headers if needed
    reqConfig.headers = { ...reqConfig.headers, ...getAuthHeaders(config) };
    return reqConfig;
  });

  // Response interceptor for retries
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // Refresh token logic would go here if needed
        return client(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export interface Go4ItEngineClient {
  config: Go4ItEngineConfig;
  httpClient: AxiosInstance;
  analyze: (data: any, options?: any) => Promise<any>;
  processMedia: (mediaData: any, options?: any) => Promise<any>;
  updateStarPath: (userId: number, progressData: any) => Promise<any>;
  getAcademics: (userId: number) => Promise<any>;
  getRecommendations: (userId: number, context?: any) => Promise<any>;
  getCoachingFeedback: (userId: number, performanceData: any) => Promise<any>;
  validateSubscriptionAccess: (userId: number, feature: string) => Promise<boolean>;
  registerWebhook: (event: string, callbackUrl: string) => Promise<any>;
  extendWithPlugin: (pluginId: string, pluginConfig: any) => Promise<any>;
}

/**
 * Initialize the Go4It Engine integration
 */
export async function initializeGo4ItEngine(options: Partial<Go4ItEngineConfig> = {}): Promise<Go4ItEngineClient> {
  const config = { ...GO4IT_ENGINE_CONFIG, ...options } as Go4ItEngineConfig;
  
  // Validate API connection
  const isConnected = await validateApiConnection(config);
  if (!isConnected) {
    console.warn('Warning: Unable to connect to Go4It Engine. Some features may not work.');
  }
  
  // Create HTTP client
  const httpClient = createHttpClient(config);
  
  // Feature module implementations
  const garAnalysis = {
    process: async (data: any, options: any = {}) => {
      const endpoint = `${config.featureConnections.garAnalysis.endpoint}`;
      const response = await httpClient.post(endpoint, {
        data,
        options: {
          ...options,
          processingType: config.featureConnections.garAnalysis.processingType
        }
      });
      return response.data;
    }
  };
  
  const mediaProcessing = {
    process: async (mediaData: any, options: any = {}) => {
      const endpoint = `${config.featureConnections.mediaProcessing.endpoint}`;
      const formData = new FormData();
      
      if (mediaData.file) {
        formData.append('file', mediaData.file);
      } else if (mediaData.url) {
        formData.append('url', mediaData.url);
      }
      
      // Add options to formData
      Object.keys(options).forEach(key => {
        formData.append(key, options[key].toString());
      });
      
      const response = await httpClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    }
  };
  
  const starPath = {
    update: async (userId: number, progressData: any) => {
      const endpoint = `${config.featureConnections.starPath.endpoint}/${userId}`;
      const response = await httpClient.post(endpoint, progressData);
      return response.data;
    },
    
    getVisualization: async (userId: number, options: any = {}) => {
      const endpoint = `${config.featureConnections.starPath.visualizationApi}/${userId}`;
      const response = await httpClient.get(endpoint, { params: options });
      return response.data;
    }
  };
  
  const academics = {
    getUserData: async (userId: number) => {
      const endpoint = `${config.featureConnections.academics.endpoint}/${userId}`;
      const response = await httpClient.get(endpoint);
      return response.data;
    }
  };
  
  const recommendations = {
    get: async (userId: number, context: any = {}) => {
      const endpoint = `${config.featureConnections.recommendations.endpoint}/${userId}`;
      const response = await httpClient.get(endpoint, { params: context });
      return response.data;
    }
  };
  
  const aiCoaching = {
    getFeedback: async (userId: number, performanceData: any) => {
      const endpoint = `${config.featureConnections.aiCoaching.endpoint}/${userId}/feedback`;
      const response = await httpClient.post(endpoint, performanceData);
      return response.data;
    }
  };
  
  // Webhook system
  const webhooks = {
    register: async (event: string, callbackUrl: string) => {
      const response = await httpClient.post('/webhooks/register', {
        event,
        callbackUrl
      });
      return response.data;
    },
    
    unregister: async (webhookId: string) => {
      const response = await httpClient.delete(`/webhooks/${webhookId}`);
      return response.data;
    }
  };
  
  // Access validation
  const validateAccess = async (userId: number, feature: string): Promise<boolean> => {
    try {
      const response = await httpClient.post('/access/validate', {
        userId,
        feature
      });
      return response.data.hasAccess;
    } catch (error) {
      console.error('Failed to validate access:', error);
      return false;
    }
  };
  
  // Plugin system
  const registerPlugin = async (pluginId: string, pluginConfig: any) => {
    if (!config.extensions.pluginSupport) {
      throw new Error('Plugin support is not enabled in configuration');
    }
    
    const response = await httpClient.post('/plugins/register', {
      pluginId,
      config: pluginConfig
    });
    
    return response.data;
  };
  
  // Return fully configured client
  return {
    config,
    httpClient,
    
    // Main methods for platform integration
    analyze: garAnalysis.process,
    processMedia: mediaProcessing.process,
    updateStarPath: starPath.update,
    getAcademics: academics.getUserData,
    getRecommendations: recommendations.get,
    getCoachingFeedback: aiCoaching.getFeedback,
    
    // Utility methods
    validateSubscriptionAccess: validateAccess,
    registerWebhook: webhooks.register,
    extendWithPlugin: registerPlugin
  };
}

// Export the module
export default {
  initializeGo4ItEngine,
  GO4IT_ENGINE_CONFIG
};
EOF

# Create engine service connector
echo "Creating engine connector service..."
cat > deployment/server/services/engine-connector.ts << 'EOF'
/**
 * Engine Connector Service
 * Provides a centralized service for accessing Go4It Engine functionality
 */

import { initializeGo4ItEngine, Go4ItEngineClient } from '../integrations/go4it-engine';
import { logger } from '../utils/logger';

let engineClient: Go4ItEngineClient | null = null;

/**
 * Initialize the engine connection
 */
export async function initializeEngine(): Promise<void> {
  try {
    engineClient = await initializeGo4ItEngine({
      apiEndpoint: process.env.GO4IT_ENGINE_API || 'http://localhost:3001/api',
      authType: process.env.GO4IT_ENGINE_AUTH_TYPE as 'jwt' | 'apiKey' || 'jwt',
    });
    
    logger.info('Go4It Engine initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Go4It Engine:', error);
    // Don't throw, allow the application to start without engine
  }
}

/**
 * Get the initialized engine client
 */
export function getEngineClient(): Go4ItEngineClient {
  if (!engineClient) {
    throw new Error('Engine client not initialized. Call initializeEngine() first.');
  }
  return engineClient;
}

/**
 * Check if the engine is connected
 */
export async function isEngineConnected(): Promise<boolean> {
  if (!engineClient) return false;
  
  try {
    // Simple ping to check connection
    await engineClient.httpClient.get('/health');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get GAR analysis for an athlete
 */
export async function getGarAnalysis(athleteId: number, videoId: number, options: any = {}): Promise<any> {
  const client = getEngineClient();
  return client.analyze({
    athleteId,
    videoId,
    ...options
  });
}

/**
 * Process a video for analysis
 */
export async function processVideo(videoData: any, options: any = {}): Promise<any> {
  const client = getEngineClient();
  return client.processMedia(videoData, options);
}

/**
 * Update athlete StarPath progression
 */
export async function updateStarPath(userId: number, progressData: any): Promise<any> {
  const client = getEngineClient();
  return client.updateStarPath(userId, progressData);
}

/**
 * Get academic data for a user
 */
export async function getAcademicData(userId: number): Promise<any> {
  const client = getEngineClient();
  return client.getAcademics(userId);
}

/**
 * Get personalized recommendations for an athlete
 */
export async function getRecommendations(userId: number, context: any = {}): Promise<any> {
  const client = getEngineClient();
  return client.getRecommendations(userId, context);
}

/**
 * Get AI coaching feedback
 */
export async function getCoachingFeedback(userId: number, performanceData: any): Promise<any> {
  const client = getEngineClient();
  return client.getCoachingFeedback(userId, performanceData);
}

/**
 * Check if a user has access to a feature based on subscription
 */
export async function checkFeatureAccess(userId: number, feature: string): Promise<boolean> {
  try {
    const client = getEngineClient();
    return client.validateSubscriptionAccess(userId, feature);
  } catch (error) {
    // Default to no access on error
    logger.error('Error checking feature access:', error);
    return false;
  }
}
EOF

# Create server initialization integration
echo "Updating server initialization..."
cat > deployment/server/routes.ts << 'EOF'
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { setupAuth } from "./auth";
import { setupApiRoutes } from "./routes/api-routes";
import { setupAdminRoutes } from "./routes/admin-routes";
import { setupWebhookRoutes } from "./routes/webhook-routes";
import { initializeEngine } from "./services/engine-connector";
import { logger } from "./utils/logger";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Go4It Engine connection
  await initializeEngine().catch(err => {
    logger.warn('Engine initialization failed, continuing with limited functionality', err);
  });

  // sets up authentication
  setupAuth(app);

  // API Routes
  setupApiRoutes(app);

  // Admin Routes
  setupAdminRoutes(app);

  // Webhook Routes
  setupWebhookRoutes(app);

  const httpServer = createServer(app);

  // WebSocket Server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    logger.debug('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        // Handle message based on type
        logger.debug('Received message:', parsedMessage);
      } catch (error) {
        logger.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      logger.debug('WebSocket client disconnected');
    });
  });

  return httpServer;
}
EOF

# Create Nginx configuration
echo "Creating Nginx configuration..."
cat > deployment/nginx.conf << 'EOF'
# Go4It Sports Nginx Configuration
# For server: 188.245.209.124
# Domain: go4itsports.org

user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Logging Settings
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Caching settings for static assets
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=24h max_size=1g;

    # Rate limiting settings
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Main Server Configuration
    server {
        listen 80;
        server_name go4itsports.org www.go4itsports.org;
        
        # Redirect HTTP to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name go4itsports.org www.go4itsports.org;
        
        # SSL Certificate
        ssl_certificate /etc/letsencrypt/live/go4itsports.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/go4itsports.org/privkey.pem;
        
        # Security headers
        add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-XSS-Protection "1; mode=block";
        
        # Root directory
        root /var/www/go4itsports/public;
        
        # Main application
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # WebSocket connections
        location /ws {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_read_timeout 86400; # 24 hours
        }
        
        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Static assets with caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|eot)$ {
            expires 7d;
            add_header Cache-Control "public, max-age=604800, immutable";
            try_files $uri $uri/ @proxy;
        }
        
        location @proxy {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Handle Go4It Engine API proxy
        location /engine-api/ {
            proxy_pass http://localhost:3001/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Uploads directory with proper permissions
        location /uploads/ {
            alias /var/www/go4itsports/uploads/;
            expires 30d;
            add_header Cache-Control "public, max-age=2592000";
        }
        
        # Error pages
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
    }
}
EOF

# Create systemd service files
echo "Creating systemd service files..."

# Main platform service
cat > deployment/go4itsports.service << 'EOF'
[Unit]
Description=Go4It Sports Platform
After=network.target postgresql.service

[Service]
User=go4it
Group=go4it
WorkingDirectory=/var/www/go4itsports
ExecStart=/usr/bin/npm run start:production
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=go4itsports
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Engine service
cat > deployment/go4it-engine.service << 'EOF'
[Unit]
Description=Go4It Engine Service
After=network.target postgresql.service

[Service]
User=go4it
Group=go4it
WorkingDirectory=/var/www/go4it-engine
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=go4it-engine
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Create deployment script for the server
echo "Creating server deployment script..."
cat > deployment/deploy.sh << 'EOF'
#!/bin/bash
# Go4It Sports Server Deployment Script
# For server: 188.245.209.124

# Exit on error
set -e

# Log function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   log "This script must be run as root" 
   exit 1
fi

# Variables
APP_DIR="/var/www/go4itsports"
ENGINE_DIR="/var/www/go4it-engine"
BACKUP_DIR="/var/backups/go4itsports"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
APP_USER="go4it"
APP_GROUP="go4it"
DOMAIN="go4itsports.org"

# Create necessary directories
log "Creating directories..."
mkdir -p $APP_DIR
mkdir -p $ENGINE_DIR
mkdir -p $BACKUP_DIR
mkdir -p $APP_DIR/uploads
mkdir -p $APP_DIR/logs

# Create user if not exists
if ! id "$APP_USER" &>/dev/null; then
  log "Creating user $APP_USER..."
  useradd -m -s /bin/bash $APP_USER
fi

# Install required packages
log "Installing required packages..."
apt-get update
apt-get install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx nodejs npm

# Backup existing application if it exists
if [ -d "$APP_DIR/server" ]; then
  log "Backing up existing application..."
  tar -czf $BACKUP_DIR/go4itsports-$TIMESTAMP.tar.gz -C $APP_DIR .
fi

# Deploy new application files
log "Deploying new application files..."
cp -r . $APP_DIR

# Set proper permissions
log "Setting permissions..."
chown -R $APP_USER:$APP_GROUP $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/uploads

# Setup Nginx
log "Setting up Nginx..."
cp $APP_DIR/nginx.conf /etc/nginx/nginx.conf

# Get SSL certificate if needed
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  log "Obtaining SSL certificate..."
  certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# Install Node.js dependencies
log "Installing Node.js dependencies..."
cd $APP_DIR
sudo -u $APP_USER npm install
sudo -u $APP_USER npm run build

# Setup database if needed
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw go4itsports; then
  log "Setting up database..."
  sudo -u postgres createdb go4itsports
  sudo -u postgres psql -c "CREATE USER go4it WITH PASSWORD 'password';"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4itsports TO go4it;"
  
  # Run database migrations
  cd $APP_DIR
  sudo -u $APP_USER npm run db:push
fi

# Setup systemd services
log "Setting up systemd services..."
cp $APP_DIR/go4itsports.service /etc/systemd/system/
cp $APP_DIR/go4it-engine.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable go4itsports
systemctl enable go4it-engine

# Start/restart services
log "Starting services..."
systemctl restart nginx
systemctl restart go4itsports
systemctl restart go4it-engine

log "Deployment completed successfully!"
log "Your application is now running at https://$DOMAIN"
EOF

# Create production environment file
echo "Creating environment file..."
cat > deployment/.env << 'EOF'
# Go4It Sports Production Environment Variables

# Server configuration
NODE_ENV=production
PORT=3000

# Database connection
DATABASE_URL=postgresql://go4it:password@localhost:5432/go4itsports

# Authentication
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Go4It Engine configuration
GO4IT_ENGINE_API=http://localhost:3001/api
GO4IT_ENGINE_JWT_SECRET=your_engine_jwt_secret_here
GO4IT_ENGINE_API_KEY=your_engine_api_key_here
GO4IT_ENGINE_AUTH_TYPE=jwt

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Twilio configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Storage paths
UPLOAD_DIR=/var/www/go4itsports/uploads
LOG_DIR=/var/www/go4itsports/logs

# Domain configuration
DOMAIN=go4itsports.org

# Subscription plan IDs
STRIPE_MVP_PLAN_ID=plan_mvp
STRIPE_ALLSTAR_PLAN_ID=plan_allstar
EOF

# Make scripts executable
chmod +x deployment/deploy.sh

# Create zip file
echo "Creating deployment package..."
cd deployment
zip -r ../go4it-deployment-with-engine.zip .

echo "Deployment package created: go4it-deployment-with-engine.zip"
echo "To deploy to server 188.245.209.124:"
echo "1. scp go4it-deployment-with-engine.zip user@188.245.209.124:/tmp/"
echo "2. ssh user@188.245.209.124"
echo "3. cd /tmp && unzip go4it-deployment-with-engine.zip && sudo ./deploy.sh"