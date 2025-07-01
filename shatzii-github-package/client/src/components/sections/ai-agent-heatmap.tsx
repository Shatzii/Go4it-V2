import { useState, useEffect } from 'react';
import { Activity, Users, Target, Zap, TrendingUp, Globe, Brain, Bot } from 'lucide-react';

interface AgentActivity {
  id: string;
  name: string;
  vertical: string;
  type: 'marketing' | 'sales' | 'support' | 'analysis';
  status: 'active' | 'processing' | 'idle' | 'optimizing';
  performance: number;
  tasksCompleted: number;
  revenue: number;
  location: { x: number; y: number };
  connections: string[];
}

interface LiveMetric {
  label: string;
  value: number;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}

const agentData: AgentActivity[] = [
  {
    id: 'truck-dispatch',
    name: 'TruckFlow Dispatch AI',
    vertical: 'Transportation',
    type: 'analysis',
    status: 'active',
    performance: 98.7,
    tasksCompleted: 2847,
    revenue: 99000,
    location: { x: 15, y: 25 },
    connections: ['truck-opt', 'driver-ai']
  },
  {
    id: 'truck-opt',
    name: 'Route Optimizer',
    vertical: 'Transportation',
    type: 'analysis',
    status: 'processing',
    performance: 94.2,
    tasksCompleted: 1923,
    revenue: 45000,
    location: { x: 25, y: 35 },
    connections: ['truck-dispatch']
  },
  {
    id: 'driver-ai',
    name: 'Driver Performance AI',
    vertical: 'Transportation',
    type: 'analysis',
    status: 'active',
    performance: 96.1,
    tasksCompleted: 1456,
    revenue: 32000,
    location: { x: 35, y: 20 },
    connections: ['truck-dispatch']
  },
  {
    id: 'health-scheduler',
    name: 'Healthcare Scheduler',
    vertical: 'Healthcare',
    type: 'support',
    status: 'active',
    performance: 97.3,
    tasksCompleted: 3421,
    revenue: 156000,
    location: { x: 55, y: 15 },
    connections: ['health-diagnostics']
  },
  {
    id: 'health-diagnostics',
    name: 'Diagnostic Assistant',
    vertical: 'Healthcare',
    type: 'analysis',
    status: 'processing',
    performance: 99.1,
    tasksCompleted: 967,
    revenue: 289000,
    location: { x: 65, y: 25 },
    connections: ['health-scheduler']
  },
  {
    id: 'finance-compliance',
    name: 'Compliance Monitor',
    vertical: 'Financial',
    type: 'analysis',
    status: 'active',
    performance: 99.8,
    tasksCompleted: 756,
    revenue: 445000,
    location: { x: 75, y: 40 },
    connections: ['finance-risk']
  },
  {
    id: 'finance-risk',
    name: 'Risk Assessment AI',
    vertical: 'Financial',
    type: 'analysis',
    status: 'optimizing',
    performance: 95.4,
    tasksCompleted: 1234,
    revenue: 267000,
    location: { x: 85, y: 50 },
    connections: ['finance-compliance']
  },
  {
    id: 'marketing-lead',
    name: 'Lead Generation Engine',
    vertical: 'Marketing',
    type: 'marketing',
    status: 'active',
    performance: 92.7,
    tasksCompleted: 5647,
    revenue: 89000,
    location: { x: 45, y: 60 },
    connections: ['marketing-content', 'sales-qualify']
  },
  {
    id: 'marketing-content',
    name: 'Content Creator AI',
    vertical: 'Marketing',
    type: 'marketing',
    status: 'processing',
    performance: 88.9,
    tasksCompleted: 2156,
    revenue: 34000,
    location: { x: 55, y: 70 },
    connections: ['marketing-lead']
  },
  {
    id: 'sales-qualify',
    name: 'Lead Qualifier',
    vertical: 'Sales',
    type: 'sales',
    status: 'active',
    performance: 96.8,
    tasksCompleted: 1789,
    revenue: 156000,
    location: { x: 25, y: 65 },
    connections: ['marketing-lead', 'sales-close']
  },
  {
    id: 'sales-close',
    name: 'Deal Closer AI',
    vertical: 'Sales',
    type: 'sales',
    status: 'processing',
    performance: 94.2,
    tasksCompleted: 445,
    revenue: 567000,
    location: { x: 15, y: 75 },
    connections: ['sales-qualify']
  },
  {
    id: 'roof-lead-gen',
    name: 'Roofing Lead Generator',
    vertical: 'Roofing',
    type: 'marketing',
    status: 'active',
    performance: 97.8,
    tasksCompleted: 3247,
    revenue: 89000,
    location: { x: 85, y: 30 },
    connections: ['roof-inspector', 'roof-scheduler']
  },
  {
    id: 'roof-inspector',
    name: 'Drone Inspection AI',
    vertical: 'Roofing',
    type: 'analysis',
    status: 'active',
    performance: 99.2,
    tasksCompleted: 1567,
    revenue: 156000,
    location: { x: 75, y: 15 },
    connections: ['roof-lead-gen', 'roof-estimator']
  },
  {
    id: 'roof-scheduler',
    name: 'Project Scheduler',
    vertical: 'Roofing',
    type: 'support',
    status: 'processing',
    performance: 95.4,
    tasksCompleted: 2134,
    revenue: 234000,
    location: { x: 95, y: 45 },
    connections: ['roof-lead-gen', 'roof-crew']
  },
  {
    id: 'roof-estimator',
    name: 'Cost Estimator AI',
    vertical: 'Roofing',
    type: 'analysis',
    status: 'active',
    performance: 96.7,
    tasksCompleted: 1876,
    revenue: 445000,
    location: { x: 65, y: 8 },
    connections: ['roof-inspector']
  },
  {
    id: 'roof-crew',
    name: 'Crew Management AI',
    vertical: 'Roofing',
    type: 'support',
    status: 'optimizing',
    performance: 93.1,
    tasksCompleted: 987,
    revenue: 123000,
    location: { x: 88, y: 60 },
    connections: ['roof-scheduler']
  }
];

const liveMetrics: LiveMetric[] = [
  {
    label: 'Active Agents',
    value: 202,
    change: '+15%',
    icon: Bot,
    color: 'text-cyan-400'
  },
  {
    label: 'Hourly Revenue',
    value: 47580,
    change: '+34%',
    icon: TrendingUp,
    color: 'text-green-400'
  },
  {
    label: 'Tasks Completed',
    value: 23456,
    change: '+89%',
    icon: Target,
    color: 'text-purple-400'
  },
  {
    label: 'Performance Score',
    value: 96.4,
    change: '+2.1%',
    icon: Activity,
    color: 'text-blue-400'
  }
];

export default function AIAgentHeatmap() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
      // Simulate dynamic connections
      setActiveConnections(agentData[Math.floor(Math.random() * agentData.length)].connections);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/20';
      case 'optimizing': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'marketing': return Users;
      case 'sales': return Target;
      case 'support': return Bot;
      case 'analysis': return Brain;
      default: return Activity;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Activity className="w-4 h-4 animate-pulse" />
            AI Agent Activity Heat Map
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Live <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Agent Network</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real-time visualization of our autonomous AI agents working across all industry verticals. 
            Watch as they collaborate, process tasks, and generate revenue 24/7.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {liveMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-mono">LIVE</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${metric.color} mb-2`}>
                {metric.label === 'Hourly Revenue' ? '$' : ''}
                {metric.value.toLocaleString()}
                {metric.label === 'Performance Score' ? '%' : ''}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">{metric.label}</span>
                <span className="text-green-400 text-sm font-semibold">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Heat Map Visualization */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-3xl border border-slate-600 p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              Global Agent Network
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              {['active', 'processing', 'optimizing', 'idle'].map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[1]}`}></div>
                  <span className="text-slate-400 capitalize">{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Heat Map */}
          <div className="relative h-96 bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {agentData.map(agent => 
                agent.connections.map(connectionId => {
                  const connectedAgent = agentData.find(a => a.id === connectionId);
                  if (!connectedAgent) return null;
                  
                  const isActive = activeConnections.includes(connectionId);
                  
                  return (
                    <line
                      key={`${agent.id}-${connectionId}`}
                      x1={`${agent.location.x}%`}
                      y1={`${agent.location.y}%`}
                      x2={`${connectedAgent.location.x}%`}
                      y2={`${connectedAgent.location.y}%`}
                      stroke={isActive ? '#06b6d4' : '#475569'}
                      strokeWidth={isActive ? '2' : '1'}
                      opacity={isActive ? '0.8' : '0.3'}
                      className="transition-all duration-500"
                    />
                  );
                })
              )}
            </svg>

            {/* Agent nodes */}
            {agentData.map((agent) => {
              const TypeIcon = getTypeIcon(agent.type);
              const isSelected = selectedAgent === agent.id;
              
              return (
                <div
                  key={agent.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
                    isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${agent.location.x}%`,
                    top: `${agent.location.y}%`
                  }}
                  onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                >
                  {/* Pulse animation for active agents */}
                  {agent.status === 'active' && (
                    <div className="absolute inset-0 bg-cyan-400/30 rounded-full animate-ping"></div>
                  )}
                  
                  {/* Agent node */}
                  <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(agent.status)} backdrop-blur-sm transition-all duration-300`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  {/* Tooltip */}
                  {isSelected && (
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-4 min-w-64 z-20">
                      <div className="text-slate-100 font-semibold mb-2">{agent.name}</div>
                      <div className="text-slate-400 text-sm mb-3">{agent.vertical} • {agent.type}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Performance:</span>
                          <span className="text-green-400 font-semibold">{agent.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tasks:</span>
                          <span className="text-cyan-400">{agent.tasksCompleted.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Revenue:</span>
                          <span className="text-green-400 font-semibold">${agent.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Performance Table */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-600 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
              <Zap className="w-5 h-5 text-cyan-400" />
              Top Performing Agents
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-semibold">Agent</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Vertical</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Performance</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Revenue</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {agentData
                  .sort((a, b) => b.performance - a.performance)
                  .slice(0, 6)
                  .map((agent, index) => {
                    const TypeIcon = getTypeIcon(agent.type);
                    return (
                      <tr
                        key={agent.id}
                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(agent.status)}`}>
                              <TypeIcon className="w-4 h-4" />
                            </div>
                            <span className="text-slate-100 font-medium">{agent.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{agent.vertical}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {agent.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 bg-gradient-to-r from-green-500 to-cyan-400 rounded-full transition-all duration-500"
                                style={{ width: `${agent.performance}%` }}
                              ></div>
                            </div>
                            <span className="text-green-400 font-semibold text-sm">{agent.performance}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-green-400 font-semibold">${agent.revenue.toLocaleString()}</td>
                        <td className="p-4 text-cyan-400">{agent.tasksCompleted.toLocaleString()}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}