'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      const redirectUrl = user.role === 'admin' ? '/admin' : '/dashboard';
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await login(email, password);

    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      // Redirect will happen in useEffect
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Go4It Sports
          </h1>
          <p className="text-slate-300 mt-2">Elite Athletic Development Platform</p>
        </div>

        {/* Login Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-white">Sign In to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-900/20 border-red-700">
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-900/20 border-green-700">
                  <AlertDescription className="text-green-300">{success}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Quick Login Options */}
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <span className="text-sm text-slate-400">Quick Login</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => {
                    setEmail('demo@go4it.com');
                    setPassword('demo123');
                  }}
                >
                  Demo Student
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => {
                    setEmail('admin@go4itsports.org');
                    setPassword('ZoPulaHoSki47$$');
                  }}
                >
                  Admin User
                </Button>
              </div>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">Demo Accounts</h3>
              <div className="space-y-1 text-xs text-slate-300">
                <p>
                  <strong>Student:</strong> demo@go4it.com / demo123
                </p>
                <p>
                  <strong>Admin:</strong> admin@go4itsports.org / ZoPulaHoSki47$$
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot your password?
              </a>
              <div className="text-sm text-slate-400">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-400 hover:text-blue-300">
                  Sign up here
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="text-sm font-medium text-white">What You Get Access To</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>✓ GAR Analysis System</div>
                <div>✓ StarPath Progression</div>
                <div>✓ Social Leaderboards</div>
                <div>✓ Academy Courses</div>
                <div>✓ AI Coach Integration</div>
                <div>✓ Recruiting Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
