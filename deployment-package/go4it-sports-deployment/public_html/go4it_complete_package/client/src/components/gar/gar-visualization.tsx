import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GarRadarChart } from './radar-chart';
import { ProgressCard } from './progress-card';
import { GarScoreCard } from './score-card';
import { Activity, Brain, Target, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Icons mapping
const getIconForCategory = (name: string) => {
  const iconMap: Record<string, any> = {
    'Physical': Activity,
    'Mental': Brain,
    'Technical': Target,
  };
  
  return iconMap[name] || Info;
};

// Color mapping
const getColorForCategory = (name: string) => {
  const colorMap: Record<string, string> = {
    'Physical': '#3b82f6', // Blue
    'Mental': '#8b5cf6',   // Purple
    'Technical': '#10b981', // Green
  };
  
  return colorMap[name] || '#f59e0b'; // Default to amber
};

type GarVisualizationProps = {
  userId: number;
};

export function GarVisualization({ userId }: GarVisualizationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch GAR categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/gar/categories'],
  });
  
  // Fetch latest GAR rating history for the user
  const { data: latestRating, isLoading: ratingLoading } = useQuery({
    queryKey: ['/api/gar/users', userId, 'latest'],
    enabled: !!userId,
  });
  
  // Set the first category as selected when data loads
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);
  
  // Generate data for radar chart from category scores
  const generateRadarData = () => {
    if (!latestRating || !latestRating.categoryScores) return [];
    
    const scores = JSON.parse(typeof latestRating.categoryScores === 'string' 
      ? latestRating.categoryScores 
      : JSON.stringify(latestRating.categoryScores));
    
    return Object.keys(scores).map(key => ({
      name: key,
      value: scores[key],
      fullMark: 100,
    }));
  };
  
  // Extract all subcategory scores for a specific category
  const getSubcategoryScores = (categoryName: string) => {
    if (!latestRating || !latestRating.categoryScores) return [];
    
    const scores = JSON.parse(typeof latestRating.categoryScores === 'string' 
      ? latestRating.categoryScores 
      : JSON.stringify(latestRating.categoryScores));
    
    // Get subcategory details for the selected category
    const category = categories?.find(c => c.name === categoryName);
    if (!category) return [];
    
    // Ideally, we would fetch subcategory scores from the backend
    // For now, we'll generate some placeholder data based on the overall category score
    const baseScore = scores[categoryName] || 0;
    
    return { categoryId: category.id, categoryColor: getColorForCategory(categoryName) };
  };
  
  // Loading state
  if (categoriesLoading || ratingLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }
  
  // No data state
  if (!latestRating || !categories || categories.length === 0) {
    return (
      <Alert>
        <AlertTitle>No GAR data available</AlertTitle>
        <AlertDescription>
          We don't have any performance data for you yet. Upload a video to get your GAR score.
        </AlertDescription>
        <Button className="mt-4" variant="outline">Upload Performance Video</Button>
      </Alert>
    );
  }
  
  const radarData = generateRadarData();
  const totalScore = latestRating.totalGarScore || 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GarRadarChart
            data={radarData}
            height={350}
            title="GAR Performance Breakdown"
            subtitle="Visualizing your performance across key categories"
          />
        </div>
        
        <div>
          <GarScoreCard
            score={totalScore}
            title="Overall GAR Score"
            subtitle="Your total performance rating"
            showStars={true}
            colorGradient={['#3b82f6', '#8b5cf6']}
          />
        </div>
      </div>
      
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Dive deeper into each performance category
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={categories[0]?.name} className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-3">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.name}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => {
              const { categoryId, categoryColor } = getSubcategoryScores(category.name);
              const categoryScore = radarData.find(item => item.name === category.name)?.value || 0;
              const Icon = getIconForCategory(category.name);
              
              return (
                <TabsContent key={categoryId} value={category.name}>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <ProgressCard
                        title={`${category.name} Score`}
                        value={categoryScore}
                        icon={Icon}
                        color={categoryColor}
                        description={category.description}
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Subcategories</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        To view detailed subcategory scores, upload a new performance video for analysis.
                      </p>
                      
                      <Button variant="outline" size="sm">
                        Upload Video for Detailed Analysis
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>GAR Score Explained</CardTitle>
          <CardDescription>
            Understanding your Go4It Sports Athletic Rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            The Go4It Sports Athletic Rating (GAR) is a dynamic scientifically backed multi-dimensional wholistic system that scores more than physical stats. Our system captures mental, emotional and learning traits to provide the most complete rating known to date.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Activity className="mr-2 h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Physical Ability</h3>
              </div>
              <p className="text-sm text-gray-400">
                Measures your speed, agility, strength, endurance, and other physical attributes.
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Brain className="mr-2 h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Mental Sharpness</h3>
              </div>
              <p className="text-sm text-gray-400">
                Tracks decision-making, focus, game intelligence, and cognitive processing.
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="mr-2 h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Technical Skills</h3>
              </div>
              <p className="text-sm text-gray-400">
                Analyzes sport-specific techniques, skills, and execution quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}