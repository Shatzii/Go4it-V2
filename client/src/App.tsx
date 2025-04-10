import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { MessagingProvider } from "./contexts/messaging-context";
import { LayoutProvider } from "./contexts/layout-context";
import { MeasurementProvider } from "./contexts/measurement-context";
import { Loader2 } from "lucide-react";
import { AccessibilityControls } from "@/components/accessibility/accessibility-controls";
// REMOVED: import { GlobalAgreementModal } from "@/components/global-agreement-modal";
import { useEffect } from "react";

import Layout from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import AthleteProfile from "@/pages/athlete-profile";
import VideoAnalysis from "@/pages/video-analysis";
import VideoAnalysisDetail from "@/pages/video-analysis-detail";
import VideoAnalysisGARPage from "@/pages/video-analysis-page";
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
import SmsMessagingPage from "@/pages/sms-messaging";

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
import SimpleLogin from "@/pages/simple-login";

// New feature page imports - Phase 2
import MyPlayerStarPath from "@/pages/myplayer-star-path";
import MyPlayerAICoach from "@/pages/myplayer-ai-coach";
import ScoutVisionFeed from "@/pages/scoutvision-feed";
import CoachPortal from "@/pages/coach-portal";
import Settings from "@/pages/settings";
import BlogPost from "@/pages/blog-post";
import BlogList from "@/pages/blog-list";
import GarScorePage from "@/pages/gar-score";
import AthleteStarProfilesPage from "@/pages/athlete-star-profiles";
import EnhancedGarVisualizationPage from "@/pages/enhanced-gar-visualization";
import EnhancedGARPage from "@/pages/enhanced-gar";

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

// Simple scroll-to-top component that runs on route changes
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/auth" component={AuthPage} />
        
        <Route path="/simple-login" component={SimpleLogin} />
        
        <Route path="/test-auth" component={TestAuth} />
        
        <Route path="/" component={HomePage} />
        
        {/* Add /app route to handle NDA redirection */}
        <Route path="/app" component={HomePage} />
        
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        
        <Route path="/profile">
          {() => <ProtectedRoute component={Profile} />}
        </Route>
        
        <Route path="/video-analysis">
          {() => <ProtectedRoute component={VideoAnalysis} />}
        </Route>
        
        <Route path="/video-analysis/:id">
          {() => <ProtectedRoute component={AnalysisReport} />}
        </Route>
        
        <Route path="/video-analysis-detail/:id">
          {() => <ProtectedRoute component={VideoAnalysisDetail} />}
        </Route>
        
        <Route path="/highlight-generator/:id">
          {() => <ProtectedRoute component={HighlightGenerator} />}
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
        
        <Route path="/messaging">
          {() => <ProtectedRoute component={MessagingPage} />}
        </Route>
        
        <Route path="/admin-dashboard">
          {() => <ProtectedRoute component={AdminDashboard} adminOnly={true} />}
        </Route>
        
        <Route path="/upload-video">
          {() => <ProtectedRoute component={UploadVideo} />}
        </Route>
        
        <Route path="/cms">
          {() => <ProtectedRoute component={CMSPage} adminOnly={true} />}
        </Route>
        
        {/* Film Comparison Feature Routes */}
        <Route path="/film-comparison">
          {() => <ProtectedRoute component={FilmComparison} />}
        </Route>
        
        <Route path="/film-comparison-create">
          {() => <ProtectedRoute component={FilmComparisonCreate} />}
        </Route>
        
        <Route path="/film-comparison/:id">
          {() => <ProtectedRoute component={FilmComparisonDetail} />}
        </Route>
        
        <Route path="/film-comparison-edit/:id">
          {() => <ProtectedRoute component={FilmComparisonEdit} />}
        </Route>
        
        {/* NextUp Spotlight Feature Routes */}
        <Route path="/nextup-spotlight">
          {() => <ProtectedRoute component={NextUpSpotlight} />}
        </Route>
        
        <Route path="/spotlight-profile/:id">
          {() => <ProtectedRoute component={SpotlightProfile} />}
        </Route>
        
        <Route path="/spotlight-create">
          {() => <ProtectedRoute component={SpotlightCreate} />}
        </Route>
        
        {/* MyPlayer Experience System Routes */}
        <Route path="/myplayer-xp">
          {() => <ProtectedRoute component={MyPlayerXP} />}
        </Route>
        
        <Route path="/myplayer-star-path">
          {() => <ProtectedRoute component={MyPlayerStarPath} />}
        </Route>
        
        <Route path="/myplayer-ai-coach">
          {() => <ProtectedRoute component={MyPlayerAICoach} />}
        </Route>
        
        {/* MyPlayer Workout Verification Routes */}
        <Route path="/workout-verification">
          {() => <ProtectedRoute component={WorkoutVerification} />}
        </Route>
        
        <Route path="/verification/:id">
          {() => <ProtectedRoute component={VerificationDetail} />}
        </Route>
        
        <Route path="/submit-verification">
          {() => <ProtectedRoute component={SubmitVerification} />}
        </Route>
        
        {/* MyPlayer UI Weight Room Route */}
        <Route path="/weight-room">
          {() => <ProtectedRoute component={WeightRoom} />}
        </Route>
        
        {/* ScoutVision Feed Route */}
        <Route path="/scoutvision-feed">
          {() => <ProtectedRoute component={ScoutVisionFeed} />}
        </Route>
        
        {/* Combine Tour Route */}
        <Route path="/combine-tour">
          {() => <ProtectedRoute component={CombineTour} />}
        </Route>
        
        {/* Coach Portal Route */}
        <Route path="/coach-portal">
          {() => <ProtectedRoute component={CoachPortal} />}
        </Route>
        
        {/* Settings Page Route */}
        <Route path="/settings">
          {() => <ProtectedRoute component={Settings} />}
        </Route>
        
        {/* SMS Messaging Route */}
        <Route path="/sms-messaging">
          {() => <ProtectedRoute component={SmsMessagingPage} />}
        </Route>
        
        {/* Blog Routes */}
        <Route path="/blog">
          {() => <BlogList />}
        </Route>
        
        <Route path="/blog/:slug">
          {() => <BlogPost />}
        </Route>
        
        {/* GAR Score Page Route */}
        <Route path="/gar-score">
          {() => <ProtectedRoute component={GarScorePage} />}
        </Route>
        
        {/* Enhanced GAR Visualization Route */}
        <Route path="/enhanced-gar">
          {() => <ProtectedRoute component={EnhancedGARPage} />}
        </Route>

        <Route path="/enhanced-gar/:id">
          {() => <ProtectedRoute component={EnhancedGARPage} />}
        </Route>
        
        {/* Legacy Enhanced GAR Visualization Route */}
        <Route path="/enhanced-gar-visualization">
          {() => <ProtectedRoute component={EnhancedGarVisualizationPage} />}
        </Route>
        
        {/* Enhanced GAR Score Route */}
        <Route path="/gar-score-enhanced">
          {() => <ProtectedRoute component={GarScorePage} />}
        </Route>
        
        {/* Video Analysis GAR Score Dashboard Route */}
        <Route path="/video-analysis-gar/:id">
          {() => <ProtectedRoute component={VideoAnalysisGARPage} />}
        </Route>
        
        {/* Athlete Profile Page Route */}
        <Route path="/profile/:id">
          {() => <AthleteProfile />}
        </Route>
        
        {/* Athlete Star Profiles Route */}
        <Route path="/athlete-star-profiles">
          {() => <ProtectedRoute component={AthleteStarProfilesPage} />}
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
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
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white text-lg">Loading Go4It Sports...</p>
        </div>
      </div>
    );
  }

  // Don't render the layout for the auth page, simple-login, test-auth, or home page
  if (location === "/auth") {
    return <AuthPage />;
  }
  
  if (location === "/simple-login") {
    return <SimpleLogin />;
  }
  
  if (location === "/test-auth") {
    return <TestAuth />;
  }
  
  // Handle root route for homepage
  if (location === "/" && !user) {
    return <HomePage />;
  }
  
  // Updated: Don't redirect /app route anymore - instead render the home page directly
  // This ensures the NDA will be shown on every login and prevents redirect loops
  if (location === "/app") {
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
              {/* REMOVED: <GlobalAgreementModal /> */}
              <AppContent />
              <AccessibilityControls />
              <Toaster />
            </MeasurementProvider>
          </LayoutProvider>
        </MessagingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;