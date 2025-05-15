import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SimplifiedAuthProvider, useSimplifiedAuth } from "./contexts/simplified-auth-context";
import { MessagingProvider } from "./contexts/messaging-context";
import { LayoutProvider } from "./contexts/layout-context";
import { MeasurementProvider } from "./contexts/measurement-context";
import { Loader2 } from "lucide-react";
import { AccessibilityControls } from "@/components/accessibility/accessibility-controls";
import { lazy, Suspense, useEffect } from "react";

import Layout from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import ServerError from "@/pages/server-error";
import Forbidden from "@/pages/forbidden";
import Unauthorized from "@/pages/unauthorized";
import SimpleHome from "@/pages/simple-home";
import SimpleAuth from "@/pages/simple-auth";

// Lazy-loaded core pages
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Profile = lazy(() => import("@/pages/profile"));
const AthleteProfile = lazy(() => import("@/pages/athlete-profile"));
const ProfileSettings = lazy(() => import("@/pages/profile-settings"));
const MessagingPage = lazy(() => import("@/pages/messaging"));
const SmsMessagingPage = lazy(() => import("@/pages/sms-messaging"));

// Lazy-loaded video analysis pages
const VideoAnalysis = lazy(() => import("@/pages/video-analysis"));
const VideoAnalysisDetail = lazy(() => import("@/pages/video-analysis-detail"));
const VideoAnalysisGARPage = lazy(() => import("@/pages/video-analysis-page"));
const AnalysisReport = lazy(() => import("@/pages/analysis-report"));
const UploadVideo = lazy(() => import("@/pages/upload-video"));
const HighlightGenerator = lazy(() => import("@/pages/highlight-generator"));
const VideoHighlightsPage = lazy(() => import("@/pages/video-highlights-page"));
const AIVideoPlayerDemo = lazy(() => import("@/pages/ai-video-player-demo"));

// Lazy-loaded athlete development pages
const SportRecommendations = lazy(() => import("@/pages/sport-recommendations"));
const CoachConnection = lazy(() => import("@/pages/coach-connection"));
const NcaaClearinghouse = lazy(() => import("@/pages/ncaa-clearinghouse"));
const GarScorePage = lazy(() => import("@/pages/gar-score"));
const EnhancedGARPage = lazy(() => import("@/pages/enhanced-gar"));
const EnhancedGarVisualizationPage = lazy(() => import("@/pages/enhanced-gar-visualization"));
const AcademicProgress = lazy(() => import("@/pages/academic-progress"));

// Lazy-loaded admin pages
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const ContentManager = lazy(() => import("@/pages/admin/content-manager"));
const CmsManager = lazy(() => import("@/pages/admin/cms-manager"));
const UploaderPage = lazy(() => import("@/pages/admin/uploader-page"));
const StatusPage = lazy(() => import("@/pages/admin/status"));
const LogsPage = lazy(() => import("@/pages/admin/logs"));
const StarProfilesManager = lazy(() => import("@/pages/admin/star-profiles-manager"));
const StarProfileDetail = lazy(() => import("@/pages/admin/star-profile-detail"));
const AnalyticsDashboard = lazy(() => import("@/pages/analytics-dashboard"));

// Lazy-loaded film comparison pages
const FilmComparison = lazy(() => import("@/pages/film-comparison"));
const FilmComparisonCreate = lazy(() => import("@/pages/film-comparison-create"));
const FilmComparisonDetail = lazy(() => import("@/pages/film-comparison-detail"));
const FilmComparisonEdit = lazy(() => import("@/pages/film-comparison-edit"));

// Lazy-loaded spotlight pages
const NextUpSpotlight = lazy(() => import("@/pages/nextup-spotlight"));
const SpotlightProfile = lazy(() => import("@/pages/spotlight-profile"));
const SpotlightCreate = lazy(() => import("@/pages/spotlight-create"));

// Lazy-loaded MyPlayer pages
const MyPlayerXP = lazy(() => import("@/pages/myplayer-xp"));
const MyPlayerXPEnhanced = lazy(() => import("@/pages/myplayer-xp-enhanced"));
const MyPlayerStarPath = lazy(() => import("@/pages/myplayer-star-path"));
const EnhancedStarPath = lazy(() => import("@/pages/myplayer/enhanced-star-path"));
const MyPlayerAICoach = lazy(() => import("@/pages/myplayer-ai-coach"));
const HybridAICoach = lazy(() => import("@/pages/hybrid-ai-coach"));
const MyPlayerInterface = lazy(() => import("@/pages/myplayer-interface"));
const WorkoutVerification = lazy(() => import("@/pages/workout-verification"));
const VerificationDetail = lazy(() => import("@/pages/verification-detail"));
const SubmitVerification = lazy(() => import("@/pages/submit-verification"));
const WeightRoom = lazy(() => import("@/pages/weight-room"));

// Lazy-loaded other feature pages
const ScoutVisionFeed = lazy(() => import("@/pages/scoutvision-feed"));
const CoachPortal = lazy(() => import("@/pages/coach-portal"));
const Settings = lazy(() => import("@/pages/settings"));
const ProfileCompletionPage = lazy(() => import("@/pages/profile-completion"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const BlogList = lazy(() => import("@/pages/blog-list"));
const SkillTreePage = lazy(() => import("@/pages/skill-tree-page"));
const AthleteStarProfilesPage = lazy(() => import("@/pages/athlete-star-profiles"));
const EnhancedSkillTreePage = lazy(() => import("@/pages/enhanced-skill-tree-page"));
const TextToAnimationPage = lazy(() => import("@/pages/text-to-animation"));
const AthleticCombineShowcasePage = lazy(() => import("@/pages/athletic-combine-showcase"));
const AthleteSocialHub = lazy(() => import("@/pages/athlete-social-hub"));
const SkillDevelopmentTracker = lazy(() => import("@/pages/skill-development-tracker"));
const StrategyBoardPage = lazy(() => import("@/pages/strategy-board-page"));
const CombineTour = lazy(() => import("@/pages/combine-tour"));
const CombineTourDetail = lazy(() => import("@/pages/combine-tour-detail"));
const CombinePublic = lazy(() => import("@/pages/combine-public"));

interface ProtectedRouteProps {
  component: React.ComponentType;
  adminOnly?: boolean;
}

function ProtectedRoute({ component: Component, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useSimplifiedAuth();
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

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    }>
      <Component />
    </Suspense>
  );
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
        <Route path="/auth" component={SimpleAuth} />
        
        <Route path="/" component={SimpleHome} />
        
        {/* Add /app route to handle NDA redirection */}
        <Route path="/app" component={SimpleHome} />
        
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
        
        <Route path="/admin/content-manager">
          {() => <ProtectedRoute component={ContentManager} adminOnly={true} />}
        </Route>
        
        <Route path="/admin/cms-manager">
          {() => <ProtectedRoute component={CmsManager} adminOnly={true} />}
        </Route>
        
        <Route path="/admin/analytics-dashboard">
          {() => <ProtectedRoute component={AnalyticsDashboard} adminOnly={true} />}
        </Route>

        <Route path="/admin/uploader">
          {() => <ProtectedRoute component={UploaderPage} adminOnly={true} />}
        </Route>

        <Route path="/admin/status">
          {() => <ProtectedRoute component={StatusPage} adminOnly={true} />}
        </Route>

        <Route path="/admin/logs">
          {() => <ProtectedRoute component={LogsPage} adminOnly={true} />}
        </Route>

        <Route path="/admin/star-profiles">
          {() => <ProtectedRoute component={StarProfilesManager} adminOnly={true} />}
        </Route>

        <Route path="/admin/star-profiles/:userId">
          {() => <ProtectedRoute component={StarProfileDetail} adminOnly={true} />}
        </Route>
        
        <Route path="/upload-video">
          {() => <ProtectedRoute component={UploadVideo} />}
        </Route>
        
        {/* Old CMS page removed in favor of the new CMS Manager */}
        
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
        
        <Route path="/myplayer-xp-enhanced">
          {() => <ProtectedRoute component={MyPlayerXPEnhanced} />}
        </Route>
        
        <Route path="/myplayer-star-path">
          {() => <ProtectedRoute component={MyPlayerStarPath} />}
        </Route>
        
        <Route path="/myplayer/enhanced-star-path">
          {() => <ProtectedRoute component={EnhancedStarPath} />}
        </Route>
        
        <Route path="/myplayer-ai-coach">
          {() => <ProtectedRoute component={MyPlayerAICoach} />}
        </Route>
        
        <Route path="/hybrid-ai-coach">
          {() => <ProtectedRoute component={HybridAICoach} />}
        </Route>

        <Route path="/myplayer-interface">
          {() => <ProtectedRoute component={MyPlayerInterface} />}
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
        
        {/* Combine Tour Routes */}
        <Route path="/combine-tour">
          {() => <ProtectedRoute component={CombineTour} />}
        </Route>
        
        <Route path="/combine-tour/:id">
          {() => <ProtectedRoute component={CombineTourDetail} />}
        </Route>
        
        {/* Combine Public Route */}
        <Route path="/combine-public">
          {() => <ProtectedRoute component={CombinePublic} />}
        </Route>
        
        {/* Coach Portal Route */}
        <Route path="/coach-portal">
          {() => <ProtectedRoute component={CoachPortal} />}
        </Route>
        
        {/* Settings Page Route */}
        <Route path="/settings">
          {() => <ProtectedRoute component={Settings} />}
        </Route>
        
        {/* Profile Settings Route */}
        <Route path="/profile-settings">
          {() => <ProtectedRoute component={ProfileSettings} />}
        </Route>
        
        {/* Profile Completion Route */}
        <Route path="/profile-completion">
          {() => <ProtectedRoute component={ProfileCompletionPage} />}
        </Route>
        
        {/* SMS Messaging Route */}
        <Route path="/sms-messaging">
          {() => <ProtectedRoute component={SmsMessagingPage} />}
        </Route>
        
        {/* Blog Routes */}
        <Route path="/blog">
          {() => (
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-border" />
              </div>
            }>
              <BlogList />
            </Suspense>
          )}
        </Route>
        
        <Route path="/blog/:slug">
          {() => (
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-border" />
              </div>
            }>
              <BlogPost />
            </Suspense>
          )}
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
          {() => (
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-border" />
              </div>
            }>
              <AthleteProfile />
            </Suspense>
          )}
        </Route>
        
        {/* Athlete Star Profiles Route */}
        <Route path="/athlete-star-profiles">
          {() => <ProtectedRoute component={AthleteStarProfilesPage} />}
        </Route>
        
        {/* Academic Progress Route */}
        <Route path="/academic-progress">
          {() => <ProtectedRoute component={AcademicProgress} />}
        </Route>
        
        <Route path="/academic-progress/:studentId">
          {() => <ProtectedRoute component={AcademicProgress} />}
        </Route>
        
        {/* Skill Tree Routes */}
        <Route path="/skill-tree">
          {() => <ProtectedRoute component={SkillTreePage} />}
        </Route>
        
        <Route path="/enhanced-skill-tree">
          {() => <ProtectedRoute component={EnhancedSkillTreePage} />}
        </Route>
        
        {/* Video Highlights Route */}
        <Route path="/video-highlights">
          {() => <ProtectedRoute component={VideoHighlightsPage} />}
        </Route>
        
        {/* AI Video Player Demo Route */}
        <Route path="/ai-video-player">
          {() => <ProtectedRoute component={AIVideoPlayerDemo} />}
        </Route>
        
        {/* Analytics Dashboard Route */}
        <Route path="/analytics-dashboard">
          {() => <ProtectedRoute component={AnalyticsDashboard} />}
        </Route>
        
        {/* Text to Animation Studio Route */}
        <Route path="/text-to-animation">
          {() => <ProtectedRoute component={TextToAnimationPage} />}
        </Route>

        {/* Athletic Combine Showcase Route */}
        <Route path="/athletic-combine-showcase">
          {() => <ProtectedRoute component={AthleticCombineShowcasePage} />}
        </Route>

        {/* Athlete Social Hub Route */}
        <Route path="/athlete-social-hub">
          {() => <ProtectedRoute component={AthleteSocialHub} />}
        </Route>

        {/* Skill Development Tracker Route */}
        <Route path="/skill-development-tracker">
          {() => <ProtectedRoute component={SkillDevelopmentTracker} />}
        </Route>

        {/* Error Pages */}
        <Route path="/server-error" component={ServerError} />
        <Route path="/forbidden" component={Forbidden} />
        <Route path="/unauthorized" component={Unauthorized} />

        {/* Strategy Board Routes */}
        <Route path="/strategy-board">
          {() => <ProtectedRoute component={StrategyBoardPage} />}
        </Route>
        
        <Route path="/strategy-board/:sessionId">
          {() => <ProtectedRoute component={StrategyBoardPage} />}
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const { user, loading } = useSimplifiedAuth();
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
    return <SimpleAuth />;
  }
  
  // Original auth page still available at /full-auth
  // Remove auth page references
  
  // Handle root route for homepage
  if (location === "/") {
    return <SimpleHome />;
  }
  
  // Use simplified home page for /app path to avoid potential issues
  if (location === "/app") {
    return <SimpleHome />;
  }

  return (
    <Layout>
      <Router />
    </Layout>
  );
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">Please try refreshing the page or contact support if the problem persists.</p>
          <pre className="bg-muted p-4 rounded-md my-4 max-w-xl overflow-auto text-sm">
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
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
          <MessagingProvider>
            <LayoutProvider>
              <MeasurementProvider>
                <AppContent />
                <AccessibilityControls />
                <Toaster />
              </MeasurementProvider>
            </LayoutProvider>
          </MessagingProvider>
        </SimplifiedAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;