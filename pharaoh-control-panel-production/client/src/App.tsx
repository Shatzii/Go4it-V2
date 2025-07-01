import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { initializeSocket, cleanupSocket } from "./lib/socketClient";

// Pages
import Dashboard from "@/pages/dashboard";
import SelfHealing from "@/pages/self-healing";
import AiAnalyzer from "@/pages/ai-analyzer";
import Landing from "@/pages/landing";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Marketplace from "@/pages/marketplace";
import Subscription from "@/pages/subscription";
import SubscriptionSuccess from "@/pages/subscription/success";
import NotFound from "@/pages/not-found";
import ServersPage from "@/pages/servers";
import TerminalPage from "@/pages/servers/[id]/terminal";
import ServerManagePage from "@/pages/servers/[id]/manage";
import ServerLogsPage from "@/pages/servers/[id]/logs";
import DeploymentPage from "@/pages/deployment";

// Router component to handle authenticated/non-authenticated routes
function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        {/* Public Authentication Routes */}
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        
        {/* Public Landing Page (only for non-authenticated users) */}
        {!isAuthenticated && <Route path="/" component={Landing} />}
        
        {/* Protected Routes */}
        <Route path="/marketplace">
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        </Route>
        <Route path="/self-healing">
          <ProtectedRoute>
            <SelfHealing />
          </ProtectedRoute>
        </Route>
        <Route path="/ai-analyzer">
          <ProtectedRoute>
            <AiAnalyzer />
          </ProtectedRoute>
        </Route>
        <Route path="/subscription">
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        </Route>
        <Route path="/subscription/success">
          <ProtectedRoute>
            <SubscriptionSuccess />
          </ProtectedRoute>
        </Route>
        <Route path="/servers">
          <ProtectedRoute>
            <ServersPage />
          </ProtectedRoute>
        </Route>
        <Route path="/servers/:id/terminal">
          <ProtectedRoute>
            <TerminalPage />
          </ProtectedRoute>
        </Route>
        <Route path="/servers/:id/manage">
          <ProtectedRoute>
            <ServerManagePage />
          </ProtectedRoute>
        </Route>
        <Route path="/servers/:id/logs">
          <ProtectedRoute>
            <ServerLogsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/deployment">
          <ProtectedRoute>
            <DeploymentPage />
          </ProtectedRoute>
        </Route>
        
        {/* Dashboard (default for authenticated users) */}
        <Route path="/">
          {isAuthenticated ? (
            <Dashboard />
          ) : (
            <Landing />
          )}
        </Route>
        
        {/* 404 Page */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  useEffect(() => {
    // Initialize socket connection when app loads
    initializeSocket();
    
    // Clean up socket connection when app unmounts
    return () => {
      cleanupSocket();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
