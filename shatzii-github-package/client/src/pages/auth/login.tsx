import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginForm) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name}!`,
      });
      
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2">Sign in to your Shatzii dashboard</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loginMutation.isPending ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setLocation('/register')}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}