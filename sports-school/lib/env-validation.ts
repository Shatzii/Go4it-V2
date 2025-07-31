/**
 * Environment Variable Validation System
 * 
 * Centralized validation and management of all environment variables
 * to ensure secure credential management across the platform.
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string;
  USE_MEMORY_STORAGE?: string;
  
  // AI/ML Services
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  
  // Authentication & Security
  JWT_SECRET: string;
  SESSION_SECRET?: string;
  BCRYPT_SALT_ROUNDS?: string;
  
  // Admin Credentials
  MASTER_ADMIN_USERNAME?: string;
  MASTER_ADMIN_PASSWORD?: string;
  SUPERHERO_ADMIN_USERNAME?: string;
  SUPERHERO_ADMIN_PASSWORD?: string;
  STAGE_ADMIN_USERNAME?: string;
  STAGE_ADMIN_PASSWORD?: string;
  LAW_ADMIN_USERNAME?: string;
  LAW_ADMIN_PASSWORD?: string;
  LANGUAGE_ADMIN_USERNAME?: string;
  LANGUAGE_ADMIN_PASSWORD?: string;
  DEMO_USER_PASSWORD?: string;
  
  // Email Services
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  
  // External APIs
  SPORTS_API_KEY?: string;
  RECRUITING_API_KEY?: string;
  VIDEO_PROCESSING_API_KEY?: string;
  
  // Cloud Storage
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_BUCKET_NAME?: string;
  
  // Development
  NODE_ENV?: string;
  API_BASE_URL?: string;
  CLIENT_URL?: string;
  DEBUG_MODE?: string;
  
  // Production
  PRODUCTION_DOMAIN?: string;
  SSL_CERT_PATH?: string;
  SSL_KEY_PATH?: string;
  REDIS_URL?: string;
  
  // Monitoring
  SENTRY_DSN?: string;
  GOOGLE_ANALYTICS_ID?: string;
  NEW_RELIC_LICENSE_KEY?: string;
  
  // Licensing
  LICENSE_VALIDATION_KEY?: string;
  HARDWARE_BINDING_SECRET?: string;
  
  // Feature Flags
  ENABLE_AI_FEATURES?: string;
  ENABLE_VIDEO_ANALYSIS?: string;
  ENABLE_RECRUITING_TOOLS?: string;
  ENABLE_WELLNESS_TRACKING?: string;
  
  // Social Media
  TWITTER_API_KEY?: string;
  TWITTER_API_SECRET?: string;
  INSTAGRAM_API_KEY?: string;
  
  // Payment Processing
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

/**
 * Required environment variables for different environments
 */
const REQUIRED_VARS = {
  development: [
    'DATABASE_URL',
    'JWT_SECRET'
  ],
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'PRODUCTION_DOMAIN'
  ],
  test: [
    'JWT_SECRET'
  ]
};

/**
 * Default values for optional environment variables
 */
const DEFAULT_VALUES = {
  NODE_ENV: 'development',
  USE_MEMORY_STORAGE: 'false',
  BCRYPT_SALT_ROUNDS: '12',
  DEBUG_MODE: 'false',
  API_BASE_URL: 'http://localhost:5000',
  CLIENT_URL: 'http://localhost:5000',
  SMTP_PORT: '587',
  SMTP_SECURE: 'false',
  AWS_REGION: 'us-east-1',
  ENABLE_AI_FEATURES: 'true',
  ENABLE_VIDEO_ANALYSIS: 'true',
  ENABLE_RECRUITING_TOOLS: 'true',
  ENABLE_WELLNESS_TRACKING: 'true'
};

/**
 * Generate a secure random key for development
 */
function generateSecureKey(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate and load environment variables
 */
export function validateEnvironment(): EnvConfig {
  const env = process.env.NODE_ENV || 'development';
  const requiredVars = REQUIRED_VARS[env as keyof typeof REQUIRED_VARS] || REQUIRED_VARS.development;
  
  // Check for required variables
  const missing: string[] = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  // Generate JWT_SECRET if missing in development
  if (missing.includes('JWT_SECRET') && env === 'development') {
    console.warn('⚠️ JWT_SECRET not found, generating secure random key for development');
    process.env.JWT_SECRET = generateSecureKey(64);
    missing.splice(missing.indexOf('JWT_SECRET'), 1);
  }
  
  // Report missing variables
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    
    if (env === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    } else {
      console.warn('⚠️ Continuing with missing variables (development mode)');
    }
  }
  
  // Apply default values
  for (const [key, defaultValue] of Object.entries(DEFAULT_VALUES)) {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  }
  
  // Validate specific formats
  validateDatabaseUrl();
  validateJwtSecret();
  validateNumericEnvVars();
  
  console.log(`✅ Environment validation complete (${env})`);
  return process.env as unknown as EnvConfig;
}

/**
 * Validate DATABASE_URL format
 */
function validateDatabaseUrl(): void {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.warn('⚠️ DATABASE_URL should start with postgresql:// or postgres://');
  }
}

/**
 * Validate JWT_SECRET strength
 */
function validateJwtSecret(): void {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    console.warn('⚠️ JWT_SECRET should be at least 32 characters long for security');
  }
}

/**
 * Validate numeric environment variables
 */
function validateNumericEnvVars(): void {
  const numericVars = ['BCRYPT_SALT_ROUNDS', 'SMTP_PORT'];
  
  for (const varName of numericVars) {
    const value = process.env[varName];
    if (value && isNaN(Number(value))) {
      console.warn(`⚠️ ${varName} should be a valid number, got: ${value}`);
    }
  }
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: keyof EnvConfig, fallback?: string): string {
  return process.env[key] || fallback || '';
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
  const value = process.env[`ENABLE_${feature.toUpperCase()}`];
  return value === 'true';
}

/**
 * Get database configuration
 */
export function getDatabaseConfig() {
  return {
    url: getEnvVar('DATABASE_URL'),
    useMemoryStorage: getEnvVar('USE_MEMORY_STORAGE') === 'true'
  };
}

/**
 * Get AI service configuration
 */
export function getAIConfig() {
  return {
    anthropicApiKey: getEnvVar('ANTHROPIC_API_KEY'),
    openaiApiKey: getEnvVar('OPENAI_API_KEY'),
    enabled: isFeatureEnabled('AI_FEATURES')
  };
}

/**
 * Get authentication configuration
 */
export function getAuthConfig() {
  return {
    jwtSecret: getEnvVar('JWT_SECRET'),
    sessionSecret: getEnvVar('SESSION_SECRET') || getEnvVar('JWT_SECRET'),
    bcryptRounds: parseInt(getEnvVar('BCRYPT_SALT_ROUNDS', '12'))
  };
}

/**
 * Initialize environment on module load
 */
export const env = validateEnvironment() as EnvConfig;