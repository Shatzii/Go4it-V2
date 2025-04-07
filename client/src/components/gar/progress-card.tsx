import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

type ProgressCardProps = {
  title: string;
  value: number;
  maxValue?: number;
  icon?: LucideIcon;
  color?: string;
  description?: string;
  compact?: boolean;
  showPercentage?: boolean;
};

export function ProgressCard({
  title,
  value,
  maxValue = 100,
  icon: Icon,
  color = "#3b82f6",
  description,
  compact = false,
  showPercentage = true,
}: ProgressCardProps) {
  const percentage = Math.round((value / maxValue) * 100);
  
  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col">
          <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-white`}>{title}</h3>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>
        {Icon && (
          <div 
            className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-md flex items-center justify-center`}
            style={{ backgroundColor: `${color}25` }} // 25% opacity
          >
            <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} style={{ color }} />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Progress 
          value={percentage}
          className="h-2 bg-gray-700"
          indicatorClassName="transition-all duration-500"
          style={{ backgroundColor: color }}
        />
        
        <div className="flex justify-between items-center">
          <p className={`${compact ? 'text-lg' : 'text-xl'} font-bold`} style={{ color }}>
            {value}
            <span className="text-sm text-gray-400 ml-1">/ {maxValue}</span>
          </p>
          
          {showPercentage && (
            <span className="text-xs text-gray-400">
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}