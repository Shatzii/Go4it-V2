import React from 'react';
import { useAI } from '@/context/AIContext';

const SystemOverview: React.FC = () => {
  const { aiStatus } = useAI();
  
  // Calculate memory usage percentage
  const memoryUsagePercent = aiStatus.memoryUsage.total > 0 
    ? Math.round((aiStatus.memoryUsage.used / aiStatus.memoryUsage.total) * 100) 
    : 0;
  
  // Determine status color
  const getStatusColor = (percent: number) => {
    if (percent >= 90) return 'bg-error-500';
    if (percent >= 70) return 'bg-warning-500';
    return 'bg-success-500';
  };
  
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold mb-2">System Overview</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-700 rounded-lg p-3">
          <div className="text-dark-400 text-xs mb-1">AI MODEL</div>
          <div className="text-white font-medium">{aiStatus.model}</div>
          <div className="mt-1 flex items-center">
            <span className={`w-2 h-2 rounded-full ${aiStatus.isReady ? 'bg-success-500' : 'bg-error-500'} mr-1`}></span>
            <span className={`text-xs ${aiStatus.isReady ? 'text-success-500' : 'text-error-500'}`}>
              {aiStatus.isReady ? 'Running' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="bg-dark-700 rounded-lg p-3">
          <div className="text-dark-400 text-xs mb-1">MEMORY</div>
          <div className="text-white font-medium">
            {(aiStatus.memoryUsage.used / 1024).toFixed(1)}GB / {(aiStatus.memoryUsage.total / 1024).toFixed(1)}GB
          </div>
          <div className="mt-1 w-full bg-dark-600 rounded-full h-1.5">
            <div 
              className={`${getStatusColor(memoryUsagePercent)} h-1.5 rounded-full`} 
              style={{ width: `${memoryUsagePercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
