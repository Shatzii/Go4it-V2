import { useEffect, useState } from 'react';
import { Route, Switch, Router } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeSocket, cleanupSocket } from '@/lib/socketClient';

// Layout Components
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

// Page Components
import Dashboard from '@/pages/dashboard';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import Landing from '@/pages/landing';
import AiAnalyzer from '@/pages/ai-analyzer';
import SelfHealing from '@/pages/self-healing';
import Marketplace from '@/pages/marketplace';
import Subscription from '@/pages/subscription';
import SubscriptionSuccess from '@/pages/subscription/success';
import NotFound from '@/pages/not-found';
import ServersPage from '@/pages/servers';
import TerminalPage from '@/pages/servers/[id]/terminal';
import ServerManagePage from '@/pages/servers/[id]/manage';
import ServerLogsPage from '@/pages/servers/[id]/logs';
import DeploymentPage from '@/pages/deployment';
import DeploySite from '@/pages/deployment/deploy-site';
import DeployComplete from '@/pages/deployment/deploy-complete';
import Settings from '@/pages/settings';
import TokenSetup from '@/pages/token-setup';
import Integrations from '@/pages/integrations';

// Main Layout Component with Sidebar and Navigation
function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav toggleSidebar={toggleSidebar} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Switch>
            {/* Dashboard */}
            <Route path="/" component={Dashboard} />
            
            {/* AI Features */}
            <Route path="/ai-analyzer" component={AiAnalyzer} />
            <Route path="/self-healing" component={SelfHealing} />
            <Route path="/marketplace" component={Marketplace} />
            
            {/* Server Management */}
            <Route path="/servers" component={ServersPage} />
            <Route path="/servers/:id/terminal" component={TerminalPage} />
            <Route path="/servers/:id/manage" component={ServerManagePage} />
            <Route path="/servers/:id/logs" component={ServerLogsPage} />
            
            {/* Deployment */}
            <Route path="/deployment" component={DeploymentPage} />
            <Route path="/deployment/deploy" component={DeployComplete} />
            
            {/* Subscription */}
            <Route path="/subscription" component={Subscription} />
            <Route path="/subscription/success" component={SubscriptionSuccess} />
            
            {/* Settings */}
            <Route path="/settings" component={Settings} />
            <Route path="/token-setup" component={TokenSetup} />
            
            {/* Integrations */}
            <Route path="/integrations" component={Integrations} />
            
            {/* Fallback */}
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

// Standalone Pages (without main layout)
function StandalonePages() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Switch>
        {/* Authentication Pages */}
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        <Route path="/landing" component={Landing} />
        
        {/* Default to Main Layout */}
        <Route component={MainLayout} />
      </Switch>
    </div>
  );
}

// Root App Component
function App() {
  useEffect(() => {
    // Initialize real-time socket connection
    initializeSocket();
    
    // Cleanup on unmount
    return () => {
      cleanupSocket();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Router>
              <StandalonePages />
            </Router>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;