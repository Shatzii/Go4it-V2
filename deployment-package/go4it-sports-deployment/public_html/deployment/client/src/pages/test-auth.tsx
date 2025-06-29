import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const TestAuth: React.FC = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { username, password }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Login success:', response.data);
      setUserInfo(response.data);
      toast({
        title: 'Login successful',
        description: `Welcome ${response.data.user?.name || username}!`,
        variant: 'default',
      });

      // Check session
      checkSession();
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
      });
      setUserInfo(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/auth/me', {
        withCredentials: true,
      });
      console.log('Session check success:', response.data);
      setUserInfo(response.data);
      toast({
        title: 'Session active',
        description: `Logged in as ${response.data.user?.name || response.data.user?.username}`,
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Session check error:', error);
      setUserInfo(null);
      toast({
        title: 'Not logged in',
        description: 'No active session found',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      {userInfo ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Logged In</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
          <div className="mt-4 flex space-x-3">
            <Button 
              onClick={checkSession} 
              variant="outline" 
              disabled={loading}
            >
              Check Session
            </Button>
            <Button 
              onClick={logout} 
              variant="destructive" 
              disabled={loading}
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={login} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
      )}

      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <h2 className="text-lg font-medium mb-2">Test Credentials</h2>
        <p><strong>Username:</strong> testuser</p>
        <p><strong>Password:</strong> password123</p>
        <p className="text-sm text-gray-500 mt-2">
          These credentials are stored in the database for testing purposes.
        </p>
      </div>
    </div>
  );
};

export default TestAuth;