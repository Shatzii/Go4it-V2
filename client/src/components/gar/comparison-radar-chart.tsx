import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';
import { Card } from "@/components/ui/card";

type ComparisonRadarChartProps = {
  currentData: {
    name: string;
    value: number;
  }[];
  previousData: {
    name: string;
    value: number;
  }[];
  height?: number;
  colors?: [string, string]; // [current, previous]
  title?: string;
  subtitle?: string;
};

export function ComparisonRadarChart({
  currentData,
  previousData,
  height = 300,
  colors = ['#3b82f6', '#f59e0b'], // Blue for current, amber for previous
  title,
  subtitle
}: ComparisonRadarChartProps) {
  // Ensure we have the same categories for both datasets
  const combinedData = currentData.map(current => {
    const previous = previousData.find(prev => prev.name === current.name);
    return {
      name: current.name,
      current: current.value,
      previous: previous?.value || 0,
      fullMark: 100
    };
  });
  
  // Calculate differences for labeling
  const getDifference = (current: number, previous: number) => {
    const diff = current - previous;
    return diff > 0 ? `+${diff}` : diff;
  };
  
  return (
    <Card className="p-4 w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      )}
      <div className="w-full" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={combinedData}>
            <PolarGrid stroke="#4b5563" />
            <PolarAngleAxis 
              dataKey="name"
              tick={{ fill: '#e5e7eb', fontSize: 12 }}
            />
            
            {/* Previous data radar */}
            <Radar
              name="Previous"
              dataKey="previous"
              stroke={colors[1]}
              fill={colors[1]}
              fillOpacity={0.3}
              dot={{ stroke: colors[1], strokeWidth: 2, fill: colors[1], r: 3 }}
            />
            
            {/* Current data radar */}
            <Radar
              name="Current"
              dataKey="current"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.6}
              dot={{ stroke: colors[0], strokeWidth: 2, fill: colors[0], r: 3 }}
            >
              <LabelList 
                dataKey={(entry: any) => getDifference(entry.current, entry.previous)} 
                position="top"
                style={{ fontSize: '10px', fill: '#fff', fontWeight: 'bold' }}
              />
            </Radar>
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                borderColor: '#374151',
                color: '#f9fafb',
                borderRadius: '0.375rem'
              }}
              itemStyle={{ color: '#f9fafb' }}
              formatter={(value) => [`${value}`, '']}
              labelFormatter={(label) => `${label}`}
            />
            <Legend 
              wrapperStyle={{ color: '#f9fafb' }} 
              iconType="circle"
              align="center"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Improvement summary */}
      <div className="mt-3 p-3 bg-blue-900/20 border border-blue-800/30 rounded-md">
        <h4 className="text-sm font-semibold mb-1">Performance Summary</h4>
        <div className="flex justify-between text-xs">
          <div>
            <span className="text-gray-400">Improved areas: </span>
            <span className="text-blue-400 font-medium">
              {combinedData.filter(d => d.current > d.previous).length}/{combinedData.length}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Biggest gain: </span>
            <span className="text-green-400 font-medium">
              {Math.max(...combinedData.map(d => d.current - d.previous)) > 0 
                ? `+${Math.max(...combinedData.map(d => d.current - d.previous))} pts` 
                : "None"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}