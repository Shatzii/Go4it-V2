import { useState, useEffect } from "react";
import { Cloud, Database, Cpu, Shield, Zap, Globe } from "lucide-react";

interface TechNode {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  x: number;
  y: number;
  connections: string[];
  status: "active" | "processing" | "standby";
}

export default function TechStackVisualizer() {
  const [nodes, setNodes] = useState<TechNode[]>([
    {
      id: "ai-engine",
      name: "AI Engine",
      category: "Core",
      icon: Cpu,
      x: 50,
      y: 30,
      connections: ["edge-compute", "data-pipeline"],
      status: "active"
    },
    {
      id: "edge-compute",
      name: "Edge Computing",
      category: "Infrastructure",
      icon: Cloud,
      x: 20,
      y: 60,
      connections: ["ai-engine", "security"],
      status: "processing"
    },
    {
      id: "data-pipeline",
      name: "Data Pipeline",
      category: "Analytics",
      icon: Database,
      x: 80,
      y: 60,
      connections: ["ai-engine", "security"],
      status: "active"
    },
    {
      id: "security",
      name: "Zero-Trust Security",
      category: "Security",
      icon: Shield,
      x: 50,
      y: 80,
      connections: ["edge-compute", "data-pipeline"],
      status: "standby"
    }
  ]);

  const [pulseAnimation, setPulseAnimation] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate data flow between nodes
      const activeConnections = nodes.flatMap(node => 
        node.connections.map(conn => `${node.id}-${conn}`)
      );
      
      const randomConnection = activeConnections[Math.floor(Math.random() * activeConnections.length)];
      setPulseAnimation([randomConnection]);
      
      setTimeout(() => setPulseAnimation([]), 1000);

      // Update node statuses
      setNodes(prev => prev.map(node => ({
        ...node,
        status: Math.random() > 0.7 ? "processing" : node.status === "processing" ? "active" : node.status
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "processing": return "bg-blue-500 animate-pulse";
      case "standby": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getConnectionPath = (from: TechNode, to: TechNode) => {
    return `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - 10} ${to.x} ${to.y}`;
  };

  return (
    <div className="glass-morphism p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Live Architecture Topology</h3>
          <p className="text-gray-600">Real-time system architecture visualization</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Processing</span>
          </div>
        </div>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {/* Connection lines */}
          {nodes.map(node => 
            node.connections.map(connId => {
              const targetNode = nodes.find(n => n.id === connId);
              if (!targetNode) return null;
              
              const connectionId = `${node.id}-${connId}`;
              const isActive = pulseAnimation.includes(connectionId);
              
              return (
                <g key={connectionId}>
                  <path
                    d={getConnectionPath(node, targetNode)}
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    fill="none"
                  />
                  {isActive && (
                    <circle r="4" fill="#3B82F6" className="animate-pulse">
                      <animateMotion dur="1s" repeatCount="1">
                        <mpath href={`#path-${connectionId}`} />
                      </animateMotion>
                    </circle>
                  )}
                </g>
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={`w-16 h-16 rounded-full ${getNodeColor(node.status)} flex items-center justify-center shadow-lg border-4 border-white`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{node.name}</div>
                <div className="text-xs text-gray-600">{node.category}</div>
              </div>
            </div>
          );
        })}

        {/* Data flow indicators */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-700">1.2M ops/sec</span>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">47 regions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">99.99%</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">&lt;15ms</div>
          <div className="text-sm text-gray-600">Latency</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">500K+</div>
          <div className="text-sm text-gray-600">Requests/min</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">Zero</div>
          <div className="text-sm text-gray-600">API Costs</div>
        </div>
      </div>
    </div>
  );
}