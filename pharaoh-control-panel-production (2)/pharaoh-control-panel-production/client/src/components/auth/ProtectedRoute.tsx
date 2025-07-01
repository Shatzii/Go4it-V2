import React from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
          <p className="text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;