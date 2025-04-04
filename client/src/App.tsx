import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/auth-context";
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
import AnalysisReport from "@/pages/analysis-report"; // Import the new component

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
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route path="/video-analysis">
        {() => <ProtectedRoute component={VideoAnalysis} />}
      </Route>
      <Route path="/video-analysis/:id"> {/* Added route for analysis report */}
        {() => <ProtectedRoute component={AnalysisReport} />}
      </Route>
      <Route path="/sport-recommendations">
        {() => <ProtectedRoute component={SportRecommendations} />}
      </Route>
      <Route path="/coach-connection">
        {() => <ProtectedRoute component={CoachConnection} />}
      </Route>
      <Route path="/ncaa-clearinghouse">
        {() => <ProtectedRoute component={NcaaClearinghouse} />}
      </Route>
      <Route path="/admin-dashboard">
        {() => <ProtectedRoute component={AdminDashboard} adminOnly={true} />}
      </Route>
      <Route path="/upload-video">
        {() => <ProtectedRoute component={UploadVideo} />}
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Don't render the layout for the auth page
  if (location === "/auth") {
    return <AuthPage />;
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
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;