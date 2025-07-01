import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Zap, 
  CheckCircle, 
  Lock, 
  Star, 
  Trophy,
  ArrowRight,
  Info
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  level: number;
  xp: number;
  maxXp: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisites?: string[];
}

interface SkillTreeProps {
  skills: Skill[];
}

export default function SkillTree({ skills }: SkillTreeProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "tree">("grid");

  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  const getCategoryColor = (category: string) => {
    const colorMap = {
      "Offense": "primary",
      "Defense": "secondary", 
      "Athletics": "warning",
      "Fundamentals": "success",
      "Mental": "destructive",
    };
    return colorMap[category as keyof typeof colorMap] || "default";
  };

  const getCategoryBgClass = (category: string) => {
    const bgMap = {
      "Offense": "bg-primary/20 border-primary/20",
      "Defense": "bg-secondary/20 border-secondary/20",
      "Athletics": "bg-warning/20 border-warning/20", 
      "Fundamentals": "bg-success/20 border-success/20",
      "Mental": "bg-destructive/20 border-destructive/20",
    };
    return bgMap[category as keyof typeof bgMap] || "bg-slate-700 border-slate-600";
  };

  const getProgressPercentage = (skill: Skill) => {
    return skill.isCompleted ? 100 : (skill.xp / skill.maxXp) * 100;
  };

  const renderSkillCard = (skill: Skill) => {
    const IconComponent = skill.icon;
    const progressPercent = getProgressPercentage(skill);
    const categoryBg = getCategoryBgClass(skill.category);

    return (
      <Card 
        key={skill.id} 
        className={`go4it-card cursor-pointer transition-all hover:scale-105 ${
          selectedSkill?.id === skill.id ? "ring-2 ring-primary" : ""
        } ${!skill.isUnlocked ? "opacity-60" : ""}`}
        onClick={() => setSelectedSkill(skill)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${categoryBg}`}>
              {skill.isUnlocked ? (
                <IconComponent className={`h-6 w-6 ${
                  skill.category === "Offense" ? "text-primary" :
                  skill.category === "Defense" ? "text-secondary" :
                  skill.category === "Athletics" ? "text-warning" :
                  skill.category === "Fundamentals" ? "text-success" :
                  "text-destructive"
                }`} />
              ) : (
                <Lock className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white text-sm">{skill.name}</h4>
              <p className="text-slate-400 text-xs">{skill.category}</p>
            </div>
            {skill.isCompleted && (
              <CheckCircle className="h-5 w-5 text-success" />
            )}
          </div>

          <p className="text-slate-300 text-xs mb-3 line-clamp-2">
            {skill.description}
          </p>

          {skill.isUnlocked ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">
                  {skill.isCompleted ? "Mastered" : `Level ${skill.level}`}
                </span>
                <span className="text-white text-xs font-medium">
                  {skill.xp.toLocaleString()} XP
                </span>
              </div>
              {!skill.isCompleted && (
                <Progress value={progressPercent} className="h-1" />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-2">
              <Badge variant="outline" className="text-slate-400 border-slate-500">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="neurodivergent-focus"
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === "tree" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("tree")}
            className="neurodivergent-focus"
          >
            Tree View
          </Button>
        </div>
        <Badge variant="secondary" className="text-slate-300">
          {skills.filter(s => s.isUnlocked).length} / {skills.length} Unlocked
        </Badge>
      </div>

      {viewMode === "grid" ? (
        /* Grid View */
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-secondary" />
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills
                  .filter(skill => skill.category === category)
                  .map(renderSkillCard)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tree View - Simplified linear progression */
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={skill.id} className="flex items-center space-x-4">
              <div className="flex-1">
                {renderSkillCard(skill)}
              </div>
              {index < skills.length - 1 && (
                <ArrowRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skill Detail Modal/Sidebar */}
      {selectedSkill && (
        <Card className="go4it-card mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedSkill.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSkill(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Description</h4>
                  <p className="text-slate-300 text-sm">{selectedSkill.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Category</h4>
                  <Badge variant="secondary" className={getCategoryBgClass(selectedSkill.category)}>
                    {selectedSkill.category}
                  </Badge>
                </div>

                {!selectedSkill.isUnlocked && selectedSkill.prerequisites && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Prerequisites</h4>
                    <div className="space-y-1">
                      {selectedSkill.prerequisites.map((prereq) => (
                        <Badge key={prereq} variant="outline" className="text-slate-400 border-slate-500">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Progress</h4>
                  {selectedSkill.isUnlocked ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">
                          {selectedSkill.isCompleted ? "Mastered" : `Level ${selectedSkill.level}`}
                        </span>
                        <span className="text-white font-medium">
                          {selectedSkill.xp.toLocaleString()} / {selectedSkill.maxXp.toLocaleString()} XP
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(selectedSkill)} className="h-2" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">Skill not yet unlocked</span>
                    </div>
                  )}
                </div>

                {selectedSkill.isUnlocked && !selectedSkill.isCompleted && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Next Milestone</h4>
                    <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="h-4 w-4 text-warning" />
                        <span className="text-white text-sm font-medium">
                          Level {selectedSkill.level + 1}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs">
                        {selectedSkill.maxXp - selectedSkill.xp} XP remaining
                      </p>
                    </div>
                  </div>
                )}

                {selectedSkill.isUnlocked && (
                  <Button 
                    className="w-full bg-primary hover:bg-blue-600 neurodivergent-focus"
                    disabled={selectedSkill.isCompleted}
                  >
                    {selectedSkill.isCompleted ? "Mastered" : "Practice Drill"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
