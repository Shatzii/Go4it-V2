import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/features/theme-provider";
import ErrorBoundary from "@/components/features/error-boundary";
import AnalyticsTracker from "@/components/features/analytics-tracker";
import PerformanceMonitor from "@/components/features/performance-monitor";
import Header from "@/components/layout/header";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import Home from "@/pages/home";
import CustomerLanding from "@/pages/customer-landing";
import SpacePharaohCommand from "@/pages/spacepharaoh-command";
import AIAgents from "@/pages/ai-agents";
import AIControlCenter from "@/pages/ai-control-center";
import ShatziiDeploymentPlan from "@/pages/shatzii-deployment-plan";
import NeuralPlayground from "@/pages/neural-playground";
import ModelMarketplace from "@/pages/model-marketplace";
import EnterpriseDashboard from "@/pages/enterprise-dashboard";
import AutonomousMarketing from "@/pages/autonomous-marketing";
import AIPlayground from "@/pages/AIPlayground";
import TechShowcase from "@/pages/TechShowcase";
import InteractiveDemo from "@/pages/InteractiveDemo";
import SEOLanding from "@/pages/SEOLanding";
import InnovationLab from "@/pages/InnovationLab";
import AgentManagement from "@/pages/agent-management";
import CustomerDashboard from "@/pages/customer-dashboard";
import EnterpriseProspects from "@/pages/enterprise-prospects";
import EnterpriseAIHealthcare from "@/pages/enterprise-ai-healthcare";
import ProductivityDashboard from "@/pages/productivity-dashboard";
import DriverEarnings from "@/pages/driver-earnings";
import LostRevenueRecovery from "@/pages/lost-revenue-recovery";
import CMSDashboard from "@/pages/cms-dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import TechExpert from "@/pages/TechExpert";
import AutonomousSales from "@/pages/autonomous-sales";
import Products from "@/pages/products";
import Dashboard from "@/pages/dashboard";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";
import { HelpBubble } from "@/components/contextual-help/help-bubble";
import PharaohPage from "@/pages/products/pharaoh";
import SentinelPage from "@/pages/products/sentinel";
import ChatbotButton from "@/components/chatbot/chatbot-button";
import Wizard from "@/pages/wizard";
import AdvancedAnalytics from "@/pages/advanced-analytics";
import DashboardCustomizerPage from "@/pages/dashboard-customizer";
import StudentDashboard from "@/pages/student-dashboard";
import InternshipApplication from "@/pages/internship-application";
import AgentMarketplace from "@/pages/agent-marketplace";
import CollaborativeWorkspace from "@/pages/collaborative-workspace";
import RoofingAI from "@/pages/roofing-ai";
import MasterControlSystem from "@/pages/master-control-system";
import InternManagement from "@/pages/intern-management";
import InvestorDashboard from "@/pages/investor-dashboard";
import SpacePharaohEmpireControl from "@/pages/spacepharaoh-empire-control";
import PaymentCenter from "@/pages/payment-center";
import Checkout from "@/pages/checkout";
import TruckFlowAI from "@/pages/verticals/TruckFlowAI";
import EduSafeAI from "@/pages/verticals/EduSafeAI";
import FinanceFlowAI from "@/pages/verticals/FinanceFlowAI";
import LegalFlowAI from "@/pages/verticals/LegalFlowAI";
import RealtyFlowAI from "@/pages/verticals/RealtyFlowAI";
import ManuFlowAI from "@/pages/verticals/ManuFlowAI";
import InsureFlowAI from "@/pages/verticals/InsureFlowAI";
import GovFlowAI from "@/pages/verticals/GovFlowAI";
import EnergyFlowAI from "@/pages/verticals/EnergyFlowAI";
import TransFlowAI from "@/pages/verticals/TransFlowAI";
import ProFlowAI from "@/pages/verticals/ProFlowAI";

function Router() {
  return (
    <Switch>
      {/* Main Landing Page */}
      <Route path="/" component={Home} />
      
      {/* Authentication */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* AI Platform Features */}
      <Route path="/ai-agents" component={AIAgents} />
      <Route path="/ai-control-center" component={AIControlCenter} />
      <Route path="/agent-management" component={AgentManagement} />
      <Route path="/autonomous-marketing" component={AutonomousMarketing} />
      <Route path="/autonomous-sales" component={AutonomousSales} />
      <Route path="/playground" component={AIPlayground} />
      <Route path="/neural-playground" component={NeuralPlayground} />
      <Route path="/innovation" component={InnovationLab} />
      <Route path="/wizard" component={Wizard} />
      
      {/* Enterprise Tools */}
      <Route path="/enterprise-dashboard" component={EnterpriseDashboard} />
      <Route path="/model-marketplace" component={ModelMarketplace} />
      <Route path="/agent-marketplace" component={AgentMarketplace} />
      <Route path="/enterprise-prospects" component={EnterpriseProspects} />
      <Route path="/collaborative-workspace" component={CollaborativeWorkspace} />
      
      {/* Industry Verticals - All 13 Verticals */}
      <Route path="/verticals/trucking" component={TruckFlowAI} />
      <Route path="/verticals/construction" component={RoofingAI} />
      <Route path="/verticals/healthcare" component={EnterpriseAIHealthcare} />
      <Route path="/verticals/education" component={EduSafeAI} />
      <Route path="/verticals/finance" component={FinanceFlowAI} />
      <Route path="/verticals/legal" component={LegalFlowAI} />
      <Route path="/verticals/realestate" component={RealtyFlowAI} />
      <Route path="/verticals/manufacturing" component={ManuFlowAI} />
      <Route path="/verticals/insurance" component={InsureFlowAI} />
      <Route path="/verticals/government" component={GovFlowAI} />
      <Route path="/verticals/energy" component={EnergyFlowAI} />
      <Route path="/verticals/transportation" component={TransFlowAI} />
      <Route path="/verticals/professional" component={ProFlowAI} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/roofing-ai" component={RoofingAI} />
      <Route path="/healthcare-ai" component={EnterpriseAIHealthcare} />
      <Route path="/driver-earnings" component={DriverEarnings} />
      
      {/* Dashboards */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/customer-dashboard" component={CustomerDashboard} />
      <Route path="/student-dashboard" component={StudentDashboard} />
      <Route path="/productivity" component={ProductivityDashboard} />
      <Route path="/analytics" component={AdvancedAnalytics} />
      <Route path="/dashboard-customizer" component={DashboardCustomizerPage} />
      
      {/* Products */}
      <Route path="/products" component={Products} />
      <Route path="/products/pharaoh" component={PharaohPage} />
      <Route path="/products/sentinel" component={SentinelPage} />
      
      {/* Marketing & Demos */}
      <Route path="/tech" component={TechShowcase} />
      <Route path="/demo" component={InteractiveDemo} />
      <Route path="/ai-development" component={SEOLanding} />
      
      {/* Operations */}
      <Route path="/deployment-plan" component={ShatziiDeploymentPlan} />
      <Route path="/revenue-recovery" component={LostRevenueRecovery} />
      <Route path="/cms" component={CMSDashboard} />
      <Route path="/tech-expert" component={TechExpert} />
      
      {/* Admin */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/command" component={SpacePharaohCommand} />
      <Route path="/empire-control" component={SpacePharaohEmpireControl} />
      <Route path="/payment-center" component={PaymentCenter} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/master-control" component={MasterControlSystem} />
      <Route path="/intern-management" component={InternManagement} />
      <Route path="/investor-dashboard" component={InvestorDashboard} />
      
      {/* Education & Careers */}
      <Route path="/internship" component={InternshipApplication} />
      
      {/* Customer Solutions */}
      <Route path="/customer-landing" component={CustomerLanding} />
      <Route path="/solutions" component={CustomerLanding} />
      
      {/* ===== FALLBACK ===== */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <AuthProvider>
              <div className="min-h-screen bg-slate-950">
                <AnalyticsTracker />
                <Header />
                <Breadcrumbs />
                <main className="relative">
                  <Router />
                </main>
                <ChatbotButton />
                <HelpBubble userRole="user" />
                <PerformanceMonitor />
              </div>
              <Toaster />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
