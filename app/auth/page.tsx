'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Target, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import { AuthClient } from '@/lib/auth-client';

export default function OptimizedAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      ...(isLogin
        ? {}
        : {
            username: formData.get('username') as string,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
          }),
    };

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the authentication token using our auth client
        if (data.token) {
          AuthClient.setToken(data.token);
        }

        setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');

        // Redirect based on user role
        const redirectPath = data.user.role === 'admin' ? '/admin' : '/dashboard';
        setTimeout(() => router.push(redirectPath), 1000);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 hero-bg">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary neon-text mb-2">Go4It Sports</h1>
            <p className="text-muted-foreground">
              Elite athletic development platform for neurodivergent student athletes
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <Star className="h-8 w-8 text-primary mx-auto mb-2 neon-glow" />
              <p className="text-xs text-muted-foreground">StarPath Training</p>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2 neon-glow" />
              <p className="text-xs text-muted-foreground">GAR Analysis</p>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <Target className="h-8 w-8 text-primary mx-auto mb-2 neon-glow" />
              <p className="text-xs text-muted-foreground">AI Coaching</p>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-card rounded-lg p-6 shadow-xl border border-border neon-border">
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-l-lg text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-primary text-primary-foreground neon-border'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-r-lg text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-primary text-primary-foreground neon-border'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter email address"
                    />
                  </div>
                </>
              )}

              {isLogin ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter email address"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Username</label>
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter username"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center neon-border"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
