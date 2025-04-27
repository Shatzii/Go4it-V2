import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { GarRadarChartInteractive } from './radar-chart-interactive';
import { Info, Calendar, BarChart2, Activity, RefreshCcw, LineChart as LineChartIcon, PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

// Define types
interface GarCategory {
  id: number;
  name: string;
  description: string;
  sportType: string;
  positionType?: string;
  displayOrder: number;
  icon?: string;
  color?: string;
  active: boolean;
}

interface GarSubcategory {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  weight: number;
  displayOrder: number;
  icon?: string;
  active: boolean;
}

interface GarRatingHistory {
  id: number;
  userId: number;
  overallRating: number;
  categoryScores: string | Record<string, number>;
  subcategoryScores: string | Record<string, Record<string, number>>;
  ratingDate: string;
  notes?: string;
}

interface DataPoint {
  name: string;
  value: number;
  fullMark: number;
  benchmark?: number;
  average?: number;
  percentile?: number;
  trend?: 'up' | 'down' | 'neutral';
  locked?: boolean;
}

type EnhancedGarScoreVisualizationProps = {
  userId: number;
  sportType?: string;
  showControls?: boolean;
  showTimeline?: boolean;
  showComparison?: boolean;
  comparisonMode?: 'benchmark' | 'peer' | 'position' | 'team' | 'none';
};

export function EnhancedGarScoreVisualization({
  userId,
  sportType,
  showControls = true,
  showTimeline = true,
  showComparison = true,
  comparisonMode = 'none',
}: EnhancedGarScoreVisualizationProps) {
  const { toast } = useToast();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<string>('radar');
  const [timeRange, setTimeRange] = useState<string>('6m'); // 1m, 3m, 6m, 1y, all
  const [showPercentiles, setShowPercentiles] = useState<boolean>(false);
  const [showBenchmarks, setShowBenchmarks] = useState<boolean>(false);
  const [showAverages, setShowAverages] = useState<boolean>(false);
  const [compareWith, setCompareWith] = useState<string>(comparisonMode);
  
  // Queries
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/gar/categories', sportType],
    queryFn: async () => {
      const params = sportType ? `?sport=${encodeURIComponent(sportType)}` : '';
      const response = await fetch(`/api/gar/categories${params}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });
  
  const { data: latestRating, isLoading: ratingLoading } = useQuery({
    queryKey: ['/api/gar/users', userId, 'latest'],
    queryFn: async () => {
      const response = await fetch(`/api/gar/users/${userId}/latest`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch latest rating');
      }
      return response.json();
    },
    enabled: !!userId,
  });
  
  const { data: ratingHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/gar/users', userId, 'history'],
    queryFn: async () => {
      const response = await fetch(`/api/gar/users/${userId}/history`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch rating history');
      }
      return response.json();
    },
    enabled: !!userId,
  });
  
  // Set first category as selected when data loads
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name);
      
      // Also find subcategories for this category
      const categoryId = categories[0].id;
      fetchSubcategories(categoryId);
    }
  }, [categories, selectedCategory]);
  
  // Function to fetch subcategories for a given category
  const fetchSubcategories = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/gar/categories/${categoryId}/subcategories`);
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSelectedSubcategory(data[0].name);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to load subcategories",
        variant: "destructive"
      });
      return [];
    }
  };
  
  // Helper function to parse JSON scores
  const parseScores = (scores: string | Record<string, any>) => {
    if (typeof scores === 'string') {
      try {
        return JSON.parse(scores);
      } catch {
        return {};
      }
    }
    return scores || {};
  };
  
  // Generate data for radar chart from category scores
  const generateRadarData = (): DataPoint[] => {
    if (!latestRating || !latestRating.categoryScores) return [];
    
    const scores = parseScores(latestRating.categoryScores);
    
    // Generate trend data by comparing to previous rating
    const previousRating = ratingHistory && ratingHistory.length > 1 ? ratingHistory[1] : null;
    const previousScores = previousRating ? parseScores(previousRating.categoryScores) : {};
    
    // Generate random benchmarks and averages for testing
    // In production, these would come from the API
    const benchmarks = {
      'Physical': 85,
      'Technical': 80,
      'Mental': 75,
      'Game Intelligence': 82,
      'Teamwork': 88
    };
    
    const averages = {
      'Physical': 70,
      'Technical': 65,
      'Mental': 72,
      'Game Intelligence': 68,
      'Teamwork': 74
    };
    
    const percentiles = {
      'Physical': 82,
      'Technical': 75,
      'Mental': 65,
      'Game Intelligence': 80,
      'Teamwork': 90
    };
    
    return Object.keys(scores).map(key => {
      const value = scores[key];
      const prevValue = previousScores[key] || 0;
      
      // Determine trend by comparing with previous value
      let trend: 'up' | 'down' | 'neutral' = 'neutral';
      if (value > prevValue + 2) trend = 'up';
      else if (value < prevValue - 2) trend = 'down';
      
      return {
        name: key,
        value: value,
        fullMark: 100,
        benchmark: showBenchmarks ? benchmarks[key as keyof typeof benchmarks] || undefined : undefined,
        average: showAverages ? averages[key as keyof typeof averages] || undefined : undefined,
        percentile: showPercentiles ? percentiles[key as keyof typeof percentiles] || undefined : undefined,
        trend
      };
    });
  };
  
  // Generate historical data for timeline charts
  const generateTimelineData = () => {
    if (!ratingHistory || ratingHistory.length === 0) return [];
    
    // Filter history based on selected time range
    const now = new Date();
    const filtered = ratingHistory.filter((rating: GarRatingHistory) => {
      const ratingDate = new Date(rating.ratingDate);
      
      switch (timeRange) {
        case '1m':
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return ratingDate >= oneMonthAgo;
        case '3m':
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return ratingDate >= threeMonthsAgo;
        case '6m':
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return ratingDate >= sixMonthsAgo;
        case '1y':
          const oneYearAgo = new Date(now);
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          return ratingDate >= oneYearAgo;
        case 'all':
        default:
          return true;
      }
    });
    
    // Create formatted data for the timeline
    return filtered.map((rating: GarRatingHistory) => {
      const scores = parseScores(rating.categoryScores);
      const formattedDate = format(new Date(rating.ratingDate), 'MMM dd');
      
      return {
        date: formattedDate,
        overallScore: rating.overallRating,
        timestamp: new Date(rating.ratingDate).getTime(),
        ...scores
      };
    }).sort((a: {timestamp: number}, b: {timestamp: number}) => a.timestamp - b.timestamp);
  };
  
  // Generate subcategory data for the selected category
  const generateSubcategoryData = () => {
    if (!latestRating || !latestRating.subcategoryScores || !selectedCategory) return [];
    
    const allSubcategories = parseScores(latestRating.subcategoryScores);
    const categorySubcategories = allSubcategories[selectedCategory] || {};
    
    return Object.keys(categorySubcategories).map(key => ({
      name: key,
      value: categorySubcategories[key],
      fullMark: 100
    }));
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Find the category ID
    const categoryObj = categories.find((cat: GarCategory) => cat.name === category);
    if (categoryObj) {
      // Fetch subcategories for this category
      fetchSubcategories(categoryObj.id);
    }
  };
  
  // Render loading state
  if (categoriesLoading || ratingLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            <Skeleton className="h-6 w-2/3 bg-gray-700" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2 bg-gray-700" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[300px] w-full bg-gray-700 rounded-md" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24 bg-gray-700 rounded-md" />
            <Skeleton className="h-8 w-24 bg-gray-700 rounded-md" />
            <Skeleton className="h-8 w-24 bg-gray-700 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle no data
  if (!latestRating) {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">GAR Score Visualization</CardTitle>
          <CardDescription className="text-gray-400">No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-gray-800 border-gray-700">
            <Info className="h-5 w-5 text-gray-400" />
            <AlertTitle>No GAR scores found</AlertTitle>
            <AlertDescription>
              This athlete doesn't have any GAR scores recorded yet. Scores are generated from video analysis and assessments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Main render with data
  const radarData = generateRadarData();
  const timelineData = generateTimelineData();
  const subcategoryData = generateSubcategoryData();
  
  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
          <span>GAR Score Visualization</span>
          <div className="text-2xl font-bold bg-blue-500 text-white px-3 py-1 rounded-md">
            {latestRating.overallRating || "N/A"}
          </div>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Growth and Ability Rating - Last updated {format(new Date(latestRating.ratingDate), 'MMM dd, yyyy')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        {showControls && (
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={selectedChartType} onValueChange={setSelectedChartType}>
              <SelectTrigger className="w-auto border-gray-700 bg-gray-800">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="radar">
                  <div className="flex items-center">
                    <PieChart className="h-4 w-4 mr-2" />
                    <span>Radar Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="bar">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span>Bar Chart</span>
                  </div>
                </SelectItem>
                <SelectItem value="timeline">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Progress Timeline</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {categories && categories.length > 0 && (
              <Select value={selectedCategory || undefined} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-auto border-gray-700 bg-gray-800">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((category: GarCategory) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {showTimeline && (
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-auto border-gray-700 bg-gray-800">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {showComparison && (
              <Select value={compareWith} onValueChange={setCompareWith}>
                <SelectTrigger className="w-auto border-gray-700 bg-gray-800">
                  <SelectValue placeholder="Compare With" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="none">No Comparison</SelectItem>
                  <SelectItem value="benchmark">Benchmark</SelectItem>
                  <SelectItem value="position">Position Average</SelectItem>
                  <SelectItem value="team">Team Average</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <div className="ml-auto flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowBenchmarks(!showBenchmarks)}
                className={`border-gray-700 ${showBenchmarks ? 'bg-green-900/20 text-green-400' : 'bg-gray-800'}`}
              >
                Benchmarks
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAverages(!showAverages)}
                className={`border-gray-700 ${showAverages ? 'bg-amber-900/20 text-amber-400' : 'bg-gray-800'}`}
              >
                Averages
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPercentiles(!showPercentiles)}
                className={`border-gray-700 ${showPercentiles ? 'bg-pink-900/20 text-pink-400' : 'bg-gray-800'}`}
              >
                Percentiles
              </Button>
            </div>
          </div>
        )}
        
        {/* Display based on selected chart type */}
        {selectedChartType === 'radar' && (
          <GarRadarChartInteractive 
            data={radarData}
            height={350}
            showBenchmark={showBenchmarks}
            showAverage={showAverages}
            showPercentiles={showPercentiles}
            showControls={false}
            onDataPointClick={(point) => {
              if (categories) {
                handleCategoryChange(point.name);
                setSelectedChartType('bar');
              }
            }}
          />
        )}
        
        {selectedChartType === 'bar' && (
          <Card className="p-4 bg-gray-800/50 border-gray-700">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg text-white">{selectedCategory} Breakdown</CardTitle>
              <CardDescription className="text-gray-400">Subcategory scores</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subcategoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#e5e7eb' }} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis domain={[0, 100]} tick={{ fill: '#e5e7eb' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#374151',
                        color: '#f9fafb' 
                      }}
                      cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3b82f6" 
                      name="Score" 
                      barSize={40}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedChartType === 'timeline' && (
          <Card className="p-4 bg-gray-800/50 border-gray-700">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg text-white">GAR Score Timeline</CardTitle>
              <CardDescription className="text-gray-400">Progress over time</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timelineData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tick={{ fill: '#e5e7eb' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#e5e7eb' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#374151',
                        color: '#f9fafb' 
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="overallScore" 
                      stroke="#3b82f6" 
                      name="Overall GAR" 
                      strokeWidth={3}
                      dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: '#3b82f6' }}
                      activeDot={{ stroke: '#60a5fa', strokeWidth: 2, r: 6, fill: '#60a5fa' }}
                    />
                    {selectedCategory && timelineData.length > 0 && timelineData[0][selectedCategory] !== undefined && (
                      <Line 
                        type="monotone" 
                        dataKey={selectedCategory} 
                        stroke="#10b981" 
                        name={selectedCategory} 
                        strokeWidth={2}
                        dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#10b981' }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 flex items-center">
              <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Overall GAR</p>
                <h4 className="text-white text-xl font-bold">{latestRating.overallRating}</h4>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 flex items-center">
              <div className="bg-green-500/20 p-3 rounded-full mr-4">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Top Category</p>
                <h4 className="text-white text-xl font-bold">
                  {radarData.length > 0 
                    ? radarData.reduce((prev, current) => prev.value > current.value ? prev : current).name 
                    : 'N/A'}
                </h4>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 flex items-center">
              <div className="bg-amber-500/20 p-3 rounded-full mr-4">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Updated</p>
                <h4 className="text-white text-xl font-bold">{format(new Date(latestRating.ratingDate), 'MMM dd')}</h4>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                <RefreshCcw className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Assessments</p>
                <h4 className="text-white text-xl font-bold">{ratingHistory?.length || 0}</h4>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500 pt-0">
        <Info className="h-4 w-4 mr-1" /> GAR scores are calculated using AI analysis from game footage and coach assessments
      </CardFooter>
    </Card>
  );
}