import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  Legend,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis
} from 'recharts';
import { 
  AlertCircle, 
  ArrowUpCircle, 
  Eye, 
  EyeOff, 
  Info, 
  Star, 
  TrendingUp, 
  Lock,
  ChevronsUpDown
} from 'lucide-react';

type DataPoint = {
  name: string;
  value: number;
  fullMark: number;
  benchmark?: number;
  average?: number;
  percentile?: number;
  trend?: 'up' | 'down' | 'neutral';
  locked?: boolean;
};

type GarRadarChartInteractiveProps = {
  data: DataPoint[];
  height?: number;
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  showAverage?: boolean;
  showBenchmark?: boolean;
  showPercentiles?: boolean;
  onDataPointClick?: (point: DataPoint) => void;
};

export function GarRadarChartInteractive({
  data,
  height = 400,
  title,
  subtitle,
  showControls = true,
  showAverage = false,
  showBenchmark = false,
  showPercentiles = false,
  onDataPointClick,
}: GarRadarChartInteractiveProps) {
  // Local state for visual controls if global state isn't passed
  const [localShowAverage, setLocalShowAverage] = useState(showAverage);
  const [localShowBenchmark, setLocalShowBenchmark] = useState(showBenchmark);
  const [localShowPercentiles, setLocalShowPercentiles] = useState(showPercentiles);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [zoom, setZoom] = useState(100);
  
  // Define the color scheme for interactive elements
  const colors = {
    primary: "#3b82f6", // Blue for user data
    benchmark: "#10b981", // Green for benchmarks
    average: "#f59e0b", // Amber for averages
    percentile: "#ec4899", // Pink for percentiles
    grid: "#4b5563", // Gray for grid
    highlight: "#6366f1", // Indigo for highlights
    text: "#e5e7eb", // Light gray for text
    background: "#1f2937", // Dark gray for background
  };

  // Apply the zoom level to the chart size
  const chartHeight = height * (zoom / 100);
  
  // Handle clicking on a data point
  const handleDataPointClick = (data: any) => {
    if (onDataPointClick && data && data.payload) {
      onDataPointClick(data.payload);
    }
  };

  // Custom tooltip component with more detailed information
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="p-3 bg-gray-800 border border-gray-700 rounded-md shadow-lg text-sm">
          <p className="font-bold text-white">{data.name}</p>
          <p className="text-blue-400">Score: {data.value}</p>
          
          {data.benchmark && (
            <p className="text-green-400">Benchmark: {data.benchmark}</p>
          )}
          
          {data.average && (
            <p className="text-amber-400">Average: {data.average}</p>
          )}
          
          {data.percentile && (
            <p className="text-pink-400">Percentile: {data.percentile}%</p>
          )}
          
          {data.trend && (
            <div className="flex items-center mt-1">
              <span className="mr-1">Trend:</span>
              {data.trend === 'up' && <TrendingUp className="text-green-400 h-4 w-4" />}
              {data.trend === 'down' && <TrendingUp className="text-red-400 h-4 w-4 transform rotate-180" />}
              {data.trend === 'neutral' && <ChevronsUpDown className="text-gray-400 h-4 w-4" />}
            </div>
          )}
          
          {data.locked && (
            <div className="flex items-center mt-1 text-gray-400">
              <Lock className="h-4 w-4 mr-1" />
              <span>Locked metric</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Format the data for visualization
  const formattedData = data.map(point => ({
    ...point,
    // Add a slight random offset to prevent visual overlap when values are identical
    value: point.value,
    valueWithJitter: point.value + (Math.random() * 0.5 - 0.25),
  }));

  return (
    <Card className="p-4 w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader className="p-4 pb-0">
        {title && <CardTitle className="text-xl font-bold text-white">{title}</CardTitle>}
        {subtitle && <CardDescription className="text-gray-400">{subtitle}</CardDescription>}
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Controls */}
        {showControls && (
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-average" 
                checked={localShowAverage} 
                onCheckedChange={setLocalShowAverage}
              />
              <Label htmlFor="show-average" className="text-sm text-gray-300">Show Average</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-benchmark" 
                checked={localShowBenchmark} 
                onCheckedChange={setLocalShowBenchmark}
              />
              <Label htmlFor="show-benchmark" className="text-sm text-gray-300">Show Benchmark</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-percentiles" 
                checked={localShowPercentiles} 
                onCheckedChange={setLocalShowPercentiles}
              />
              <Label htmlFor="show-percentiles" className="text-sm text-gray-300">Show Percentiles</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAnimationPaused(!animationPaused)}
                className="text-sm border-gray-600 hover:bg-gray-700"
              >
                {animationPaused ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                {animationPaused ? "Resume Animation" : "Pause Animation"}
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col space-y-1 min-w-[200px]">
              <Label htmlFor="zoom-level" className="text-sm text-gray-300">Zoom: {zoom}%</Label>
              <Slider 
                id="zoom-level" 
                min={50} 
                max={150} 
                step={5} 
                value={[zoom]} 
                onValueChange={(values) => setZoom(values[0])}
              />
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-blue-400 border-blue-400">Your Score</Badge>
          
          {(showBenchmark || localShowBenchmark) && (
            <Badge variant="outline" className="text-green-400 border-green-400">Benchmark</Badge>
          )}
          
          {(showAverage || localShowAverage) && (
            <Badge variant="outline" className="text-amber-400 border-amber-400">Average</Badge>
          )}
          
          {(showPercentiles || localShowPercentiles) && (
            <Badge variant="outline" className="text-pink-400 border-pink-400">Percentile</Badge>
          )}
        </div>
        
        {/* The Radar Chart */}
        <div className="w-full transition-all duration-300" style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
              <PolarGrid stroke={colors.grid} />
              <PolarAngleAxis 
                dataKey="name"
                tick={{ fill: colors.text, fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: colors.text, fontSize: 10 }}
              />
              
              {/* User's Scores */}
              <Radar
                name="GAR Score"
                dataKey="value"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
                dot={{ 
                  stroke: colors.primary, 
                  strokeWidth: 2, 
                  fill: colors.primary, 
                  r: 4,
                  className: "cursor-pointer" 
                }}
                activeDot={{ 
                  stroke: colors.highlight, 
                  strokeWidth: 3, 
                  fill: colors.highlight, 
                  r: 6, 
                  onClick: handleDataPointClick 
                }}
                isAnimationActive={!animationPaused}
              />
              
              {/* Benchmark Scores (conditionally rendered) */}
              {(showBenchmark || localShowBenchmark) && (
                <Radar
                  name="Benchmark"
                  dataKey="benchmark"
                  stroke={colors.benchmark}
                  fill={colors.benchmark}
                  fillOpacity={0.1}
                  dot={{ 
                    stroke: colors.benchmark, 
                    strokeWidth: 2, 
                    fill: colors.benchmark, 
                    r: 3 
                  }}
                  isAnimationActive={!animationPaused}
                />
              )}
              
              {/* Average Scores (conditionally rendered) */}
              {(showAverage || localShowAverage) && (
                <Radar
                  name="Average"
                  dataKey="average"
                  stroke={colors.average}
                  fill={colors.average}
                  fillOpacity={0.1}
                  dot={{ 
                    stroke: colors.average, 
                    strokeWidth: 2, 
                    fill: colors.average, 
                    r: 3 
                  }}
                  isAnimationActive={!animationPaused}
                />
              )}
              
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Visual indicators for data insights */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {data.filter(point => point.trend === 'up').length > 0 && (
            <div className="flex items-center p-2 bg-green-900/20 border border-green-900 rounded-md">
              <ArrowUpCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm text-green-400">
                {data.filter(point => point.trend === 'up').length} improving metrics
              </span>
            </div>
          )}
          
          {data.filter(point => point.percentile && point.percentile >= 90).length > 0 && (
            <div className="flex items-center p-2 bg-blue-900/20 border border-blue-900 rounded-md">
              <Star className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm text-blue-400">
                {data.filter(point => point.percentile && point.percentile >= 90).length} top 10% metrics
              </span>
            </div>
          )}
          
          {data.filter(point => point.value < 30).length > 0 && (
            <div className="flex items-center p-2 bg-red-900/20 border border-red-900 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-400">
                {data.filter(point => point.value < 30).length} metrics need attention
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}