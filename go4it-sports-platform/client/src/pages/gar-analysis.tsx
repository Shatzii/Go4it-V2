import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoUpload from "@/components/gar/video-upload";
import AnalysisResults from "@/components/gar/analysis-results";
import StarRatingSystem, { StarDisplay, getStarRatingFromGAR } from "@/components/gar/star-rating-system";
import MultiSportSystem from "@/components/sports/multi-sport-system";
import { TrendingUp, BarChart3, Download, Filter, Star, Trophy, Target } from "lucide-react";

export default function GarAnalysis() {
  const { user } = useAuth();

  const { data: garScores, isLoading } = useQuery({
    queryKey: [`/api/gar-scores/${user?.id}`],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-700 rounded-xl"></div>
            <div className="h-96 bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const scores = garScores || [];
  const latestScore = scores[0];
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((sum, score) => sum + score.overallScore, 0) / scores.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">GAR Analysis</h1>
        <p className="text-slate-300 text-lg">
          Game Analysis Rating - AI-powered performance scoring and insights
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary/20 rounded-lg p-3">
                <BarChart3 className="text-primary h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-success bg-success/20">
                Latest
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {latestScore?.overallScore || 0}
            </h3>
            <p className="text-slate-300 text-sm mb-3">Latest GAR Score</p>
            <div className="flex items-center justify-between">
              <Progress value={latestScore?.overallScore || 0} className="h-2 flex-1 mr-2" />
              <StarDisplay rating={latestScore?.overallScore || 0} size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary/20 rounded-lg p-3">
                <TrendingUp className="text-secondary h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-primary bg-primary/20">
                Average
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{averageScore}</h3>
            <p className="text-slate-300 text-sm mb-3">Average Score</p>
            <div className="flex items-center justify-between">
              <Progress value={averageScore} className="h-2 flex-1 mr-2" />
              <StarDisplay rating={averageScore} size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500/20 rounded-lg p-3">
                <Star className="text-yellow-500 h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-yellow-500 bg-yellow-500/20">
                Rating
              </Badge>
            </div>
            <div className="mb-3">
              <StarDisplay rating={latestScore?.overallScore || 0} size="md" />
            </div>
            <p className="text-slate-300 text-sm">
              {getStarRatingFromGAR(latestScore?.overallScore || 0).title}
            </p>
          </CardContent>
        </Card>

        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-success/20 rounded-lg p-3">
                <Download className="text-success h-6 w-6" />
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Export
              </Button>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{scores.length}</h3>
            <p className="text-slate-300 text-sm">Total Analyses</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700 mb-8">
          <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4" />
            GAR Analysis
          </TabsTrigger>
          <TabsTrigger value="stars" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Star className="w-4 h-4" />
            Star Ratings
          </TabsTrigger>
          <TabsTrigger value="sports" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Trophy className="w-4 h-4" />
            Multi-Sport
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Target className="w-4 h-4" />
            Video Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Analysis Results */}
            <div className="lg:col-span-2">
              <AnalysisResults scores={scores} />
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <Card className="go4it-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Current Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-white">
                      {latestScore?.overallScore || 0}
                    </div>
                    <StarDisplay rating={latestScore?.overallScore || 0} size="lg" />
                    <div className="text-slate-300">
                      {getStarRatingFromGAR(latestScore?.overallScore || 0).title}
                    </div>
                    <div className="text-sm text-slate-400">
                      {getStarRatingFromGAR(latestScore?.overallScore || 0).description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="go4it-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => {}}>
                    Upload New Video
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Training Plan
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stars" className="mt-6">
          <StarRatingSystem />
        </TabsContent>

        <TabsContent value="sports" className="mt-6">
          <MultiSportSystem />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Video Upload & Analysis */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Upload Section */}
              <Card className="go4it-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-white">
                      Upload Training Video
                    </CardTitle>
                    <Badge variant="outline" className="text-slate-300">
                      MP4, MOV • Max 500MB
                    </Badge>
                  </div>
            </CardHeader>
            <CardContent>
              <VideoUpload />
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="go4it-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-white">
                  Analysis Results
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AnalysisResults scores={scores} />
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* Score Breakdown */}
          {latestScore && (
            <Card className="go4it-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Latest Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 text-sm">Speed</span>
                      <span className="text-white font-medium">{latestScore.speedScore}</span>
                    </div>
                    <Progress value={latestScore.speedScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 text-sm">Accuracy</span>
                      <span className="text-white font-medium">{latestScore.accuracyScore}</span>
                    </div>
                    <Progress value={latestScore.accuracyScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 text-sm">Decision Making</span>
                      <span className="text-white font-medium">{latestScore.decisionScore}</span>
                    </div>
                    <Progress value={latestScore.decisionScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights */}
          <Card className="go4it-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestScore ? (
                  <>
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <h4 className="font-medium text-primary mb-2">Strength</h4>
                      <p className="text-slate-300 text-sm">
                        Excellent speed and agility demonstrated throughout the drill
                      </p>
                    </div>
                    
                    <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
                      <h4 className="font-medium text-warning mb-2">Focus Area</h4>
                      <p className="text-slate-300 text-sm">
                        Work on decision-making under pressure situations
                      </p>
                    </div>
                    
                    <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                      <h4 className="font-medium text-success mb-2">Recommendation</h4>
                      <p className="text-slate-300 text-sm">
                        Practice more complex passing drills to improve game awareness
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Upload a video to get AI insights</p>
                    <p className="text-sm">Our AI will analyze your performance and provide personalized feedback</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Tips */}
          <Card className="go4it-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Performance Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300 text-sm">
                    Record videos in good lighting for better analysis accuracy
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300 text-sm">
                    Include full-body movements in your training videos
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300 text-sm">
                    Upload consistently to track improvement over time
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300 text-sm">
                    Focus on specific skills for targeted analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
