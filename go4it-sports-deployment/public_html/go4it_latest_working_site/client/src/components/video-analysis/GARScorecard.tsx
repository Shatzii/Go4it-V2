import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types to match the backend GAR score structure
export interface GARScoreCategory {
  score: number;
  confidence: number;
  strengths: string[];
  areas_to_improve: string[];
  coaching_points: string[];
}

export interface GARPhysicalScores {
  speed: GARScoreCategory;
  strength: GARScoreCategory;
  endurance: GARScoreCategory;
  agility: GARScoreCategory;
  overall: number;
}

export interface GARPsychologicalScores {
  focus: GARScoreCategory;
  confidence: GARScoreCategory;
  decision_making: GARScoreCategory;
  resilience: GARScoreCategory;
  overall: number;
}

export interface GARTechnicalScores {
  technique: GARScoreCategory;
  skill_execution: GARScoreCategory;
  game_iq: GARScoreCategory;
  positioning: GARScoreCategory;
  overall: number;
}

export interface GARScoreBreakdown {
  physical: GARPhysicalScores;
  psychological: GARPsychologicalScores;
  technical: GARTechnicalScores;
  overall_gar_score: number;
  key_highlights: string[];
  tailored_development_path: string;
  adhd_specific_insights: string;
}

interface GARScorecardProps {
  scoreBreakdown: GARScoreBreakdown;
  sportType?: string;
  className?: string;
  compact?: boolean;
}

// Helper function to get color based on score
const getScoreColor = (score: number) => {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-green-500';
  if (score >= 70) return 'bg-lime-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 50) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

// Helper to format score category name
const formatCategoryName = (name: string) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const GARScorecard: React.FC<GARScorecardProps> = ({
  scoreBreakdown,
  sportType,
  className,
  compact = false
}) => {
  return (
    <Card className={cn("w-full shadow-md border-[#2A3142] bg-[#171C2C]", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white flex items-center">
              GAR Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="ml-2 h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Growth and Ability Rating (GAR) is our proprietary scoring system for measuring athletic performance across physical, psychological, and technical domains.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            {sportType && (
              <CardDescription className="text-gray-400">
                {sportType.charAt(0).toUpperCase() + sportType.slice(1)} Performance Analysis
              </CardDescription>
            )}
          </div>
          <div className="flex items-center justify-center bg-[#2A3142] rounded-full w-20 h-20">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(scoreBreakdown.overall_gar_score).replace('bg-', 'text-')}`}>
                {scoreBreakdown.overall_gar_score}
              </div>
              <div className="text-xs text-gray-400">OVERALL</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Score Categories */}
        <div className="space-y-6">
          {/* Physical */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white">Physical</h3>
              <span className={`text-sm font-semibold ${getScoreColor(scoreBreakdown.physical.overall).replace('bg-', 'text-')}`}>
                {scoreBreakdown.physical.overall}
              </span>
            </div>
            {!compact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {Object.entries(scoreBreakdown.physical).map(([key, value]) => {
                  if (key === 'overall') return null;
                  const category = value as GARScoreCategory;
                  return (
                    <div key={key} className="mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{formatCategoryName(key)}</span>
                        <span className="text-xs font-medium text-gray-400">{category.score}</span>
                      </div>
                      <Progress
                        value={category.score}
                        className="h-2 mt-1"
                        indicatorClassName={getScoreColor(category.score)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Psychological */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white">Psychological</h3>
              <span className={`text-sm font-semibold ${getScoreColor(scoreBreakdown.psychological.overall).replace('bg-', 'text-')}`}>
                {scoreBreakdown.psychological.overall}
              </span>
            </div>
            {!compact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {Object.entries(scoreBreakdown.psychological).map(([key, value]) => {
                  if (key === 'overall') return null;
                  const category = value as GARScoreCategory;
                  return (
                    <div key={key} className="mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{formatCategoryName(key)}</span>
                        <span className="text-xs font-medium text-gray-400">{category.score}</span>
                      </div>
                      <Progress
                        value={category.score}
                        className="h-2 mt-1"
                        indicatorClassName={getScoreColor(category.score)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Technical */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white">Technical</h3>
              <span className={`text-sm font-semibold ${getScoreColor(scoreBreakdown.technical.overall).replace('bg-', 'text-')}`}>
                {scoreBreakdown.technical.overall}
              </span>
            </div>
            {!compact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {Object.entries(scoreBreakdown.technical).map(([key, value]) => {
                  if (key === 'overall') return null;
                  const category = value as GARScoreCategory;
                  return (
                    <div key={key} className="mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{formatCategoryName(key)}</span>
                        <span className="text-xs font-medium text-gray-400">{category.score}</span>
                      </div>
                      <Progress
                        value={category.score}
                        className="h-2 mt-1"
                        indicatorClassName={getScoreColor(category.score)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Key Insights Section */}
        {!compact && (
          <div className="mt-6 p-4 border border-[#2A3142] rounded-lg bg-[#1A2033]">
            <h3 className="font-medium text-white mb-3">Key Insights</h3>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              {scoreBreakdown.key_highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
            
            <h3 className="font-medium text-white mt-4 mb-2">Development Focus</h3>
            <p className="text-sm text-gray-300">{scoreBreakdown.tailored_development_path}</p>
            
            <h3 className="font-medium text-white mt-4 mb-2">ADHD-Specific Insights</h3>
            <p className="text-sm text-gray-300">{scoreBreakdown.adhd_specific_insights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GARScorecard;