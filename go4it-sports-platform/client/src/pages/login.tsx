import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ChartLine, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "student",
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/dashboard");
      toast({
        title: "Welcome!",
        description: "Successfully logged in to Go4It Sports.",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: typeof registerForm) => {
      const res = await apiRequest("POST", "/api/auth/register", userData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/dashboard");
      toast({
        title: "Welcome to Go4It Sports!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.username || !registerForm.password || !registerForm.firstName || !registerForm.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(registerForm);
  };

  const handleDemoLogin = (role: string) => {
    const demoCredentials = {
      admin: { username: "admin", password: "admin123" },
    };

    if (role === "admin") {
      loginMutation.mutate(demoCredentials.admin);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <ChartLine className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Go4It Sports</h1>
          <p className="text-slate-300">AI-Enhanced Sports Analytics Platform</p>
        </div>

        <Card className="go4it-card">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 neurodivergent-focus"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 neurodivergent-focus pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-blue-600"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-slate-800 px-2 text-slate-400">Quick Demo Access</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      onClick={() => handleDemoLogin("admin")}
                      variant="outline"
                      className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      disabled={loginMutation.isPending}
                    >
                      Demo as Admin/Coach
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 neurodivergent-focus"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 neurodivergent-focus"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regUsername" className="text-white">Username</Label>
                    <Input
                      id="regUsername"
                      type="text"
                      placeholder="Choose a username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 neurodivergent-focus"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 neurodivergent-focus"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select 
                      value={registerForm.role} 
                      onValueChange={(value) => setRegisterForm({ ...registerForm, role: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white neurodivergent-focus">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="student">Student Athlete</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regPassword" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="regPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 neurodivergent-focus pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-blue-600"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-slate-400">
          <p>Designed for neurodivergent student athletes ages 12-18</p>
          <p className="mt-1">Empowering athletic excellence through AI analytics</p>
        </div>
      </div>
    </div>
  );
}
