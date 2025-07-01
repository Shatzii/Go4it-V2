import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import VideoUpload from "@/components/gar/video-upload";
import AnalysisResults from "@/components/gar/analysis-results";
import ProgressCard from "@/components/starpath/progress-card";
import MotivationalDashboard from "@/components/enhanced/motivational-dashboard";
import AccessibilityPanel from "@/components/enhanced/accessibility-panel";
import { useState } from "react";
import { 
  ChartLine, 
  Star, 
  Trophy, 
  GraduationCap, 
  Upload, 
  Video, 
  Calendar, 
  Download, 
  Settings,
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  Flame,
  Zap
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);

  const { data: garScores } = useQuery({
    queryKey: ["/api/gar-scores"],
    enabled: !!user,
  });

  const { data: starpathProgress } = useQuery({
    queryKey: ["/api/starpath"],
    enabled: !!user,
  });

  const { data: academicRecord } = useQuery({
    queryKey: ["/api/academic"],
    enabled: !!user,
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: !!user,
  });

  // Ensure data is available or use empty arrays
  const garScoresData = (garScores as any[]) || [];
  const starpathData = (starpathProgress as any[]) || [];
  const achievementsData = (achievements as any[]) || [];
  const academicData = academicRecord as any;

  const latestGarScore = garScoresData[0]?.overallScore || 0;
  const totalXP = starpathData.reduce((sum: number, skill: any) => sum + (skill.xpPoints || 0), 0);
  const currentLevel = Math.max(...starpathData.map((skill: any) => skill.level || 1), 1);

  // Enhanced stats for motivational dashboard
  const enhancedStats = {
    weeklyGoal: 5,
    weeklyProgress: garScoresData.filter((score: any) => {
      const scoreDate = new Date(score.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return scoreDate >= weekAgo;
    }).length,
    streak: 3,
    totalXP,
    level: currentLevel,
    nextLevelXP: 1000,
    achievements: achievementsData.length,
    recentActivity: [
      `Completed GAR analysis with ${latestGarScore} score`,
      "Unlocked 'Consistency Champion' achievement",
      `Reached Level ${currentLevel}`,
      "Uploaded new training video"
    ].slice(0, Math.min(4, garScoresData.length + 1))
  };

  if (showAccessibilityPanel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Accessibility Settings</h1>
            <p className="text-slate-400">
              Customize your experience for optimal comfort and focus
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowAccessibilityPanel(false)}
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
          >
            Back to Dashboard
          </Button>
        </div>
        <AccessibilityPanel />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Welcome Section with Verification Theme */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-cyan-400 neon-glow" />
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-cyan-400 neon-text">{(user as any)?.firstName || (user as any)?.username}</span>!
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Track your progress and get verified as an elite athlete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAccessibilityPanel(true)}
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Accessibility
          </Button>
          <div className="verified-badge">
            <CheckCircle className="w-4 h-4 mr-2" />
            Level {currentLevel}
          </div>
        </div>
      </div>

      {/* Enhanced Motivational Dashboard */}
      <MotivationalDashboard user={user} stats={enhancedStats} />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* GAR Score Card */}
        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary/20 rounded-lg p-3">
                <ChartLine className="text-primary h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-success bg-success/20">
                +12 pts
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{latestGarScore}</h3>
            <p className="text-slate-300 text-sm mb-3">Latest GAR Score</p>
            <Progress value={latestGarScore} className="h-2" />
          </CardContent>
        </Card>

        {/* StarPath Level */}
        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary/20 rounded-lg p-3">
                <Star className="text-secondary h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-warning bg-warning/20">
                Level Up!
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Level {currentLevel}</h3>
            <p className="text-slate-300 text-sm mb-3">Basketball Skills</p>
            <Progress value={68} className="h-2" />
          </CardContent>
        </Card>

        {/* XP Points */}
        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-success/20 rounded-lg p-3">
                <Trophy className="text-success h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-success bg-success/20">
                +250 XP
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{totalXP.toLocaleString()}</h3>
            <p className="text-slate-300 text-sm">Total XP Points</p>
          </CardContent>
        </Card>

        {/* Academic Progress */}
        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-warning/20 rounded-lg p-3">
                <GraduationCap className="text-warning h-6 w-6" />
              </div>
              <Badge variant="secondary" className="text-success bg-success/20">
                NCAA Ready
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {academicRecord?.gpa || "N/A"}
            </h3>
            <p className="text-slate-300 text-sm">Current GPA</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - GAR Analysis & Video Upload */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* GAR Analysis Section */}
          <Card className="go4it-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-white">
                  GAR Analysis Dashboard
                </CardTitle>
                <Button className="bg-primary hover:bg-blue-600">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <VideoUpload />
              <AnalysisResults garScores={garScores} />
            </CardContent>
          </Card>

          {/* Performance Trends Chart */}
          <Card className="go4it-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-white">
                  Performance Trends
                </CardTitle>
                <select className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm neurodivergent-focus">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Season</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
                <div className="text-center">
                  <TrendingUp className="text-slate-400 h-12 w-12 mx-auto mb-4" />
                  <p className="text-slate-400">Performance trend chart</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Showing GAR score progression over time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - StarPath & Quick Actions */}
        <div className="space-y-8">
          
          {/* StarPath Progress */}
          <ProgressCard 
            starpathProgress={starpathProgress}
            currentLevel={currentLevel}
            totalXP={totalXP}
          />

          {/* Recent Achievements */}
          <Card className="go4it-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievementsData.slice(0, 2).map((achievement, index) => (
                  <div 
                    key={achievement.id} 
                    className="flex items-center space-x-4 p-4 bg-success/10 rounded-lg border border-success/20"
                  >
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                      <Award className="text-success h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{achievement.title}</h4>
                      <p className="text-slate-300 text-sm">{achievement.description}</p>
                      <p className="text-success text-xs">
                        +{achievement.xpReward} XP
                      </p>
                    </div>
                  </div>
                ))}
                
                {achievementsData.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-4" />
                    <p>No achievements yet</p>
                    <p className="text-sm">Complete drills and upload videos to earn rewards!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="go4it-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="default" 
                  className="w-full justify-start bg-primary hover:bg-blue-600"
                >
                  <Video className="mr-3 h-4 w-4" />
                  Upload New Video
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-slate-700 hover:bg-slate-600 border-slate-600"
                >
                  <Calendar className="mr-3 h-4 w-4" />
                  Schedule Practice
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-slate-700 hover:bg-slate-600 border-slate-600"
                >
                  <Download className="mr-3 h-4 w-4" />
                  Download Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-slate-700 hover:bg-slate-600 border-slate-600"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Academic Progress Section */}
      {academicRecord && (
        <Card className="mt-8 go4it-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Academic Progress
              </CardTitle>
              <Badge variant="secondary" className="text-success bg-success/20">
                <Award className="mr-1 h-3 w-3" />
                NCAA Eligible
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h3 className="font-medium text-white mb-2">Current GPA</h3>
                <div className="text-2xl font-bold text-success mb-2">
                  {academicRecord.gpa}
                </div>
                <p className="text-slate-400 text-sm">Target: 3.5+ for NCAA</p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h3 className="font-medium text-white mb-2">Credits Completed</h3>
                <div className="text-2xl font-bold text-primary mb-2">
                  {academicRecord.creditsCompleted}
                </div>
                <p className="text-slate-400 text-sm">
                  of {academicRecord.totalCreditsRequired} required
                </p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h3 className="font-medium text-white mb-2">SAT Score</h3>
                <div className="text-2xl font-bold text-warning mb-2">
                  {academicRecord.satScore || "N/A"}
                </div>
                <p className="text-slate-400 text-sm">Min: 1,010 for NCAA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
