import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/services/notificationService';
import { SecurityReportGenerator } from '@/components/reports/SecurityReportGenerator';
import { AlertManagementInterface } from '@/components/alerts/AlertManagementInterface';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Shield, 
  AlertTriangle,
  FileText, 
  BarChart3, 
  Network, 
  Server, 
  LogOut,
  RefreshCw,
  User,
  Settings
} from 'lucide-react';

// Sample security metrics data
const securityMetrics = {
  threatScore: 67,
  alertsToday: 14,
  criticalAlerts: 3,
  resolvedAlerts: 8,
  activeSystems: 42,
  networkNodes: 18,
  detectionRate: 95.7,
  resolutionTime: 22.5
};

export function SecurityDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use notification service if user is authenticated
  const { 
    notifications, 
    connectionStatus, 
    markAllAsRead 
  } = useNotifications(user?.clientId || undefined);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-indigo-500 mr-2" />
          <h1 className="text-xl font-bold text-white">Sentinel AI</h1>
        </div>
        
        <div className="space-y-1">
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
            Alerts
            {unreadCount > 0 && (
              <Badge className="ml-auto bg-red-500">{unreadCount}</Badge>
            )}
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
            variant={activeTab === 'network' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('network')}
          >
            <Network className="h-5 w-5 mr-2" />
            Network
          </Button>
          
          <Button 
            variant={activeTab === 'systems' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('systems')}
          >
            <Server className="h-5 w-5 mr-2" />
            Systems
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        {/* Connection status */}
        <div className="flex items-center mb-2">
          <div 
            className={`h-2 w-2 rounded-full mr-2 ${
              connectionStatus === 'connected' 
                ? 'bg-green-500' 
                : connectionStatus === 'connecting' 
                ? 'bg-amber-500 animate-pulse' 
                : 'bg-red-500'
            }`} 
          />
          <span className="text-sm text-gray-400">
            {connectionStatus === 'connected' 
              ? 'Connected' 
              : connectionStatus === 'connecting' 
              ? 'Connecting...' 
              : 'Disconnected'}
          </span>
        </div>
        
        <div className="mt-auto">
          {user && (
            <div className="flex flex-col">
              <div className="flex items-center p-2 rounded-lg bg-gray-700/50 mb-2">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.username}</span>
                  <span className="text-xs text-gray-400">{user.role}</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Security Overview</h2>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              {/* Security metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Security Score</CardTitle>
                    <CardDescription>Overall security posture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div 
                        className="h-16 w-16 rounded-full border-4 border-indigo-500 flex items-center justify-center mr-4"
                      >
                        <span className="text-xl font-bold">{securityMetrics.threatScore}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Detection Rate</p>
                        <p className="font-medium">{securityMetrics.detectionRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Alerts</CardTitle>
                    <CardDescription>Today's security alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <span className="text-sm text-gray-400">Total</span>
                        <p className="text-xl font-bold">{securityMetrics.alertsToday}</p>
                      </div>
                      <div className="bg-red-900/30 p-2 rounded-lg">
                        <span className="text-sm text-gray-400">Critical</span>
                        <p className="text-xl font-bold">{securityMetrics.criticalAlerts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Systems</CardTitle>
                    <CardDescription>Monitored systems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Active</span>
                        <span className="font-medium">{securityMetrics.activeSystems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Network Nodes</span>
                        <span className="font-medium">{securityMetrics.networkNodes}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Response</CardTitle>
                    <CardDescription>Incident resolution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Resolved Today</span>
                        <span className="font-medium">{securityMetrics.resolvedAlerts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Avg. Resolution Time</span>
                        <span className="font-medium">{securityMetrics.resolutionTime} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Notifications</CardTitle>
                      <CardDescription>
                        Latest security events and alerts
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={markAllAsRead}
                    >
                      Mark All as Read
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="h-10 w-10 text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium">No notifications</h3>
                        <p className="text-gray-400 mt-1">
                          You're all caught up! No new security events to display.
                        </p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 rounded-lg border ${
                            notification.isRead 
                              ? 'bg-gray-800 border-gray-700' 
                              : 'bg-gray-800/50 border-gray-600'
                          }`}
                        >
                          <div className="flex items-start">
                            {notification.type === 'alert' && (
                              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                            )}
                            {notification.type === 'threat' && (
                              <Shield className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                            )}
                            {notification.type === 'system' && (
                              <Server className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <span className="text-xs text-gray-400">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                              {notification.priority === 'high' || notification.priority === 'critical' ? (
                                <Badge 
                                  className={notification.priority === 'critical' ? 'bg-red-600 mt-2' : 'bg-amber-600 mt-2'}
                                >
                                  {notification.priority.toUpperCase()}
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Alert Management</h2>
              </div>
              <AlertManagementInterface clientId={user?.clientId || undefined} />
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Security Reports</h2>
              </div>
              <SecurityReportGenerator clientId={user?.clientId || undefined} />
            </div>
          )}
          
          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Network Security</h2>
              </div>
              <Card className="p-10 text-center">
                <Network className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium">Network Visualization</h3>
                <p className="text-gray-400 mt-2 mb-6">
                  Interactive network topology and security status visualization will be displayed here.
                </p>
                <Button disabled>Network Visualization Coming Soon</Button>
              </Card>
            </div>
          )}
          
          {activeTab === 'systems' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">System Security</h2>
              </div>
              <Card className="p-10 text-center">
                <Server className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium">System Monitoring</h3>
                <p className="text-gray-400 mt-2 mb-6">
                  Real-time system security status and performance metrics will be displayed here.
                </p>
                <Button disabled>System Monitoring Coming Soon</Button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}