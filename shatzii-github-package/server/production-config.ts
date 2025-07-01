/**
 * Production Configuration Manager
 * Optimizes settings for production deployment
 */

export interface ProductionConfig {
  database: {
    maxConnections: number;
    idleTimeout: number;
    acquireTimeout: number;
    ssl: boolean;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  api: {
    rateLimit: number;
    timeout: number;
    cors: string[];
  };
  ai: {
    ollamaUrl: string;
    maxConcurrentRequests: number;
    timeout: number;
    fallbackEnabled: boolean;
  };
  monitoring: {
    enabled: boolean;
    metricsInterval: number;
    logLevel: string;
  };
}

export const getProductionConfig = (): ProductionConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    database: {
      maxConnections: isProduction ? 20 : 5,
      idleTimeout: 30000,
      acquireTimeout: 60000,
      ssl: isProduction
    },
    cache: {
      enabled: true,
      ttl: 300, // 5 minutes
      maxSize: 1000
    },
    api: {
      rateLimit: isProduction ? 100 : 1000, // requests per minute
      timeout: 30000,
      cors: isProduction ? [process.env.FRONTEND_URL || 'https://shatzii.com'] : ['*']
    },
    ai: {
      ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
      maxConcurrentRequests: 5,
      timeout: 60000,
      fallbackEnabled: true
    },
    monitoring: {
      enabled: isProduction,
      metricsInterval: 60000, // 1 minute
      logLevel: isProduction ? 'info' : 'debug'
    }
  };
};