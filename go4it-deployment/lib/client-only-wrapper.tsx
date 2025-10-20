'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component that only renders children on the client side
 * Prevents SSR issues with browser-only dependencies like TensorFlow.js
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to safely check if we're in a browser environment
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Higher-order component for client-only rendering
 */
export function withClientOnly<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  return function ClientOnlyComponent(props: P) {
    return (
      <ClientOnly fallback={fallback}>
        <Component {...props} />
      </ClientOnly>
    );
  };
}
