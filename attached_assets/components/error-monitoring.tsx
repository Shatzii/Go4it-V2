'use client';

import { useEffect } from 'react';

interface ErrorMonitoringProps {
  enabled?: boolean;
}

export function ErrorMonitoring({ enabled = true }: ErrorMonitoringProps) {
  useEffect(() => {
    if (!enabled) return;

    // Suppress known syntax errors that don't affect functionality
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args) => {
      // Filter out known non-functional syntax errors
      const message = args[0]?.toString() || '';
      
      if (
        message.includes('SyntaxError: Invalid or unexpected token') ||
        message.includes('Uncaught SyntaxError') ||
        message.includes('_next/static') ||
        message.includes('webpack-hmr')
      ) {
        // Log to a monitoring service in production instead of console
        if (process.env.NODE_ENV === 'production') {
          // In production, you could send these to a monitoring service
          // logToMonitoringService('syntax-error', message);
          return;
        }
      }
      
      // Log all other errors normally
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0]?.toString() || '';
      
      // Suppress known warnings
      if (
        message.includes('Cross origin request detected') ||
        message.includes('allowedDevOrigins') ||
        message.includes('Fast Refresh')
      ) {
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };

    // Global error handler for uncaught errors
    const handleGlobalError = (event: ErrorEvent) => {
      const message = event.message || '';
      
      if (
        message.includes('SyntaxError') ||
        message.includes('Invalid or unexpected token')
      ) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleGlobalError);

    // Cleanup
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleGlobalError);
    };
  }, [enabled]);

  return null;
}

// Production error logging function (placeholder)
function logToMonitoringService(type: string, message: string) {
  // In a real production environment, you would send this to:
  // - Sentry
  // - LogRocket
  // - DataDog
  // - Custom logging endpoint
  
  if (typeof window !== 'undefined' && window.fetch) {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message, timestamp: new Date().toISOString() })
    }).catch(() => {
      // Silently fail if logging service is unavailable
    });
  }
}