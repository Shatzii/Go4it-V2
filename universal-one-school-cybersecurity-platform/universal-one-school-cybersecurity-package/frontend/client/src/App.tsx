import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import DemoDashboard from "@/pages/demo-dashboard";
import { AuthProvider } from "@/providers/AuthProvider";

function Router() {
  const [location] = useLocation();

  // Simple routing without auth dependency
  if (location === '/dashboard') {
    return <DemoDashboard />;
  }
  
  if (location === '/login' || location === '/') {
    return <Login />;
  }
  
  return <NotFound />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
