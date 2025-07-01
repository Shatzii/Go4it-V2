import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSkillVisualizer from "@/components/starpath/animated-skill-visualizer";
import InteractiveLearningPaths from "@/components/starpath/interactive-learning-paths";
import SkillProgressionAnalytics from "@/components/starpath/skill-progression-analytics";
import { Star, Trophy, Target, Zap, Lock, CheckCircle, Map, BarChart3, Route, BookOpen } from "lucide-react";

export default function StarPath() {
  const { user } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { data: starpathProgress, isLoading } = useQuery({
    queryKey: [`/api/starpath`],
    enabled: !!user,
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

  const progress = starpathProgress || [];
  const totalXP = Array.isArray(progress) ? progress.reduce((sum: number, skill: any) => sum + (skill.xpPoints || 0), 0) : 0;
  const currentLevel = Array.isArray(progress) ? Math.max(...progress.map((skill: any) => skill.level || 1), 1) : 1;
  const unlockedSkills = Array.isArray(progress) ? progress.filter((skill: any) => skill.isUnlocked).length : 0;

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
  };

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId);
  };

  const handleModuleStart = (moduleId: string) => {
    console.log('Starting module:', moduleId);
  };

  const handlePathComplete = (pathId: string) => {
    console.log('Path completed:', pathId);
  };

  const handleTimeFrameChange = (newTimeFrame: string) => {
    setTimeFrame(newTimeFrame as '7d' | '30d' | '90d' | '1y');
  };

  // Sample user progress data for paths
  const userPathProgress = [
    {
      pathId: 'speed-demon',
      currentModule: 'top-speed-mechanics',
      completedModules: ['speed-basics', 'acceleration-drills'],
      totalXP: 250,
      timeSpent: 3600, // seconds
      streakDays: 5,
      lastActivity: new Date()
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">StarPath Skill Development</h1>
        <p className="text-slate-300 text-lg">
          Interactive progression system with animated visualizations and learning paths
        </p>
      </div>

      {/* Level Overview - Condensed */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="go4it-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/20 rounded-lg p-2">
              <Star className="text-secondary h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Level {currentLevel}</div>
              <div className="text-xs text-slate-300">Current</div>
            </div>
          </div>
        </Card>

        <Card className="go4it-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 rounded-lg p-2">
              <Trophy className="text-primary h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{totalXP.toLocaleString()}</div>
              <div className="text-xs text-slate-300">Total XP</div>
            </div>
          </div>
        </Card>

        <Card className="go4it-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-success/20 rounded-lg p-2">
              <CheckCircle className="text-success h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{unlockedSkills}</div>
              <div className="text-xs text-slate-300">Unlocked</div>
            </div>
          </div>
        </Card>

        <Card className="go4it-card p-4">
          <div className="flex items-center gap-3">
            <div className="bg-warning/20 rounded-lg p-2">
              <Target className="text-warning h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">780 XP</div>
              <div className="text-xs text-slate-300">To Next Level</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs defaultValue="visualizer" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger value="visualizer" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Map className="w-4 h-4" />
            Skills Map
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Route className="w-4 h-4" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualizer" className="mt-6">
          <AnimatedSkillVisualizer
            userProgress={Array.isArray(progress) ? progress : []}
            onSkillSelect={handleSkillSelect}
            onPathSelect={handlePathSelect}
          />
        </TabsContent>

        <TabsContent value="paths" className="mt-6">
          <InteractiveLearningPaths
            selectedPath={selectedPath}
            userProgress={userPathProgress}
            onModuleStart={handleModuleStart}
            onPathComplete={handlePathComplete}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <SkillProgressionAnalytics
            userProgress={Array.isArray(progress) ? progress : []}
            timeFrame={timeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}