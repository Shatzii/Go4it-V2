/**
 * Credential Management System
 * 
 * Centralized secure credential management for all platform services
 */

import { getEnvVar, getAuthConfig, getAIConfig, getDatabaseConfig } from '../../lib/env-validation';
import * as crypto from 'crypto';

interface ServiceCredentials {
  ai: {
    anthropic?: string;
    openai?: string;
  };
  database: {
    url: string;
    useMemory: boolean;
  };
  auth: {
    jwtSecret: string;
    sessionSecret: string;
    bcryptRounds: number;
  };
  admin: {
    masterUsername: string;
    masterPassword: string;
    schoolAdmins: Record<string, { username: string; password: string }>;
  };
  external: {
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
    };
    aws?: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      bucket: string;
    };
    stripe?: {
      publishableKey: string;
      secretKey: string;
      webhookSecret: string;
    };
  };
}

/**
 * Validate credential security requirements
 */
export function validateCredentialSecurity(): Array<{ service: string; issue: string; severity: 'low' | 'medium' | 'high' | 'critical' }> {
  const issues = [];
  
  // Check JWT secret strength
  const jwtSecret = getEnvVar('JWT_SECRET');
  if (!jwtSecret) {
    issues.push({ service: 'auth', issue: 'JWT_SECRET not configured', severity: 'critical' as const });
  } else if (jwtSecret.length < 32) {
    issues.push({ service: 'auth', issue: 'JWT_SECRET too short (< 32 chars)', severity: 'high' as const });
  } else if (jwtSecret === 'CHANGE_ME_IN_PRODUCTION') {
    issues.push({ service: 'auth', issue: 'JWT_SECRET using default placeholder', severity: 'critical' as const });
  }
  
  // Check admin passwords
  const adminPassword = getEnvVar('MASTER_ADMIN_PASSWORD');
  if (adminPassword === 'CHANGE_ME_IN_PRODUCTION') {
    issues.push({ service: 'admin', issue: 'Admin password using default placeholder', severity: 'critical' as const });
  }
  
  // Check database security
  const dbUrl = getEnvVar('DATABASE_URL');
  if (dbUrl && dbUrl.includes('password')) {
    const url = new URL(dbUrl);
    if (url.password && url.password.length < 8) {
      issues.push({ service: 'database', issue: 'Database password too short', severity: 'high' as const });
    }
  }
  
  // Check for development keys in production
  if (process.env.NODE_ENV === 'production') {
    const devPatterns = ['test', 'dev', 'demo', 'localhost', 'example'];
    
    Object.keys(process.env).forEach(key => {
      const value = process.env[key] || '';
      devPatterns.forEach(pattern => {
        if (value.toLowerCase().includes(pattern) && key.includes('KEY')) {
          issues.push({ 
            service: 'external', 
            issue: `${key} appears to contain development value in production`, 
            severity: 'medium' as const 
          });
        }
      });
    });
  }
  
  return issues;
}

/**
 * Get all service credentials securely
 */
export function getServiceCredentials(): ServiceCredentials {
  const aiConfig = getAIConfig();
  const authConfig = getAuthConfig();
  const dbConfig = getDatabaseConfig();
  
  return {
    ai: {
      anthropic: aiConfig.anthropicApiKey,
      openai: getEnvVar('OPENAI_API_KEY')
    },
    database: {
      url: dbConfig.url,
      useMemory: dbConfig.useMemoryStorage
    },
    auth: {
      jwtSecret: authConfig.jwtSecret,
      sessionSecret: authConfig.sessionSecret,
      bcryptRounds: authConfig.bcryptRounds
    },
    admin: {
      masterUsername: getEnvVar('MASTER_ADMIN_USERNAME', 'spacepharaoh'),
      masterPassword: getEnvVar('MASTER_ADMIN_PASSWORD', 'CHANGE_ME_IN_PRODUCTION'),
      schoolAdmins: {
        superhero: {
          username: getEnvVar('SUPERHERO_ADMIN_USERNAME', 'hero_admin'),
          password: getEnvVar('SUPERHERO_ADMIN_PASSWORD', 'CHANGE_ME_IN_PRODUCTION')
        },
        stage_prep: {
          username: getEnvVar('STAGE_ADMIN_USERNAME', 'stage_admin'),
          password: getEnvVar('STAGE_ADMIN_PASSWORD', 'CHANGE_ME_IN_PRODUCTION')
        },
        law: {
          username: getEnvVar('LAW_ADMIN_USERNAME', 'law_admin'),
          password: getEnvVar('LAW_ADMIN_PASSWORD', 'CHANGE_ME_IN_PRODUCTION')
        },
        language: {
          username: getEnvVar('LANGUAGE_ADMIN_USERNAME', 'language_admin'),
          password: getEnvVar('LANGUAGE_ADMIN_PASSWORD', 'CHANGE_ME_IN_PRODUCTION')
        }
      }
    },
    external: {
      smtp: getEnvVar('SMTP_HOST') ? {
        host: getEnvVar('SMTP_HOST'),
        port: parseInt(getEnvVar('SMTP_PORT', '587')),
        secure: getEnvVar('SMTP_SECURE') === 'true',
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASS')
      } : undefined,
      aws: getEnvVar('AWS_ACCESS_KEY_ID') ? {
        accessKeyId: getEnvVar('AWS_ACCESS_KEY_ID'),
        secretAccessKey: getEnvVar('AWS_SECRET_ACCESS_KEY'),
        region: getEnvVar('AWS_REGION', 'us-east-1'),
        bucket: getEnvVar('AWS_BUCKET_NAME')
      } : undefined,
      stripe: getEnvVar('STRIPE_SECRET_KEY') ? {
        publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY'),
        secretKey: getEnvVar('STRIPE_SECRET_KEY'),
        webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET')
      } : undefined
    }
  };
}

/**
 * Generate secure random credential for development
 */
export function generateSecureCredential(type: 'password' | 'key' | 'secret' = 'key', length: number = 32): string {
  if (type === 'password') {
    // Generate secure password with mixed case, numbers, and symbols
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let result = '';
    
    // Ensure at least one character from each category
    result += lowercase[Math.floor(Math.random() * lowercase.length)];
    result += uppercase[Math.floor(Math.random() * uppercase.length)];
    result += numbers[Math.floor(Math.random() * numbers.length)];
    result += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      result += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the result
    return result.split('').sort(() => Math.random() - 0.5).join('');
  } else {
    // Generate secure key/secret using crypto
    return crypto.randomBytes(length).toString('hex');
  }
}

/**
 * Check if running in secure environment
 */
export function isSecureEnvironment(): boolean {
  const issues = validateCredentialSecurity();
  const criticalIssues = issues.filter(issue => issue.severity === 'critical');
  
  if (criticalIssues.length > 0) {
    console.error('❌ Critical security issues found:');
    criticalIssues.forEach(issue => {
      console.error(`   - ${issue.service}: ${issue.issue}`);
    });
    return false;
  }
  
  return true;
}

/**
 * Initialize security checks on startup
 */
export function initializeSecurityChecks(): void {
  console.log('🔐 Running security credential validation...');
  
  const issues = validateCredentialSecurity();
  
  if (issues.length === 0) {
    console.log('✅ All credential security checks passed');
    return;
  }
  
  // Group issues by severity
  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.severity]) acc[issue.severity] = [];
    acc[issue.severity].push(issue);
    return acc;
  }, {} as Record<string, typeof issues>);
  
  // Report issues
  Object.entries(groupedIssues).forEach(([severity, severityIssues]) => {
    const icon = severity === 'critical' ? '❌' : severity === 'high' ? '⚠️' : 'ℹ️';
    console.log(`${icon} ${severity.toUpperCase()} security issues (${severityIssues.length}):`);
    
    severityIssues.forEach(issue => {
      console.log(`   - ${issue.service}: ${issue.issue}`);
    });
  });
  
  // Fail startup for critical issues in production
  if (process.env.NODE_ENV === 'production' && groupedIssues.critical) {
    throw new Error('Critical security issues prevent production startup');
  }
}