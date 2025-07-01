import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Cpu, Database } from "lucide-react";

interface DataPoint {
  time: string;
  performance: number;
  users: number;
  cpu: number;
  memory: number;
}

export default function RealTimeAnalytics() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    activeUsers: 2847,
    cpuUsage: 23.5,
    memoryUsage: 67.2,
    throughput: 1284
  });

  useEffect(() => {
    const generateDataPoint = (): DataPoint => {
      const now = new Date();
      return {
        time: now.toLocaleTimeString(),
        performance: 85 + Math.random() * 15,
        users: 2800 + Math.floor(Math.random() * 100),
        cpu: 20 + Math.random() * 30,
        memory: 60 + Math.random() * 25
      };
    };

    // Initialize with some data
    const initialData = Array.from({ length: 20 }, (_, i) => {
      const time = new Date(Date.now() - (19 - i) * 3000);
      return {
        time: time.toLocaleTimeString(),
        performance: 85 + Math.random() * 15,
        users: 2800 + Math.floor(Math.random() * 100),
        cpu: 20 + Math.random() * 30,
        memory: 60 + Math.random() * 25
      };
    });
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), generateDataPoint()];
        return newData;
      });

      setCurrentMetrics({
        activeUsers: 2800 + Math.floor(Math.random() * 100),
        cpuUsage: 20 + Math.random() * 30,
        memoryUsage: 60 + Math.random() * 25,
        throughput: 1200 + Math.floor(Math.random() * 200)
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Real-time metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-morphism p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">LIVE</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{currentMetrics.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Active Users</div>
        </div>

        <div className="glass-morphism p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-5 h-5 text-orange-500" />
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">REAL-TIME</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{currentMetrics.cpuUsage.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">CPU Usage</div>
        </div>

        <div className="glass-morphism p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-purple-500" />
            <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">LIVE</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{currentMetrics.memoryUsage.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Memory Usage</div>
        </div>

        <div className="glass-morphism p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">STREAMING</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{currentMetrics.throughput}</div>
          <div className="text-xs text-gray-600">Req/min</div>
        </div>
      </div>

      {/* Performance chart */}
      <div className="glass-morphism p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Data Stream</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="performance" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#performanceGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resource utilization */}
      <div className="glass-morphism p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}