import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Wifi, WifiOff, Shield, AlertCircle, Server, Globe, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NetworkNode } from "@shared/schema";

// Network topology visualization component
function NetworkTopology({ nodes }: { nodes: NetworkNode[] }) {
  return (
    <div className="w-full h-[400px] relative border rounded-lg border-gray-700 p-4 overflow-hidden">
      {/* Central server node */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center">
          <Server className="w-8 h-8 text-blue-400" />
          <div className="absolute top-[80px] text-sm font-medium">Core Server</div>
        </div>
      </div>
      
      {/* Dynamic nodes */}
      {nodes.map((node, index) => {
        const isEven = index % 2 === 0;
        const angleOffset = (index * Math.PI * 2) / nodes.length;
        const radius = 150;
        const x = Math.cos(angleOffset) * radius;
        const y = Math.sin(angleOffset) * radius;
        
        // Connection line
        const lineStyle = {
          strokeDasharray: node.status === 'offline' ? '5,5' : 'none',
          stroke: node.status === 'online' ? '#3b82f6' : 
                 node.status === 'filtered' ? '#f59e0b' : '#6b7280',
          strokeWidth: 2
        };
        
        return (
          <div key={node.id}>
            {/* Connection line to central server */}
            <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <line 
                x1="50%" 
                y1="50%" 
                x2={`calc(50% + ${x}px)`} 
                y2={`calc(50% + ${y}px)`} 
                style={lineStyle} 
              />
            </svg>
            
            {/* Node */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `calc(50% + ${x}px)`, 
                top: `calc(50% + ${y}px)`, 
              }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center
                ${node.status === 'online' ? 'bg-green-900' : 
                  node.status === 'filtered' ? 'bg-amber-900' : 'bg-gray-800'}`}>
                {node.status === 'online' ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="absolute whitespace-nowrap text-xs font-medium mt-1 transform -translate-x-1/2 left-1/2">
                {node.name.length > 15 ? `${node.name.slice(0, 12)}...` : node.name}
              </div>
              <div className="absolute whitespace-nowrap text-xs text-gray-400 mt-5 transform -translate-x-1/2 left-1/2">
                {node.ip}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function NetworkPage() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  
  // Fetch network nodes
  const { data: nodes = [], isLoading, refetch } = useQuery<NetworkNode[]>({
    queryKey: ["/api/network/nodes"],
  });
  
  // Device stats
  const activeDevices = nodes.filter(node => node.status === 'online').length;
  const offlineDevices = nodes.filter(node => node.status === 'offline').length;
  const filteredDevices = nodes.filter(node => node.status === 'filtered').length;
  
  // Handle network scan
  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      const response = await fetch("/api/network/scan", {
        method: "POST"
      });
      
      if (response.ok) {
        toast({
          title: "Network Scan Complete",
          description: "Successfully scanned network for devices and vulnerabilities.",
        });
        refetch();
      } else {
        const data = await response.json();
        toast({
          title: "Scan Failed",
          description: data.message || "Failed to perform network scan.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during network scan.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  // Color-coded badge for node status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-600">Online</Badge>;
      case 'offline':
        return <Badge variant="outline">Offline</Badge>;
      case 'filtered':
        return <Badge className="bg-amber-600">Filtered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Network Security</h1>
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            onClick={() => refetch()}
            disabled={isLoading || isScanning}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Scan Network
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-20">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Wifi className="h-4 w-4 mr-2 text-green-400" />
                  Online Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeDevices}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center">
                  <WifiOff className="h-4 w-4 mr-2 text-gray-400" />
                  Offline Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{offlineDevices}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-400" />
                  Suspicious Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredDevices}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="topology">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="topology">Network Topology</TabsTrigger>
              <TabsTrigger value="devices">Device List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="topology" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Network Visualization</CardTitle>
                  <CardDescription>Visual representation of your network topology</CardDescription>
                </CardHeader>
                <CardContent>
                  {nodes.length > 0 ? (
                    <NetworkTopology nodes={nodes} />
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No network nodes found. Run a network scan to discover devices.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Network Devices</CardTitle>
                  <CardDescription>All devices discovered on your network</CardDescription>
                </CardHeader>
                <CardContent>
                  {nodes.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Open Ports</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nodes.map(node => (
                          <TableRow key={node.id}>
                            <TableCell className="font-medium">{node.name}</TableCell>
                            <TableCell>{node.ip}</TableCell>
                            <TableCell>{node.type}</TableCell>
                            <TableCell>{node.openPorts?.join(', ') || 'None'}</TableCell>
                            <TableCell>{getStatusBadge(node.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No network nodes found. Run a network scan to discover devices.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Network Security Recommendations</CardTitle>
              <CardDescription>
                Based on our analysis of your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDevices > 0 ? (
                  <Alert className="border-amber-800 bg-amber-900/20">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <AlertDescription className="text-amber-100">
                      {filteredDevices} {filteredDevices === 1 ? 'device has' : 'devices have'} suspicious activity. Review the filtered devices for potential security issues.
                    </AlertDescription>
                  </Alert>
                ) : null}
                
                <Alert className="border-blue-800 bg-blue-900/20">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-100">
                    Regularly scan your network to discover new devices and potential vulnerabilities.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-blue-800 bg-blue-900/20">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-100">
                    Monitor network traffic patterns to identify unusual behavior that may indicate security threats.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}