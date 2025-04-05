import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { MessagingProvider } from "./contexts/messaging-context";
import { LayoutProvider } from "./contexts/layout-context";
import { MeasurementProvider } from "./contexts/measurement-context";
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
import TestAuth from "@/pages/test-auth";

// Feature page imports
import FilmComparison from "@/pages/film-comparison";
import FilmComparisonCreate from "@/pages/film-comparison-create";
import FilmComparisonDetail from "@/pages/film-comparison-detail";
import FilmComparisonEdit from "@/pages/film-comparison-edit";
import NextUpSpotlight from "@/pages/nextup-spotlight";
import SpotlightProfile from "@/pages/spotlight-profile";
import SpotlightCreate from "@/pages/spotlight-create";
import MyPlayerXP from "@/pages/myplayer-xp";
import WorkoutVerification from "@/pages/workout-verification";
import VerificationDetail from "@/pages/verification-detail";
import SubmitVerification from "@/pages/submit-verification";
import WeightRoom from "@/pages/weight-room";
import CombineTour from "@/pages/combine-tour";
import HighlightGenerator from "@/pages/highlight-generator";

// New feature page imports - Phase 2
import MyPlayerStarPath from "@/pages/myplayer-star-path";
import MyPlayerAICoach from "@/pages/myplayer-ai-coach";
import ScoutVisionFeed from "@/pages/scoutvision-feed";
import CoachPortal from "@/pages/coach-portal";
import Settings from "@/pages/settings";
import BlogPost from "@/pages/blog-post";

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

  // Admin can access all pages, even role-specific ones
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
      
      <Route path="/test-auth" component={TestAuth} />
      
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
      
      <Route path="/highlight-generator/:id">
        {({ params }) => (
          <ProtectedRoute component={HighlightGenerator} />
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
      
      {/* Film Comparison Feature Routes */}
      <Route path="/film-comparison">
        {({ params }) => (
          <ProtectedRoute component={FilmComparison} />
        )}
      </Route>
      
      <Route path="/film-comparison-create">
        {({ params }) => (
          <ProtectedRoute component={FilmComparisonCreate} />
        )}
      </Route>
      
      <Route path="/film-comparison/:id">
        {({ params }) => (
          <ProtectedRoute component={FilmComparisonDetail} />
        )}
      </Route>
      
      <Route path="/film-comparison-edit/:id">
        {({ params }) => (
          <ProtectedRoute component={FilmComparisonEdit} />
        )}
      </Route>
      
      {/* NextUp Spotlight Feature Routes */}
      <Route path="/nextup-spotlight">
        {({ params }) => (
          <ProtectedRoute component={NextUpSpotlight} />
        )}
      </Route>
      
      <Route path="/spotlight-profile/:id">
        {({ params }) => (
          <ProtectedRoute component={SpotlightProfile} />
        )}
      </Route>
      
      <Route path="/spotlight-create">
        {({ params }) => (
          <ProtectedRoute component={SpotlightCreate} />
        )}
      </Route>
      
      {/* MyPlayer Experience System Routes */}
      <Route path="/myplayer-xp">
        {({ params }) => (
          <ProtectedRoute component={MyPlayerXP} />
        )}
      </Route>
      
      <Route path="/myplayer-star-path">
        {({ params }) => (
          <ProtectedRoute component={MyPlayerStarPath} />
        )}
      </Route>
      
      <Route path="/myplayer-ai-coach">
        {({ params }) => (
          <ProtectedRoute component={MyPlayerAICoach} />
        )}
      </Route>
      
      {/* MyPlayer Workout Verification Routes */}
      <Route path="/workout-verification">
        {({ params }) => (
          <ProtectedRoute component={WorkoutVerification} />
        )}
      </Route>
      
      <Route path="/verification/:id">
        {({ params }) => (
          <ProtectedRoute component={VerificationDetail} />
        )}
      </Route>
      
      <Route path="/submit-verification">
        {({ params }) => (
          <ProtectedRoute component={SubmitVerification} />
        )}
      </Route>
      
      {/* MyPlayer UI Weight Room Route */}
      <Route path="/weight-room">
        {({ params }) => (
          <ProtectedRoute component={WeightRoom} />
        )}
      </Route>
      
      {/* ScoutVision Feed Route */}
      <Route path="/scoutvision-feed">
        {({ params }) => (
          <ProtectedRoute component={ScoutVisionFeed} />
        )}
      </Route>
      
      {/* Combine Tour Route */}
      <Route path="/combine-tour">
        {({ params }) => (
          <ProtectedRoute component={CombineTour} />
        )}
      </Route>
      
      {/* Coach Portal Route */}
      <Route path="/coach-portal">
        {({ params }) => (
          <ProtectedRoute component={CoachPortal} />
        )}
      </Route>
      
      {/* Settings Page Route */}
      <Route path="/settings">
        {({ params }) => (
          <ProtectedRoute component={Settings} />
        )}
      </Route>
      
      {/* Blog Post Page Route */}
      <Route path="/blog/:slug">
        {({ params }) => (
          <BlogPost />
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

  // Don't render the layout for the auth page, test-auth, or home page
  if (location === "/auth") {
    return <AuthPage />;
  }
  
  if (location === "/test-auth") {
    return <TestAuth />;
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
            <MeasurementProvider>
              <AppContent />
              <Toaster />
            </MeasurementProvider>
          </LayoutProvider>
        </MessagingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;