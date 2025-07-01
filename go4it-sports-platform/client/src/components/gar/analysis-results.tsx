import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, BarChart3, Download, Eye, Clock } from "lucide-react";
import type { GarScore } from "@shared/schema";

interface AnalysisResultsProps {
  garScores: GarScore[];
}

export default function AnalysisResults({ garScores }: AnalysisResultsProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<GarScore | null>(null);

  if (!garScores || garScores.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <BarChart3 className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No Analysis Results Yet</h3>
        <p className="text-slate-300 mb-4">
          Upload your first training video to get AI-powered GAR analysis
        </p>
        <p className="text-slate-400 text-sm">
          Our AI will analyze your performance and provide detailed scoring
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    if (score >= 70) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Recent Analysis Results</h3>
        <span className="text-slate-400 text-sm">{garScores.length} analyses</span>
      </div>

      {garScores.map((analysis) => (
        <Card key={analysis.id} className="go4it-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                  <Play className="text-slate-300 h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-white">
                    Video Analysis #{analysis.id}
                  </h4>
                  <p className="text-slate-400 text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(analysis.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </div>
                <div className="text-slate-400 text-xs">GAR Score</div>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-medium text-white">
                  {analysis.speedScore || 0}
                </div>
                <div className="text-slate-400 text-xs">Speed</div>
                <Progress value={analysis.speedScore || 0} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-white">
                  {analysis.accuracyScore || 0}
                </div>
                <div className="text-slate-400 text-xs">Accuracy</div>
                <Progress value={analysis.accuracyScore || 0} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-white">
                  {analysis.decisionScore || 0}
                </div>
                <div className="text-slate-400 text-xs">Decision</div>
                <Progress value={analysis.decisionScore || 0} className="h-1 mt-1" />
              </div>
            </div>

            {/* Skill Breakdown Tags */}
            {analysis.skillBreakdown && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(analysis.skillBreakdown as Record<string, number>).map(([skill, score]) => (
                  <Badge 
                    key={skill} 
                    variant={getScoreBadgeVariant(score)}
                    className="text-xs"
                  >
                    {skill}: {score}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-slate-600 hover:bg-slate-500 border-slate-500 text-white neurodivergent-focus"
                onClick={() => setSelectedAnalysis(analysis)}
              >
                <Eye className="mr-2 h-3 w-3" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-600 hover:bg-slate-500 border-slate-500 text-white neurodivergent-focus"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>

            {/* Expanded Details */}
            {selectedAnalysis?.id === analysis.id && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">Performance Metrics</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Overall Score</span>
                        <span className={`font-medium ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Speed & Agility</span>
                        <span className="text-white font-medium">{analysis.speedScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Accuracy</span>
                        <span className="text-white font-medium">{analysis.accuracyScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Decision Making</span>
                        <span className="text-white font-medium">{analysis.decisionScore}/100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">AI Insights</h5>
                    <div className="text-slate-300 text-sm space-y-2">
                      {analysis.overallScore >= 85 && (
                        <p className="text-success">
                          ✓ Excellent performance with strong fundamentals
                        </p>
                      )}
                      {analysis.speedScore && analysis.speedScore > analysis.accuracyScore! && (
                        <p className="text-primary">
                          → Speed is a key strength - maintain this advantage
                        </p>
                      )}
                      {analysis.accuracyScore && analysis.accuracyScore < 80 && (
                        <p className="text-warning">
                          ! Focus on accuracy drills for improvement
                        </p>
                      )}
                      {analysis.decisionScore && analysis.decisionScore < 75 && (
                        <p className="text-warning">
                          ! Work on decision-making under pressure
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-slate-400 hover:text-white"
                  onClick={() => setSelectedAnalysis(null)}
                >
                  Collapse Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
