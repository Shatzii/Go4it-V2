// Simplified Console Logger (Winston replacement for deployment size optimization)
// Provides same API as winston logger but uses console logging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMeta {
  [key: string]: any;
}

class SimpleLogger {
  private level: LogLevel;
  private enableLogging: boolean;

  constructor() {
    this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.enableLogging = process.env.ENABLE_CONSOLE_LOGGING !== 'false';
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enableLogging) return false;
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, meta?: LogMeta): string {
    const timestamp = new Date().toISOString();
    const levelStr = level.toUpperCase().padEnd(5);
    const metaStr = meta && Object.keys(meta).length > 0 
      ? ` ${JSON.stringify(meta)}` 
      : '';
    return `[${timestamp}] ${levelStr} ${message}${metaStr}`;
  }

  debug(message: string, meta?: LogMeta): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: LogMeta): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, meta));
    }
  }

  warn(message: string, meta?: LogMeta): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  error(message: string, meta?: LogMeta): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  setRequestContext(_context: any): void {
    // No-op: context not persisted in simple logger
  }

  clearRequestContext(): void {
    // No-op
  }
}

// Enterprise Logger API compatibility
export class EnterpriseLogger {
  private static instance: EnterpriseLogger;
  private simpleLogger: SimpleLogger;

  private constructor() {
    this.simpleLogger = new SimpleLogger();
  }

  static getInstance(): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger();
    }
    return EnterpriseLogger.instance;
  }

  debug(message: string, meta?: LogMeta): void {
    this.simpleLogger.debug(message, meta);
  }

  info(message: string, meta?: LogMeta): void {
    this.simpleLogger.info(message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.simpleLogger.warn(message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.simpleLogger.error(message, meta);
  }

  setRequestContext(context: any): void {
    this.simpleLogger.setRequestContext(context);
  }

  clearRequestContext(): void {
    this.simpleLogger.clearRequestContext();
  }

  audit(action: string, meta?: LogMeta): void {
    this.info(`AUDIT: ${action}`, meta);
  }

  security(action: string, meta?: LogMeta): void {
    this.warn(`SECURITY: ${action}`, meta);
  }

  performance(metric: string, value: number, meta?: LogMeta): void {
    this.info(`PERFORMANCE: ${metric}`, { value, ...meta });
  }
}

// Export singleton instance
export const logger = EnterpriseLogger.getInstance();

// Export for testing
export { SimpleLogger };
