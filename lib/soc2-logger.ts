import winston from 'winston';

// Define log levels for SOC2 compliance
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  security: 3,
  audit: 4,
  debug: 5,
};

// SOC2-compliant log format
const soc2LogFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
      // SOC2 required fields
      source: 'go4it-platform',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };

    // Add user context if available
    if (meta.userId) logEntry.userId = meta.userId;
    if (meta.sessionId) logEntry.sessionId = meta.sessionId;
    if (meta.ip) logEntry.ipAddress = meta.ip;

    return JSON.stringify(logEntry);
  })
);

// Create winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: soc2LogFormat,
  transports: [
    // Security and audit logs (always written)
    new winston.transports.File({
      filename: 'logs/security.log',
      level: 'security',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 30,
      tailable: true,
    }),
    new winston.transports.File({
      filename: 'logs/audit.log',
      level: 'audit',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 90, // 90 days retention
      tailable: true,
    }),
    // Application logs
    new winston.transports.File({
      filename: 'logs/application.log',
      maxsize: 50 * 1024 * 1024, // 50MB
      maxFiles: 14,
      tailable: true,
    }),
    // Error logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 20 * 1024 * 1024, // 20MB
      maxFiles: 30,
      tailable: true,
    }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        let output = `${timestamp} ${level}: ${message}`;
        if (Object.keys(meta).length > 0) {
          output += ` ${JSON.stringify(meta)}`;
        }
        return output;
      })
    ),
  }));
}

// SOC2 Security Event Logger
export const securityLogger = {
  // Authentication events
  authSuccess: (userId: string, ip: string, userAgent?: string) => {
    logger.security('Authentication successful', {
      event: 'AUTH_SUCCESS',
      userId,
      ip,
      userAgent,
      category: 'authentication',
    });
  },

  authFailure: (identifier: string, ip: string, reason: string, userAgent?: string) => {
    logger.security('Authentication failed', {
      event: 'AUTH_FAILURE',
      identifier,
      ip,
      reason,
      userAgent,
      category: 'authentication',
    });
  },

  // Authorization events
  accessDenied: (userId: string | null, resource: string, action: string, ip: string) => {
    logger.security('Access denied', {
      event: 'ACCESS_DENIED',
      userId,
      resource,
      action,
      ip,
      category: 'authorization',
    });
  },

  // Data access events
  dataAccess: (userId: string, action: string, resource: string, recordId?: string) => {
    logger.audit('Data access', {
      event: 'DATA_ACCESS',
      userId,
      action,
      resource,
      recordId,
      category: 'data_access',
    });
  },

  // Security incidents
  suspiciousActivity: (userId: string | null, activity: string, ip: string, details?: any) => {
    logger.security('Suspicious activity detected', {
      event: 'SUSPICIOUS_ACTIVITY',
      userId,
      activity,
      ip,
      details,
      category: 'threat_detection',
    });
  },

  // Configuration changes
  configChange: (userId: string, change: string, oldValue?: any, newValue?: any) => {
    logger.audit('Configuration change', {
      event: 'CONFIG_CHANGE',
      userId,
      change,
      oldValue,
      newValue,
      category: 'configuration',
    });
  },
};

// SOC2 Audit Logger
export const auditLogger = {
  userAction: (userId: string, action: string, details?: any) => {
    logger.audit('User action', {
      event: 'USER_ACTION',
      userId,
      action,
      details,
      category: 'user_activity',
    });
  },

  systemEvent: (event: string, details?: any) => {
    logger.audit('System event', {
      event: 'SYSTEM_EVENT',
      systemEvent: event,
      details,
      category: 'system',
    });
  },

  dataChange: (userId: string, table: string, operation: string, recordId?: string) => {
    logger.audit('Data change', {
      event: 'DATA_CHANGE',
      userId,
      table,
      operation,
      recordId,
      category: 'data_modification',
    });
  },
};

// Application Logger (replaces console.log)
export const appLogger = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
};

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export default logger;