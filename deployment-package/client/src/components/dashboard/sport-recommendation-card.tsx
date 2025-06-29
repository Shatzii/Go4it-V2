import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, Zap } from "lucide-react";
import { SportRecommendation } from "@shared/schema";

interface SportRecommendationCardProps {
  recommendation: SportRecommendation;
  index?: number;
}

export function SportRecommendationCard({ recommendation, index = 0 }: SportRecommendationCardProps) {
  // Function to get a thumbnail image based on the sport
  const getSportImage = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "basketball":
        return "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80";
      case "volleyball":
        return "https://images.unsplash.com/photo-1529768167801-9173047f55bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80";
      case "track & field":
        return "https://images.unsplash.com/photo-1599391398131-c82b569142b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80";
      case "soccer":
        return "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80";
      case "swimming":
        return "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80";
      default:
        return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80";
    }
  };

  // Determine color class based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-accent font-medium";
    if (percentage >= 80) return "text-accent font-medium";
    if (percentage >= 70) return "text-primary font-medium";
    return "text-neutral font-medium";
  };

  return (
    <div className="bg-neutral-light bg-opacity-30 rounded-lg p-4 flex items-center">
      <img 
        src={getSportImage(recommendation.sport)} 
        alt={recommendation.sport} 
        className="w-20 h-20 object-cover rounded-lg mr-4"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-neutral">{recommendation.sport}</h3>
          <span className={getMatchColor(recommendation.matchPercentage)}>
            {recommendation.matchPercentage}% Match
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{recommendation.reasonForMatch}</p>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <span className="flex items-center mr-3">
            <ChevronUp className="h-4 w-4 mr-1" />
            {recommendation.positionRecommendation}
          </span>
          <span className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            {recommendation.potentialLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
