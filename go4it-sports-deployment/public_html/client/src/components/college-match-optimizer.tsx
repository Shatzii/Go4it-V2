import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap,
  Trophy,
  DollarSign,
  Heart,
  Brain,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  School
} from 'lucide-react';

interface MatchResult {
  collegeId: string;
  collegeName: string;
  overallScore: number;
  scores: {
    academic: number;
    athletic: number;
    social: number;
    financial: number;
    adhdSupport: number;
  };
  strengths: string[];
  concerns: string[];
  scholarshipProbability: {
    athletic: number;
    academic: number;
    needBased: number;
    total: number;
  };
  recruitmentStrategy: {
    contactTiming: 'immediate' | 'soon' | 'future';
    approach: string;
    requiredMaterials: string[];
    keySellingPoints: string[];
  };
  adhdCompatibility: {
    supportMatch: number;
    environmentFit: number;
    accommodationAvailability: string[];
  };
}

interface ScholarshipOpportunity {
  athleteId: string;
  collegeName: string;
  scholarshipType: string;
  deadline: Date;
  requirements: string[];
  matchScore: number;
}

interface UrgentDeadline {
  athleteId: string;
  opportunity: string;
  deadline: Date;
  daysRemaining: number;
}

export function CollegeMatchOptimizer({ 
  athleteId, 
  athleteProfile 
}: { 
  athleteId: string; 
  athleteProfile: any; 
}) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [scholarshipOpportunities, setScholarshipOpportunities] = useState<ScholarshipOpportunity[]>([]);
  const [urgentDeadlines, setUrgentDeadlines] = useState<UrgentDeadline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    maxResults: 10,
    division: ['D1', 'D2', 'D3'],
    maxDistance: 500,
    maxCost: 60000
  });
  const [weights, setWeights] = useState({
    academic: 25,
    athletic: 30,
    social: 20,
    financial: 15,
    adhdSupport: 10
  });

  useEffect(() => {
    if (athleteProfile) {
      findMatches();
      monitorScholarships();
    }
  }, [athleteProfile, filters, weights]);

  const findMatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/college-match/find-optimal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteProfile,
          preferences: {
            maxResults: filters.maxResults,
            priorityWeights: weights,
            filters: {
              division: filters.division,
              maxDistance: filters.maxDistance,
              maxCost: filters.maxCost
            }
          }
        })
      });

      if (response.ok) {
        const matchData: MatchResult[] = await response.json();
        setMatches(matchData);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const monitorScholarships = async () => {
    try {
      const response = await fetch('/api/college-match/monitor-scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteIds: [athleteId]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setScholarshipOpportunities(data.newOpportunities);
        setUrgentDeadlines(data.urgentDeadlines);
      }
    } catch (error) {
      console.error('Error monitoring scholarships:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  const getContactTimingColor = (timing: string) => {
    const colors = {
      immediate: 'bg-red-100 text-red-800',
      soon: 'bg-yellow-100 text-yellow-800',
      future: 'bg-blue-100 text-blue-800'
    };
    return colors[timing as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDeadline = (deadline: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(deadline);
  };

  return (
    <div className="space-y-6">
      {/* Header with Key Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            AI College Match Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{matches.length}</div>
              <div className="text-sm text-gray-600">College Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scholarshipOpportunities.length}</div>
              <div className="text-sm text-gray-600">Scholarship Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{urgentDeadlines.length}</div>
              <div className="text-sm text-gray-600">Urgent Deadlines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {matches.length > 0 ? Math.round(matches.reduce((sum, m) => sum + m.overallScore, 0) / matches.length) : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Match Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Alerts */}
      {urgentDeadlines.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold text-red-800">Urgent Deadlines Approaching!</div>
              {urgentDeadlines.map((deadline, index) => (
                <div key={index} className="text-red-700 text-sm">
                  <strong>{deadline.opportunity}</strong> - {deadline.daysRemaining} days remaining
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* New Scholarship Opportunities */}
      {scholarshipOpportunities.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <DollarSign className="h-5 w-5" />
              New Scholarship Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scholarshipOpportunities.map((opportunity, index) => (
                <div key={index} className="bg-white p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{opportunity.collegeName}</h4>
                      <p className="text-sm text-gray-600">{opportunity.scholarshipType}</p>
                    </div>
                    <Badge variant="default">{opportunity.matchScore}% Match</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Deadline: {formatDeadline(opportunity.deadline)}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {opportunity.requirements.map((req, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{req}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top College Matches
            {isLoading && <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match, index) => (
              <Card key={match.collegeId} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{match.collegeName}</h3>
                      <Badge variant={getScoreBadgeVariant(match.overallScore)} className="mt-1">
                        {match.overallScore}% Overall Match
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Scholarship Probability</div>
                      <div className="text-lg font-bold text-green-600">{match.scholarshipProbability.total}%</div>
                    </div>
                  </div>

                  <Tabs defaultValue="scores" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="scores">Scores</TabsTrigger>
                      <TabsTrigger value="strengths">Strengths</TabsTrigger>
                      <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                      <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
                      <TabsTrigger value="adhd">ADHD Support</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scores" className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(match.scores).map(([category, score]) => (
                          <div key={category} className="text-center">
                            <div className={`text-xl font-bold ${getScoreColor(score)}`}>
                              {score}%
                            </div>
                            <div className="text-sm text-gray-600 capitalize">{category}</div>
                            <Progress value={score} className="h-2 mt-1" />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="strengths" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {match.strengths.map((strength, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <Star className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {match.concerns.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Considerations
                            </h4>
                            <ul className="space-y-1">
                              {match.concerns.map((concern, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  {concern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="scholarships" className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {match.scholarshipProbability.athletic}%
                          </div>
                          <div className="text-sm text-gray-600">Athletic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {match.scholarshipProbability.academic}%
                          </div>
                          <div className="text-sm text-gray-600">Academic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {match.scholarshipProbability.needBased}%
                          </div>
                          <div className="text-sm text-gray-600">Need-Based</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {match.scholarshipProbability.total}%
                          </div>
                          <div className="text-sm text-gray-600">Total</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="recruitment" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Contact Timing: </span>
                          <Badge className={getContactTimingColor(match.recruitmentStrategy.contactTiming)}>
                            {match.recruitmentStrategy.contactTiming}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Approach Strategy</h4>
                          <p className="text-sm text-gray-700">{match.recruitmentStrategy.approach}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Required Materials</h4>
                          <div className="flex flex-wrap gap-1">
                            {match.recruitmentStrategy.requiredMaterials.map((material, i) => (
                              <Badge key={i} variant="outline">{material}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Key Selling Points</h4>
                          <ul className="text-sm space-y-1">
                            {match.recruitmentStrategy.keySellingPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="adhd" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {match.adhdCompatibility.supportMatch}%
                            </div>
                            <div className="text-sm text-gray-600">Support Match</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {match.adhdCompatibility.environmentFit}%
                            </div>
                            <div className="text-sm text-gray-600">Environment Fit</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Available Accommodations
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {match.adhdCompatibility.accommodationAvailability.map((accommodation, i) => (
                              <Badge key={i} variant="secondary">{accommodation}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Weights Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Customize Match Priorities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Adjust the importance of each factor in college matching (total must equal 100%)
            </div>
            
            {Object.entries(weights).map(([category, weight]) => (
              <div key={category} className="flex items-center gap-4">
                <div className="w-24 text-sm capitalize">{category}</div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={weight}
                    onChange={(e) => setWeights(prev => ({
                      ...prev,
                      [category]: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                <div className="w-12 text-sm font-medium">{weight}%</div>
              </div>
            ))}
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Total: {Object.values(weights).reduce((sum, weight) => sum + weight, 0)}%
              </div>
              <Button onClick={findMatches} size="sm">Update Matches</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}