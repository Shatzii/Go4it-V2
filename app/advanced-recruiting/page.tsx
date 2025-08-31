'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  VideoIcon,
  Search,
  Target,
  TrendingUp,
  Users,
  Eye,
  Play,
  BarChart3,
  Zap,
} from 'lucide-react';

interface AdvancedMatch {
  schoolId: string;
  school: string;
  matchScore: number;
  schemeFit: number;
  rosterOpportunity: number;
  competition: number;
  positionNeed: string;
  roleProjection: string;
  availableSpots: number;
  schemeMatch: string;
  keyRequirements: string[];
  recruitingTimeline: string;
}

interface HighlightAnalysis {
  id: string;
  athleteId: string;
  analysis: {
    technical: { overall: number };
    physical: { overall: number };
    tactical: { overall: number };
  };
  highlights: Array<{
    timestamp: string;
    description: string;
    rating: number;
  }>;
  coachingSchemesFit: { [key: string]: number };
}

interface CoachMatch {
  athleteId: string;
  name: string;
  matchScore: number;
  systemFit: number;
  characterFit: number;
  academicFit: number;
  projectedRole: string;
  timeline: string;
}

export default function AdvancedRecruitingPage() {
  const [activeTab, setActiveTab] = useState('ai-matching');
  const [advancedMatches, setAdvancedMatches] = useState<AdvancedMatch[]>([]);
  const [highlightAnalyses, setHighlightAnalyses] = useState<HighlightAnalysis[]>([]);
  const [coachMatches, setCoachMatches] = useState<CoachMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('PG');
  const [selectedCoach, setSelectedCoach] = useState('');

  const fetchAdvancedMatching = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiting/advanced-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteProfile: {
            skills: {
              basketball_iq: 90,
              three_point_shooting: 85,
              court_vision: 92,
              leadership: 88,
            },
          },
          position: selectedPosition,
          highlightMetrics: {},
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAdvancedMatches(data.matches);
      }
    } catch (error) {
      console.error('Error fetching advanced matching:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHighlightAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiting/highlight-analysis');
      const data = await response.json();

      if (data.success) {
        setHighlightAnalyses(data.highlights);
      }
    } catch (error) {
      console.error('Error fetching highlight analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachDiscovery = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiting/coach-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: selectedCoach || 'mick-cronin-ucla',
          searchFilters: {},
          systemRequirements: {},
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCoachMatches(data.matches);
      }
    } catch (error) {
      console.error('Error fetching coach discovery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai-matching') {
      fetchAdvancedMatching();
    } else if (activeTab === 'highlight-analysis') {
      fetchHighlightAnalysis();
    } else if (activeTab === 'coach-discovery') {
      fetchCoachDiscovery();
    }
  }, [activeTab, selectedPosition, selectedCoach]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-500 text-white font-bold text-lg px-6 py-2">
            <Brain className="w-5 h-5 mr-2" />
            ADVANCED AI RECRUITING
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            NEXT-GEN RECRUITING
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            AI-powered coaching scheme analysis, highlight tape comparison, and reverse coach
            discovery
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="ai-matching">AI Scheme Matching</TabsTrigger>
            <TabsTrigger value="highlight-analysis">Highlight Analysis</TabsTrigger>
            <TabsTrigger value="coach-discovery">Coach Discovery</TabsTrigger>
          </TabsList>

          {/* AI Scheme Matching Tab */}
          <TabsContent value="ai-matching" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI-Powered Scheme Matching
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PG">Point Guard</SelectItem>
                      <SelectItem value="SG">Shooting Guard</SelectItem>
                      <SelectItem value="SF">Small Forward</SelectItem>
                      <SelectItem value="PF">Power Forward</SelectItem>
                      <SelectItem value="C">Center</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={fetchAdvancedMatching} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Fit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {advancedMatches.map((match) => (
                    <Card key={match.schoolId} className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{match.school}</CardTitle>
                            <p className="text-sm text-slate-300">{match.schemeMatch}</p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-2xl font-bold ${getScoreColor(match.matchScore)}`}
                            >
                              {match.matchScore}%
                            </div>
                            <div className="text-xs text-slate-400">Overall Match</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Fit Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-400">
                              {match.schemeFit}%
                            </div>
                            <div className="text-xs text-slate-400">Scheme Fit</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-400">
                              {match.rosterOpportunity}%
                            </div>
                            <div className="text-xs text-slate-400">Roster Opportunity</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-400">
                              {match.competition}%
                            </div>
                            <div className="text-xs text-slate-400">Competition Level</div>
                          </div>
                        </div>

                        {/* Position Info */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getPriorityColor(match.positionNeed)} text-white`}>
                              {match.positionNeed.toUpperCase()} NEED
                            </Badge>
                            <span className="text-sm text-slate-300">
                              {match.availableSpots} spots
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">{match.roleProjection}</div>
                        </div>

                        {/* Key Requirements */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-white mb-2 text-sm">
                            System Requirements:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {match.keyRequirements.slice(0, 3).map((req, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs text-slate-300"
                              >
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-400">
                            Timeline: {match.recruitingTimeline}
                          </div>
                          <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Highlight Analysis Tab */}
          <TabsContent value="highlight-analysis" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VideoIcon className="w-5 h-5" />
                  Advanced Highlight Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {highlightAnalyses.map((analysis) => (
                    <Card key={analysis.id} className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Play className="w-5 h-5" />
                          Athlete Performance Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Overall Scores */}
                        <div className="grid grid-cols-3 gap-6 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-2">
                              {analysis.analysis.technical.overall}%
                            </div>
                            <div className="text-sm text-slate-400">Technical</div>
                            <Progress
                              value={analysis.analysis.technical.overall}
                              className="mt-2"
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400 mb-2">
                              {analysis.analysis.physical.overall}%
                            </div>
                            <div className="text-sm text-slate-400">Physical</div>
                            <Progress value={analysis.analysis.physical.overall} className="mt-2" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-2">
                              {analysis.analysis.tactical.overall}%
                            </div>
                            <div className="text-sm text-slate-400">Tactical</div>
                            <Progress value={analysis.analysis.tactical.overall} className="mt-2" />
                          </div>
                        </div>

                        {/* Key Highlights */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-white mb-4">Key Highlights:</h4>
                          <div className="space-y-2">
                            {analysis.highlights.slice(0, 3).map((highlight, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-slate-600 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="text-xs">
                                    {highlight.timestamp}
                                  </Badge>
                                  <span className="text-sm text-slate-200">
                                    {highlight.description}
                                  </span>
                                </div>
                                <div
                                  className={`text-sm font-semibold ${getScoreColor(highlight.rating)}`}
                                >
                                  {highlight.rating}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Coaching Scheme Fits */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-white mb-4">
                            Coaching Scheme Compatibility:
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(analysis.coachingSchemesFit).map(([scheme, fit]) => (
                              <div
                                key={scheme}
                                className="flex items-center justify-between p-2 bg-slate-600 rounded"
                              >
                                <span className="text-sm text-slate-300 capitalize">
                                  {scheme.replace('-', ' ')}
                                </span>
                                <span className={`text-sm font-semibold ${getScoreColor(fit)}`}>
                                  {fit}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Compare
                          </Button>
                          <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                            <VideoIcon className="w-3 h-3 mr-1" />
                            Watch Full Analysis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach Discovery Tab */}
          <TabsContent value="coach-discovery" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Reverse Coach Discovery
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Select value={selectedCoach} onValueChange={setSelectedCoach}>
                    <SelectTrigger className="w-64 bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select Coach Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mick-cronin-ucla">Mick Cronin (UCLA)</SelectItem>
                      <SelectItem value="jon-scheyer-duke">Jon Scheyer (Duke)</SelectItem>
                      <SelectItem value="dusty-may-michigan">Dusty May (Michigan)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={fetchCoachDiscovery} disabled={loading}>
                    {loading ? 'Searching...' : 'Find Players'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coachMatches.map((match) => (
                    <Card key={match.athleteId} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-white">{match.name}</h3>
                              <Badge className="bg-blue-500 text-white">
                                {match.matchScore}% Match
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-purple-400">
                                  {match.systemFit}%
                                </div>
                                <div className="text-xs text-slate-400">System Fit</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-green-400">
                                  {match.characterFit}%
                                </div>
                                <div className="text-xs text-slate-400">Character Fit</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-blue-400">
                                  {match.academicFit}%
                                </div>
                                <div className="text-xs text-slate-400">Academic Fit</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                {match.projectedRole}
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {match.timeline}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                              <Eye className="w-3 h-3 mr-1" />
                              View Profile
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              <Zap className="w-3 h-3 mr-1" />
                              Recruit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">Revolutionize Your Recruiting</h3>
              <p className="text-slate-300 mb-6">
                Use AI to match players with coaching schemes, analyze highlight tapes, and discover
                perfect fits
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-purple-500 hover:bg-purple-600">Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
