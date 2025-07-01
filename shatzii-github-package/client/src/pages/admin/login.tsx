import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    adminKey: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin control center",
        });
        
        setLocation('/admin/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Shield className="h-12 w-12 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-cyan-400">Admin Access</h1>
          <p className="text-slate-400 mt-2">Secure system administration portal</p>
        </div>

        {/* Login Form */}
        <Card className="bg-slate-900/95 backdrop-blur-xl border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-center text-slate-100">Administrative Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Administrator Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-800/50 border-cyan-500/20 text-slate-100"
                  placeholder="Enter admin username"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-slate-800/50 border-cyan-500/20 text-slate-100 pr-10"
                    placeholder="Enter admin password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Admin Key */}
              <div className="space-y-2">
                <Label htmlFor="adminKey" className="text-slate-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Master Admin Key
                </Label>
                <div className="relative">
                  <Input
                    id="adminKey"
                    type={showAdminKey ? "text" : "password"}
                    value={credentials.adminKey}
                    onChange={(e) => setCredentials(prev => ({ ...prev, adminKey: e.target.value }))}
                    className="bg-slate-800/50 border-cyan-500/20 text-slate-100 pr-10"
                    placeholder="Enter master admin key"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                  >
                    {showAdminKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="bg-slate-800/30 border border-cyan-500/20 rounded-lg p-3 mt-2">
                  <div className="text-xs text-cyan-400 font-mono mb-1">SECURE VERIFICATION REQUIRED:</div>
                  <div className="text-sm text-slate-300 bg-slate-900/50 p-2 rounded border">
                    Master key access protected by multi-factor authentication
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Phone verification (205-434-8405) or local machine key required for changes
                  </p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Access Admin Panel
                  </div>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-cyan-500/10">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-cyan-400">Security Notice</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    This is a secure administrative interface. All login attempts are logged and monitored.
                    Unauthorized access attempts will be reported.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          Shatzii AI Platform - Administrative Access Portal
        </div>
      </div>
    </div>
  );
}