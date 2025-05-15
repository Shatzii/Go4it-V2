import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSimplifiedAuth } from "@/contexts/simplified-auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SimpleAuth() {
  const { user, login, loading } = useSimplifiedAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Please enter your credentials",
        description: "Both username and password are required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(username, password);
    } catch (error) {
      console.error("Login error:", error);
      // Toast is already shown in the login function
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still checking authentication status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Auth Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md bg-gray-800 text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Go4It Sports</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Login to access your performance dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-sm text-center">
              For testing, use: alexjohnson/password123, admin/admin123, or coach/coach123
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - Hero Section */}
      <div className="hidden md:flex md:flex-1 flex-col items-center justify-center bg-blue-900 p-8 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Go4It Sports</h1>
          <h2 className="text-2xl font-medium mb-2">For Neurodivergent Athletes</h2>
          <p className="text-lg mb-6">
            The ultimate platform designed specifically for neurodivergent student athletes.
            Track your performance, connect with coaches, and unlock your potential.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold">StarPath™</div>
              <p className="text-sm">Interactive player development</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">GAR™</div>
              <p className="text-sm">Advanced performance scoring</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">AI Coach</div>
              <p className="text-sm">Personalized training</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}