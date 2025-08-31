// Production Configuration and Environment Management

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

// Database Configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://localhost:5432/go4it_sports',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  pool: {
    min: isProduction ? 2 : 1,
    max: isProduction ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  logging: !isProduction,
};

// Security Configuration
export const securityConfig = {
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-in-production',
  bcryptRounds: isProduction ? 12 : 10,
  sessionTimeout: isProduction ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 1 day prod, 7 days dev
  corsOrigins: isProduction
    ? ['https://go4itsports.org', 'https://www.go4itsports.org']
    : ['http://localhost:3000', 'http://localhost:5000'],
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: isProduction ? 100 : 1000,
  },
};

// API Configuration
export const apiConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  timeout: isProduction ? 30000 : 60000,
  retries: isProduction ? 3 : 1,
};

// File Storage Configuration
export const storageConfig = {
  provider: isProduction ? 'aws' : 'local',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME || 'go4it-sports-production',
    region: process.env.AWS_REGION || 'us-east-1',
  },
  local: {
    uploadPath: './uploads',
    maxFileSize: 500 * 1024 * 1024, // 500MB
  },
  allowedFileTypes: [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

// Monitoring Configuration
export const monitoringConfig = {
  sentryDsn: process.env.SENTRY_DSN,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  mixpanelToken: process.env.MIXPANEL_TOKEN,
  logLevel: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  enablePerformanceMonitoring: isProduction,
};

// Cache Configuration
export const cacheConfig = {
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: isProduction ? 3600 : 300, // 1 hour prod, 5 minutes dev
  },
  memory: {
    maxItems: isProduction ? 1000 : 100,
    ttl: isProduction ? 1800 : 60, // 30 minutes prod, 1 minute dev
  },
};

// Email Configuration
export const emailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  from: process.env.EMAIL_FROM || 'noreply@go4itsports.org',
  templates: {
    welcome: 'welcome-email.html',
    passwordReset: 'password-reset.html',
    garResults: 'gar-results.html',
  },
};

// Performance Configuration
export const performanceConfig = {
  compression: isProduction,
  minifyHtml: isProduction,
  optimizeImages: isProduction,
  bundleAnalyzer: process.env.ANALYZE === 'true',
  preloadCriticalAssets: isProduction,
  enableServiceWorker: isProduction,
};

// Feature Flags
export const featureFlags = {
  enableAdvancedAnalytics: true,
  enableSocialLogin: isProduction,
  enablePayments: true,
  enablePushNotifications: isProduction,
  enableOfflineMode: isProduction,
  enableA11yFeatures: true,
  enableBetaFeatures: !isProduction,
};

// URL Configuration
export const urlConfig = {
  baseUrl: isProduction ? 'https://go4itsports.org' : 'http://localhost:5000',
  apiUrl: isProduction ? 'https://api.go4itsports.org' : 'http://localhost:5000/api',
  cdnUrl: isProduction ? 'https://cdn.go4itsports.org' : '',
  websocketUrl: isProduction ? 'wss://ws.go4itsports.org' : 'ws://localhost:5001',
};

// Validation helper
export const validateProductionConfig = () => {
  if (!isProduction) return true;

  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'OPENAI_API_KEY'];

  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables for production: ${missing.join(', ')}`);
  }

  return true;
};

// Export all configurations
export const productionConfig = {
  isProduction,
  isDevelopment,
  isTest,
  database: databaseConfig,
  security: securityConfig,
  api: apiConfig,
  storage: storageConfig,
  monitoring: monitoringConfig,
  cache: cacheConfig,
  email: emailConfig,
  performance: performanceConfig,
  features: featureFlags,
  urls: urlConfig,
  validate: validateProductionConfig,
};
