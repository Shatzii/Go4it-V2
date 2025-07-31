/**
 * Security Initialization Module
 * 
 * Runs comprehensive security checks and credential validation on server startup
 */

import { initializeSecurityChecks, validateCredentialSecurity, isSecureEnvironment } from '../security/credential-manager';
import { validateEnvironment } from '../../lib/env-validation';

/**
 * Initialize all security systems on server startup
 */
export async function initializeSecurity(): Promise<void> {
  console.log('🚀 Initializing Sports Platform Security Systems...\n');
  
  try {
    // Step 1: Validate environment variables
    console.log('📋 Step 1: Environment Variable Validation');
    validateEnvironment();
    console.log('');
    
    // Step 2: Run credential security checks
    console.log('🔐 Step 2: Credential Security Validation');
    initializeSecurityChecks();
    console.log('');
    
    // Step 3: Check overall security status
    console.log('🛡️ Step 3: Overall Security Assessment');
    const isSecure = isSecureEnvironment();
    
    if (isSecure) {
      console.log('✅ Security initialization complete - Platform ready');
    } else {
      console.log('⚠️ Security initialization complete with warnings');
      
      if (process.env.NODE_ENV === 'production') {
        console.log('❌ Production environment requires all security checks to pass');
        process.exit(1);
      } else {
        console.log('🚧 Development environment - continuing with warnings');
      }
    }
    
    // Step 4: Log security summary
    logSecuritySummary();
    
  } catch (error) {
    console.error('❌ Security initialization failed:', error);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('💥 Production startup aborted due to security failure');
      process.exit(1);
    } else {
      console.warn('⚠️ Development mode - continuing despite security errors');
    }
  }
}

/**
 * Log security configuration summary
 */
function logSecuritySummary(): void {
  console.log('\n📊 Security Configuration Summary:');
  console.log('─'.repeat(50));
  
  // Environment
  const env = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${env}`);
  
  // Database
  const hasDbUrl = !!process.env.DATABASE_URL;
  const useMemory = process.env.USE_MEMORY_STORAGE === 'true';
  console.log(`Database: ${hasDbUrl ? '✅ Configured' : '❌ Missing'} ${useMemory ? '(Memory Storage)' : '(PostgreSQL)'}`);
  
  // AI Services
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  console.log(`AI Services: Anthropic ${hasAnthropic ? '✅' : '❌'}, OpenAI ${hasOpenAI ? '✅' : '❌'}`);
  
  // Authentication
  const hasJwtSecret = !!process.env.JWT_SECRET;
  const jwtLength = process.env.JWT_SECRET?.length || 0;
  console.log(`JWT Secret: ${hasJwtSecret ? '✅' : '❌'} (${jwtLength} chars)`);
  
  // Admin Credentials
  const hasCustomAdminPwd = process.env.MASTER_ADMIN_PASSWORD !== 'CHANGE_ME_IN_PRODUCTION';
  console.log(`Admin Security: ${hasCustomAdminPwd ? '✅ Custom' : '⚠️ Default'}`);
  
  // External Services
  const hasSmtp = !!process.env.SMTP_HOST;
  const hasAws = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  console.log(`External APIs: SMTP ${hasSmtp ? '✅' : '❌'}, AWS ${hasAws ? '✅' : '❌'}, Stripe ${hasStripe ? '✅' : '❌'}`);
  
  console.log('─'.repeat(50));
  console.log('');
}

/**
 * Generate development environment template
 */
export function generateDevEnvironment(): void {
  console.log('🛠️ Generating development environment configuration...');
  
  const { generateSecureCredential } = require('../security/credential-manager');
  
  const devEnv = {
    // Core required variables
    DATABASE_URL: 'postgresql://postgres:SECURE_PASSWORD@localhost:5432/sports_platform_dev',
    JWT_SECRET: generateSecureCredential('key', 64),
    NODE_ENV: 'development',
    
    // AI Services (user will need to provide these)
    ANTHROPIC_API_KEY: 'PROVIDE_YOUR_ANTHROPIC_API_KEY',
    OPENAI_API_KEY: 'PROVIDE_YOUR_OPENAI_API_KEY',
    
    // Admin credentials for development
    MASTER_ADMIN_USERNAME: 'spacepharaoh',
    MASTER_ADMIN_PASSWORD: generateSecureCredential('password', 16),
    
    // Demo user password
    DEMO_USER_PASSWORD: generateSecureCredential('password', 12),
    
    // Development settings
    DEBUG_MODE: 'true',
    USE_MEMORY_STORAGE: 'false',
    ENABLE_AI_FEATURES: 'true',
    ENABLE_VIDEO_ANALYSIS: 'true',
    ENABLE_RECRUITING_TOOLS: 'true',
    ENABLE_WELLNESS_TRACKING: 'true'
  };
  
  console.log('\n📝 Development Environment Variables:');
  console.log('─'.repeat(60));
  Object.entries(devEnv).forEach(([key, value]) => {
    if (key.includes('SECRET') || key.includes('PASSWORD')) {
      console.log(`${key}=${value}`);
    } else {
      console.log(`${key}=${value}`);
    }
  });
  console.log('─'.repeat(60));
  console.log('\n💡 Copy these to your .env file to get started with development');
}