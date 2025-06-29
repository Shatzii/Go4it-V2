import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SimplifiedAuthProvider } from "./contexts/simplified-auth-context";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import SimpleHome from "@/pages/simple-home";
import SimpleAuth from "@/pages/simple-auth";

// Simple scroll-to-top component that runs on route changes
function ScrollToTop() {
  const [location] = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/auth" component={SimpleAuth} />
        <Route path="/" component={SimpleHome} />
        <Route path="/app" component={SimpleHome} />
        <Route path="/dashboard" component={SimpleHome} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const [location, setLocation] = useLocation();

  // Safety check for unexpected or empty routes
  if (!location || location === '' || location === undefined) {
    console.log('Empty route detected, redirecting to auth page');
    // Force redirect to auth on next tick
    setTimeout(() => {
      setLocation("/auth");
    }, 10);
    
    // Show loader while redirecting
    return (
      <div className="flex items-center justify-center h-screen w-screen" style={{ backgroundColor: "#0e1628" }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: "#2563eb" }} />
          <p className="text-white text-lg">Loading Go4It Sports...</p>
        </div>
      </div>
    );
  }

  // Render the simplified router directly
  return <Router />;
}

// ErrorBoundary component to catch rendering errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("UI Rendering Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#0e1628", color: "white", padding: "1rem" }}>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">Please try refreshing the page or contact support if the problem persists.</p>
          <pre style={{ 
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            padding: "1rem",
            borderRadius: "0.5rem",
            margin: "1rem 0",
            maxWidth: "36rem",
            overflow: "auto",
            fontSize: "0.875rem" 
          }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem", 
              background: "linear-gradient(to right, #2563eb, #0891b2)",
              color: "white",
              borderRadius: "0.375rem",
              fontWeight: "bold"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SimplifiedAuthProvider>
          <AppContent />
          <Toaster />
        </SimplifiedAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;