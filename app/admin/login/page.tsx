'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Verify admin credentials
    if (email === 'admin@go4itsports.com' && password === 'G04IT@dm1n2025!Secure#') {
      // Set admin context and redirect
      localStorage.setItem('adminAccess', 'true');
      localStorage.setItem('adminToken', 'go4it-admin-secure-token-2025');

      // Set secure cookie for server-side authentication
      document.cookie = 'adminToken=go4it-admin-secure-token-2025; path=/; max-age=86400; secure; samesite=strict';
      document.cookie = 'adminAccess=true; path=/; max-age=86400; secure; samesite=strict';

      // In a real system, you would set proper authentication tokens
      window.location.href = '/admin/dashboard?admin=true';
    } else {
      setError('Invalid admin credentials. Please check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <p className="text-slate-400">Go4It Sports Platform Administration</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@go4itsports.com"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
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
                    placeholder="Enter admin password"
                    className="bg-slate-700 border-slate-600 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In as Admin'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">Admin credentials required for system access</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <a href="/" className="text-slate-400 hover:text-white text-sm">
            ← Back to Go4It Sports Platform
          </a>
        </div>
      </div>
    </div>
  );
}
