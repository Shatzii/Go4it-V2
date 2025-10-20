'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { ErrorTrackingService, ErrorSeverity, ErrorCategory } from '@/lib/error-tracking';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const errorTracker = ErrorTrackingService.getInstance();

  React.useEffect(() => {
    // Log the error to our tracking system
    errorTracker.logError({
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.UI,
      message: error.message,
      stack: error.stack,
      metadata: {
        type: 'react_error_boundary',
        componentStack: error.stack,
      },
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <Badge variant="destructive" className="mx-auto w-fit">
            Application Error
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="font-medium text-red-800 mb-2">Error Details</h4>
            <p className="text-sm text-red-700">{error.message}</p>
          </div>

          <div className="text-sm text-gray-600">
            <p>This error has been automatically logged and reported to our development team.</p>
            <p className="mt-2">Error ID: {Date.now()}</p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={resetErrorBoundary} className="flex-1" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = '/')} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          <Button
            onClick={() => (window.location.href = '/error-dashboard')}
            variant="ghost"
            className="w-full"
          >
            <Bug className="h-4 w-4 mr-2" />
            View Error Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || ErrorFallback}
      onError={(error, errorInfo) => {
        const errorTracker = ErrorTrackingService.getInstance();
        errorTracker.logError({
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.UI,
          message: error.message,
          stack: error.stack,
          metadata: {
            type: 'react_error_boundary',
            componentStack: errorInfo.componentStack,
          },
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
