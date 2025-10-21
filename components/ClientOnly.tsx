'use client';

import { useState, useEffect } from 'react';
import { PageLoadingSpinner } from './ui/LoadingSpinner';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback ? <>{fallback}</> : <PageLoadingSpinner />;
  }

  return <>{children}</>;
}
