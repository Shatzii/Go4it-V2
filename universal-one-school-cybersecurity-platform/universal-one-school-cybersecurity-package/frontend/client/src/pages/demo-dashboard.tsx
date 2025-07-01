import React, { useState } from 'react';
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
  Bell,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExecutiveDashboard } from '@/components/executive/ExecutiveDashboard';
import { IncidentResponseWorkflow } from '@/components/incident/IncidentResponseWorkflow';
import { ComplianceAuditCenter } from '@/components/compliance/ComplianceAuditCenter';

export default function DemoDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Demo user data
  const demoUser = {
    username: 'admin',
    role: 'admin'
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
            
            <Button
              variant={activeTab === 'users' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5 mr-2" />
              User Management
            </Button>
            
            <Button
              variant={activeTab === 'executive' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('executive')}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Executive Dashboard
            </Button>
            
            <Button
              variant={activeTab === 'incidents' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('incidents')}
            >
              <Activity className="h-5 w-5 mr-2" />
              Incident Response
            </Button>
            
            <Button
              variant={activeTab === 'compliance' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('compliance')}
            >
              <FileText className="h-5 w-5 mr-2" />
              Compliance & Audit
            </Button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-4 p-2 rounded-md bg-gray-700/50">
            <User className="h-8 w-8 text-gray-300 p-1 bg-gray-600 rounded-full" />
            <div className="ml-2">
              <div className="text-sm font-medium text-white">{demoUser.username}</div>
              <div className="text-xs text-gray-400 capitalize">{demoUser.role}</div>
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
            {activeTab === 'executive' && 'Executive Dashboard'}
            {activeTab === 'incidents' && 'Incident Response'}
            {activeTab === 'compliance' && 'Compliance & Audit'}
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
                
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-gray-800 border-gray-700">
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
                  </Card>
                  
                  <Card className="p-4 bg-gray-800 border-gray-700">
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
                  </Card>
                  
                  <Card className="p-4 bg-gray-800 border-gray-700">
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
                  </Card>
                </div>
                
                {/* Recent alerts and threats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-4 bg-gray-800 border-gray-700">
                    <h4 className="font-medium mb-4">Recent Alerts</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-md">
                        <div className="rounded-full bg-red-900/30 p-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h5 className="font-medium">Critical File Deleted</h5>
                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-900/30 text-red-400 rounded-full">Critical</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">System configuration file removed without authorization</p>
                          <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-md">
                        <div className="rounded-full bg-amber-900/30 p-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h5 className="font-medium">Failed Login Attempts</h5>
                            <span className="ml-2 px-2 py-0.5 text-xs bg-amber-900/30 text-amber-400 rounded-full">Medium</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Multiple failed login attempts from IP 192.168.1.105</p>
                          <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-md">
                        <div className="rounded-full bg-blue-900/30 p-2">
                          <AlertTriangle className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h5 className="font-medium">Network Scan Detected</h5>
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900/30 text-blue-400 rounded-full">Low</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Port scan detected from external IP 203.45.67.89</p>
                          <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 bg-gray-800 border-gray-700">
                    <h4 className="font-medium mb-4">Network Status</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Firewall Status</span>
                          <span className="text-sm font-medium text-green-400">Active</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">VPN Connections</span>
                          <span className="text-sm font-medium">4/5</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">IDS/IPS Status</span>
                          <span className="text-sm font-medium text-green-400">Normal</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Bandwidth Usage</span>
                          <span className="text-sm font-medium">68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-gray-700/50 p-3 rounded-md">
                          <div className="text-sm font-medium">Active Nodes</div>
                          <div className="text-xl font-bold mt-1">24/27</div>
                        </div>
                        
                        <div className="bg-gray-700/50 p-3 rounded-md">
                          <div className="text-sm font-medium">Secure Connections</div>
                          <div className="text-xl font-bold mt-1">18</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-medium mb-4">Alert Management</h3>
                <div className="space-y-4">
                  {/* Alert list would go here */}
                  <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-md">
                    <div className="rounded-full bg-red-900/30 p-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h5 className="font-medium">Critical File Deleted</h5>
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-900/30 text-red-400 rounded-full">Critical</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">System configuration file removed without authorization</p>
                      <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-md">
                    <div className="rounded-full bg-amber-900/30 p-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h5 className="font-medium">Failed Login Attempts</h5>
                        <span className="ml-2 px-2 py-0.5 text-xs bg-amber-900/30 text-amber-400 rounded-full">Medium</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Multiple failed login attempts from IP 192.168.1.105</p>
                      <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 bg-gray-700/50 rounded-md">
                    <div className="rounded-full bg-blue-900/30 p-2">
                      <AlertTriangle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h5 className="font-medium">Network Scan Detected</h5>
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900/30 text-blue-400 rounded-full">Low</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Port scan detected from external IP 203.45.67.89</p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="network">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-medium mb-4">Network Security</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Network topology visualization would display here</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Network Devices</div>
                      <div className="text-xl font-bold mt-1">27</div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Firewall Rules</div>
                      <div className="text-xl font-bold mt-1">184</div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Blocked IPs</div>
                      <div className="text-xl font-bold mt-1">47</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-medium mb-4">Security Analytics</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Security analytics charts would display here</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Total Events</div>
                      <div className="text-xl font-bold mt-1">24,856</div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Incidents</div>
                      <div className="text-xl font-bold mt-1">12</div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">False Positives</div>
                      <div className="text-xl font-bold mt-1">8</div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">MTTR</div>
                      <div className="text-xl font-bold mt-1">2.4h</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-medium mb-4">Security Reports</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-md">
                    <h4 className="font-medium">Monthly Security Summary</h4>
                    <p className="text-sm text-gray-400 mt-1">Generated on May 1, 2025</p>
                    <Button className="mt-3" variant="outline" size="sm">View Report</Button>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-md">
                    <h4 className="font-medium">Threat Intelligence Report</h4>
                    <p className="text-sm text-gray-400 mt-1">Generated on April 28, 2025</p>
                    <Button className="mt-3" variant="outline" size="sm">View Report</Button>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-md">
                    <h4 className="font-medium">Compliance Status Report</h4>
                    <p className="text-sm text-gray-400 mt-1">Generated on April 15, 2025</p>
                    <Button className="mt-3" variant="outline" size="sm">View Report</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-medium mb-4">User Management</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Admin User</h4>
                      <p className="text-sm text-gray-400 mt-1">admin@sentinelai.com</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Reset Password</Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Security Analyst</h4>
                      <p className="text-sm text-gray-400 mt-1">analyst@sentinelai.com</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Reset Password</Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Network Admin</h4>
                      <p className="text-sm text-gray-400 mt-1">network@sentinelai.com</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Reset Password</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}