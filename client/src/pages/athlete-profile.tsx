import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useMeasurement } from "@/contexts/measurement-context";
import { 
  ChevronLeft, 
  Star, 
  Share2, 
  Heart, 
  Video, 
  Trophy, 
  Calendar, 
  School, 
  MapPin, 
  Activity,
  BarChart3,
  Medal,
  Dumbbell,
  Check,
  MoveUp,
  ArrowUpRight,
  VideoIcon,
  Timer,
  Flag,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { formatHeight, formatWeight } from "@/lib/unit-conversion";

const JrScoreRating = ({ score }: { score: number }) => {
  // Helper function to get color based on score
  const getColorClass = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  // Helper function to get text color based on score
  const getTextColorClass = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`w-24 h-24 rounded-full border-4 border-background flex items-center justify-center ${getColorClass(score)}`}>
        <span className="text-3xl font-bold text-white">{score}</span>
      </div>
      <span className={`mt-2 font-bold ${getTextColorClass(score)}`}>JR Score</span>
    </div>
  );
};

const RenderStarRating = ({ rating }: { rating: number }) => {
  // Convert rating (0-100) to 1-5 star rating
  const starRating = Math.max(1, Math.min(5, Math.ceil(rating / 20)));
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

export default function AthleteProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { system } = useMeasurement();
  const [activeTab, setActiveTab] = useState("overview");
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const userId = parseInt(params.id);

  // Fetch the athlete's user profile
  const { data: athlete, isLoading: isAthleteLoading } = useQuery({
    queryKey: ["/api/users", userId],
    enabled: !!userId,
  });

  // Fetch the athlete's profile details
  const { data: athleteProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["/api/athletes", userId, "profile"],
    enabled: !!userId,
  });

  // Fetch the athlete's sport recommendations
  const { data: sportRecommendations, isLoading: isRecommendationsLoading } = useQuery({
    queryKey: ["/api/athletes", userId, "recommendations"],
    enabled: !!userId,
  });

  // Fetch the athlete's video analyses
  const { data: videoAnalyses, isLoading: isAnalysesLoading } = useQuery({
    queryKey: ["/api/athletes", userId, "analyses"],
    enabled: !!userId,
  });

  // Calculate averages from video analyses if available
  const averageScore = videoAnalyses?.length 
    ? Math.round(videoAnalyses.reduce((sum, analysis) => sum + analysis.overallScore, 0) / videoAnalyses.length) 
    : athleteProfile?.motionScore || 0;

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isAthleteLoading || isProfileLoading || isRecommendationsLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading athlete profile...</p>
        </div>
      </div>
    );
  }

  if (!athlete || !athleteProfile) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Athlete Not Found</h2>
          <p className="text-gray-600 mb-6">The athlete profile you're looking for doesn't exist or you may not have permission to view it.</p>
          <Button onClick={() => navigate("/")}>Return to Homepage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back 
      </Button>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Profile sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="bg-gray-950 border border-gray-800 shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative"></div>
            
            <div className="px-4 pb-4 relative">
              <div className="flex justify-center">
                <Avatar className="w-24 h-24 border-4 border-black -mt-12 bg-black overflow-hidden">
                  <AvatarImage src={athlete.profileImage} alt={athlete.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {getInitials(athlete.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="mt-3 text-center">
                <h2 className="text-xl font-bold text-white">{athlete.name}</h2>
                <p className="text-gray-400">
                  {athleteProfile.sportsInterest?.[0] || "Athlete"} 
                  {athleteProfile.school ? ` at ${athleteProfile.school}` : ""}
                </p>
                <div className="flex justify-center my-2">
                  <RenderStarRating rating={averageScore} />
                </div>
                
                <div className="flex gap-2 mt-4 justify-center">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Heart className="mr-1 h-4 w-4" /> Follow
                  </Button>
                  <Button size="sm" variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800">
                    <Share2 className="mr-1 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4 bg-gray-800" />
              
              <div className="space-y-3 text-gray-300">
                {athleteProfile.school && (
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{athleteProfile.school}</span>
                  </div>
                )}
                {athleteProfile.graduationYear && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">Class of {athleteProfile.graduationYear}</span>
                  </div>
                )}
                {athleteProfile.height && athleteProfile.weight && (
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">
                      {formatHeight(athleteProfile.height, system)} | {formatWeight(athleteProfile.weight, system)}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-4 bg-gray-800" />
              
              <div className="flex justify-between text-center">
                <div className="flex flex-col text-gray-400">
                  <span className="font-medium text-lg text-white">{averageScore}</span>
                  <span className="text-xs">JR Score</span>
                </div>
                <div className="flex flex-col text-gray-400">
                  <span className="font-medium text-lg text-white">
                    {athleteProfile.profileCompletionPercentage}%
                  </span>
                  <span className="text-xs">Profile</span>
                </div>
                <div className="flex flex-col text-gray-400">
                  <span className="font-medium text-lg text-white">
                    {sportRecommendations?.length || 0}
                  </span>
                  <span className="text-xs">Sports</span>
                </div>
              </div>
            </div>
          </Card>

          {/* JR Score Card */}
          <Card className="mt-6 bg-gray-950 border border-gray-800 shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                JR Score Analysis
              </CardTitle>
              <CardDescription>
                Athletic performance rating and potential
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex justify-center">
              <JrScoreRating score={averageScore} />
            </CardContent>
            <CardFooter className="bg-gray-900 py-3 px-4">
              <p className="text-xs text-gray-400 text-center w-full">
                JR Scores evaluate overall athletic potential based on multiple performance metrics
              </p>
            </CardFooter>
          </Card>

          {/* Top 5 Recommended Sports */}
          {sportRecommendations && sportRecommendations.length > 0 && (
            <Card className="mt-6 bg-gray-950 border border-gray-800 shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center">
                  <Medal className="h-5 w-5 mr-2 text-blue-500" />
                  Top Recommended Sports
                </CardTitle>
                <CardDescription>
                  Sports that match your athletic profile
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {sportRecommendations.slice(0, 5).map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{rec.sport}</p>
                          {rec.positionRecommendation && (
                            <p className="text-xs text-gray-400">{rec.positionRecommendation}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-cyan-400">
                          {rec.matchPercentage}%
                        </span>
                        <span className="text-xs text-gray-400">Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-900 pt-2 pb-3 px-4">
                <Button variant="link" size="sm" className="text-blue-400 hover:text-blue-300 mx-auto">
                  View All Sport Recommendations
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right column - Detailed content */}
        <div className="col-span-12 lg:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-gray-950 border border-gray-800 rounded-lg shadow-lg p-4">
            <TabsList className="grid grid-cols-3 gap-2 mb-6 bg-gray-900 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Performance</TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white">Videos</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="pt-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Athlete Profile</h3>
                <p className="text-gray-300 mb-6">{athlete.bio || "This athlete hasn't added a bio yet."}</p>
                
                {sportRecommendations && sportRecommendations.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-blue-500" /> Sport Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sportRecommendations.slice(0, 6).map((rec, index) => (
                        <Card key={index} className="bg-gray-900 border border-gray-800">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">{rec.sport}</Badge>
                                <RenderStarRating rating={rec.matchPercentage} />
                              </div>
                              <span className="text-lg font-bold text-cyan-400">{rec.matchPercentage}%</span>
                            </div>
                            <CardDescription>
                              {rec.positionRecommendation && (
                                <div className="mt-1 text-gray-400">
                                  Recommended Position: <span className="text-white">{rec.positionRecommendation}</span>
                                </div>
                              )}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-300">{rec.reasonForMatch || "Based on your physical attributes and performance metrics."}</p>
                            {rec.potentialLevel && (
                              <div className="mt-2 flex items-center">
                                <ArrowUpRight className="h-4 w-4 text-blue-400 mr-1" />
                                <span className="text-sm text-blue-400">Potential: {rec.potentialLevel}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="pt-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Performance Analysis</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gray-900 border border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Dumbbell className="h-4 w-4 mr-2 text-blue-400" /> Athletic Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Overall</span>
                        <span className="text-white font-bold">{averageScore}/100</span>
                      </div>
                      <Progress value={averageScore} className="h-2 bg-gray-800" />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <MoveUp className="h-4 w-4 mr-2 text-blue-400" /> Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Profile Completion</span>
                        <span className="text-white font-bold">{athleteProfile.profileCompletionPercentage}%</span>
                      </div>
                      <Progress value={athleteProfile.profileCompletionPercentage} className="h-2 bg-gray-800" />
                    </CardContent>
                  </Card>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-3">Skill Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Speed</span>
                      <span className="text-white font-medium">{Math.min(95, averageScore + 5)}/100</span>
                    </div>
                    <Progress value={Math.min(95, averageScore + 5)} className="h-2 bg-gray-800" />
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Strength</span>
                      <span className="text-white font-medium">{Math.max(30, averageScore - 10)}/100</span>
                    </div>
                    <Progress value={Math.max(30, averageScore - 10)} className="h-2 bg-gray-800" />
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Agility</span>
                      <span className="text-white font-medium">{Math.min(90, averageScore + 2)}/100</span>
                    </div>
                    <Progress value={Math.min(90, averageScore + 2)} className="h-2 bg-gray-800" />
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Endurance</span>
                      <span className="text-white font-medium">{Math.max(40, averageScore - 5)}/100</span>
                    </div>
                    <Progress value={Math.max(40, averageScore - 5)} className="h-2 bg-gray-800" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="pt-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Performance Videos</h3>
                
                {videoAnalyses && videoAnalyses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoAnalyses.map((analysis) => (
                      <Card key={analysis.id} className="bg-gray-900 border border-gray-800 overflow-hidden">
                        <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
                          <VideoIcon className="h-12 w-12 text-gray-600" />
                          <Badge className="absolute top-2 right-2 bg-blue-600">
                            Score: {analysis.overallScore}
                          </Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base text-white">Performance Analysis</CardTitle>
                            <div className="flex items-center text-xs text-gray-400">
                              <Timer className="h-3 w-3 mr-1" />
                              {new Date(analysis.analysisDate).toLocaleDateString()}
                            </div>
                          </div>
                          <CardDescription>
                            Video analysis with AI feedback
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-300 mb-2">
                            {analysis.feedback}
                          </p>
                          {analysis.improvementTips?.length > 0 && (
                            <div className="mt-2">
                              <h5 className="text-sm font-medium text-white mb-1">Improvement Tips:</h5>
                              <ul className="space-y-1">
                                {analysis.improvementTips.slice(0, 2).map((tip, i) => (
                                  <li key={i} className="flex text-sm">
                                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-300">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="bg-gray-950 pt-2">
                          <Button variant="outline" size="sm" className="text-blue-400 border-gray-700 hover:bg-gray-800 w-full">
                            View Full Analysis
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
                    <VideoIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-white mb-2">No Videos Available</h4>
                    <p className="text-gray-400 mb-4">This athlete hasn't uploaded any performance videos yet.</p>
                    {user?.id === userId && (
                      <Button>Upload Your First Video</Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}