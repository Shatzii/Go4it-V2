'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin' | 'coach';
  fallbackUrl?: string;
}

export function ProtectedRoute({ children, requiredRole, fallbackUrl = '/' }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLogin(true);
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // Redirect to fallback URL if user doesn't have required role
      window.location.href = fallbackUrl;
    }
  }, [isLoading, isAuthenticated, user, requiredRole, fallbackUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const result = await login(email, password);

    if (result.success) {
      setShowLogin(false);
    } else {
      setLoginError(result.error || 'Login failed');
    }

    setIsLoggingIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (showLogin || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to Go4It</h1>
              <p className="text-slate-300">Please sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {loginError && <div className="text-red-400 text-sm text-center">{loginError}</div>}

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoggingIn ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-sm text-slate-400 text-center space-y-2">
              <p>Demo Credentials:</p>
              <p>Student: demo@go4it.com / demo123</p>
              <p>Admin: admin@go4itsports.org / ZoPulaHoSki47$$</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-slate-300 mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => (window.location.href = fallbackUrl)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
