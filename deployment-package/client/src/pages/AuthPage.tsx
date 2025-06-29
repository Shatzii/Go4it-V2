import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/simplified-auth-context";
import { useToast } from "@/hooks/use-toast";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"athlete" | "coach" | "admin">("athlete");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAuthenticated, login, register } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        if (!name || !email) {
          toast({
            title: "Error",
            description: "All fields are required",
            variant: "destructive",
          });
          return;
        }
        
        await register(username, password, name, email, role);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: "#0e1628" }}>
      {/* Auth Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-5 py-12 md:p-16">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Go4It Sports
            </h1>
            <p className="text-slate-400">
              {isLogin 
                ? "Sign in to your account to continue" 
                : "Create an account to get started"}
            </p>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-6 md:p-8 shadow-xl">
            {/* Form Tabs */}
            <div className="flex mb-6 border-b border-slate-800">
              <button
                className={`pb-3 px-4 font-medium text-sm ${
                  isLogin 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-slate-400 hover:text-slate-300"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`pb-3 px-4 font-medium text-sm ${
                  !isLogin 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-slate-400 hover:text-slate-300"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>
            
            {/* Auth Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">
                        I am a:
                      </label>
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as "athlete" | "coach" | "admin")}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="athlete">Athlete</option>
                        <option value="coach">Coach</option>
                      </select>
                    </div>
                  </>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? "Signing in..." : "Creating account..."}
                      </>
                    ) : (
                      <>{isLogin ? "Sign In" : "Create Account"}</>
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-400">
              {isLogin ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-400 hover:text-blue-300 focus:outline-none"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-400 hover:text-blue-300 focus:outline-none"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Development build for go4itsports.org
            </p>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div 
        className="w-full md:w-1/2 bg-slate-900 flex items-center justify-center p-8 hidden md:flex"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, rgba(14, 22, 40, 0.9), rgba(14, 22, 40, 0.95))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="bg-blue-600 p-4 rounded-full inline-block mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.4 19.8C19.4 18.4 20.7 16.2 20.9 13.7C21.1 11.2 20.3 8.7 18.5 6.9C16.8 5.1 14.2 4.1 11.7 4.1C9.19999 4.1 6.59999 5.1 4.89999 6.9C3.09999 8.7 2.29999 11.2 2.49999 13.7C2.69999 16.2 4.09999 18.4 5.99999 19.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21C13.6569 21 15 19.6569 15 18C15 16.3431 13.6569 15 12 15C10.3431 15 9 16.3431 9 18C9 19.6569 10.3431 21 12 21Z" fill="white"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Elevate Your Athletic Potential</h2>
            <p className="text-slate-300">
              Go4It Sports combines cutting-edge video analysis with a personalized StarPath™ development system to help neurodivergent athletes reach their full potential.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-blue-400 font-medium mb-2">Video Analysis</h3>
              <p className="text-slate-300 text-sm">Upload your game footage for professional GAR scoring and personalized insights.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-blue-400 font-medium mb-2">StarPath Progress</h3>
              <p className="text-slate-300 text-sm">Track your development through interactive skill trees and achievement systems.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-blue-400 font-medium mb-2">NCAA Eligibility</h3>
              <p className="text-slate-300 text-sm">Monitor your academic progress toward meeting college eligibility requirements.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-blue-400 font-medium mb-2">Coach Connections</h3>
              <p className="text-slate-300 text-sm">Connect with coaches who can help take your game to the next level.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;