import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GARScoreCardProps {
  overall: number;
  physical: number;
  mental: number;
  technical: number;
  sportType?: string;
  showDetails?: boolean;
}

/**
 * GARScoreCard component
 * 
 * Displays an athlete's GAR scores in a card format with visual indicators
 * This is a modular component that can be dropped into the CMS
 */
export const GARScoreCard: React.FC<GARScoreCardProps> = ({
  overall,
  physical,
  mental,
  technical,
  sportType,
  showDetails = true
}) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">
          {sportType ? `${sportType} GAR Score` : 'GAR Score'}
        </CardTitle>
        <CardDescription>
          Growth and Ability Rating assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-primary">{overall}/100</div>
            <Progress value={overall} className="h-3 flex-1" />
          </div>
          
          {showDetails && (
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Physical</span>
                  <span className="text-sm">{physical}/100</span>
                </div>
                <Progress value={physical} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Mental</span>
                  <span className="text-sm">{mental}/100</span>
                </div>
                <Progress value={mental} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Technical</span>
                  <span className="text-sm">{technical}/100</span>
                </div>
                <Progress value={technical} className="h-2" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};