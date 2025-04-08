import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from "@/components/ui/card";

type GarRadarChartProps = {
  data: {
    name: string;
    value: number;
    fullMark?: number;
  }[];
  height?: number;
  title?: string;
  subtitle?: string;
};

export function GarRadarChart({
  data,
  height = 300,
  title,
  subtitle
}: GarRadarChartProps) {
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
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#e5e7eb', fontSize: 10 }}
            />
            <Radar
              name="GAR Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              dot={{ stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6', r: 4 }}
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
              labelFormatter={(label) => `${label}`}
            />
            <Legend wrapperStyle={{ color: '#f9fafb' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}