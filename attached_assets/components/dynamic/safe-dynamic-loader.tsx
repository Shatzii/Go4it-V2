'use client';

import { Suspense, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { DeploymentErrorBoundary } from '@/components/error-boundary/deployment-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SafeDynamicLoaderProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  loadingComponent?: ReactNode;
  className?: string;
}

function DefaultLoadingComponent() {
  return (
    <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500">
      <CardHeader>
        <CardTitle className="text-blue-400">Loading...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-blue-500/10 rounded"></div>
          <div className="h-10 bg-blue-500/10 rounded"></div>
          <div className="h-10 bg-blue-500/10 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SafeDynamicLoader({ 
  children, 
  fallbackTitle = "Component Loading Error",
  fallbackMessage = "This component failed to load properly.",
  loadingComponent = <DefaultLoadingComponent />,
  className 
}: SafeDynamicLoaderProps) {
  return (
    <DeploymentErrorBoundary
      fallbackTitle={fallbackTitle}
      fallbackMessage={fallbackMessage}
      className={className}
    >
      <Suspense fallback={loadingComponent}>
        {children}
      </Suspense>
    </DeploymentErrorBoundary>
  );
}

// Helper function to create safe dynamic imports
export function createSafeDynamicImport<T = any>(
  importFn: () => Promise<T>,
  options: {
    fallbackTitle?: string;
    fallbackMessage?: string;
    loadingComponent?: ReactNode;
  } = {}
) {
  return dynamic(importFn, {
    ssr: false,
    loading: () => options.loadingComponent || <DefaultLoadingComponent />,
  });
}