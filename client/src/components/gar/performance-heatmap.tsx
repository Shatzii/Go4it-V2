import React from 'react';
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type PerformanceHeatmapProps = {
  data: {
    name: string;
    value: number;
    fullMark?: number;
  }[];
  height?: number;
  title?: string;
  subtitle?: string;
  showPercentiles?: boolean;
};

export function PerformanceHeatmap({
  data,
  height = 300,
  title,
  subtitle,
  showPercentiles = false
}: PerformanceHeatmapProps) {
  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Helper function to get color based on value
  const getHeatColor = (value: number) => {
    if (value >= 85) return 'from-green-500/90 to-green-600/80 border-green-400';
    if (value >= 70) return 'from-lime-500/90 to-lime-600/80 border-lime-400';
    if (value >= 55) return 'from-yellow-500/90 to-yellow-600/80 border-yellow-400';
    if (value >= 40) return 'from-amber-500/90 to-amber-600/80 border-amber-400';
    if (value >= 25) return 'from-orange-500/90 to-orange-600/80 border-orange-400';
    return 'from-red-500/90 to-red-600/80 border-red-400';
  };
  
  // Get text color based on value
  const getTextColor = (value: number) => {
    if (value >= 70) return 'text-white';
    if (value >= 40) return 'text-white';
    return 'text-white';
  };
  
  // Get percentile badge type
  const getPercentileBadge = (value: number) => {
    if (value >= 90) return { label: 'ELITE', style: 'bg-indigo-800 text-indigo-100' };
    if (value >= 80) return { label: 'EXCELLENT', style: 'bg-blue-800 text-blue-100' };
    if (value >= 70) return { label: 'GOOD', style: 'bg-green-800 text-green-100' };
    if (value >= 50) return { label: 'AVERAGE', style: 'bg-yellow-800 text-yellow-100' };
    if (value >= 30) return { label: 'BELOW AVG', style: 'bg-orange-800 text-orange-100' };
    return { label: 'NEEDS WORK', style: 'bg-red-800 text-red-100' };
  };
  
  return (
    <Card className="p-4 w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2" style={{ minHeight: `${height * 0.8}px` }}>
        {data.map((item, index) => {
          const heatColor = getHeatColor(item.value);
          const textColor = getTextColor(item.value);
          const percentile = getPercentileBadge(item.value);
          const normValue = Math.max(0.1, item.value / 100); // Normalize to 0-1 scale, min size 0.1
          
          // Generate a deterministic height for the category based on its index
          const baseHeight = Math.max(80, height / 3 - 10); // Minimum height of 80px
          const heightMultiplier = [1, 1.2, 0.9, 1.1, 0.95, 1.05][index % 6];
          const itemHeight = baseHeight * heightMultiplier;
          
          return (
            <div
              key={item.name}
              className={`bg-gradient-to-br ${heatColor} rounded-lg border p-3 flex flex-col justify-between`}
              style={{ height: `${itemHeight}px` }}
            >
              <div>
                <h4 className={`font-semibold ${textColor}`}>{item.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-2xl font-bold ${textColor}`}>{item.value}</span>
                  {showPercentiles && (
                    <Badge className={`text-xs ${percentile.style}`}>
                      {percentile.label}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Performance bars to visualize the score */}
              <div className="mt-2">
                <div className="w-full bg-gray-900/30 rounded-full h-1.5 mb-1">
                  <div 
                    className="bg-white rounded-full h-1.5" 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-100">
                    {item.value >= 70 ? 'Strong' : item.value >= 40 ? 'Average' : 'Needs Work'}
                  </span>
                  {item.fullMark && (
                    <span className="text-xs text-gray-100">
                      {item.value}/{item.fullMark}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center">
        <div className="bg-gray-800 rounded-lg p-2 flex gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-300">85-100</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-lime-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-300">70-84</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-300">55-69</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-300">40-54</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-300">25-39</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
            <span className="text-xs text-gray-300">0-24</span>
          </div>
        </div>
      </div>
    </Card>
  );
}