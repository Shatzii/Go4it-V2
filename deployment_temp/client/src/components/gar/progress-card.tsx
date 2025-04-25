import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProgressCardProps = {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  description?: string;
  previousValue?: number;
  showDifference?: boolean;
};

export function ProgressCard({
  title,
  value,
  icon: Icon,
  color,
  description,
  previousValue,
  showDifference = true
}: ProgressCardProps) {
  // Calculate difference if previous value exists
  const difference = previousValue !== undefined ? value - previousValue : null;
  
  // Convert hex color to rgba for background
  const hexToRgba = (hex: string, alpha: number = 0.1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : 
      `rgba(59, 130, 246, ${alpha})`;
  };
  
  return (
    <Card className="p-4 bg-gray-800 border border-gray-700">
      <div className="flex items-start gap-4">
        <div 
          className="p-3 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: hexToRgba(color, 0.15) }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-white">{title}</h3>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          </div>
          
          {description && (
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          )}
          
          <div className="mt-3 space-y-2">
            <Progress 
              value={value} 
              className="h-1.5"
              style={{
                ['--progress-background' as any]: hexToRgba(color, 0.2),
                ['--progress-foreground' as any]: color
              }}
            />
            
            {showDifference && difference !== null && (
              <div className="flex justify-end text-xs">
                <span 
                  className={
                    difference > 0 ? 'text-green-400' : 
                    difference < 0 ? 'text-red-400' : 
                    'text-gray-400'
                  }
                >
                  {difference > 0 ? '+' : ''}{difference} from previous
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}