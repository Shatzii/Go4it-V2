import React, { useState } from 'react';
import { NetworkTopologyMap } from '@/components/network/NetworkTopologyMap';
import { SecurityAnalyticsDashboard } from '@/components/analytics/SecurityAnalyticsDashboard';
import { UserManagementInterface } from '@/components/users/UserManagementInterface';
import { AlertManagementInterface } from '@/components/alerts/AlertManagementInterface';
import { SecurityReportGenerator } from '@/components/reports/SecurityReportGenerator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Network, 
  Users, 
  LogOut, 
  User,
  Settings,
  RefreshCw,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [_, navigate] = useLocation();
  
  // Demo user data (normally would come from authentication)
  const demoUser = {
    id: 1,
    username: 'admin',
    email: 'admin@sentinelai.com',
    role: 'admin',
    clientId: 1
  };
  
  const handleLogout = () => {
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.'
    });
    window.location.href = '/login';
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-indigo-500 mr-2" />
            <h1 className="text-xl font-bold text-white">Sentinel AI</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">Cybersecurity Platform</p>
        </div>
        
        <div className="p-2 overflow-y-auto flex-1">
          <nav className="space-y-1">
            <Button
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
            
            <Button
              variant={activeTab === 'alerts' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('alerts')}
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alert Management
            </Button>
            
            <Button
              variant={activeTab === 'network' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('network')}
            >
              <Network className="h-5 w-5 mr-2" />
              Network Security
            </Button>
            
            <Button
              variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Security Analytics
            </Button>
            
            <Button
              variant={activeTab === 'reports' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('reports')}
            >
              <FileText className="h-5 w-5 mr-2" />
              Reports
            </Button>
            
            {user.role === 'admin' && (
              <Button
                variant={activeTab === 'users' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="h-5 w-5 mr-2" />
                User Management
              </Button>
            )}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-4 p-2 rounded-md bg-gray-700/50">
            <User className="h-8 w-8 text-gray-300 p-1 bg-gray-600 rounded-full" />
            <div className="ml-2">
              <div className="text-sm font-medium text-white">{user.username}</div>
              <div className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')}</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <h2 className="text-xl font-bold text-white">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'alerts' && 'Alert Management'}
            {activeTab === 'network' && 'Network Security'}
            {activeTab === 'analytics' && 'Security Analytics'}
            {activeTab === 'reports' && 'Security Reports'}
            {activeTab === 'users' && 'User Management'}
          </h2>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </header>
        
        {/* Tab content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsContent value="overview">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Security Overview</h3>
                
                {/* Summary cards would go here */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400">Security Health</h4>
                    <div className="flex items-center mt-2">
                      <div className="h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                        <span className="text-xl font-bold">87%</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Overall status</div>
                        <div className="text-sm text-green-400 mt-1">Good</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400">Active Threats</h4>
                    <div className="flex items-center mt-2">
                      <div className="h-16 w-16 rounded-full border-4 border-amber-500 flex items-center justify-center">
                        <span className="text-xl font-bold">3</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Severity</div>
                        <div className="text-sm text-amber-400 mt-1">Medium</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400">System Status</h4>
                    <div className="flex items-center mt-2">
                      <div className="h-16 w-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                        <span className="text-xl font-bold">100%</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm text-gray-400">Uptime</div>
                        <div className="text-sm text-blue-400 mt-1">Operational</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium mb-4">Recent Alerts</h4>
                    <AlertManagementInterface clientId={user.clientId || undefined} />
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium mb-4">Network Status</h4>
                    <NetworkTopologyMap />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts">
              <AlertManagementInterface clientId={user.clientId || undefined} />
            </TabsContent>
            
            <TabsContent value="network">
              <NetworkTopologyMap />
            </TabsContent>
            
            <TabsContent value="analytics">
              <SecurityAnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="reports">
              <SecurityReportGenerator clientId={user.clientId || undefined} />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagementInterface />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}