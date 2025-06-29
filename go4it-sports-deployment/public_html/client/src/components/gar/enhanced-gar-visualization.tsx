import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GarRadarChart } from './radar-chart';
import { GarScoreCard } from './score-card';
import { ProgressCard } from './progress-card';
import { ComparisonRadarChart } from './comparison-radar-chart';
import { TimelapseChart } from './timelapse-chart';
import { PerformanceHeatmap } from './performance-heatmap';
import { StrengthWeaknessGrid } from './strength-weakness-grid';
import { SubcategoryDetailView } from './subcategory-detail-view';
import { Activity, Brain, Target, Info, Calendar, BarChart2, TrendingUp, 
         Clock, LayoutGrid, BarChart, ChevronDown, History } from 'lucide-react';

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

type EnhancedGarVisualizationProps = {
  userId: number;
};

export function EnhancedGarVisualization({ userId }: EnhancedGarVisualizationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<string>('radar');
  const [selectedCompareMode, setSelectedCompareMode] = useState<string>('none');
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 6]); // Last 6 months by default
  const [showPercentiles, setShowPercentiles] = useState<boolean>(false);
  
  // Fetch GAR categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/gar/categories'],
  });
  
  // Fetch latest GAR rating history for the user
  const { data: latestRating, isLoading: ratingLoading } = useQuery({
    queryKey: ['/api/gar/users', userId, 'latest'],
    enabled: !!userId,
  });
  
  // Fetch GAR history for the user
  const { data: ratingHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/gar/users', userId, 'history'],
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
    
    return { categoryId: category.id, categoryColor: getColorForCategory(categoryName) };
  };
  
  // Generate comparison data
  const generateComparisonData = () => {
    if (!ratingHistory || ratingHistory.length < 2) return null;
    
    // Get the current and previous ratings
    let compareWith: any;
    
    if (selectedCompareMode === 'previous') {
      compareWith = ratingHistory[1]; // Previous rating
    } else if (selectedCompareMode === 'best') {
      // Find the best rating based on totalGarScore
      compareWith = [...ratingHistory].sort((a, b) => b.totalGarScore - a.totalGarScore)[0];
    } else if (selectedCompareMode === 'first') {
      // Find the first (oldest) rating
      compareWith = [...ratingHistory].sort((a, b) => 
        new Date(a.calculatedDate).getTime() - new Date(b.calculatedDate).getTime()
      )[0];
    }
    
    if (!compareWith) return null;
    
    const currentScores = JSON.parse(typeof latestRating.categoryScores === 'string' 
      ? latestRating.categoryScores 
      : JSON.stringify(latestRating.categoryScores));
      
    const compareScores = JSON.parse(typeof compareWith.categoryScores === 'string' 
      ? compareWith.categoryScores 
      : JSON.stringify(compareWith.categoryScores));
    
    return {
      current: Object.keys(currentScores).map(key => ({
        name: key,
        value: currentScores[key],
      })),
      compare: Object.keys(compareScores).map(key => ({
        name: key,
        value: compareScores[key],
      })),
      compareDate: compareWith.calculatedDate,
    };
  };
  
  // Generate timelapse data
  const generateTimelapseData = () => {
    if (!ratingHistory || ratingHistory.length < 2) return [];
    
    const sortedHistory = [...ratingHistory].sort((a, b) => 
      new Date(a.calculatedDate).getTime() - new Date(b.calculatedDate).getTime()
    );
    
    return sortedHistory.map(record => {
      const date = new Date(record.calculatedDate);
      const scores = JSON.parse(typeof record.categoryScores === 'string' 
        ? record.categoryScores 
        : JSON.stringify(record.categoryScores));
      
      return {
        date: date.toISOString().split('T')[0],
        totalScore: record.totalGarScore,
        ...scores
      };
    });
  };
  
  // Loading state
  if (categoriesLoading || ratingLoading || historyLoading) {
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
  const comparisonData = generateComparisonData();
  const timelapseData = generateTimelapseData();
  
  return (
    <div className="space-y-6">
      {/* Visualization Controls */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>GAR Performance Dashboard</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Advanced visualization of your Go4It Sports Athletic Rating
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Visualization Type</Label>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visualization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radar">Radar Chart</SelectItem>
                  <SelectItem value="comparison">Side-by-Side Comparison</SelectItem>
                  <SelectItem value="timelapse">Time-lapse Progress</SelectItem>
                  <SelectItem value="heatmap">Performance Heatmap</SelectItem>
                  <SelectItem value="strengths">Strengths & Weaknesses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedView === 'comparison' && (
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Compare With</Label>
                <Select value={selectedCompareMode} onValueChange={setSelectedCompareMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select comparison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="previous">Previous Analysis</SelectItem>
                    <SelectItem value="best">Best Performance</SelectItem>
                    <SelectItem value="first">First Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {selectedView === 'timelapse' && (
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Time Range (Months)</Label>
                <Slider
                  defaultValue={[0, 6]}
                  max={timelapseData.length > 0 ? 12 : 6}
                  step={1}
                  onValueChange={(value) => setTimeRange(value as [number, number])}
                  className="mt-2"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2 justify-end">
              <Switch
                id="percentiles"
                checked={showPercentiles}
                onCheckedChange={setShowPercentiles}
              />
              <Label htmlFor="percentiles" className="text-sm text-gray-300">Show Percentiles</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Visualization Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {selectedView === 'radar' && (
            <GarRadarChart
              data={radarData}
              height={350}
              title="GAR Performance Breakdown"
              subtitle="Visualizing your performance across key categories"
            />
          )}
          
          {selectedView === 'comparison' && comparisonData && (
            <ComparisonRadarChart
              currentData={comparisonData.current}
              previousData={comparisonData.compare}
              height={350}
              title="Performance Comparison"
              subtitle={`Comparing current with ${new Date(comparisonData.compareDate).toLocaleDateString()}`}
            />
          )}
          
          {selectedView === 'timelapse' && (
            <TimelapseChart
              data={timelapseData.slice(timeRange[0], timeRange[1] + 1)}
              height={350}
              title="Performance Over Time"
              subtitle="Track your GAR score progression"
            />
          )}
          
          {selectedView === 'heatmap' && (
            <PerformanceHeatmap
              data={radarData}
              height={350}
              title="Performance Heatmap"
              subtitle="Visualize strengths and areas for improvement"
              showPercentiles={showPercentiles}
            />
          )}
          
          {selectedView === 'strengths' && (
            <StrengthWeaknessGrid
              data={radarData}
              height={350}
              title="Strengths & Weaknesses"
              subtitle="Your performance highlights and areas to focus on"
            />
          )}
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
      
      {/* Category Details */}
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
                    
                    <SubcategoryDetailView 
                      categoryId={categoryId}
                      userId={userId}
                      categoryColor={categoryColor}
                      categoryName={category.name}
                    />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Historical Analytics */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Insights from your athletic performance data
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <History className="h-4 w-4" />
            View All History
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Improved Area */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-lg p-4 border border-blue-900/40">
              <h3 className="text-blue-400 font-semibold text-sm mb-1">Most Improved</h3>
              <div className="flex items-center gap-2">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">Physical: Agility</p>
                  <p className="text-xs text-blue-300">+15 points since last assessment</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Your agility has shown significant improvement. This is a strong indicator of
                enhanced movement patterns and reaction time.
              </p>
            </div>
            
            {/* Focus Area */}
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-lg p-4 border border-purple-900/40">
              <h3 className="text-purple-400 font-semibold text-sm mb-1">Suggested Focus</h3>
              <div className="flex items-center gap-2">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-lg">Mental: Decision Making</p>
                  <p className="text-xs text-purple-300">Below your average in other areas</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Focusing on decision-making drills could help improve your overall performance
                and game intelligence.
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="font-semibold mb-2">Personalized Insights</h3>
            <p className="text-sm text-gray-300">
              Based on your performance data, we recommend focusing on:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400 mt-2 space-y-1">
              <li>Agility training to leverage your natural quickness</li>
              <li>Decision-making drills to improve your mental processing</li>
              <li>Position-specific technical skills to refine your execution</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* GAR Score Explainer */}
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