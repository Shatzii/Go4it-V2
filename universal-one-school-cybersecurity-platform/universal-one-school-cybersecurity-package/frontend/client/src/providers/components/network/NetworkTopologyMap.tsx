import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Network, 
  RefreshCw, 
  Laptop, 
  Server, 
  Smartphone, 
  Wifi, 
  Shield, 
  AlertTriangle, 
  Search,
  Maximize,
  Minimize,
  MonitorSmartphone,
  Router
} from 'lucide-react';

// Interfaces for network node and connection data
interface NetworkNode {
  id: number;
  name: string;
  ipAddress: string;
  type: 'server' | 'workstation' | 'router' | 'firewall' | 'mobile' | 'iot' | 'other';
  status: 'online' | 'offline' | 'warning' | 'compromised';
  securityScore: number;
  lastSeen: string;
  location?: string;
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
}

interface NetworkConnection {
  id: number;
  source: number;
  target: number;
  type: 'wired' | 'wireless' | 'vpn';
  status: 'active' | 'inactive' | 'degraded' | 'suspicious';
  bandwidth?: string;
  latency?: number;
  encrypted?: boolean;
}

interface NetworkData {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
}

export function NetworkTopologyMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [highlightThreats, setHighlightThreats] = useState<boolean>(true);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'topology' | 'security'>('topology');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [offset, setOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
  // Fetch network data
  const { data: networkData, isLoading, refetch } = useQuery<NetworkData>({
    queryKey: ['/api/network/topology'],
    queryFn: async () => {
      // For demo, generate sample network data
      return generateSampleNetworkData();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Generate sample network data for the demo
  const generateSampleNetworkData = (): NetworkData => {
    // Generate nodes in a sensible network layout
    const nodes: NetworkNode[] = [
      // Core infrastructure
      { id: 1, name: 'Core Router', ipAddress: '10.0.0.1', type: 'router', status: 'online', securityScore: 95, lastSeen: new Date().toISOString(), x: 400, y: 300 },
      { id: 2, name: 'Firewall', ipAddress: '10.0.0.2', type: 'firewall', status: 'online', securityScore: 98, lastSeen: new Date().toISOString(), x: 500, y: 300 },
      { id: 3, name: 'Main Switch', ipAddress: '10.0.0.3', type: 'router', status: 'online', securityScore: 90, lastSeen: new Date().toISOString(), x: 400, y: 400 },
      
      // Servers
      { id: 4, name: 'Web Server', ipAddress: '10.0.1.1', type: 'server', status: 'online', securityScore: 85, lastSeen: new Date().toISOString(), x: 300, y: 200 },
      { id: 5, name: 'Database Server', ipAddress: '10.0.1.2', type: 'server', status: 'online', securityScore: 92, lastSeen: new Date().toISOString(), x: 400, y: 200 },
      { id: 6, name: 'File Server', ipAddress: '10.0.1.3', type: 'server', status: 'warning', securityScore: 75, lastSeen: new Date().toISOString(), x: 500, y: 200 },
      { id: 7, name: 'Mail Server', ipAddress: '10.0.1.4', type: 'server', status: 'online', securityScore: 88, lastSeen: new Date().toISOString(), x: 600, y: 200 },
      
      // Workstations
      { id: 8, name: 'Dev Workstation 1', ipAddress: '10.0.2.1', type: 'workstation', status: 'online', securityScore: 82, lastSeen: new Date().toISOString(), x: 200, y: 400 },
      { id: 9, name: 'Dev Workstation 2', ipAddress: '10.0.2.2', type: 'workstation', status: 'online', securityScore: 80, lastSeen: new Date().toISOString(), x: 250, y: 450 },
      { id: 10, name: 'Admin Workstation', ipAddress: '10.0.2.3', type: 'workstation', status: 'online', securityScore: 90, lastSeen: new Date().toISOString(), x: 300, y: 500 },
      { id: 11, name: 'Finance Workstation', ipAddress: '10.0.2.4', type: 'workstation', status: 'offline', securityScore: 70, lastSeen: new Date(Date.now() - 86400000).toISOString(), x: 350, y: 450 },
      
      // Mobile and IoT devices
      { id: 12, name: 'CEO Smartphone', ipAddress: '10.0.3.1', type: 'mobile', status: 'online', securityScore: 85, lastSeen: new Date().toISOString(), x: 600, y: 400 },
      { id: 13, name: 'Conference Room Tablet', ipAddress: '10.0.3.2', type: 'mobile', status: 'online', securityScore: 75, lastSeen: new Date().toISOString(), x: 650, y: 450 },
      { id: 14, name: 'Security Camera 1', ipAddress: '10.0.4.1', type: 'iot', status: 'online', securityScore: 60, lastSeen: new Date().toISOString(), x: 500, y: 500 },
      { id: 15, name: 'Security Camera 2', ipAddress: '10.0.4.2', type: 'iot', status: 'compromised', securityScore: 30, lastSeen: new Date().toISOString(), x: 550, y: 550 },
    ];
    
    // Create connections between nodes
    const connections: NetworkConnection[] = [
      // Core infrastructure connections
      { id: 1, source: 1, target: 2, type: 'wired', status: 'active', bandwidth: '10Gbps', latency: 1, encrypted: true },
      { id: 2, source: 2, target: 3, type: 'wired', status: 'active', bandwidth: '10Gbps', latency: 1, encrypted: true },
      
      // Server connections
      { id: 3, source: 3, target: 4, type: 'wired', status: 'active', bandwidth: '1Gbps', latency: 2, encrypted: true },
      { id: 4, source: 3, target: 5, type: 'wired', status: 'active', bandwidth: '1Gbps', latency: 2, encrypted: true },
      { id: 5, source: 3, target: 6, type: 'wired', status: 'degraded', bandwidth: '1Gbps', latency: 15, encrypted: true },
      { id: 6, source: 3, target: 7, type: 'wired', status: 'active', bandwidth: '1Gbps', latency: 2, encrypted: true },
      
      // Workstation connections
      { id: 7, source: 3, target: 8, type: 'wired', status: 'active', bandwidth: '1Gbps', latency: 3, encrypted: true },
      { id: 8, source: 3, target: 9, type: 'wired', status: 'active', bandwidth: '1Gbps', latency: 3, encrypted: true },
      { id: 9, source: 3, target: 10, type: 'wired', status: 'active', bandwidth: '1Gbps', latency: 3, encrypted: true },
      { id: 10, source: 3, target: 11, type: 'wired', status: 'inactive', bandwidth: '1Gbps', latency: 0, encrypted: true },
      
      // Mobile and IoT connections
      { id: 11, source: 1, target: 12, type: 'wireless', status: 'active', bandwidth: '100Mbps', latency: 5, encrypted: true },
      { id: 12, source: 1, target: 13, type: 'wireless', status: 'active', bandwidth: '100Mbps', latency: 6, encrypted: true },
      { id: 13, source: 3, target: 14, type: 'wired', status: 'active', bandwidth: '100Mbps', latency: 4, encrypted: false },
      { id: 14, source: 3, target: 15, type: 'wired', status: 'suspicious', bandwidth: '100Mbps', latency: 4, encrypted: false },
      
      // Additional connections to show relationships
      { id: 15, source: 4, target: 5, type: 'wired', status: 'active', bandwidth: '1Gbps', latency: 2, encrypted: true },
      { id: 16, source: 6, target: 15, type: 'wireless', status: 'suspicious', bandwidth: '100Mbps', latency: 10, encrypted: false },
    ];
    
    return { nodes, connections };
  };
  
  // Draw the network topology on canvas
  useEffect(() => {
    if (!canvasRef.current || !networkData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and offset
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoomLevel, zoomLevel);
    
    // Draw connections first (so they appear behind nodes)
    networkData.connections.forEach(connection => {
      const sourceNode = networkData.nodes.find(node => node.id === connection.source);
      const targetNode = networkData.nodes.find(node => node.id === connection.target);
      
      if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) return;
      
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      // Set connection style based on status
      switch (connection.status) {
        case 'active':
          ctx.strokeStyle = '#4CAF50';
          ctx.lineWidth = 2;
          break;
        case 'inactive':
          ctx.strokeStyle = '#9E9E9E';
          ctx.lineWidth = 1;
          break;
        case 'degraded':
          ctx.strokeStyle = '#FFC107';
          ctx.lineWidth = 2;
          break;
        case 'suspicious':
          ctx.strokeStyle = '#FF5722';
          ctx.lineWidth = 3;
          if (highlightThreats) {
            // Animated dashed line for suspicious connections
            const dashOffset = Date.now() / 100 % 16;
            ctx.setLineDash([4, 4]);
            ctx.lineDashOffset = -dashOffset;
          }
          break;
        default:
          ctx.strokeStyle = '#2196F3';
          ctx.lineWidth = 2;
      }
      
      // Draw different line styles for different connection types
      if (connection.type === 'wireless') {
        ctx.setLineDash([5, 5]);
      } else if (connection.type === 'vpn') {
        ctx.setLineDash([10, 5]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    });
    
    // Draw nodes
    networkData.nodes.forEach(node => {
      if (!node.x || !node.y) return;
      
      // Determine if this node is being searched for
      const isHighlighted = searchQuery && (
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.ipAddress.includes(searchQuery)
      );
      
      // Determine node appearance based on type and status
      let nodeColor = '#2196F3'; // Default blue
      let nodeSize = 15;
      
      // Set color based on view mode
      if (viewMode === 'topology') {
        // Colors based on node type
        switch (node.type) {
          case 'server':
            nodeColor = '#673AB7'; // Purple
            nodeSize = 20;
            break;
          case 'workstation':
            nodeColor = '#2196F3'; // Blue
            nodeSize = 15;
            break;
          case 'router':
            nodeColor = '#FF9800'; // Orange
            nodeSize = 22;
            break;
          case 'firewall':
            nodeColor = '#F44336'; // Red
            nodeSize = 22;
            break;
          case 'mobile':
            nodeColor = '#4CAF50'; // Green
            nodeSize = 12;
            break;
          case 'iot':
            nodeColor = '#00BCD4'; // Cyan
            nodeSize = 10;
            break;
          default:
            nodeColor = '#9E9E9E'; // Grey
            nodeSize = 15;
        }
        
        // Adjust appearance for node status
        if (node.status === 'offline') {
          nodeColor = '#9E9E9E'; // Grey out offline nodes
        } else if (node.status === 'warning') {
          // Add warning indicator
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize + 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(255, 193, 7, 0.3)';
          ctx.fill();
        } else if (node.status === 'compromised') {
          // Add danger indicator
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize + 8, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(244, 67, 54, 0.3)';
          ctx.fill();
          
          // Pulsing effect for compromised nodes
          if (highlightThreats) {
            const pulseSize = 4 * Math.sin(Date.now() / 200) + 8;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize + pulseSize, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(244, 67, 54, 0.2)';
            ctx.fill();
          }
        }
      } else if (viewMode === 'security') {
        // Colors based on security score
        if (node.securityScore >= 90) {
          nodeColor = '#4CAF50'; // Green (good)
        } else if (node.securityScore >= 70) {
          nodeColor = '#FFC107'; // Yellow (moderate)
        } else if (node.securityScore >= 50) {
          nodeColor = '#FF9800'; // Orange (concerning)
        } else {
          nodeColor = '#F44336'; // Red (critical)
        }
        
        // Size based on node importance
        switch (node.type) {
          case 'server':
          case 'router':
          case 'firewall':
            nodeSize = 20;
            break;
          case 'workstation':
            nodeSize = 15;
            break;
          default:
            nodeSize = 12;
        }
      }
      
      // Draw the node
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      
      // Add border to selected node
      if (selectedNodeId === node.id) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize + 3, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Add search highlight
      if (isHighlighted) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize + 6, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFEB3B';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Draw node labels if enabled
      if (showLabels || selectedNodeId === node.id || isHighlighted) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.name, node.x, node.y + nodeSize + 5);
        
        // Show IP address for selected node
        if (selectedNodeId === node.id || isHighlighted) {
          ctx.fillText(node.ipAddress, node.x, node.y + nodeSize + 20);
        }
      }
      
      // Draw node icon based on type
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '10px Arial';
      
      switch (node.type) {
        case 'server':
          ctx.fillText('S', node.x, node.y);
          break;
        case 'workstation':
          ctx.fillText('W', node.x, node.y);
          break;
        case 'router':
          ctx.fillText('R', node.x, node.y);
          break;
        case 'firewall':
          ctx.fillText('F', node.x, node.y);
          break;
        case 'mobile':
          ctx.fillText('M', node.x, node.y);
          break;
        case 'iot':
          ctx.fillText('I', node.x, node.y);
          break;
        default:
          ctx.fillText('?', node.x, node.y);
      }
    });
    
    ctx.restore();
  }, [networkData, zoomLevel, showLabels, highlightThreats, selectedNodeId, searchQuery, viewMode, offset]);
  
  // Handle mouse interactions with the canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !networkData) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel - offset.x / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel - offset.y / zoomLevel;
    
    // Check if clicked on a node
    const clickedNode = networkData.nodes.find(node => {
      if (!node.x || !node.y) return false;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= 20; // Check within node radius
    });
    
    if (clickedNode) {
      setSelectedNodeId(clickedNode.id);
    } else {
      // Start dragging the canvas
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.0));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleZoomReset = () => {
    setZoomLevel(1.0);
    setOffset({ x: 0, y: 0 });
  };
  
  // Get node details for the selected node
  const selectedNode = selectedNodeId ? networkData?.nodes.find(node => node.id === selectedNodeId) : null;
  
  // Get connection details for the selected node
  const selectedNodeConnections = selectedNodeId ? networkData?.connections.filter(
    conn => conn.source === selectedNodeId || conn.target === selectedNodeId
  ) : [];
  
  return (
    <div className="space-y-4">
      {/* Network Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onValueChange={(value: 'topology' | 'security') => setViewMode(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="topology">Topology View</SelectItem>
              <SelectItem value="security">Security View</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomReset}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <Minimize className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
            <Label htmlFor="show-labels">Labels</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="highlight-threats"
              checked={highlightThreats}
              onCheckedChange={setHighlightThreats}
            />
            <Label htmlFor="highlight-threats">Highlight Threats</Label>
          </div>
          
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Network Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="mr-2 h-5 w-5" />
              Network Topology Map
            </CardTitle>
            <CardDescription>
              Interactive visualization of network devices and connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border border-gray-800 rounded-lg h-[600px] overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full bg-gray-900"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              )}
              
              {/* Map legend */}
              <div className="absolute bottom-4 left-4 bg-gray-800/80 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Legend</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#673AB7] mr-2"></span>
                    <span>Server</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#2196F3] mr-2"></span>
                    <span>Workstation</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#FF9800] mr-2"></span>
                    <span>Router</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#F44336] mr-2"></span>
                    <span>Firewall</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#4CAF50] mr-2"></span>
                    <span>Mobile</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[#00BCD4] mr-2"></span>
                    <span>IoT</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Node Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedNode ? 'Device Details' : 'Network Information'}
            </CardTitle>
            <CardDescription>
              {selectedNode 
                ? `Details for ${selectedNode.name}`
                : 'Select a device to view details'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{selectedNode.name}</h3>
                    <p className="text-sm text-gray-400">{selectedNode.ipAddress}</p>
                  </div>
                  <Badge className={`
                    ${selectedNode.status === 'online' ? 'bg-green-600' : ''}
                    ${selectedNode.status === 'offline' ? 'bg-gray-600' : ''}
                    ${selectedNode.status === 'warning' ? 'bg-amber-600' : ''}
                    ${selectedNode.status === 'compromised' ? 'bg-red-600' : ''}
                  `}>
                    {selectedNode.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-400">Device Type</span>
                    <span className="flex items-center">
                      {selectedNode.type === 'server' && <Server className="h-4 w-4 mr-1" />}
                      {selectedNode.type === 'workstation' && <Laptop className="h-4 w-4 mr-1" />}
                      {selectedNode.type === 'router' && <Router className="h-4 w-4 mr-1" />}
                      {selectedNode.type === 'firewall' && <Shield className="h-4 w-4 mr-1" />}
                      {selectedNode.type === 'mobile' && <Smartphone className="h-4 w-4 mr-1" />}
                      {selectedNode.type === 'iot' && <MonitorSmartphone className="h-4 w-4 mr-1" />}
                      {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-400">Security Score</span>
                    <span className={`font-medium ${
                      selectedNode.securityScore >= 90 ? 'text-green-400' :
                      selectedNode.securityScore >= 70 ? 'text-amber-400' :
                      selectedNode.securityScore >= 50 ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {selectedNode.securityScore}/100
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-400">Last Seen</span>
                    <span>{new Date(selectedNode.lastSeen).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-400">Location</span>
                    <span>{selectedNode.location || 'Main Office'}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Connections</h4>
                  <div className="space-y-2 max-h-[200px] overflow-auto pr-2">
                    {selectedNodeConnections && selectedNodeConnections.length > 0 ? (
                      selectedNodeConnections.map((conn) => {
                        const connectedNodeId = conn.source === selectedNodeId ? conn.target : conn.source;
                        const connectedNode = networkData?.nodes.find(n => n.id === connectedNodeId);
                        
                        return (
                          <div 
                            key={conn.id} 
                            className="flex items-center justify-between p-2 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer"
                            onClick={() => setSelectedNodeId(connectedNodeId)}
                          >
                            <div className="flex items-center">
                              {conn.type === 'wireless' && <Wifi className="h-4 w-4 mr-2 text-blue-400" />}
                              {conn.type === 'wired' && <Network className="h-4 w-4 mr-2 text-green-400" />}
                              {conn.type === 'vpn' && <Shield className="h-4 w-4 mr-2 text-purple-400" />}
                              <span>{connectedNode?.name || `Node ${connectedNodeId}`}</span>
                            </div>
                            <Badge className={`
                              ${conn.status === 'active' ? 'bg-green-600' : ''}
                              ${conn.status === 'inactive' ? 'bg-gray-600' : ''}
                              ${conn.status === 'degraded' ? 'bg-amber-600' : ''}
                              ${conn.status === 'suspicious' ? 'bg-red-600' : ''}
                            `}>
                              {conn.status.toUpperCase()}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-400">No connections found</p>
                    )}
                  </div>
                </div>
                
                {selectedNode.status === 'compromised' && (
                  <div className="mt-4 p-3 bg-red-950/30 border border-red-900 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-400">Security Alert</h4>
                        <p className="text-sm mt-1">This device has been detected as compromised. Recommend immediate isolation and investigation.</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="destructive">Isolate Device</Button>
                    </div>
                  </div>
                )}
                
                {selectedNode.status === 'warning' && (
                  <div className="mt-4 p-3 bg-amber-950/30 border border-amber-900 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-400">Warning</h4>
                        <p className="text-sm mt-1">This device has unusual behavior or security concerns that should be investigated.</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline">Investigate</Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 text-center">
                  <Network className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium">Network Overview</h3>
                  <p className="text-gray-400 mt-2">
                    Select a device from the network map to view detailed information
                  </p>
                </div>
                
                {networkData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Devices</h4>
                      <p className="text-2xl font-semibold">{networkData.nodes.length}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Connections</h4>
                      <p className="text-2xl font-semibold">{networkData.connections.length}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Online</h4>
                      <p className="text-2xl font-semibold text-green-500">
                        {networkData.nodes.filter(node => node.status === 'online').length}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Issues</h4>
                      <p className="text-2xl font-semibold text-red-500">
                        {networkData.nodes.filter(node => ['warning', 'compromised'].includes(node.status)).length}
                      </p>
                    </div>
                  </div>
                )}
                
                {networkData && (
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Security Assessment</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ 
                          width: `${Math.round(networkData.nodes.reduce((acc, node) => acc + node.securityScore, 0) / networkData.nodes.length)}%` 
                        }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {Math.round(networkData.nodes.reduce((acc, node) => acc + node.securityScore, 0) / networkData.nodes.length)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}