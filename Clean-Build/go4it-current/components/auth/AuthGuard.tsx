'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'student' | 'admin' | 'coach';
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = false,
  requiredRole,
  fallback,
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      setShouldRender(false);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
  }, [isLoading, isAuthenticated, user, requireAuth, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!shouldRender) {
    return fallback || null;
  }

  return <>{children}</>;
}
