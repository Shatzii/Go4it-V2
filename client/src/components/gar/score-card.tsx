import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

type ScoreCardProps = {
  score: number;
  title?: string;
  subtitle?: string;
  maxScore?: number;
  showStars?: boolean;
  colorGradient?: [string, string];
};

export function GarScoreCard({
  score,
  title = "GAR Score",
  subtitle,
  maxScore = 100,
  showStars = true,
  colorGradient = ["#3b82f6", "#8b5cf6"]
}: ScoreCardProps) {
  // Calculate percentage and star rating
  const percentage = Math.round((score / maxScore) * 100);
  const starRating = Math.round((score / maxScore) * 5 * 2) / 2; // Round to nearest 0.5
  
  // Determine color based on score
  const getColor = () => {
    if (percentage >= 90) return "#10b981"; // Green
    if (percentage >= 70) return "#3b82f6"; // Blue
    if (percentage >= 50) return "#f59e0b"; // Yellow
    if (percentage >= 30) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };
  
  // Render stars
  const renderStars = () => {
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 !== 0;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400 w-5 h-5" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400 w-5 h-5" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-600 w-5 h-5" />);
    }
    
    return stars;
  };
  
  return (
    <Card className="w-full overflow-hidden border-gray-800">
      <div className="relative">
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            background: `linear-gradient(135deg, ${colorGradient[0]}, ${colorGradient[1]})`,
            opacity: 0.15
          }}
        />
        
        <CardHeader className="relative z-10 pb-2">
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </CardHeader>
        
        <CardContent className="relative z-10 pt-0">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative mb-2">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${getColor()} ${percentage}%, #1f2937 0%)`,
                  transform: 'rotate(-90deg)'
                }}
              />
              <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gray-900">
                <span className="text-4xl font-bold" style={{ color: getColor() }}>{score}</span>
                <span className="text-sm text-gray-400">/{maxScore}</span>
              </div>
            </div>
            
            {showStars && (
              <div className="flex space-x-1 mt-4">
                {renderStars()}
              </div>
            )}
            
            <p className="text-sm text-gray-400 mt-2">
              {percentage}% of maximum potential
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}