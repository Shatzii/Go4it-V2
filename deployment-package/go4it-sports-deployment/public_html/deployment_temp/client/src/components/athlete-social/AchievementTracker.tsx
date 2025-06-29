import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  TrendingUp, 
  Target, 
  Trophy, 
  Medal, 
  Zap, 
  ChevronRight 
} from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  category: 'physical' | 'technical' | 'mental' | 'competition';
  completed: boolean;
  xp: number;
}

interface AchievementTrackerProps {
  achievements: Achievement[];
  onViewAll: () => void;
}

const categoryIcons = {
  physical: <Zap className="h-4 w-4" />,
  technical: <Target className="h-4 w-4" />,
  mental: <TrendingUp className="h-4 w-4" />,
  competition: <Trophy className="h-4 w-4" />
};

const categoryColors = {
  physical: 'bg-blue-500',
  technical: 'bg-purple-500',
  mental: 'bg-green-500',
  competition: 'bg-amber-500'
};

const categoryBgColors = {
  physical: 'bg-blue-100 dark:bg-blue-950',
  technical: 'bg-purple-100 dark:bg-purple-950',
  mental: 'bg-green-100 dark:bg-green-950',
  competition: 'bg-amber-100 dark:bg-amber-950'
};

const categoryTextColors = {
  physical: 'text-blue-500 dark:text-blue-400',
  technical: 'text-purple-500 dark:text-purple-400',
  mental: 'text-green-500 dark:text-green-400',
  competition: 'text-amber-500 dark:text-amber-400'
};

export function AchievementTracker({ achievements, onViewAll }: AchievementTrackerProps) {
  // Get top achievements (most recent or most progress)
  const topAchievements = achievements
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  // Count completed achievements  
  const completedCount = achievements.filter(a => a.completed).length;
  const completionPercentage = Math.round((completedCount / achievements.length) * 100);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Award className="h-5 w-5 mr-2" /> 
            Achievements
          </CardTitle>
          <Badge variant="outline">{completedCount}/{achievements.length}</Badge>
        </div>
        <CardDescription>
          Track your athletic milestones and earn XP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="space-y-3">
            {topAchievements.map((achievement) => (
              <div key={achievement.id} className="relative pr-6">
                <div className={`p-3 rounded-lg ${achievement.completed ? 'border-2 border-primary' : 'border'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${categoryBgColors[achievement.category]} ${categoryTextColors[achievement.category]}`}>
                      {categoryIcons[achievement.category]}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        {achievement.completed && (
                          <Medal className="h-4 w-4 text-yellow-500 absolute right-2 top-3" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex-1 mr-4">
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${categoryColors[achievement.category]}`} 
                              style={{ width: `${achievement.progress}%` }} 
                            />
                          </div>
                        </div>
                        <div className="text-xs font-medium">
                          {achievement.completed ? 'Complete' : `${achievement.progress}%`}
                        </div>
                      </div>
                      
                      {achievement.completed && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          +{achievement.xp} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between" 
            onClick={onViewAll}
          >
            <span>View All Achievements</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AchievementTracker;