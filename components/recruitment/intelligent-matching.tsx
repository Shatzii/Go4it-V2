'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Target,
  TrendingUp,
  MapPin,
  GraduationCap,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Star,
  Users,
  BarChart3,
} from 'lucide-react';
import {
  recruitmentEngine,
  type AthleteProfile,
  type MatchAnalysis,
} from '@/lib/recruitment-engine';

interface IntelligentMatchingProps {
  athleteId?: string;
  sport: string;
  className?: string;
}

export function IntelligentMatching({ athleteId, sport, className }: IntelligentMatchingProps) {
  const [matches, setMatches] = useState<MatchAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    division: '',
    region: '',
    minScore: 70,
    maxResults: 10,
  });
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  const [searchMode, setSearchMode] = useState<'athlete' | 'coach'>('athlete');

  useEffect(() => {
    if (athleteId) {
      loadMatches();
      loadMarketAnalysis();
    }
  }, [athleteId, filters]);

  const loadMatches = async () => {
    if (!athleteId) return;

    setLoading(true);
    try {
      const results = await recruitmentEngine.findMatches(athleteId, {
        maxResults: filters.maxResults,
        minScore: filters.minScore,
        divisionFilter: filters.division ? [filters.division] : undefined,
        regionFilter: filters.region ? [filters.region] : undefined,
      });
      setMatches(results);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketAnalysis = async () => {
    try {
      const analysis = await recruitmentEngine.getMarketAnalysis(sport, 'Point Guard');
      setMarketAnalysis(analysis);
    } catch (error) {
      console.error('Failed to load market analysis:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-400';
    if (probability >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Intelligent Recruitment Matching
              </CardTitle>
              <CardDescription>
                AI-powered analysis to find your perfect college match
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={searchMode}
                onValueChange={(value: 'athlete' | 'coach') => setSearchMode(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="athlete">Athlete View</SelectItem>
                  <SelectItem value="coach">Coach View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Division Level</label>
              <Select
                value={filters.division}
                onValueChange={(value) => setFilters({ ...filters, division: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Divisions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Divisions</SelectItem>
                  <SelectItem value="D1">Division I</SelectItem>
                  <SelectItem value="D2">Division II</SelectItem>
                  <SelectItem value="D3">Division III</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Geographic Region</label>
              <Select
                value={filters.region}
                onValueChange={(value) => setFilters({ ...filters, region: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Regions</SelectItem>
                  <SelectItem value="Southeast">Southeast</SelectItem>
                  <SelectItem value="Northeast">Northeast</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="Midwest">Midwest</SelectItem>
                  <SelectItem value="Southwest">Southwest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Minimum Score: {filters.minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Max Results</label>
              <Select
                value={filters.maxResults.toString()}
                onValueChange={(value) => setFilters({ ...filters, maxResults: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Results</SelectItem>
                  <SelectItem value="10">10 Results</SelectItem>
                  <SelectItem value="20">20 Results</SelectItem>
                  <SelectItem value="50">50 Results</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis */}
      {marketAnalysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {marketAnalysis.averageGarScore}
                </div>
                <div className="text-sm text-slate-400">Average GAR Score</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {marketAnalysis.availableScholarships}
                </div>
                <div className="text-sm text-slate-400">Available Scholarships</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {marketAnalysis.competitionLevel}
                </div>
                <div className="text-sm text-slate-400">Competition Level</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {marketAnalysis.topPrograms?.length || 0}
                </div>
                <div className="text-sm text-slate-400">Top Programs</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">Market Trends</h4>
              <div className="space-y-1">
                {marketAnalysis.trends?.map((trend: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    {trend}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Results */}
      <Tabs defaultValue="matches" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Best Matches</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          {loading ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <div className="text-slate-400">Finding your perfect matches...</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">School Name {index + 1}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">D1</Badge>
                          <Badge variant="outline">ACC</Badge>
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <MapPin className="w-3 h-3" />
                            Durham, NC
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(match.overallScore)}`}>
                          {match.overallScore.toFixed(1)}
                        </div>
                        <Badge variant={getScoreBadgeVariant(match.overallScore)}>
                          {match.overallScore >= 85
                            ? 'Excellent Match'
                            : match.overallScore >= 70
                              ? 'Good Match'
                              : 'Fair Match'}
                        </Badge>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      {Object.entries(match.breakdown).map(([category, score]) => (
                        <div key={category} className="text-center">
                          <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
                            {score.toFixed(0)}
                          </div>
                          <div className="text-xs text-slate-400 capitalize">
                            {category === 'needs' ? 'Position Fit' : category}
                          </div>
                          <Progress value={score} className="h-1 mt-1" />
                        </div>
                      ))}
                    </div>

                    {/* Probabilities */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold ${getProbabilityColor(match.probability.recruitment)}`}
                        >
                          {match.probability.recruitment.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-400">Recruitment</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold ${getProbabilityColor(match.probability.scholarship)}`}
                        >
                          {match.probability.scholarship.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-400">Scholarship</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold ${getProbabilityColor(match.probability.success)}`}
                        >
                          {match.probability.success.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-400">Success</div>
                      </div>
                    </div>

                    {/* Strengths and Concerns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Strengths
                        </h4>
                        <div className="space-y-1">
                          {match.strengths.slice(0, 3).map((strength, i) => (
                            <div key={i} className="text-xs text-slate-300">
                              • {strength}
                            </div>
                          ))}
                        </div>
                      </div>

                      {match.concerns.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Considerations
                          </h4>
                          <div className="space-y-1">
                            {match.concerns.slice(0, 3).map((concern, i) => (
                              <div key={i} className="text-xs text-slate-300">
                                • {concern}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Recruitment Timeline
                      </h4>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-slate-300">Contact</div>
                          <div className="text-slate-400">{match.timeline.contactPhase}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-300">Visit</div>
                          <div className="text-slate-400">{match.timeline.visitPhase}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-300">Offer</div>
                          <div className="text-slate-400">{match.timeline.offerPhase}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-300">Commit</div>
                          <div className="text-slate-400">{match.timeline.commitmentPhase}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Contact Coach
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Add to Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Comprehensive Match Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your recruitment prospects</CardDescription>
            </CardHeader>
            <CardContent>
              {matches.length > 0 ? (
                <div className="space-y-6">
                  {/* Overall Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{matches.length}</div>
                      <div className="text-sm text-slate-400">Total Matches</div>
                    </div>

                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {(
                          matches.reduce((sum, m) => sum + m.overallScore, 0) / matches.length
                        ).toFixed(1)}
                      </div>
                      <div className="text-sm text-slate-400">Average Score</div>
                    </div>

                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        {matches.filter((m) => m.probability.scholarship > 70).length}
                      </div>
                      <div className="text-sm text-slate-400">High Scholarship Chance</div>
                    </div>

                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">
                        {matches.filter((m) => m.overallScore >= 85).length}
                      </div>
                      <div className="text-sm text-slate-400">Excellent Matches</div>
                    </div>
                  </div>

                  {/* Category Analysis */}
                  <div>
                    <h4 className="text-white font-medium mb-4">Performance by Category</h4>
                    <div className="space-y-3">
                      {['athletic', 'academic', 'cultural', 'geographic', 'needs'].map(
                        (category) => {
                          const avg =
                            matches.reduce(
                              (sum, m) => sum + m.breakdown[category as keyof typeof m.breakdown],
                              0,
                            ) / matches.length;
                          return (
                            <div key={category} className="flex items-center gap-4">
                              <div className="w-24 text-sm text-slate-300 capitalize">
                                {category === 'needs' ? 'Position Fit' : category}
                              </div>
                              <div className="flex-1">
                                <Progress value={avg} className="h-2" />
                              </div>
                              <div className={`w-12 text-sm font-medium ${getScoreColor(avg)}`}>
                                {avg.toFixed(0)}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-white font-medium mb-4">AI Recommendations</h4>
                    <div className="space-y-2">
                      {matches[0]?.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
                          <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  No analysis available. Please search for matches first.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
