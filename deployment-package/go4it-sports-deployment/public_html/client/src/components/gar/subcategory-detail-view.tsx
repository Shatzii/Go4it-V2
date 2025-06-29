import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type SubcategoryDetailViewProps = {
  categoryId: number;
  userId: number;
  categoryColor: string;
  categoryName: string;
};

export function SubcategoryDetailView({
  categoryId,
  userId,
  categoryColor,
  categoryName
}: SubcategoryDetailViewProps) {
  // Fetch subcategories for the category
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['/api/gar/categories', categoryId, 'subcategories'],
    enabled: !!categoryId,
  });
  
  // Fetch ratings for the user and category
  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['/api/gar/users', userId, 'categories', categoryId, 'ratings'],
    enabled: !!userId && !!categoryId,
  });
  
  // Loading state
  if (subcategoriesLoading || ratingsLoading) {
    return (
      <div className="space-y-4 mt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  // No data state
  if (!subcategories || subcategories.length === 0 || !ratings) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400 mt-4">
        No detailed data available for this category yet.
      </div>
    );
  }
  
  // Helper function to get score for a subcategory
  const getScoreForSubcategory = (subcategoryId: number) => {
    const rating = ratings.find(r => r.subcategoryId === subcategoryId);
    return rating ? rating.score : 0;
  };
  
  // Helper function to get previous score
  const getPreviousScore = (subcategoryId: number) => {
    const rating = ratings.find(r => r.subcategoryId === subcategoryId);
    return rating && rating.previousScore ? rating.previousScore : null;
  };
  
  // Helper function to get trend indicator
  const getTrendIndicator = (current: number, previous: number | null) => {
    if (previous === null) return null;
    
    if (current > previous) {
      return { icon: TrendingUp, color: 'text-green-400', value: current - previous };
    } else if (current < previous) {
      return { icon: TrendingDown, color: 'text-red-400', value: previous - current };
    }
    
    return { icon: Minus, color: 'text-gray-400', value: 0 };
  };
  
  // Helper function to get progress bar color class
  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 60) return 'bg-lime-500';
    if (score >= 45) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-3 mt-4">
      <h3 className="text-sm font-medium text-gray-400 mb-2">{categoryName} Subcategories</h3>
      
      {subcategories.map(subcategory => {
        const score = getScoreForSubcategory(subcategory.id);
        const previousScore = getPreviousScore(subcategory.id);
        const trend = getTrendIndicator(score, previousScore);
        const progressColor = getProgressColor(score);
        
        return (
          <div 
            key={subcategory.id} 
            className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{subcategory.name}</h4>
                {trend && (
                  <div className={`flex items-center gap-0.5 text-xs ${trend.color}`}>
                    <trend.icon className="h-3 w-3" />
                    <span>{trend.value > 0 ? `${trend.value > 0 ? '+' : ''}${trend.value}` : ''}</span>
                  </div>
                )}
              </div>
              <span className="font-bold text-lg">{score}</span>
            </div>
            
            <div className="relative pt-1">
              <Progress value={score} className="h-2" indicatorClassName={progressColor} />
            </div>
            
            <p className="text-xs text-gray-400 mt-2">{subcategory.description}</p>
          </div>
        );
      })}
      
      {subcategories.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
          No subcategories available for this category.
        </div>
      )}
    </div>
  );
}