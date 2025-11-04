'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin' | 'coach';
  fallbackUrl?: string;
}

export function ProtectedRoute({ children, requiredRole, fallbackUrl = '/' }: ProtectedRouteProps) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = '/login';
    }

    if (isLoaded && user && requiredRole) {
      // Check user role from publicMetadata
      const userRole = user.publicMetadata?.role as string;
      if (userRole !== requiredRole) {
        window.location.href = fallbackUrl;
      }
    }
  }, [isLoaded, user, requiredRole, fallbackUrl]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole) {
    const userRole = user.publicMetadata?.role as string;
    if (userRole !== requiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
