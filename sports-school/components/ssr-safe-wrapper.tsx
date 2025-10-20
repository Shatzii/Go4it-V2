'use client';

import { useEffect, useState } from 'react';

interface SSRSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SSRSafeWrapper({ children, fallback = null }: SSRSafeWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
