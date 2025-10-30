// Enterprise Logger Module
// Production-ready logging with structured data, multiple levels, and cloud integration

import winston from 'winston';
import { format } from 'winston';

// Enterprise logging configuration
const config = {
  level: process.env.LOG_LEVEL || 'info',
  enableFileLogging: process.env.ENABLE_FILE_LOGGING !== 'false',
  enableConsoleLogging: process.env.ENABLE_CONSOLE_LOGGING !== 'false',
  logRetention: process.env.LOG_RETENTION_DAYS || '30',
  maxFileSize: process.env.MAX_LOG_FILE_SIZE || '20m',
  maxFiles: process.env.MAX_LOG_FILES || '14d',
};

// Custom log format for enterprise readability
const enterpriseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format.json(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const logEntry: any = {
      timestamp,
      level: level.toUpperCase(),
      message,
      service: 'advanced-social-media-engine',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      ...meta,
    };

    // Context fields are added via spread operator above

    return JSON.stringify(logEntry, null, 0);
  })
);

// Console transport for development
const consoleTransport = new winston.transports.Console({
  level: config.level,
  format: format.combine(
    format.colorize(),
    format.simple(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : '';
      return `${timestamp} ${level}: ${message}${metaStr}`;
    })
  ),
});

// File transport for production logging (simplified for deployment)
const fileTransport = new winston.transports.File({
  filename: 'logs/application.log',
  level: config.level,
  format: enterpriseFormat,
  maxsize: 20971520, // 20MB
  maxFiles: 5,
});

// Error-specific file transport
const errorFileTransport = new winston.transports.File({
  filename: 'logs/error.log',
  level: 'error',
  format: enterpriseFormat,
  maxsize: 20971520, // 20MB
  maxFiles: 5,
});

// Create the logger instance
const transports: winston.transport[] = [];

if (config.enableConsoleLogging) {
  transports.push(consoleTransport);
}

if (config.enableFileLogging) {
  transports.push(fileTransport);
  transports.push(errorFileTransport);
}

const winstonLogger = winston.createLogger({
  level: config.level,
  format: enterpriseFormat,
  transports,
  exitOnError: false,
});

// Enterprise logging methods with structured data
export class EnterpriseLogger {
  private static instance: EnterpriseLogger;
  private requestContext: Map<string, any> = new Map();

  static getInstance(): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger();
    }
    return EnterpriseLogger.instance;
  }

  // Set request context for correlation
  setRequestContext(requestId: string, context: any): void {
    this.requestContext.set(requestId, context);
  }

  // Clear request context
  clearRequestContext(requestId: string): void {
    this.requestContext.delete(requestId);
  }

  // Get request context
  getRequestContext(requestId: string): any {
    return this.requestContext.get(requestId);
  }

  // Structured logging methods
  info(message: string, meta?: any): void {
    winstonLogger.info(message, this.enrichMeta(meta));
  }

  warn(message: string, meta?: any): void {
    winstonLogger.warn(message, this.enrichMeta(meta));
  }

  error(message: string, error?: Error, meta?: any): void {
    const enrichedMeta = this.enrichMeta(meta);

    if (error) {
      enrichedMeta.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    winstonLogger.error(message, enrichedMeta);
  }

  debug(message: string, meta?: any): void {
    winstonLogger.debug(message, this.enrichMeta(meta));
  }

  // Performance logging
  performance(operation: string, duration: number, meta?: any): void {
    const enrichedMeta = this.enrichMeta(meta);
    enrichedMeta.operation = operation;
    enrichedMeta.duration = duration;
    enrichedMeta.performance = true;

    winstonLogger.info(`Performance: ${operation}`, enrichedMeta);
  }

  // Security event logging
  security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any): void {
    const enrichedMeta = this.enrichMeta(meta);
    enrichedMeta.security = {
      event,
      severity,
      timestamp: new Date().toISOString(),
    };

    const level = severity === 'critical' ? 'error' : severity === 'high' ? 'warn' : 'info';
    winstonLogger.log(level, `Security: ${event}`, enrichedMeta);
  }

  // Audit logging
  audit(action: string, resource: string, outcome: 'success' | 'failure', meta?: any): void {
    const enrichedMeta = this.enrichMeta(meta);
    enrichedMeta.audit = {
      action,
      resource,
      outcome,
      timestamp: new Date().toISOString(),
    };

    winstonLogger.info(`Audit: ${action} on ${resource}`, enrichedMeta);
  }

  // Business event logging
  business(event: string, category: string, value?: any, meta?: any): void {
    const enrichedMeta = this.enrichMeta(meta);
    enrichedMeta.business = {
      event,
      category,
      value,
      timestamp: new Date().toISOString(),
    };

    winstonLogger.info(`Business: ${event}`, enrichedMeta);
  }

  // Enrich metadata with context
  private enrichMeta(meta?: any): any {
    const enriched = { ...meta };

    // Add hostname and process info
    enriched.hostname = process.env.HOSTNAME || 'unknown';
    enriched.pid = process.pid;

    // Add memory usage
    const memUsage = process.memoryUsage();
    enriched.memory = {
      rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
    };

    return enriched;
  }

  // Log with correlation ID
  withCorrelation(correlationId: string) {
    return {
      info: (message: string, meta?: any) => this.info(message, { ...meta, correlationId }),
      warn: (message: string, meta?: any) => this.warn(message, { ...meta, correlationId }),
      error: (message: string, error?: Error, meta?: any) => this.error(message, error, { ...meta, correlationId }),
      debug: (message: string, meta?: any) => this.debug(message, { ...meta, correlationId }),
      performance: (operation: string, duration: number, meta?: any) => this.performance(operation, duration, { ...meta, correlationId }),
      security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any) => this.security(event, severity, { ...meta, correlationId }),
      audit: (action: string, resource: string, outcome: 'success' | 'failure', meta?: any) => this.audit(action, resource, outcome, { ...meta, correlationId }),
      business: (event: string, category: string, value?: any, meta?: any) => this.business(event, category, value, { ...meta, correlationId }),
    };
  }

  // Flush all pending logs (useful for graceful shutdown)
  async flush(): Promise<void> {
    return new Promise((resolve) => {
      winstonLogger.on('finish', resolve);
      winstonLogger.end();
    });
  }

  // Get logger statistics
  getStats(): any {
    return {
      level: winstonLogger.level,
      transports: transports.length,
      fileLogging: config.enableFileLogging,
      consoleLogging: config.enableConsoleLogging,
    };
  }
}

// Export singleton instance
export const enterpriseLogger = EnterpriseLogger.getInstance();

// Backward compatibility with existing logger interface
export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => enterpriseLogger.info(msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => enterpriseLogger.warn(msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => enterpriseLogger.error(msg, undefined, meta),
};

// Helpers
export const mask = {
  email(e?: string | null) {
    if (!e) return e as any;
    const [user, domain] = String(e).split('@');
    if (!domain) return e;
    const u =
      user.length <= 2
        ? user[0] + '*'
        : user[0] + '*'.repeat(Math.max(1, user.length - 2)) + user[user.length - 1];
    return `${u}@${domain}`;
  },
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await enterpriseLogger.flush();
});

process.on('SIGTERM', async () => {
  await enterpriseLogger.flush();
});

export default enterpriseLogger;
