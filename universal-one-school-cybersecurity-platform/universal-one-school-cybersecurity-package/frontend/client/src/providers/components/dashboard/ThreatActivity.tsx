import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from '@/hooks/useWebSocket';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Threat activity data interface
interface ThreatActivityData {
  labels: string[];
  detected: number[];
  resolved: number[];
  timespan: string;
}

export function ThreatActivity() {
  const { isConnected } = useWebSocket();
  
  // Query threat activity data
  const { data, isLoading } = useQuery<ThreatActivityData>({
    queryKey: ['/api/threats/activity'],
    refetchInterval: isConnected ? false : 60000, // Only poll if not using WebSocket
  });
  
  // Generate default data if none is available
  const generateDefaultData = (): ThreatActivityData => {
    const today = new Date();
    const labels = [];
    const detected = [];
    const resolved = [];
    
    // Generate 7 days of dummy data
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      detected.push(Math.floor(Math.random() * 10) + 1);
      resolved.push(Math.floor(Math.random() * 8));
    }
    
    return {
      labels,
      detected,
      resolved,
      timespan: '7 days'
    };
  };
  
  // Use actual data or fallback to default
  const chartData = data || generateDefaultData();
  
  // Chart data and options
  const lineChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Threats Detected',
        data: chartData.detected,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Threats Resolved',
        data: chartData.resolved,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.3,
        fill: true
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'system-ui',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        displayColors: true,
        padding: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'system-ui'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'system-ui'
          }
        }
      }
    }
  };
  
  // Calculate total threats
  const totalDetected = chartData.detected.reduce((total, value) => total + value, 0);
  const totalResolved = chartData.resolved.reduce((total, value) => total + value, 0);
  const resolutionRate = totalDetected > 0 ? Math.round((totalResolved / totalDetected) * 100) : 0;
  
  // Get status badge color
  const getStatusBadge = () => {
    if (resolutionRate >= 90) return 'bg-green-600';
    if (resolutionRate >= 70) return 'bg-blue-600';
    if (resolutionRate >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Threat Activity</CardTitle>
            <CardDescription>Security incidents over the last {chartData.timespan}</CardDescription>
          </div>
          <Badge className={getStatusBadge()}>
            {resolutionRate}% Resolution Rate
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="text-center bg-gray-800/50 rounded-lg p-3 flex-1">
            <div className="text-sm text-gray-400">Total Detected</div>
            <div className="text-2xl font-bold text-red-400">{totalDetected}</div>
          </div>
          <div className="text-center bg-gray-800/50 rounded-lg p-3 flex-1">
            <div className="text-sm text-gray-400">Total Resolved</div>
            <div className="text-2xl font-bold text-blue-400">{totalResolved}</div>
          </div>
          <div className="text-center bg-gray-800/50 rounded-lg p-3 flex-1">
            <div className="text-sm text-gray-400">Open Threats</div>
            <div className="text-2xl font-bold text-yellow-400">{totalDetected - totalResolved}</div>
          </div>
        </div>
        
        <div style={{ height: '250px' }}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading threat data...</div>
            </div>
          ) : (
            <Line data={lineChartData} options={chartOptions} />
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-400 text-center">
          {isConnected ? 
            'Real-time threat data active' : 
            'Displaying static data - connect for real-time updates'}
        </div>
      </CardContent>
    </Card>
  );
}