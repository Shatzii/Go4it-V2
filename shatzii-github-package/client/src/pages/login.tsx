import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Eye, EyeOff, Crown, Shield, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Custom messages based on user type
      if (data.user.email === 'SpaceP@shatzii.com') {
        toast({
          title: "🏛️ Supreme SpacePharaoh Access Granted",
          description: "Welcome to your AI Empire Command Center. All systems under your control.",
        });
      } else if (data.user.role === 'admin') {
        toast({
          title: "👑 Admin Access Granted", 
          description: "Welcome to the Shatzii admin dashboard. Accessing your AI engines...",
        });
      } else {
        toast({
          title: "Welcome to Shatzii AI",
          description: "Login successful! Accessing your AI engines...",
        });
      }

      // Redirect based on user role and security level
      if (data.user.email === 'SpaceP@shatzii.com') {
        // SpacePharaoh gets supreme access to Master Control
        setLocation('/master-control');
      } else if (data.user.role === 'admin') {
        // Other admins get dashboard access
        setLocation('/dashboard-customizer');
      } else {
        // Regular users get client dashboard
        setLocation('/client-dashboard');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const quickLogin = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Shatzii AI</h1>
          </div>
          <p className="text-slate-300">Access your autonomous AI empire</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your credentials to access your AI engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your.email@company.com"
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            {/* Quick Login Options */}
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 text-center">Quick Access</p>
              
              <Button
                variant="outline"
                onClick={() => quickLogin('SpaceP@shatzii.com', '*GodFlow42$$')}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white border-yellow-600"
                disabled={loginMutation.isPending}
              >
                <Crown className="h-4 w-4 mr-2" />
                SpacePharaoh (Supreme Admin)
              </Button>

              <Button
                variant="outline"
                onClick={() => quickLogin('admin@shatzii.com', 'ShatziiAdmin2025!')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                disabled={loginMutation.isPending}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Access
              </Button>
            </div>

            {/* Registration Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-slate-400">
                Need an AI empire?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                  Start Your Journey
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500">
            Join 500+ companies using autonomous AI operations
          </p>
          <div className="flex justify-center space-x-4 text-xs text-slate-400">
            <span>202+ AI Agents</span>
            <span>•</span>
            <span>13 Industries</span>
            <span>•</span>
            <span>$166M+ Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}