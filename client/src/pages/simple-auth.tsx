import React, { useState } from "react";
import { useLocation } from "wouter";

const SimpleAuth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Hard-coded credentials for now to bypass API issues
    if (
      (username === "alexjohnson" && password === "password123") ||
      (username === "admin" && password === "admin123") ||
      (username === "coach" && password === "coach123")
    ) {
      // Store user data for session persistence
      localStorage.setItem(
        "go4it_user",
        JSON.stringify({
          username,
          name:
            username === "alexjohnson"
              ? "Alex Johnson"
              : username === "admin"
              ? "Admin User"
              : "Coach Smith",
          role:
            username === "alexjohnson"
              ? "athlete"
              : username === "admin"
              ? "admin"
              : "coach",
        })
      );
      
      // Redirect to the main app
      navigate("/app");
    } else {
      setError("Invalid username or password.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1628] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-[rgba(15,23,42,0.6)] p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-white">
            Sign In to Go4It Sports
          </h1>
          
          {error && (
            <div className="mb-4 rounded border border-red-300 bg-[rgba(220,38,38,0.2)] p-3 text-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-2 block text-sm text-gray-400"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded bg-[#1e293b] p-3 text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-gray-400"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded bg-[#1e293b] p-3 text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-gradient-to-r from-blue-600 to-cyan-600 p-3 font-bold text-white hover:opacity-90 disabled:opacity-70"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Demo credentials:</p>
            <p>Username: alexjohnson</p>
            <p>Password: password123</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <a href="/" className="text-cyan-400 hover:underline">
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimpleAuth;