import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Eye, EyeOff, Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: "Welcome to Pharaoh Control Panel!",
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Pharaoh
            </span>{' '}
            Control Panel
          </h1>
          <p className="text-slate-400 mt-2">
            AI-powered server management platform
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setLocation('/auth/register')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Create one here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-lg border border-slate-800 bg-slate-900/50">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Demo Credentials</h3>
          <div className="text-xs text-slate-400 space-y-1">
            <p><strong>Email:</strong> admin@pharaoh.local</p>
            <p><strong>Password:</strong> pharaoh123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;