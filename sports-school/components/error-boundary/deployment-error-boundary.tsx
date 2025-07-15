'use client';

import { ErrorBoundary, ErrorFallback } from 'react-error-boundary';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DeploymentErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  className?: string;
}

function DeploymentErrorFallback({ 
  error, 
  resetErrorBoundary, 
  fallbackTitle = "Component Error",
  fallbackMessage = "This component failed to load during deployment."
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
  fallbackTitle?: string;
  fallbackMessage?: string;
}) {
  return (
    <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          {fallbackTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-300 mb-4">{fallbackMessage}</p>
        <div className="space-y-2">
          <p className="text-xs text-red-200">Error: {error.message}</p>
          <Button 
            onClick={resetErrorBoundary}
            className="w-full bg-red-600 hover:bg-red-700"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DeploymentErrorBoundary({ 
  children, 
  fallbackTitle, 
  fallbackMessage, 
  className 
}: DeploymentErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <DeploymentErrorFallback
          {...props}
          fallbackTitle={fallbackTitle}
          fallbackMessage={fallbackMessage}
        />
      )}
      onError={(error, errorInfo) => {
        console.error('Deployment Error Boundary caught an error:', error, errorInfo);
      }}
    >
      <div className={className}>
        {children}
      </div>
    </ErrorBoundary>
  );
}