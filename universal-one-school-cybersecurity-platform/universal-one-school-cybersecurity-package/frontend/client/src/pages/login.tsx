import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle, UserCircle, KeyRound } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!username || !password) {
      setLoginError('Username and password are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo: hardcoded credentials check
      if (username === 'admin' && password === 'sentinel123') {
        console.log('Login successful with demo credentials');
        // Simulate brief delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use direct window location change instead of React router
        window.location.href = '/dashboard';
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError('Invalid username or password. Try admin/sentinel123');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-full">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <Card className="border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign in to Sentinel AI</CardTitle>
            <CardDescription>
              Enter your credentials to access your security dashboard
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs" disabled={isSubmitting}>
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center text-gray-400 text-sm mt-6">
          <p>Demo credentials: admin / sentinel123</p>
          <p className="mt-4">For testing purposes only. Do not use in production.</p>
        </div>
      </div>
    </div>
  );
}