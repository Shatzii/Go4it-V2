import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from "@/components/ui/card";

type RadarChartProps = {
  data: {
    name: string;
    value: number;
    fullMark: number;
  }[];
  height?: number;
  colors?: string[];
  title?: string;
  subtitle?: string;
};

export function GarRadarChart({
  data,
  height = 300,
  colors = ['#3b82f6', '#8b5cf6', '#10b981'],
  title,
  subtitle
}: RadarChartProps) {
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
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#4b5563" />
            <PolarAngleAxis 
              dataKey="name"
              tick={{ fill: '#e5e7eb', fontSize: 12 }}
            />
            <Radar
              name="Current"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.6}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                borderColor: '#374151',
                color: '#f9fafb',
                borderRadius: '0.375rem'
              }}
              itemStyle={{ color: '#f9fafb' }}
              formatter={(value) => [`${value}`, 'Score']}
            />
            <Legend wrapperStyle={{ color: '#f9fafb' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}