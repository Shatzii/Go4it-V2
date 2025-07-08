'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Target, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import { useApp } from '@/components/providers/AppProviders';

export default function OptimizedAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { setUser } = useApp();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const credentials = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      ...(isLogin ? {} : {
        email: formData.get('email') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
      })
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
        setUser(data.user);
        setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');
        setTimeout(() => router.push('/dashboard'), 1000);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Go4It Sports
            </h1>
            <p className="text-slate-400">
              Elite athletic development platform for neurodivergent student athletes
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">StarPath Training</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">GAR Analysis</p>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">AI Coaching</p>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-l-lg text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-r-lg text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Demo Credentials:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-700 p-2 rounded">
                  <p className="text-slate-300">Athlete</p>
                  <p className="text-slate-400">demo/demo123</p>
                </div>
                <div className="bg-slate-700 p-2 rounded">
                  <p className="text-slate-300">Coach</p>
                  <p className="text-slate-400">coach/demo123</p>
                </div>
                <div className="bg-slate-700 p-2 rounded">
                  <p className="text-slate-300">Admin</p>
                  <p className="text-slate-400">admin/demo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}