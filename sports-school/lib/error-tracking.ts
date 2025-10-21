'use client';

import { z } from 'zod';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  API = 'api',
  UI = 'ui',
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  SYSTEM = 'system',
}

// Error schema validation
export const ErrorLogSchema = z.object({
  id: z.string().optional(),
  timestamp: z.date(),
  severity: z.nativeEnum(ErrorSeverity),
  category: z.nativeEnum(ErrorCategory),
  message: z.string(),
  stack: z.string().optional(),
  userAgent: z.string().optional(),
  url: z.string().optional(),
  userId: z.string().optional(),
  schoolId: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  resolved: z.boolean().default(false),
  resolvedAt: z.date().optional(),
  resolvedBy: z.string().optional(),
});

export type ErrorLog = z.infer<typeof ErrorLogSchema>;

// Error tracking service
export class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private errors: ErrorLog[] = [];
  private listeners: ((error: ErrorLog) => void)[] = [];

  static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  // Log an error
  logError(error: Partial<ErrorLog>): void {
    const errorLog: ErrorLog = ErrorLogSchema.parse({
      id: this.generateId(),
      timestamp: new Date(),
      severity: error.severity || ErrorSeverity.MEDIUM,
      category: error.category || ErrorCategory.SYSTEM,
      message: error.message || 'Unknown error',
      stack: error.stack,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: error.userId,
      schoolId: error.schoolId,
      sessionId: this.getSessionId(),
      metadata: error.metadata || {},
      resolved: false,
    });

    this.errors.push(errorLog);
    this.notifyListeners(errorLog);
    this.persistError(errorLog);

    // Auto-report critical errors
    if (errorLog.severity === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(errorLog);
    }
  }

  // Get all errors
  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  // Get errors by category
  getErrorsByCategory(category: ErrorCategory): ErrorLog[] {
    return this.errors.filter((error) => error.category === category);
  }

  // Get errors by severity
  getErrorsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.errors.filter((error) => error.severity === severity);
  }

  // Get unresolved errors
  getUnresolvedErrors(): ErrorLog[] {
    return this.errors.filter((error) => !error.resolved);
  }

  // Mark error as resolved
  resolveError(errorId: string, resolvedBy: string): void {
    const error = this.errors.find((e) => e.id === errorId);
    if (error) {
      error.resolved = true;
      error.resolvedAt = new Date();
      error.resolvedBy = resolvedBy;
      this.persistError(error);
    }
  }

  // Add error listener
  addListener(listener: (error: ErrorLog) => void): void {
    this.listeners.push(listener);
  }

  // Remove error listener
  removeListener(listener: (error: ErrorLog) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Generate analytics
  getAnalytics() {
    const total = this.errors.length;
    const resolved = this.errors.filter((e) => e.resolved).length;
    const unresolved = total - resolved;

    const bySeverity = {
      critical: this.errors.filter((e) => e.severity === ErrorSeverity.CRITICAL).length,
      high: this.errors.filter((e) => e.severity === ErrorSeverity.HIGH).length,
      medium: this.errors.filter((e) => e.severity === ErrorSeverity.MEDIUM).length,
      low: this.errors.filter((e) => e.severity === ErrorSeverity.LOW).length,
    };

    const byCategory = Object.values(ErrorCategory).reduce(
      (acc, category) => {
        acc[category] = this.errors.filter((e) => e.category === category).length;
        return acc;
      },
      {} as Record<ErrorCategory, number>,
    );

    return {
      total,
      resolved,
      unresolved,
      bySeverity,
      byCategory,
      resolutionRate: total > 0 ? (resolved / total) * 100 : 0,
    };
  }

  // Private methods
  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('error_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('error_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  }

  private notifyListeners(error: ErrorLog): void {
    this.listeners.forEach((listener) => {
      try {
        listener(error);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });
  }

  private persistError(error: ErrorLog): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('error_logs');
        const logs = stored ? JSON.parse(stored) : [];
        logs.push(error);

        // Keep only last 1000 errors
        if (logs.length > 1000) {
          logs.splice(0, logs.length - 1000);
        }

        localStorage.setItem('error_logs', JSON.stringify(logs));
      } catch (e) {
        console.error('Failed to persist error:', e);
      }
    }
  }

  private reportCriticalError(error: ErrorLog): void {
    // In a real application, this would send to external monitoring service
    console.error('CRITICAL ERROR DETECTED:', error);

    // Send to API endpoint for immediate notification
    if (typeof window !== 'undefined') {
      fetch('/api/errors/critical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      }).catch((e) => console.error('Failed to report critical error:', e));
    }
  }
}

// Global error handler
export const setupGlobalErrorHandling = () => {
  const errorTracker = ErrorTrackingService.getInstance();

  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      errorTracker.logError({
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        message: `Unhandled promise rejection: ${event.reason}`,
        stack: event.reason?.stack,
        metadata: { type: 'unhandled_rejection' },
      });
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      errorTracker.logError({
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        message: event.message,
        stack: event.error?.stack,
        metadata: {
          type: 'javascript_error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });
  }
};

// Convenience functions
export const logError = (error: Partial<ErrorLog>) => {
  ErrorTrackingService.getInstance().logError(error);
};

export const logCriticalError = (message: string, metadata?: Record<string, any>) => {
  logError({
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.SYSTEM,
    message,
    metadata,
  });
};

export const logAuthError = (message: string, userId?: string) => {
  logError({
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.AUTHENTICATION,
    message,
    userId,
  });
};

export const logDatabaseError = (message: string, metadata?: Record<string, any>) => {
  logError({
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.DATABASE,
    message,
    metadata,
  });
};

export const logApiError = (message: string, metadata?: Record<string, any>) => {
  logError({
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.API,
    message,
    metadata,
  });
};
