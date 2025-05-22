import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/simplified-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { login, register, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    role: "athlete" as const,
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegisterData((prev) => ({ ...prev, role: e.target.value as any }));
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!loginData.username) newErrors.username = "Username is required";
    if (!loginData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: Record<string, string> = {};
    if (!registerData.username) newErrors.username = "Username is required";
    if (!registerData.password) newErrors.password = "Password is required";
    if (registerData.password.length < 8) 
      newErrors.password = "Password must be at least 8 characters";
    if (registerData.password !== registerData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!registerData.name) newErrors.name = "Name is required";
    if (!registerData.email) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email))
      newErrors.email = "Invalid email format";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    const success = await login(loginData.username, loginData.password);
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    
    const success = await register({
      username: registerData.username,
      password: registerData.password,
      name: registerData.name,
      email: registerData.email,
      role: registerData.role,
    });
    
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0e1628]">
      {/* Left column - forms */}
      <div className="md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Go4It <span className="text-blue-400">Sports</span></h1>
            <p className="text-gray-400 mt-2">Elevate your athletic potential</p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        placeholder="yourusername"
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500">{errors.username}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-blue-400 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Log In"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-blue-400 hover:underline"
                  >
                    Register
                  </button>
                </p>
                <p className="mt-2 text-gray-500">
                  Demo accounts: alexjohnson/password123, coach/coach123, admin/admin123
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>Join Go4It Sports and start your athletic journey</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegisterSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-username">Username</Label>
                        <Input
                          id="reg-username"
                          name="username"
                          value={registerData.username}
                          onChange={handleRegisterChange}
                          placeholder="yourusername"
                        />
                        {errors.username && (
                          <p className="text-sm text-red-500">{errors.username}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={registerData.name}
                          onChange={handleRegisterChange}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">I am a</Label>
                      <select
                        id="role"
                        name="role"
                        value={registerData.role}
                        onChange={handleRoleChange}
                        className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="athlete">Student Athlete</option>
                        <option value="coach">Coach</option>
                        <option value="parent">Parent</option>
                        <option value="scout">Scout</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          name="password"
                          type="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          placeholder="••••••••"
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500"
                        required
                      />
                      <Label htmlFor="terms" className="text-xs">
                        I agree to the{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-blue-400 hover:underline"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right column - hero section */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-900 p-8 flex flex-col justify-center items-center">
        <div className="max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Elevate Your Game with Advanced Video Analysis
          </h2>
          <p className="text-xl mb-8">
            Join thousands of student athletes who are using Go4It's GAR scoring system
            to improve their performance and get noticed by coaches.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Video Analysis</h3>
              <p className="text-blue-100">
                Upload your game footage and get AI-powered insights and improvements
              </p>
            </div>
            <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-bold text-xl mb-2">NCAA Tracking</h3>
              <p className="text-blue-100">
                Keep your academics on track with NCAA eligibility monitoring
              </p>
            </div>
            <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Coach Connect</h3>
              <p className="text-blue-100">
                Get noticed by coaches and receive professional feedback
              </p>
            </div>
            <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Mobile First</h3>
              <p className="text-blue-100">
                Access your profile, videos, and feedback from any device
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium">
              Trusted by 5,000+ student athletes across the country
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}