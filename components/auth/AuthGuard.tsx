'use client';

import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

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
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return fallback || null;
  }

  if (requiredRole) {
    const userRole = user?.publicMetadata?.role as string;
    if (userRole !== requiredRole) {
      return fallback || null;
    }
  }

  return <>{children}</>;
}
