'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, TrendingUp, MapPin, Users, Target, Star, Award, Calendar, Filter } from 'lucide-react';

interface AthleteRanking {
  id: string;
  name: string;
  sport: string;
  position: string;
  city: string;
  state: string;
  region: string;
  garScore: number;
  nationalRank: number;
  regionalRank: number;
  cityRank: number;
  stateRank: number;
  recruitmentScore: number;
  collegeInterest: number;
  scholarshipPotential: number;
  highlights: string[];
  stats: any;
  recruitmentPrediction?: any;
}

const SPORTS = ['Basketball', 'Football', 'Soccer', 'Tennis', 'Track & Field', 'Baseball', 'Swimming', 'Volleyball'];
const REGIONS = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
const STATES = ['AL', 'CA', 'FL', 'GA', 'IL', 'MI', 'OH', 'TX', 'NY', 'NC'];
const RANKING_TYPES = ['national', 'regional', 'state', 'city'];

export default function RecruitmentRanking() {
  const [athletes, setAthletes] = useState<AthleteRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sport: '',
    region: '',
    state: '',
    city: '',
    type: 'national'
  });
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteRanking | null>(null);
  const [collegeMatches, setCollegeMatches] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchRankings();
  }, [filters]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.region) params.append('region', filters.region);
      if (filters.state) params.append('state', filters.state);
      if (filters.city) params.append('city', filters.city);
      if (filters.type) params.append('type', filters.type);

      const response = await fetch(`/api/recruitment-ranking?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setAthletes(data.athletes);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      sport: '',
      region: '',
      state: '',
      city: '',
      type: 'national'
    });
  };

  const getRankingColor = (rank: number) => {
    if (rank <= 10) return 'text-yellow-400';
    if (rank <= 50) return 'text-green-400';
    if (rank <= 100) return 'text-blue-400';
    return 'text-slate-400';
  };

  const getGARColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const viewAthleteDetails = async (athlete: AthleteRanking) => {
    setSelectedAthlete(athlete);
    
    // Fetch college matches
    try {
      const response = await fetch('/api/recruitment-ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'college-match',
          athleteId: athlete.id
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setCollegeMatches(data.matches);
      }
    } catch (error) {
      console.error('Error fetching college matches:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-300">Loading recruitment rankings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Recruitment Rankings
          </h1>
          <p className="text-slate-300 text-lg">
            National, regional, state, and city athletic rankings with recruitment predictions
          </p>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-white">{summary.totalAthletes}</div>
                    <div className="text-sm text-slate-400">Total Athletes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{summary.averageGARScore.toFixed(1)}</div>
                    <div className="text-sm text-slate-400">Average GAR Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{summary.topPerformers}</div>
                    <div className="text-sm text-slate-400">Elite Athletes (90+ GAR)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{summary.scholarshipCandidates}</div>
                    <div className="text-sm text-slate-400">Scholarship Candidates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Ranking Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <Label className="text-slate-300">Ranking Type</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">National Rankings</SelectItem>
                    <SelectItem value="regional">Regional Rankings</SelectItem>
                    <SelectItem value="state">State Rankings</SelectItem>
                    <SelectItem value="city">City Rankings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Sport</Label>
                <Select value={filters.sport} onValueChange={(value) => handleFilterChange('sport', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="All sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sports</SelectItem>
                    {SPORTS.map(sport => (
                      <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Region</Label>
                <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Regions</SelectItem>
                    {REGIONS.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">State</Label>
                <Select value={filters.state} onValueChange={(value) => handleFilterChange('state', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">City</Label>
                <Input
                  placeholder="Enter city name"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={clearFilters} variant="outline" className="border-slate-600">
                Clear Filters
              </Button>
              <span className="text-slate-400">
                Showing {athletes.length} athletes
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Rankings List */}
        <div className="grid grid-cols-1 gap-4">
          {athletes.map((athlete, index) => (
            <Card key={athlete.id} className="bg-slate-800 border-slate-700 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Athlete Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-4">
                      <div className={`text-3xl font-bold ${getRankingColor(athlete[`${filters.type}Rank`])}`}>
                        #{athlete[`${filters.type}Rank`]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{athlete.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary text-white">{athlete.sport}</Badge>
                          <Badge variant="outline" className="text-slate-300 border-slate-600">
                            {athlete.position}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{athlete.city}, {athlete.state}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {athlete.highlights.slice(0, 3).map((highlight, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rankings */}
                  <div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">GAR Score</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getGARColor(athlete.garScore)}`}></div>
                          <span className="font-bold text-white">{athlete.garScore}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">National Rank</span>
                        <span className={`font-bold ${getRankingColor(athlete.nationalRank)}`}>
                          #{athlete.nationalRank}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Regional Rank</span>
                        <span className={`font-bold ${getRankingColor(athlete.regionalRank)}`}>
                          #{athlete.regionalRank}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">State Rank</span>
                        <span className={`font-bold ${getRankingColor(athlete.stateRank)}`}>
                          #{athlete.stateRank}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recruitment Metrics */}
                  <div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-400">Recruitment Score</span>
                          <span className="font-bold text-white">{athlete.recruitmentScore}</span>
                        </div>
                        <Progress value={athlete.recruitmentScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-400">College Interest</span>
                          <span className="font-bold text-white">{athlete.collegeInterest}</span>
                        </div>
                        <Progress value={(athlete.collegeInterest / 30) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-400">Scholarship Potential</span>
                          <span className="font-bold text-white">{athlete.scholarshipPotential}%</span>
                        </div>
                        <Progress value={athlete.scholarshipPotential} className="h-2" />
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => viewAthleteDetails(athlete)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Athlete Details Modal */}
        {selectedAthlete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-slate-800 border-slate-700 max-w-6xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl">{selectedAthlete.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-primary text-white">{selectedAthlete.sport}</Badge>
                      <Badge variant="outline" className="text-slate-300 border-slate-600">
                        {selectedAthlete.position}
                      </Badge>
                      <Badge className={`${getGARColor(selectedAthlete.garScore)} text-white`}>
                        GAR: {selectedAthlete.garScore}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedAthlete(null)}
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rankings">Rankings</TabsTrigger>
                    <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
                    <TabsTrigger value="matches">College Matches</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-slate-700 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-white">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(selectedAthlete.stats).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-slate-300 capitalize">{key}</span>
                                <span className="text-white font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-white">Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedAthlete.highlights.map((highlight, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-slate-300">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="rankings" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-slate-700 border-slate-600 text-center">
                        <CardContent className="p-4">
                          <div className={`text-3xl font-bold ${getRankingColor(selectedAthlete.nationalRank)}`}>
                            #{selectedAthlete.nationalRank}
                          </div>
                          <div className="text-sm text-slate-400">National</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700 border-slate-600 text-center">
                        <CardContent className="p-4">
                          <div className={`text-3xl font-bold ${getRankingColor(selectedAthlete.regionalRank)}`}>
                            #{selectedAthlete.regionalRank}
                          </div>
                          <div className="text-sm text-slate-400">Regional</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700 border-slate-600 text-center">
                        <CardContent className="p-4">
                          <div className={`text-3xl font-bold ${getRankingColor(selectedAthlete.stateRank)}`}>
                            #{selectedAthlete.stateRank}
                          </div>
                          <div className="text-sm text-slate-400">State</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700 border-slate-600 text-center">
                        <CardContent className="p-4">
                          <div className={`text-3xl font-bold ${getRankingColor(selectedAthlete.cityRank)}`}>
                            #{selectedAthlete.cityRank}
                          </div>
                          <div className="text-sm text-slate-400">City</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="recruitment" className="space-y-4">
                    {selectedAthlete.recruitmentPrediction && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-700 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white">Division Probability</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-slate-300">Division I</span>
                                  <span className="text-white">{selectedAthlete.recruitmentPrediction.d1Probability}%</span>
                                </div>
                                <Progress value={selectedAthlete.recruitmentPrediction.d1Probability} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-slate-300">Division II</span>
                                  <span className="text-white">{selectedAthlete.recruitmentPrediction.d2Probability}%</span>
                                </div>
                                <Progress value={selectedAthlete.recruitmentPrediction.d2Probability} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-slate-300">Division III</span>
                                  <span className="text-white">{selectedAthlete.recruitmentPrediction.d3Probability}%</span>
                                </div>
                                <Progress value={selectedAthlete.recruitmentPrediction.d3Probability} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-700 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white">Recommended Actions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedAthlete.recruitmentPrediction.recommendedActions.map((action: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-primary" />
                                  <span className="text-slate-300">{action}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="matches" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {collegeMatches.map((match, i) => (
                        <Card key={i} className="bg-slate-700 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">{match.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300">Overall Match</span>
                                <div className="flex items-center gap-2">
                                  <Progress value={match.matchScore} className="h-2 w-20" />
                                  <span className="text-white font-bold">{match.matchScore}%</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Academic Fit</span>
                                  <span className="text-white">{match.fit.academic}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Athletic Fit</span>
                                  <span className="text-white">{match.fit.athletic}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Geographic Fit</span>
                                  <span className="text-white">{match.fit.geographic}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Financial Fit</span>
                                  <span className="text-white">{match.fit.financial}%</span>
                                </div>
                              </div>
                              <Button size="sm" className="w-full">
                                Contact Coach
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}