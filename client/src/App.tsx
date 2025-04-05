import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { MessagingProvider } from "./contexts/messaging-context";
import { LayoutProvider } from "./contexts/layout-context";
import { Loader2 } from "lucide-react";

import Layout from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import VideoAnalysis from "@/pages/video-analysis";
import SportRecommendations from "@/pages/sport-recommendations";
import CoachConnection from "@/pages/coach-connection";
import NcaaClearinghouse from "@/pages/ncaa-clearinghouse";
import AdminDashboard from "@/pages/admin-dashboard";
import UploadVideo from "@/pages/upload-video";
import AuthPage from "@/pages/auth-page";
import AnalysisReport from "@/pages/analysis-report";
import MessagingPage from "@/pages/messaging";
import HomePage from "@/pages/home-page";
import CMSPage from "@/pages/cms-page";

interface ProtectedRouteProps {
  component: React.ComponentType;
  adminOnly?: boolean;
}

function ProtectedRoute({ component: Component, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (adminOnly && user.role !== "admin") {
    navigate("/");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      <Route path="/" component={HomePage} />
      
      <Route path="/dashboard">
        {({ params }) => (
          <ProtectedRoute component={Dashboard} />
        )}
      </Route>
      
      <Route path="/profile">
        {({ params }) => (
          <ProtectedRoute component={Profile} />
        )}
      </Route>
      
      <Route path="/video-analysis">
        {({ params }) => (
          <ProtectedRoute component={VideoAnalysis} />
        )}
      </Route>
      
      <Route path="/video-analysis/:id">
        {({ params }) => (
          <ProtectedRoute component={AnalysisReport} />
        )}
      </Route>
      
      <Route path="/sport-recommendations">
        {({ params }) => (
          <ProtectedRoute component={SportRecommendations} />
        )}
      </Route>
      
      <Route path="/coach-connection">
        {({ params }) => (
          <ProtectedRoute component={CoachConnection} />
        )}
      </Route>
      
      <Route path="/ncaa-clearinghouse">
        {({ params }) => (
          <ProtectedRoute component={NcaaClearinghouse} />
        )}
      </Route>
      
      <Route path="/messaging">
        {({ params }) => (
          <ProtectedRoute component={MessagingPage} />
        )}
      </Route>
      
      <Route path="/admin-dashboard">
        {({ params }) => (
          <ProtectedRoute component={AdminDashboard} adminOnly={true} />
        )}
      </Route>
      
      <Route path="/upload-video">
        {({ params }) => (
          <ProtectedRoute component={UploadVideo} />
        )}
      </Route>
      
      <Route path="/cms">
        {({ params }) => (
          <ProtectedRoute component={CMSPage} adminOnly={true} />
        )}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Don't render the layout for the auth page or home page
  if (location === "/auth") {
    return <AuthPage />;
  }
  
  if (location === "/" && !user) {
    return <HomePage />;
  }

  return (
    <Layout>
      <Router />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MessagingProvider>
          <LayoutProvider>
            <AppContent />
            <Toaster />
          </LayoutProvider>
        </MessagingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;