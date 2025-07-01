import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, CheckCircle, Lock, TreePine } from "lucide-react";
import type { StarpathProgress } from "@shared/schema";

interface ProgressCardProps {
  starpathProgress: StarpathProgress[];
  currentLevel: number;
  totalXP: number;
}

export default function ProgressCard({ 
  starpathProgress, 
  currentLevel, 
  totalXP 
}: ProgressCardProps) {
  
  // Calculate progress to next level
  const baseXPPerLevel = 1000;
  const xpForNextLevel = currentLevel * baseXPPerLevel;
  const currentLevelXP = totalXP % xpForNextLevel;
  const progressToNextLevel = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);

  // Get active skills (unlocked but not completed)
  const activeSkills = (starpathProgress || []).filter(skill => skill.isUnlocked);
  const completedSkills = activeSkills.filter(skill => skill.level >= 15); // Assuming max level is 15

  return (
    <Card className="go4it-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white">
            StarPath Progress
          </CardTitle>
          <Badge variant="secondary" className="text-secondary bg-secondary/20">
            <Star className="h-3 w-3 mr-1" />
            Level {currentLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Level Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm">Progress to Level {currentLevel + 1}</span>
            <span className="text-white text-sm font-medium">
              {currentLevelXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progressToNextLevel} className="h-3 mb-1" />
          <p className="text-slate-400 text-xs">
            {(xpForNextLevel - currentLevelXP).toLocaleString()} XP to next level
          </p>
        </div>

        {/* Next Unlock Preview */}
        <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
          <h4 className="font-medium text-secondary mb-2 flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Next Unlock
          </h4>
          <p className="text-slate-300 text-sm mb-2">Team Strategy Skills</p>
          <p className="text-slate-400 text-xs">Available at Level {currentLevel + 1}</p>
        </div>

        {/* Active Skills Summary */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Active Skills</h3>
          
          {activeSkills.length > 0 ? (
            <div className="space-y-3">
              {activeSkills.slice(0, 3).map((skill) => {
                const isCompleted = skill.level >= 15;
                const progressPercent = isCompleted ? 100 : (skill.xpPoints / (skill.level * 100)) * 100;
                
                return (
                  <div 
                    key={skill.id} 
                    className="flex items-center space-x-4 p-3 bg-slate-700 rounded-lg border border-slate-600"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-success/20' 
                        : skill.skillId.includes('shooting') 
                          ? 'bg-primary/20' 
                          : skill.skillId.includes('speed') 
                            ? 'bg-warning/20' 
                            : 'bg-secondary/20'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : skill.skillId.includes('shooting') ? (
                        <Star className="h-5 w-5 text-primary" />
                      ) : skill.skillId.includes('speed') ? (
                        <Star className="h-5 w-5 text-warning" />
                      ) : (
                        <Star className="h-5 w-5 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{skill.skillName}</h4>
                      <p className="text-slate-400 text-xs">
                        {isCompleted ? 'Master level' : `Level ${skill.level}`} • {skill.xpPoints.toLocaleString()} XP
                      </p>
                      {!isCompleted && (
                        <div className="mt-2">
                          <Progress value={progressPercent} className="h-1" />
                        </div>
                      )}
                    </div>
                    <div className={isCompleted ? 'text-success' : 'text-slate-400'}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                );
              })}
              
              {activeSkills.length > 3 && (
                <p className="text-slate-400 text-xs text-center">
                  +{activeSkills.length - 3} more skills
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <TreePine className="h-12 w-12 mx-auto mb-3" />
              <p className="text-sm">No active skills yet</p>
              <p className="text-xs">Complete training to unlock your first skills</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{activeSkills.length}</div>
            <div className="text-slate-400 text-xs">Skills Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{completedSkills.length}</div>
            <div className="text-slate-400 text-xs">Skills Mastered</div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-secondary hover:bg-purple-600 text-white mobile-touch-target neurodivergent-focus">
          <TreePine className="mr-2 h-4 w-4" />
          View Full Skill Tree
        </Button>
      </CardContent>
    </Card>
  );
}
