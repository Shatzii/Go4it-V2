import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar } from "lucide-react";

interface StreakBonus {
  days: number;
  multiplier: number;
}

interface StreakInfoCardProps {
  streakDays: number;
  streakBonuses: StreakBonus[];
}

export default function StreakInfoCard({ streakDays, streakBonuses }: StreakInfoCardProps) {
  // Sort streak bonuses by days
  const sortedBonuses = useMemo(() => {
    return [...streakBonuses].sort((a, b) => a.days - b.days);
  }, [streakBonuses]);

  // Find the next streak milestone
  const nextMilestone = useMemo(() => {
    const next = sortedBonuses.find(bonus => bonus.days > streakDays);
    if (!next && sortedBonuses.length > 0) {
      // If streak is beyond all milestones, use the last one plus 30 days
      const highest = sortedBonuses[sortedBonuses.length - 1];
      return {
        days: Math.ceil(streakDays / highest.days) * highest.days + highest.days,
        multiplier: highest.multiplier
      };
    }
    return next;
  }, [streakDays, sortedBonuses]);

  // Calculate days until next milestone
  const daysToNextMilestone = useMemo(() => {
    return nextMilestone ? nextMilestone.days - streakDays : 0;
  }, [nextMilestone, streakDays]);

  // Calculate progress percentage to next milestone
  const progressToNextMilestone = useMemo(() => {
    if (!nextMilestone) return 100;
    
    // If streak is 0, set previous milestone to 0
    const prevMilestone = streakDays === 0 ? 0 : 
      // Find the previous milestone or use 0
      sortedBonuses.filter(b => b.days <= streakDays)
        .reduce((prev, current) => (current.days > prev ? current.days : prev), 0);
    
    const totalDays = nextMilestone.days - prevMilestone;
    const daysCompleted = streakDays - prevMilestone;
    
    return (daysCompleted / totalDays) * 100;
  }, [nextMilestone, streakDays, sortedBonuses]);

  // Get current streak multiplier
  const currentMultiplier = useMemo(() => {
    // Find the highest milestone that is less than or equal to current streak
    const current = [...sortedBonuses]
      .filter(bonus => bonus.days <= streakDays)
      .sort((a, b) => b.days - a.days)[0];
    
    return current ? current.multiplier : 1.0;
  }, [streakDays, sortedBonuses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className="mr-2 h-5 w-5 text-red-500" />
          Daily Streak
        </CardTitle>
        <CardDescription>
          Maintain your streak for XP multipliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold">{streakDays} days</div>
            <div className="text-sm text-muted-foreground">Current streak</div>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-base">
            {currentMultiplier}x <span className="ml-1 text-xs">multiplier</span>
          </Badge>
        </div>

        {nextMilestone && (
          <>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Next milestone: {nextMilestone.days} days</span>
                <span>{daysToNextMilestone} days left</span>
              </div>
              <Progress value={progressToNextMilestone} className="h-2" />
            </div>

            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                At {nextMilestone.days} days you'll earn a {nextMilestone.multiplier}x XP multiplier!
              </span>
            </div>
          </>
        )}

        <div className="mt-4 pt-4 border-t">
          <div className="text-sm font-medium mb-2">Streak Milestones</div>
          <div className="grid grid-cols-2 gap-2">
            {sortedBonuses.map((bonus) => (
              <div 
                key={bonus.days} 
                className={`p-2 rounded-md border text-sm ${streakDays >= bonus.days 
                  ? "bg-primary/10 border-primary" 
                  : "bg-muted/50"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{bonus.days} days</span>
                  <Badge variant={streakDays >= bonus.days ? "default" : "secondary"} className="px-1 py-0 h-5">
                    {bonus.multiplier}x
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}