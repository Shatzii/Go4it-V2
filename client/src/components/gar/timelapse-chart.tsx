import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimelapseChartProps = {
  data: any[];
  height?: number;
  title?: string;
  subtitle?: string;
};

export function TimelapseChart({
  data,
  height = 300,
  title,
  subtitle
}: TimelapseChartProps) {
  const [viewMode, setViewMode] = useState<'line' | 'area'>('line');
  const [focusCategory, setFocusCategory] = useState<string | null>(null);

  // Identify categories from the first data point (excluding date and totalScore)
  const categories = Object.keys(data[0] || {}).filter(key => 
    key !== 'date' && key !== 'totalScore'
  );
  
  // Generate color for each category
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Physical': '#3b82f6', // Blue
      'Mental': '#8b5cf6',   // Purple
      'Technical': '#10b981', // Green
      'totalScore': '#f59e0b' // Amber
    };
    
    return colorMap[category] || '#f43f5e'; // Default to pink
  };

  return (
    <Card className="p-4 w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <div className="flex justify-between mb-4">
        <div>
          {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as 'line' | 'area')}
          className="w-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="line" className="text-xs px-2 py-1">Line</TabsTrigger>
            <TabsTrigger value="area" className="text-xs px-2 py-1">Area</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="w-full" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#e5e7eb', fontSize: 10 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#e5e7eb', fontSize: 10 }}
              />
              
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  borderColor: '#374151',
                  color: '#f9fafb',
                  borderRadius: '0.375rem'
                }}
                itemStyle={{ color: '#f9fafb' }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              
              <Legend 
                wrapperStyle={{ color: '#f9fafb', fontSize: '12px' }}
                onClick={(e) => {
                  if (focusCategory === e.dataKey) {
                    setFocusCategory(null);
                  } else {
                    setFocusCategory(e.dataKey as string);
                  }
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="totalScore" 
                name="Overall Score"
                stroke={getCategoryColor('totalScore')} 
                strokeWidth={focusCategory === 'totalScore' || !focusCategory ? 3 : 1}
                opacity={focusCategory === null || focusCategory === 'totalScore' ? 1 : 0.3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              
              {categories.map(category => (
                <Line 
                  key={category}
                  type="monotone" 
                  dataKey={category} 
                  name={category}
                  stroke={getCategoryColor(category)} 
                  strokeWidth={focusCategory === category || !focusCategory ? 2 : 1}
                  opacity={focusCategory === null || focusCategory === category ? 1 : 0.3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
              
              <ReferenceLine 
                y={50} 
                stroke="#64748b" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Average", 
                  position: "insideBottomRight",
                  fill: "#94a3b8",
                  fontSize: 10
                }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#e5e7eb', fontSize: 10 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#e5e7eb', fontSize: 10 }}
              />
              
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  borderColor: '#374151',
                  color: '#f9fafb',
                  borderRadius: '0.375rem'
                }}
                itemStyle={{ color: '#f9fafb' }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              
              <Legend 
                wrapperStyle={{ color: '#f9fafb', fontSize: '12px' }}
                onClick={(e) => {
                  if (focusCategory === e.dataKey) {
                    setFocusCategory(null);
                  } else {
                    setFocusCategory(e.dataKey as string);
                  }
                }}
              />
              
              <Area 
                type="monotone" 
                dataKey="totalScore" 
                name="Overall Score"
                stroke={getCategoryColor('totalScore')} 
                fill={`${getCategoryColor('totalScore')}50`}
                strokeWidth={focusCategory === 'totalScore' || !focusCategory ? 3 : 1}
                opacity={focusCategory === null || focusCategory === 'totalScore' ? 1 : 0.3}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              
              {categories.map(category => (
                <Area 
                  key={category}
                  type="monotone" 
                  dataKey={category} 
                  name={category}
                  stroke={getCategoryColor(category)} 
                  fill={`${getCategoryColor(category)}50`}
                  strokeWidth={focusCategory === category || !focusCategory ? 2 : 1}
                  opacity={focusCategory === null || focusCategory === category ? 1 : 0.3}
                  activeDot={{ r: 5 }}
                />
              ))}
              
              <ReferenceLine 
                y={50} 
                stroke="#64748b" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Average", 
                  position: "insideBottomRight",
                  fill: "#94a3b8",
                  fontSize: 10
                }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Trend Analysis */}
      {data.length >= 2 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="p-2 bg-blue-900/20 border border-blue-800/30 rounded-md">
            <h4 className="text-xs font-semibold mb-1">Performance Trend</h4>
            <div className="text-xs">
              <span className="text-gray-400">Overall progress: </span>
              <span className={data[data.length - 1].totalScore > data[0].totalScore 
                ? "text-green-400 font-medium" 
                : "text-red-400 font-medium"}>
                {data[data.length - 1].totalScore > data[0].totalScore ? "+" : ""}
                {(data[data.length - 1].totalScore - data[0].totalScore).toFixed(1)} pts
              </span>
            </div>
          </div>
          
          <div className="p-2 bg-gray-800 border border-gray-700 rounded-md">
            <h4 className="text-xs font-semibold mb-1">Most Recent Change</h4>
            <div className="text-xs">
              <span className="text-gray-400">Last update: </span>
              <span className={data[data.length - 1].totalScore > data[data.length - 2].totalScore 
                ? "text-green-400 font-medium" 
                : "text-red-400 font-medium"}>
                {data[data.length - 1].totalScore > data[data.length - 2].totalScore ? "+" : ""}
                {(data[data.length - 1].totalScore - data[data.length - 2].totalScore).toFixed(1)} pts
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}