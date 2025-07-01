import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Bell, Terminal, ShieldAlert } from "lucide-react";
import { SecurityMetrics } from "@/components/dashboard/SecurityMetrics";
import { ThreatActivity } from "@/components/dashboard/ThreatActivity";
import { useToast } from "@/hooks/use-toast";
import type { DashboardStats } from "@/types/security";

export default function Dashboard() {
  const { user } = useAuth();
  const { isConnected, requestSync } = useWebSocket();
  const { toast } = useToast();
  const [isGeneratingAlert, setIsGeneratingAlert] = useState(false);

  // Fetch dashboard data
  const { isLoading, refetch } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user?.clientId || user?.role === "admin",
    refetchInterval: isConnected ? false : 30000, // Only poll if not connected to WebSocket
  });

  // Generate an alert for testing
  const generateTestAlert = async () => {
    setIsGeneratingAlert(true);
    
    try {
      const response = await fetch("/api/alerts/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ severity: "medium" })
      });
      
      if (response.ok) {
        toast({
          title: "Test Alert Generated",
          description: "A security alert has been created. Check your notifications.",
        });
        
        // Refresh dashboard data
        refetch();
      } else {
        toast({
          title: "Error",
          description: "Failed to generate test alert",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAlert(false);
    }
  };

  // Force refresh of all dashboard data
  const handleRefresh = () => {
    if (isConnected) {
      requestSync(); // Request immediate sync from WebSocket
    }
    refetch(); // Also perform a regular API fetch
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
          <p className="text-gray-400 mt-1">Your cybersecurity command center</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={generateTestAlert} 
            disabled={isGeneratingAlert}
          >
            {isGeneratingAlert ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4 mr-2" />
                Generate Test Alert
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* WebSocket Connection Status */}
      <div className="flex items-center space-x-2 text-sm">
        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        <span className="text-gray-400">
          {isConnected ? 'Connected to real-time security feed' : 'Connecting to security feed...'}
        </span>
        {isConnected && (
          <Badge variant="outline" className="ml-2 bg-blue-900/30">
            <Terminal className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        )}
      </div>
      
      {/* Not connected warning */}
      {!isConnected && (
        <div className="bg-amber-900/10 border border-amber-800/20 rounded-lg p-3">
          <p className="text-amber-400 text-sm">
            ⚠️ Real-time updates disconnected. Attempting to reconnect...
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center p-20">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Security metrics section */}
          <SecurityMetrics />
          
          {/* Threat activity and recent alerts section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThreatActivity />
            
            <div className="grid grid-cols-1 gap-6">
              {/* Recent alerts/incidents card will go here */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Security Incidents</CardTitle>
                  <CardDescription>Latest alerts from your systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className={`mt-0.5 p-1.5 rounded-full ${
                          i === 0 ? 'bg-red-900/40 text-red-400' : 
                          i === 1 ? 'bg-amber-900/40 text-amber-400' : 
                          'bg-blue-900/40 text-blue-400'
                        }`}>
                          <ShieldAlert className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {i === 0 ? 'Critical File Deleted' :
                             i === 1 ? 'Suspicious Login Attempt' :
                             'Port Scan Detected'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(Date.now() - (i * 1000 * 60 * 30)).toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge variant={i === 0 ? 'destructive' : 'outline'}>
                          {i === 0 ? 'Critical' : i === 1 ? 'Medium' : 'Low'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Recent alerts card component
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden ${className || ''}`}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b border-gray-800">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-white">{children}</h3>;
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-400">{children}</p>;
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4">{children}</div>;
}
