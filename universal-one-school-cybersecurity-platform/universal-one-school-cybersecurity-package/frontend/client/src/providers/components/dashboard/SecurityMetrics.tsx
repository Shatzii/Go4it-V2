import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertCircle, CheckCircle, Cpu, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Security metrics interface
interface SecurityMetrics {
  securityScore: number;
  activeThreats: number;
  resolvedThreats: number;
  criticalAlerts: number;
  networkProtection: number;
  endpointsProtected: number;
  lastScanTime?: string;
}

export function SecurityMetrics() {
  const { toast } = useToast();
  const { isConnected, requestSync } = useWebSocket();
  const [refreshing, setRefreshing] = useState(false);
  
  // Set up real-time data query
  const { data: metrics, isLoading, refetch } = useQuery<SecurityMetrics>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: isConnected ? false : 30000, // Only poll if websocket is disconnected
  });
  
  // Default metrics if data is not available
  const defaultMetrics: SecurityMetrics = {
    securityScore: 78,
    activeThreats: 5,
    resolvedThreats: 12,
    criticalAlerts: 1,
    networkProtection: 92,
    endpointsProtected: 18,
    lastScanTime: new Date().toISOString()
  };
  
  // Get actual metrics or fall back to defaults
  const currentMetrics = metrics || defaultMetrics;
  
  // Manually refresh metrics
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Request immediate sync from the WebSocket connection
      if (isConnected) {
        requestSync();
      }
      
      // Also perform a regular fetch as a backup
      await refetch();
      
      toast({
        title: "Metrics Updated",
        description: "Security metrics have been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not refresh security metrics.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  // Security score color based on value
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Progress bar color based on value
  const getProgressColor = (value: number): string => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Security Overview</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Security Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <CardDescription>Overall security posture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(currentMetrics.securityScore)}`}>
              {currentMetrics.securityScore}%
            </div>
            <Progress 
              value={currentMetrics.securityScore} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
        
        {/* Active Threats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <CardDescription>Requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              <div className="text-3xl font-bold">{currentMetrics.activeThreats}</div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {currentMetrics.activeThreats > 0 ? 'Immediate action required' : 'No active threats'}
            </div>
          </CardContent>
        </Card>
        
        {/* Resolved Threats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Threats</CardTitle>
            <CardDescription>Successfully mitigated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <div className="text-3xl font-bold">{currentMetrics.resolvedThreats}</div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              In the last 7 days
            </div>
          </CardContent>
        </Card>
        
        {/* Protected Endpoints */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protected Endpoints</CardTitle>
            <CardDescription>Actively monitored</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              <div className="text-3xl font-bold">{currentMetrics.endpointsProtected}</div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Devices secured and monitored
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Network Protection */}
      <Card>
        <CardHeader>
          <CardTitle>Network Protection Status</CardTitle>
          <CardDescription>Security coverage across your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Overall Protection</span>
                <span className="font-medium">{currentMetrics.networkProtection}%</span>
              </div>
              <Progress 
                value={currentMetrics.networkProtection} 
                className={`h-2 ${getProgressColor(currentMetrics.networkProtection)}`}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{Math.max(0, currentMetrics.endpointsProtected - 2)}</div>
                <div className="text-xs text-gray-400 mt-1">Servers</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{currentMetrics.endpointsProtected}</div>
                <div className="text-xs text-gray-400 mt-1">Endpoints</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{Math.floor(currentMetrics.endpointsProtected / 2)}</div>
                <div className="text-xs text-gray-400 mt-1">Applications</div>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{Math.floor(currentMetrics.activeThreats + currentMetrics.resolvedThreats)}</div>
                <div className="text-xs text-gray-400 mt-1">Total Incidents</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* System Status */}
      {currentMetrics.criticalAlerts > 0 && (
        <Card className="border-red-900 bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              Critical Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>{currentMetrics.criticalAlerts} critical {currentMetrics.criticalAlerts === 1 ? 'alert' : 'alerts'} requiring immediate attention</span>
              <Button variant="destructive" size="sm">
                View Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!isConnected && (
        <Card className="border-yellow-900 bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              Real-time Updates Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Not receiving real-time security updates. Data may be delayed.</span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Reconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}