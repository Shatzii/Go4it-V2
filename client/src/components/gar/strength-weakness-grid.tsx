import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, Target, Activity, Brain, Zap } from 'lucide-react';

type StrengthWeaknessGridProps = {
  data: {
    name: string;
    value: number;
    fullMark?: number;
  }[];
  height?: number;
  title?: string;
  subtitle?: string;
};

// Helper function to get icon based on category name
const getCategoryIcon = (name: string) => {
  const icons: Record<string, any> = {
    'Physical': Activity,
    'Mental': Brain,
    'Technical': Target,
  };
  
  return icons[name] || Zap;
};

export function StrengthWeaknessGrid({
  data,
  height = 300,
  title,
  subtitle
}: StrengthWeaknessGridProps) {
  // Sort data into strengths and weaknesses
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // Split into strengths (top half) and weaknesses (bottom half)
  const midpoint = Math.ceil(sortedData.length / 2);
  const strengths = sortedData.slice(0, midpoint);
  const weaknesses = sortedData.slice(midpoint);
  
  // Helper function to get color based on value
  const getValueColor = (value: number) => {
    if (value >= 75) return 'text-green-400';
    if (value >= 60) return 'text-lime-400';
    if (value >= 45) return 'text-yellow-400';
    if (value >= 30) return 'text-orange-400';
    return 'text-red-400';
  };
  
  // Get feedback based on score
  const getFeedbackText = (value: number, isStrength: boolean) => {
    if (isStrength) {
      if (value >= 85) return 'Elite';
      if (value >= 70) return 'Excellent';
      if (value >= 60) return 'Above Average';
      return 'Decent';
    } else {
      if (value <= 20) return 'Critical Focus Area';
      if (value <= 35) return 'Needs Significant Work';
      if (value <= 50) return 'Development Needed';
      return 'Slightly Below Average';
    }
  };
  
  // Helper function to get background color based on whether it's a strength or weakness
  const getBackgroundColor = (value: number, isStrength: boolean) => {
    if (isStrength) {
      if (value >= 85) return 'bg-green-900/20 border-green-700/30';
      if (value >= 70) return 'bg-lime-900/20 border-lime-700/30';
      return 'bg-blue-900/20 border-blue-700/30';
    } else {
      if (value <= 20) return 'bg-red-900/20 border-red-700/30';
      if (value <= 40) return 'bg-orange-900/20 border-orange-700/30';
      return 'bg-yellow-900/20 border-yellow-700/30';
    }
  };
  
  return (
    <Card className="p-4 w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      )}
      
      {/* Strengths Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUpCircle className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-bold text-green-400">Strengths</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {strengths.map(strength => {
            const Icon = getCategoryIcon(strength.name);
            return (
              <div 
                key={`strength-${strength.name}`}
                className={`p-3 rounded-lg border flex items-start gap-3 ${getBackgroundColor(strength.value, true)}`}
              >
                <div className="p-2 bg-gray-800 rounded-full">
                  <Icon className="h-5 w-5 text-green-400" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-white">{strength.name}</h4>
                    <span className={`font-bold ${getValueColor(strength.value)}`}>{strength.value}</span>
                  </div>
                  
                  <Badge variant="outline" className="mt-1 bg-gray-800/50 text-xs">
                    {getFeedbackText(strength.value, true)}
                  </Badge>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 rounded-full h-1.5" 
                        style={{ width: `${strength.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Weaknesses Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ArrowDownCircle className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-bold text-red-400">Development Areas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {weaknesses.map(weakness => {
            const Icon = getCategoryIcon(weakness.name);
            return (
              <div 
                key={`weakness-${weakness.name}`}
                className={`p-3 rounded-lg border flex items-start gap-3 ${getBackgroundColor(weakness.value, false)}`}
              >
                <div className="p-2 bg-gray-800 rounded-full">
                  <Icon className="h-5 w-5 text-red-400" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-white">{weakness.name}</h4>
                    <span className={`font-bold ${getValueColor(weakness.value)}`}>{weakness.value}</span>
                  </div>
                  
                  <Badge variant="outline" className="mt-1 bg-gray-800/50 text-xs">
                    {getFeedbackText(weakness.value, false)}
                  </Badge>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 rounded-full h-1.5" 
                        style={{ width: `${weakness.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Training Recommendations */}
      <div className="mt-6 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <h4 className="font-semibold text-sm mb-2">Training Recommendations</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          {weaknesses.slice(0, 2).map(weakness => (
            <li key={`rec-${weakness.name}`} className="flex items-start gap-2">
              <Target className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Focus on improving your <strong>{weakness.name.toLowerCase()}</strong> skills with targeted drills.</span>
            </li>
          ))}
          <li className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <span>Leverage your strengths in <strong>{strengths[0]?.name.toLowerCase()}</strong> to enhance overall performance.</span>
          </li>
        </ul>
      </div>
    </Card>
  );
}