import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StarLevel, StarPathProgress } from '../index';
import { CalendarCheck, Star, Trophy, Activity, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';

interface StarPathCardProps {
  progress: StarPathProgress;
  onClaimReward?: (milestoneId: number) => void;
  onCheckIn?: () => void;
}

export const StarPathCard: React.FC<StarPathCardProps> = ({ 
  progress, 
  onClaimReward, 
  onCheckIn 
}) => {
  const canCheckIn = progress.lastUpdated ? 
    new Date().getTime() - new Date(progress.lastUpdated).getTime() > 24 * 60 * 60 * 1000 : 
    true;

  const formatStarLevel = (level: number): string => {
    switch(level) {
      case StarLevel.RisingProspect: return "Rising Prospect";
      case StarLevel.EmergingTalent: return "Emerging Talent";
      case StarLevel.StandoutPerformer: return "Standout Performer";
      case StarLevel.EliteProspect: return "Elite Prospect";
      case StarLevel.FiveStarAthlete: return "Five-Star Athlete";
      default: return "Unknown";
    }
  };

  // Calculate XP progress bar percentage
  const xpProgressPercentage = progress.xpTotal > 0 && progress.levelThresholds.length > 0 ?
    Math.min(100, (progress.xpTotal / progress.levelThresholds[progress.level]) * 100) : 0;

  return (
    <Card className="shadow-lg bg-background border-primary/20 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-primary/10 flex items-center justify-center`}>
        <Star className="h-8 w-8 text-primary" />
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {formatStarLevel(progress.currentStarLevel)}
          </Badge>
          <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
            Level {progress.level}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight mt-2">
          Star Path Progression
        </CardTitle>
        <CardDescription>
          Track your journey from prospect to 5-star athlete
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>XP Progress</span>
            <span className="text-muted-foreground">{progress.xpTotal} / {progress.levelThresholds[progress.level]} XP</span>
          </div>
          <Progress value={xpProgressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-3">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Streak</div>
              <div className="text-xl font-bold">{progress.streakDays} days</div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-3">
            <Trophy className="h-5 w-5 text-amber-500" />
            <div>
              <div className="text-sm font-medium">Star Level</div>
              <div className="text-xl font-bold">{progress.currentStarLevel}/5</div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-3">
            <Activity className="h-5 w-5 text-emerald-500" />
            <div>
              <div className="text-sm font-medium">Drills</div>
              <div className="text-xl font-bold">{progress.completedDrills}</div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-3">
            <Dumbbell className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Workouts</div>
              <div className="text-xl font-bold">{progress.verifiedWorkouts}</div>
            </div>
          </div>
        </div>
        
        {progress.nextMilestone && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-sm mb-1">Next Milestone</h4>
            <p className="text-sm text-muted-foreground">{progress.nextMilestone}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        {progress.lastUpdated && (
          <div className="text-xs text-muted-foreground">
            Last updated: {format(new Date(progress.lastUpdated), 'MMM dd, yyyy')}
          </div>
        )}
        
        {onCheckIn && (
          <button
            onClick={onCheckIn}
            disabled={!canCheckIn}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              canCheckIn 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            Daily Check-In
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StarPathCard;