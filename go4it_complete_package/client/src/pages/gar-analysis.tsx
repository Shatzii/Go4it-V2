import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Info, TrendingUp, BarChart3, Activity, Award, Video, Play, Camera, UploadCloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VideoUploadModal } from "@/components/gar/VideoUploadModal";
import { VideoAnalysisDialog } from "@/components/gar/VideoAnalysisDialog";
import { GarTrendAnalysis } from "@/components/gar/GarTrendAnalysis";
import { GarComparison } from "@/components/gar/GarComparison";
import { GarChallenges } from "@/components/gar/GarChallenges";
import { MobileVideoCaptureDialog } from "@/components/gar/MobileVideoCaptureDialog";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

export default function GARAnalysis() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("physical");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMobileCaptureDialog, setShowMobileCaptureDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: garScores, isLoading: isLoadingGarScores } = useQuery({
    queryKey: ["/api/athlete/gar-scores", user?.id],
    queryFn: () => fetch(`/api/athlete/gar-scores/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const { data: garHistory, isLoading: isLoadingGarHistory } = useQuery({
    queryKey: ["/api/athlete/gar-history", user?.id],
    queryFn: () => fetch(`/api/athlete/gar-history/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const { data: videos, isLoading: isLoadingVideos } = useQuery({
    queryKey: ["/api/athlete/videos", user?.id],
    queryFn: () => fetch(`/api/athlete/videos/${user?.id}?limit=3`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["/api/athlete/training-recommendations", user?.id],
    queryFn: () => fetch(`/api/athlete/training-recommendations/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  if (isLoadingGarScores || isLoadingGarHistory || isLoadingVideos || isLoadingRecommendations) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading GAR analysis...</span>
      </div>
    );
  }

  // Mock data for development - will be replaced with actual data
  const totalGarScore = garScores?.overallScore || 78;
  const categoryScores = garScores?.categoryScores || {
    physical: 82,
    technical: 75,
    mental: 77,
  };

  // Mock subcategories for each major category
  const subcategories = {
    physical: [
      { name: "Speed", score: 85, description: "Ability to move quickly across the field/court" },
      { name: "Strength", score: 78, description: "Power and muscle capability for your sport" },
      { name: "Endurance", score: 90, description: "Stamina and ability to maintain performance over time" },
      { name: "Agility", score: 75, description: "Ability to change direction quickly while maintaining control" },
      { name: "Power", score: 82, description: "Explosive strength in key movements" },
    ],
    technical: [
      { name: "Ball Handling", score: 81, description: "Control and manipulation of the ball" },
      { name: "Shooting", score: 70, description: "Accuracy and technique when shooting" },
      { name: "Passing", score: 85, description: "Precision and decision making in passing" },
      { name: "Footwork", score: 72, description: "Efficiency and precision of foot movements" },
      { name: "Positioning", score: 67, description: "Understanding and executing proper positioning" },
    ],
    mental: [
      { name: "Focus", score: 75, description: "Ability to maintain concentration during play" },
      { name: "Decision Making", score: 82, description: "Making good choices under pressure" },
      { name: "Resilience", score: 85, description: "Mental toughness and ability to overcome setbacks" },
      { name: "Awareness", score: 68, description: "Court/field awareness and reading the game" },
      { name: "Composure", score: 75, description: "Staying calm and composed in high-pressure situations" },
    ],
  };

  // Mock historical data for line chart
  const historicalData = [
    { month: "Jan", score: 65, physical: 68, technical: 59, mental: 68 },
    { month: "Feb", score: 68, physical: 72, technical: 61, mental: 71 },
    { month: "Mar", score: 70, physical: 74, technical: 65, mental: 71 },
    { month: "Apr", score: 73, physical: 76, technical: 68, mental: 75 },
    { month: "May", score: 75, physical: 78, technical: 70, mental: 77 },
    { month: "Jun", score: 78, physical: 82, technical: 75, mental: 77 },
  ];

  // Mock radar chart data
  const radarData = [
    { subject: "Speed", A: 85, fullMark: 100 },
    { subject: "Strength", A: 78, fullMark: 100 },
    { subject: "Endurance", A: 90, fullMark: 100 },
    { subject: "Agility", A: 75, fullMark: 100 },
    { subject: "Power", A: 82, fullMark: 100 },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">GAR Analysis</h1>
          <p className="text-muted-foreground">
            Your detailed Growth and Ability Rating analysis and recommendations
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="mt-0" hidden={activeTab !== "overview"}>
      

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center">
              {totalGarScore}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Your overall GAR score is calculated from the weighted average of 
                      Physical, Technical, and Mental categories. Each category makes up 
                      approximately one-third of your total score.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Overall GAR Score</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomProgress value={totalGarScore} className="h-3" indicatorClassName="bg-primary" />
            <div className="mt-2 text-sm text-right">
              <span className={
                totalGarScore > 75 ? "text-green-500" : 
                totalGarScore > 60 ? "text-amber-500" : 
                "text-red-500"
              }>
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +8 pts since last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
            <CardDescription>Score by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Physical</span>
                  <span className="text-sm font-medium">{categoryScores.physical}</span>
                </div>
                <CustomProgress value={categoryScores.physical} className="h-2 bg-slate-200" indicatorClassName="bg-blue-500" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Technical</span>
                  <span className="text-sm font-medium">{categoryScores.technical}</span>
                </div>
                <CustomProgress value={categoryScores.technical} className="h-2 bg-slate-200" indicatorClassName="bg-green-500" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Mental</span>
                  <span className="text-sm font-medium">{categoryScores.mental}</span>
                </div>
                <CustomProgress value={categoryScores.mental} className="h-2 bg-slate-200" indicatorClassName="bg-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Indicators</CardTitle>
            <CardDescription>Key metrics from recent analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Videos Analyzed</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm">Latest Analysis</span>
                <span className="text-sm font-medium">2 days ago</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm">Highest Category</span>
                <span className="text-sm font-medium">Physical (82)</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm">Focus Area</span>
                <span className="text-sm font-medium">Shooting</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>GAR Score Progress</CardTitle>
          <CardDescription>Your improvement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Overall"
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="physical" stroke="#0ea5e9" name="Physical" />
                <Line type="monotone" dataKey="technical" stroke="#10b981" name="Technical" />
                <Line type="monotone" dataKey="mental" stroke="#8b5cf6" name="Mental" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Category Analysis</CardTitle>
              <CardDescription>Select a category to view details</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="space-y-4">
                <Button 
                  variant={selectedCategory === "physical" ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("physical")}
                >
                  <div className="w-12 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Physical
                </Button>
                
                <Button 
                  variant={selectedCategory === "technical" ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("technical")}
                >
                  <div className="w-12 h-2 bg-green-500 rounded-full mr-3"></div>
                  Technical
                </Button>
                
                <Button 
                  variant={selectedCategory === "mental" ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("mental")}
                >
                  <div className="w-12 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Mental
                </Button>
              </div>

              <div className="mt-6 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="80%" 
                    data={radarData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar
                      name="Athlete"
                      dataKey="A"
                      stroke={
                        selectedCategory === "physical" ? "#0ea5e9" : 
                        selectedCategory === "technical" ? "#10b981" : 
                        "#8b5cf6"
                      }
                      fill={
                        selectedCategory === "physical" ? "#0ea5e9" : 
                        selectedCategory === "technical" ? "#10b981" : 
                        "#8b5cf6"
                      }
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Attributes
              </CardTitle>
              <CardDescription>Detailed breakdown of {selectedCategory} skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subcategories[selectedCategory as keyof typeof subcategories].map((subcategory, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="font-medium">{subcategory.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-60">{subcategory.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="font-bold">{subcategory.score}/100</span>
                    </div>
                    <CustomProgress 
                      value={subcategory.score} 
                      className="h-3" 
                      indicatorClassName={
                        selectedCategory === "physical" ? "bg-blue-500" : 
                        selectedCategory === "technical" ? "bg-green-500" : 
                        "bg-purple-500"
                      } 
                    />
                    {index < subcategories[selectedCategory as keyof typeof subcategories].length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations and Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Improvement Recommendations
              </CardTitle>
              <CardDescription>
                Based on your GAR analysis, here's what you should focus on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recommendation 1 */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:flex-1">
                      <h3 className="font-semibold">Improve Shooting Technique</h3>
                      <p className="text-sm text-muted-foreground">
                        Your shooting scores are below average for your position. Focus on proper form and follow-through.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                      View Drills
                    </Button>
                  </div>
                </div>

                {/* Recommendation 2 */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:flex-1">
                      <h3 className="font-semibold">Enhance Court Awareness</h3>
                      <p className="text-sm text-muted-foreground">
                        Work on scanning the court more frequently to improve decision-making.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                      View Drills
                    </Button>
                  </div>
                </div>

                {/* Recommendation 3 */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:flex-1">
                      <h3 className="font-semibold">Speed and Agility Training</h3>
                      <p className="text-sm text-muted-foreground">
                        Continue developing your quick-twitch muscles with lateral movement drills.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                      View Drills
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View My Training Plan</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Recent Analysis Videos
              </CardTitle>
              <CardDescription>Videos used in your GAR analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video thumbnails will go here */}
              <div className="space-y-3">
                {[1, 2, 3].map((video, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden group cursor-pointer">
                    <div className="aspect-video bg-slate-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-8 w-8 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white text-sm font-medium">Basketball Practice {index + 1}</p>
                        <p className="text-white/70 text-xs">Analyzed 3 days ago</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-md">
                      Score: 76
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowUploadModal(true)}
              >
                Upload New Video
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      </TabsContent>
      
      <TabsContent value="trends" className="mt-0" hidden={activeTab !== "trends"}>
        <GarTrendAnalysis />
      </TabsContent>
      
      <TabsContent value="comparison" className="mt-0" hidden={activeTab !== "comparison"}>
        <GarComparison />
      </TabsContent>
      
      <TabsContent value="videos" className="mt-0" hidden={activeTab !== "videos"}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">Performance Videos</h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setShowMobileCaptureDialog(true)}
                className="flex items-center gap-2"
                variant="default"
              >
                <Camera className="h-4 w-4" />
                Record Now
              </Button>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2"
                variant="outline"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Video
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock videos for now */}
            {[1, 2, 3, 4, 5, 6].map((video, index) => (
              <Card key={index} className="overflow-hidden">
                <div 
                  className="aspect-video bg-slate-800 relative cursor-pointer group"
                  onClick={() => {
                    setSelectedVideo(video);
                    setShowVideoAnalysis(true);
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <Play className="h-12 w-12 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-md">
                    Score: {70 + Math.floor(Math.random() * 20)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">Basketball Game {index + 1}</p>
                    <p className="text-white/70 text-xs">Analyzed {Math.floor(Math.random() * 30) + 1} days ago</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Physical</span>
                      <span className="text-sm font-medium">{70 + Math.floor(Math.random() * 20)}</span>
                    </div>
                    <CustomProgress 
                      value={70 + Math.floor(Math.random() * 20)} 
                      className="h-2" 
                      indicatorClassName="bg-blue-500" 
                    />
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Technical</span>
                      <span className="text-sm font-medium">{70 + Math.floor(Math.random() * 20)}</span>
                    </div>
                    <CustomProgress 
                      value={70 + Math.floor(Math.random() * 20)} 
                      className="h-2" 
                      indicatorClassName="bg-green-500" 
                    />
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Mental</span>
                      <span className="text-sm font-medium">{70 + Math.floor(Math.random() * 20)}</span>
                    </div>
                    <CustomProgress 
                      value={70 + Math.floor(Math.random() * 20)} 
                      className="h-2" 
                      indicatorClassName="bg-purple-500" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedVideo(video);
                      setShowVideoAnalysis(true);
                    }}
                  >
                    View Analysis
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
      
      {/* Upload Modal */}
      <VideoUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
      />
      
      {/* Video Analysis Dialog */}
      <VideoAnalysisDialog
        open={showVideoAnalysis}
        onOpenChange={setShowVideoAnalysis}
        videoId={selectedVideo}
      />
      
      {/* Mobile Video Capture Dialog */}
      <MobileVideoCaptureDialog
        open={showMobileCaptureDialog}
        onOpenChange={setShowMobileCaptureDialog}
        onCaptureComplete={(videoId) => {
          setSelectedVideo(videoId);
          setShowVideoAnalysis(true);
          setShowMobileCaptureDialog(false);
        }}
      />
    </div>
  );
}