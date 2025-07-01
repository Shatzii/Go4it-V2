import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Eye, EyeOff, Lock, Mail, User, Building, ArrowRight } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState<RegisterForm>({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterForm, 'confirmPassword'>) => {
      return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Shatzii, ${data.user.name}!`,
      });
      
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  });

  const validateForm = (): string | null => {
    if (!form.name || !form.email || !form.password) {
      return "Please fill in all required fields.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords don't match.";
    }

    if (form.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    const { confirmPassword, ...registerData } = form;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Join Shatzii
          </h1>
          <p className="text-slate-400 mt-2">Create your AI-powered business account</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email *</Label>
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
                <Label htmlFor="company" className="text-slate-300">Company (Optional)</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="Create a strong password"
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
                <p className="text-xs text-slate-400">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {registerMutation.isPending ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setLocation('/login')}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}