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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Loader2, Users, Trophy, ArrowUpFromLine, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";

type ComparisonType = "peers" | "standards" | "college" | "pro";
type ComparisonSport = "basketball" | "football" | "soccer" | "baseball" | "track";
type ComparisonPosition = string;

interface ComparisonData {
  type: string;
  name: string;
  overall: number;
  physical: number;
  technical: number;
  mental: number;
  color: string;
}

export function GarComparison() {
  const { user } = useAuth();
  const [comparisonType, setComparisonType] = useState<ComparisonType>("peers");
  const [sport, setSport] = useState<ComparisonSport>("basketball");
  const [position, setPosition] = useState<ComparisonPosition>("guard");
  const [viewType, setViewType] = useState<"radar" | "bar">("radar");
  
  // Fetch athlete's GAR scores
  const { data: garScores, isLoading: isLoadingGarScores } = useQuery({
    queryKey: ["/api/athlete/gar-scores", user?.id],
    queryFn: () => fetch(`/api/athlete/gar-scores/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });
  
  // Fetch comparison data
  const { data: comparisonData, isLoading: isLoadingComparison } = useQuery({
    queryKey: ["/api/athlete/gar-comparison", user?.id, comparisonType, sport, position],
    queryFn: () => 
      fetch(`/api/athlete/gar-comparison/${user?.id}?type=${comparisonType}&sport=${sport}&position=${position}`)
        .then(res => res.json()),
    enabled: !!user?.id,
  });
  
  // Get positional options based on selected sport
  const getPositionOptions = () => {
    switch (sport) {
      case "basketball":
        return ["guard", "forward", "center"];
      case "football":
        return ["quarterback", "running back", "wide receiver", "offensive line", "defensive line", "linebacker", "defensive back"];
      case "soccer":
        return ["goalkeeper", "defender", "midfielder", "forward"];
      case "baseball":
        return ["pitcher", "catcher", "infielder", "outfielder"];
      case "track":
        return ["sprinter", "distance", "jumper", "thrower"];
      default:
        return ["all"];
    }
  };
  
  // Mock comparison data
  const mockAthleteData = {
    name: "Your Score",
    overall: 78,
    physical: 82,
    technical: 75,
    mental: 77,
    color: "#8884d8",
  };
  
  const mockComparisonData: ComparisonData[] = [
    {
      type: "peers",
      name: "Peer Average",
      overall: 72,
      physical: 74,
      technical: 70,
      mental: 72,
      color: "#82ca9d",
    },
    {
      type: "standards",
      name: "Age Group Standard",
      overall: 75,
      physical: 76,
      technical: 75,
      mental: 74,
      color: "#8dd1e1",
    },
    {
      type: "college",
      name: "College D1",
      overall: 88,
      physical: 90,
      technical: 87,
      mental: 87,
      color: "#a4de6c",
    },
    {
      type: "pro",
      name: "Professional",
      overall: 94,
      physical: 95,
      technical: 93,
      mental: 94,
      color: "#d0ed57",
    },
  ];
  
  // Prepare data for radar chart
  const prepareRadarData = () => {
    const athleteData = garScores || mockAthleteData;
    const comparisons = comparisonData || mockComparisonData.filter(d => d.type === comparisonType);
    
    return [
      { 
        attribute: "Overall", 
        You: athleteData.overall,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.overall || 0,
      },
      { 
        attribute: "Physical", 
        You: athleteData.physical,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.physical || 0,
      },
      { 
        attribute: "Technical", 
        You: athleteData.technical,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.technical || 0,
      },
      { 
        attribute: "Mental", 
        You: athleteData.mental,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.mental || 0,
      },
    ];
  };
  
  // Prepare data for bar chart
  const prepareBarData = () => {
    const athleteData = garScores || mockAthleteData;
    const comparisons = comparisonData || mockComparisonData.filter(d => d.type === comparisonType);
    
    return [
      { 
        category: "Overall", 
        You: athleteData.overall,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.overall || 0,
      },
      { 
        category: "Physical", 
        You: athleteData.physical,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.physical || 0,
      },
      { 
        category: "Technical", 
        You: athleteData.technical,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.technical || 0,
      },
      { 
        category: "Mental", 
        You: athleteData.mental,
        [comparisons[0]?.name || "Comparison"]: comparisons[0]?.mental || 0,
      },
    ];
  };
  
  const radarData = prepareRadarData();
  const barData = prepareBarData();
  const athleteData = garScores || mockAthleteData;
  const comparisons = comparisonData || mockComparisonData.filter(d => d.type === comparisonType);
  
  // Calculate GAP percentage
  const calculateGap = (athlete: number, comparison: number) => {
    return comparison > athlete ? 
      ((comparison - athlete) / comparison * 100).toFixed(1) :
      ((athlete - comparison) / athlete * 100).toFixed(1);
  };
  
  // If loading, show loading state
  if (isLoadingGarScores || isLoadingComparison) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle>GAR Comparison</CardTitle>
            <CardDescription>Compare your scores with peers and standards</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={comparisonType} onValueChange={(val) => setComparisonType(val as ComparisonType)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Compare to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peers">Peers</SelectItem>
                <SelectItem value="standards">Standards</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="pro">Professional</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sport} onValueChange={(val) => setSport(val as ComparisonSport)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="soccer">Soccer</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
                <SelectItem value="track">Track</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={position} 
              onValueChange={(val) => setPosition(val as ComparisonPosition)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                {getPositionOptions().map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Tabs value={viewType} onValueChange={(val) => setViewType(val as "radar" | "bar")}>
              <TabsList>
                <TabsTrigger value="radar">Radar</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {viewType === "radar" ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="attribute" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="You"
                      dataKey="You"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name={comparisons[0]?.name || "Comparison"}
                      dataKey={comparisons[0]?.name || "Comparison"}
                      stroke={comparisons[0]?.color || "#82ca9d"}
                      fill={comparisons[0]?.color || "#82ca9d"}
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="You" fill="#8884d8" name="You" />
                    <Bar
                      dataKey={comparisons[0]?.name || "Comparison"}
                      fill={comparisons[0]?.color || "#82ca9d"}
                      name={comparisons[0]?.name || "Comparison"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Score Comparison</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-medium">Overall GAR</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 inline-block ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-64">
                          <p>Overall Growth and Ability Rating across all categories</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{athleteData.overall} / 100</div>
                    <div className={`text-xs ${
                      athleteData.overall >= comparisons[0]?.overall 
                        ? "text-green-500" 
                        : "text-amber-500"
                    }`}>
                      {athleteData.overall >= comparisons[0]?.overall ? (
                        <>+{calculateGap(athleteData.overall, comparisons[0]?.overall)}% above</>
                      ) : (
                        <>{calculateGap(athleteData.overall, comparisons[0]?.overall)}% below</>
                      )}
                      {" " + comparisons[0]?.name}
                    </div>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-primary"
                        style={{ width: `${athleteData.overall}%` }}
                      ></div>
                      <div
                        className="h-3 rounded-full bg-green-400 absolute top-1"
                        style={{ 
                          width: "3px", 
                          left: `${comparisons[0]?.overall || 0}%`,
                          opacity: 0.8,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-medium">Physical</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{athleteData.physical} / 100</div>
                    <div className={`text-xs ${
                      athleteData.physical >= comparisons[0]?.physical 
                        ? "text-green-500" 
                        : "text-amber-500"
                    }`}>
                      {athleteData.physical >= comparisons[0]?.physical ? (
                        <>+{calculateGap(athleteData.physical, comparisons[0]?.physical)}% above</>
                      ) : (
                        <>{calculateGap(athleteData.physical, comparisons[0]?.physical)}% below</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-blue-500"
                        style={{ width: `${athleteData.physical}%` }}
                      ></div>
                      <div
                        className="h-3 rounded-full bg-green-400 absolute top-1"
                        style={{ 
                          width: "3px", 
                          left: `${comparisons[0]?.physical || 0}%`,
                          opacity: 0.8,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-medium">Technical</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{athleteData.technical} / 100</div>
                    <div className={`text-xs ${
                      athleteData.technical >= comparisons[0]?.technical 
                        ? "text-green-500" 
                        : "text-amber-500"
                    }`}>
                      {athleteData.technical >= comparisons[0]?.technical ? (
                        <>+{calculateGap(athleteData.technical, comparisons[0]?.technical)}% above</>
                      ) : (
                        <>{calculateGap(athleteData.technical, comparisons[0]?.technical)}% below</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-green-500"
                        style={{ width: `${athleteData.technical}%` }}
                      ></div>
                      <div
                        className="h-3 rounded-full bg-green-400 absolute top-1"
                        style={{ 
                          width: "3px", 
                          left: `${comparisons[0]?.technical || 0}%`,
                          opacity: 0.8,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-medium">Mental</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{athleteData.mental} / 100</div>
                    <div className={`text-xs ${
                      athleteData.mental >= comparisons[0]?.mental 
                        ? "text-green-500" 
                        : "text-amber-500"
                    }`}>
                      {athleteData.mental >= comparisons[0]?.mental ? (
                        <>+{calculateGap(athleteData.mental, comparisons[0]?.mental)}% above</>
                      ) : (
                        <>{calculateGap(athleteData.mental, comparisons[0]?.mental)}% below</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-purple-500"
                        style={{ width: `${athleteData.mental}%` }}
                      ></div>
                      <div
                        className="h-3 rounded-full bg-green-400 absolute top-1"
                        style={{ 
                          width: "3px", 
                          left: `${comparisons[0]?.mental || 0}%`,
                          opacity: 0.8,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Insights</h3>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm">
                  {comparisonType === "peers" ? (
                    <span>
                      Your overall GAR score is <strong>{
                        athleteData.overall >= comparisons[0]?.overall 
                          ? `${calculateGap(athleteData.overall, comparisons[0]?.overall)}% above` 
                          : `${calculateGap(athleteData.overall, comparisons[0]?.overall)}% below`
                      }</strong> the average for your peers in {sport} playing as {position}. 
                      Your strongest advantage is in the <strong>physical</strong> category.
                    </span>
                  ) : comparisonType === "standards" ? (
                    <span>
                      Based on established standards for athletes in your age group, your scores are 
                      {athleteData.overall >= comparisons[0]?.overall ? " meeting expectations" : " approaching expectations"}.
                      Focus on improving your <strong>technical</strong> skills to reach the next level.
                    </span>
                  ) : comparisonType === "college" ? (
                    <span>
                      Compared to average D1 college athletes, your GAR scores show{' '}
                      {(athleteData.overall / comparisons[0]?.overall * 100).toFixed(0)}% readiness.
                      Continue developing all aspects of your game, with emphasis on <strong>mental</strong> attributes.
                    </span>
                  ) : (
                    <span>
                      Your current scores are at {(athleteData.overall / comparisons[0]?.overall * 100).toFixed(0)}% 
                      of professional level standards. This is excellent progress for your age group. 
                      With continued development, especially in <strong>technical</strong> skills, 
                      you have potential to reach elite levels.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}