import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import GarAnalysis from "@/pages/gar-analysis";
import StarPath from "@/pages/starpath";
import Profile from "@/pages/profile";
import AdvancedFeatures from "@/pages/advanced-features";
import USAFootball from "@/pages/usa-football";
import NCAAEligibility from "@/pages/ncaa-eligibility";
import CmsAdmin from "@/pages/cms-admin";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import MobileNav from "@/components/mobile-nav";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/gar-analysis" component={GarAnalysis} />
        <Route path="/starpath" component={StarPath} />
        <Route path="/profile" component={Profile} />
        <Route path="/advanced-features" component={AdvancedFeatures} />
        <Route path="/usa-football" component={USAFootball} />
        <Route path="/ncaa-eligibility" component={NCAAEligibility} />
        <Route path="/cms-admin" component={CmsAdmin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
