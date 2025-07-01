import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  
  const [_, navigate] = useLocation();
  const { login, isLoginPending, loginError } = useAuth();
  
  // Update error message when login error occurs
  if (loginError && !errorMessage) {
    setErrorMessage(typeof loginError === 'string' ? loginError : 'Authentication failed');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!credentials.username || !credentials.password) {
      setErrorMessage("Username and password are required");
      return;
    }
    
    // Clear previous errors
    setErrorMessage(null);
    
    // Attempt login
    login(credentials);
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user types
    if (errorMessage) {
      setErrorMessage(null);
    }
    
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="bg-navy-800 border-gray-700">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Sentinel AI
        </CardTitle>
        <CardDescription className="text-gray-400 mt-2">
          Enterprise Cybersecurity Platform
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="pl-10 bg-navy-900 border-gray-700"
                placeholder="Enter your username"
                disabled={isLoginPending}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-gray-400 font-normal"
                type="button"
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 bg-navy-900 border-gray-700"
                placeholder="Enter your password"
                disabled={isLoginPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(!!checked)} 
            />
            <Label 
              htmlFor="rememberMe"
              className="text-sm text-gray-400 font-normal"
            >
              Remember me for 30 days
            </Label>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoginPending}
          >
            {isLoginPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-navy-800 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="w-full" type="button" disabled>
              SSO
            </Button>
            <Button variant="outline" className="w-full" type="button" disabled>
              2FA
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-gray-800 pt-6">
        <p className="text-sm text-gray-400">
          <span>© 2023 Sentinel AI. All rights reserved.</span>
        </p>
      </CardFooter>
    </Card>
  );
}