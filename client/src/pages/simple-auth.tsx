import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSimplifiedAuth } from "@/contexts/simplified-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function SimpleAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user, loading } = useSimplifiedAuth();
  const [, navigate] = useLocation();

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const success = await login(username, password);
      if (success === false) {
        setErrorMessage("Invalid username or password.");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0e1628" }}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: "#0e1628",
      color: "white",
      margin: 0,
      padding: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
        }}>
          <h1 style={{
            fontSize: "24px",
            textAlign: "center",
            marginBottom: "20px"
          }}>Sign In to Go4It Sports</h1>
          
          {errorMessage && (
            <div style={{
              backgroundColor: "rgba(220, 38, 38, 0.2)",
              border: "1px solid rgba(220, 38, 38, 0.5)",
              color: "#fca5a5",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "20px"
            }}>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <Label 
                htmlFor="username" 
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#94a3b8"
                }}
              >
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <Label 
                htmlFor="password" 
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#94a3b8"
                }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                display: "inline-block",
                width: "100%",
                background: "linear-gradient(to right, #2563eb, #0891b2)",
                padding: "12px",
                borderRadius: "6px",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                textAlign: "center",
                border: "none",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          <div style={{
            fontSize: "14px",
            color: "#94a3b8",
            textAlign: "center",
            marginTop: "20px"
          }}>
            <p>Demo credentials:</p>
            <p>Username: alexjohnson</p>
            <p>Password: password123</p>
          </div>
        </div>
        
        <a 
          href="/" 
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "20px",
            color: "#38bdf8",
            textDecoration: "none"
          }}
        >
          ← Back to Homepage
        </a>
      </div>
    </div>
  );
}