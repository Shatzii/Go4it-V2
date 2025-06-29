import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TrendViewPeriod = "1m" | "3m" | "6m" | "1y" | "all";
type TrendViewType = "line" | "area" | "bar";
type TrendCategory = "overall" | "physical" | "technical" | "mental";

const getCategoryColor = (category: TrendCategory) => {
  switch (category) {
    case "physical":
      return "#0ea5e9"; // blue
    case "technical":
      return "#10b981"; // green
    case "mental":
      return "#8b5cf6"; // purple
    default:
      return "#8884d8"; // default purple
  }
};

export function GarTrendAnalysis() {
  const { user } = useAuth();
  const [viewPeriod, setViewPeriod] = useState<TrendViewPeriod>("3m");
  const [viewType, setViewType] = useState<TrendViewType>("line");
  const [selectedCategory, setSelectedCategory] = useState<TrendCategory>("overall");
  
  // Fetch GAR history data
  const { data: garHistory, isLoading } = useQuery({
    queryKey: ["/api/athlete/gar-history", user?.id],
    queryFn: () => fetch(`/api/athlete/gar-history/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });
  
  // Calculate period based on selected view period
  const getPeriodData = () => {
    if (!garHistory) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (viewPeriod) {
      case "1m":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
      default:
        return garHistory;
    }
    
    return garHistory.filter((item: any) => new Date(item.date) >= cutoffDate);
  };
  
  // Calculate change percentages for each category
  const calculateChanges = () => {
    const data = getPeriodData();
    if (data.length < 2) return { overall: 0, physical: 0, technical: 0, mental: 0 };
    
    const first = data[0];
    const last = data[data.length - 1];
    
    return {
      overall: ((last.score - first.score) / first.score) * 100,
      physical: ((last.physical - first.physical) / first.physical) * 100,
      technical: ((last.technical - first.technical) / first.technical) * 100,
      mental: ((last.mental - first.mental) / first.mental) * 100,
    };
  };
  
  const changes = calculateChanges();
  
  // Get trend icon based on change percentage
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };
  
  // Format change as percentage string
  const formatChange = (change: number) => {
    const prefix = change > 0 ? "+" : "";
    return `${prefix}${change.toFixed(1)}%`;
  };
  
  // Custom tooltip formatter for charts
  const tooltipFormatter = (value: number) => [`${value.toFixed(1)}`, "GAR Score"];
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // Mock historical data if none available
  const mockHistoricalData = [
    { date: "Jan 2023", score: 68, physical: 72, technical: 65, mental: 67 },
    { date: "Feb 2023", score: 69, physical: 74, technical: 65, mental: 68 },
    { date: "Mar 2023", score: 71, physical: 76, technical: 68, mental: 69 },
    { date: "Apr 2023", score: 70, physical: 75, technical: 67, mental: 68 },
    { date: "May 2023", score: 73, physical: 78, technical: 70, mental: 71 },
    { date: "Jun 2023", score: 74, physical: 80, technical: 70, mental: 72 },
    { date: "Jul 2023", score: 76, physical: 81, technical: 73, mental: 74 },
    { date: "Aug 2023", score: 77, physical: 82, technical: 74, mental: 75 },
    { date: "Sep 2023", score: 78, physical: 82, technical: 75, mental: 77 },
    { date: "Oct 2023", score: 77, physical: 81, technical: 74, mental: 76 },
    { date: "Nov 2023", score: 79, physical: 83, technical: 76, mental: 78 },
    { date: "Dec 2023", score: 81, physical: 85, technical: 78, mental: 80 },
    { date: "Jan 2024", score: 82, physical: 86, technical: 79, mental: 81 },
    { date: "Feb 2024", score: 84, physical: 87, technical: 81, mental: 84 },
    { date: "Mar 2024", score: 85, physical: 88, technical: 82, mental: 85 },
    { date: "Apr 2024", score: 86, physical: 89, technical: 83, mental: 86 },
  ];
  
  const historyData = garHistory || mockHistoricalData;
  const periodData = getPeriodData().length > 0 ? getPeriodData() : mockHistoricalData;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle>GAR Progress Trends</CardTitle>
            <CardDescription>Track your performance improvements over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select value={viewPeriod} onValueChange={(val) => setViewPeriod(val as TrendViewPeriod)}>
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={viewType} onValueChange={(val) => setViewType(val as TrendViewType)}>
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="Chart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Overall</p>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(changes.overall)}
                  <span className={`text-lg font-bold ml-1 ${
                    changes.overall > 0 ? "text-green-500" : 
                    changes.overall < 0 ? "text-red-500" : "text-gray-400"
                  }`}>
                    {formatChange(changes.overall)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Physical</p>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(changes.physical)}
                  <span className={`text-lg font-bold ml-1 ${
                    changes.physical > 0 ? "text-green-500" : 
                    changes.physical < 0 ? "text-red-500" : "text-gray-400"
                  }`}>
                    {formatChange(changes.physical)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Technical</p>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(changes.technical)}
                  <span className={`text-lg font-bold ml-1 ${
                    changes.technical > 0 ? "text-green-500" : 
                    changes.technical < 0 ? "text-red-500" : "text-gray-400"
                  }`}>
                    {formatChange(changes.technical)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Mental</p>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(changes.mental)}
                  <span className={`text-lg font-bold ml-1 ${
                    changes.mental > 0 ? "text-green-500" : 
                    changes.mental < 0 ? "text-red-500" : "text-gray-400"
                  }`}>
                    {formatChange(changes.mental)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overall" value={selectedCategory} onValueChange={(val) => setSelectedCategory(val as TrendCategory)}>
          <TabsList className="mx-auto mb-6">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="mental">Mental</TabsTrigger>
          </TabsList>
          
          <div className="h-[350px] w-full">
            {viewType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={periodData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedCategory === "overall" ? "score" : selectedCategory}
                    stroke={getCategoryColor(selectedCategory)}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {viewType === "area" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={periodData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={selectedCategory === "overall" ? "score" : selectedCategory}
                    stroke={getCategoryColor(selectedCategory)}
                    fill={getCategoryColor(selectedCategory)}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            
            {viewType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={periodData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                  <Bar
                    dataKey={selectedCategory === "overall" ? "score" : selectedCategory}
                    fill={getCategoryColor(selectedCategory)}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Tabs>
        
        <div className="flex mt-4 justify-between">
          <div>
            <p className="text-sm font-medium">Analysis:</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedCategory === "overall" ? (
                "Your overall GAR score has shown consistent improvement, reflecting positive development across all aspects of performance."
              ) : selectedCategory === "physical" ? (
                "Physical metrics show strong positive trends, particularly in speed and endurance. Continue strength training for additional improvements."
              ) : selectedCategory === "technical" ? (
                "Technical skills have improved steadily. Focus on consistency in shooting/striking to address the area with the most potential for growth."
              ) : (
                "Mental metrics show solid improvement. Decision-making under pressure has the most room for additional development."
              )}
            </p>
          </div>
          
          <Button variant="outline" size="sm">
            View Detailed Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}