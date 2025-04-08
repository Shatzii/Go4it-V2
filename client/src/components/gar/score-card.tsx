import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, StarHalf } from 'lucide-react';

type GarScoreCardProps = {
  score: number;
  title: string;
  subtitle?: string;
  showStars?: boolean;
  colorGradient?: [string, string];
};

export function GarScoreCard({
  score,
  title,
  subtitle,
  showStars = false,
  colorGradient = ['#3b82f6', '#8b5cf6'] // Blue to Purple
}: GarScoreCardProps) {
  // Calculate star rating (1-5) based on score (0-100)
  const starRating = Math.max(1, Math.min(5, Math.round(score / 20)));
  
  // Helper function to get background color based on score
  const getBackgroundColor = (score: number) => {
    if (score >= 80) return 'from-green-700/20 to-green-800/10 border-green-600/30';
    if (score >= 60) return 'from-blue-700/20 to-blue-800/10 border-blue-600/30';
    if (score >= 40) return 'from-yellow-700/20 to-yellow-800/10 border-yellow-600/30';
    if (score >= 20) return 'from-orange-700/20 to-orange-800/10 border-orange-600/30';
    return 'from-red-700/20 to-red-800/10 border-red-600/30';
  };
  
  // Helper function to get text color based on score
  const getTextColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-red-400';
  };
  
  // Convert hex color to RGB for gradient
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  const startColor = hexToRgb(colorGradient[0]);
  const endColor = hexToRgb(colorGradient[1]);
  
  // Build gradient for score text
  const scoreGradient = `linear-gradient(135deg, rgb(${startColor.r}, ${startColor.g}, ${startColor.b}) 0%, rgb(${endColor.r}, ${endColor.g}, ${endColor.b}) 100%)`;
  
  return (
    <Card className={`bg-gradient-to-br ${getBackgroundColor(score)} p-4 h-full border flex flex-col justify-between`}>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      
      <div className="mt-4 mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-400">GAR Score</span>
          <span className="text-sm text-gray-400">{score}/100</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>
      
      <div className="flex flex-col items-center mt-auto pt-4 border-t border-gray-700/50">
        <div 
          className="text-5xl font-bold mb-2"
          style={{ 
            background: scoreGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 1px 1px rgba(0,0,0,0.1)'
          }}
        >
          {score}
        </div>
        
        {showStars && (
          <div className="flex items-center space-x-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
              />
            ))}
          </div>
        )}
        
        <div className={`mt-2 text-sm font-semibold ${getTextColor(score)}`}>
          {score >= 80 && "Elite"}
          {score >= 60 && score < 80 && "Excellent"}
          {score >= 40 && score < 60 && "Good"}
          {score >= 20 && score < 40 && "Needs Work"}
          {score < 20 && "Beginner"}
        </div>
      </div>
    </Card>
  );
}