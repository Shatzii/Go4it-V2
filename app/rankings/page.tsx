'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, MapPin, Users, TrendingUp, Star, Award, Globe, Target, Crown, Medal } from 'lucide-react';

interface RankedAthlete {
  id: string;
  name: string;
  position: string;
  sport: string;
  country: string;
  state?: string;
  city: string;
  school: string;
  ranking: {
    overall: number;
    national: number;
    regional: number;
    position: number;
  };
  stats: {
    [key: string]: number | string;
  };
  recruiting: {
    offers: number;
    commitment?: string;
    status: string;
  };
  sources: string[];
  lastUpdated: string;
}

interface RankingData {
  rankings: RankedAthlete[];
  totalAthletes: number;
  lastUpdated: string;
  regions: string[];
  sports: string[];
  countries: string[];
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global');
  const [filters, setFilters] = useState({
    sport: '',
    country: '',
    position: '',
    minRanking: '',
    maxRanking: '',
    searchTerm: ''
  });

  useEffect(() => {
    loadRankings();
  }, [activeTab, filters]);

  const loadRankings = async () => {
    setLoading(true);
    try {
      // Use GAR-based ranking for better athlete scoring
      const response = await fetch('/api/rankings/gar-ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sport: filters.sport || null,
          region: activeTab === 'usa' ? 'USA' : activeTab === 'european' ? 'Europe' : null,
          maxResults: 50
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        let filteredAthletes = data.athletes || [];
        
        // Apply additional filters
        if (filters.country) {
          filteredAthletes = filteredAthletes.filter(athlete => 
            athlete.country?.toLowerCase().includes(filters.country.toLowerCase())
          );
        }
        
        if (filters.position) {
          filteredAthletes = filteredAthletes.filter(athlete => 
            athlete.position?.toLowerCase().includes(filters.position.toLowerCase())
          );
        }
        
        if (filters.searchTerm) {
          filteredAthletes = filteredAthletes.filter(athlete => 
            athlete.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            athlete.sport?.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
        }
        
        if (filters.minRanking || filters.maxRanking) {
          filteredAthletes = filteredAthletes.filter((athlete, index) => {
            const rank = index + 1;
            const min = filters.minRanking ? parseInt(filters.minRanking) : 1;
            const max = filters.maxRanking ? parseInt(filters.maxRanking) : 1000;
            return rank >= min && rank <= max;
          });
        }
        
        setRankings(filteredAthletes);
      }
    } catch (error) {
      console.error('Failed to load rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankingIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    if (rank <= 10) return <Trophy className="w-5 h-5 text-blue-500" />;
    if (rank <= 25) return <Star className="w-5 h-5 text-purple-500" />;
    return <Target className="w-5 h-5 text-green-500" />;
  };

  const getRankingBadge = (rank: number) => {
    if (rank <= 5) return 'bg-yellow-500 text-black';
    if (rank <= 10) return 'bg-blue-500 text-white';
    if (rank <= 25) return 'bg-purple-500 text-white';
    if (rank <= 50) return 'bg-green-500 text-white';
    return 'bg-slate-500 text-white';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'committed': return 'bg-green-500';
      case 'open': return 'bg-blue-500';
      case 'interested': return 'bg-yellow-500';
      case 'decommitted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Global Athlete Rankings
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Live rankings from major recruiting platforms worldwide including ESPN, 247Sports, EuroLeague, 1stLookSports, and social media
          </p>
        </div>

        {/* Stats Overview */}
        {rankings && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Athletes</p>
                    <p className="text-2xl font-bold text-white">{rankings.totalAthletes.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Countries</p>
                    <p className="text-2xl font-bold text-white">{rankings.countries.length}</p>
                  </div>
                  <Globe className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Sports</p>
                    <p className="text-2xl font-bold text-white">{rankings.sports.length}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Last Updated</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(rankings.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Filter Rankings</CardTitle>
            <CardDescription className="text-slate-400">
              Narrow down results by sport, country, position, or ranking range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="sport" className="text-white">Sport</Label>
                <Input
                  id="sport"
                  placeholder="Basketball, Football..."
                  value={filters.sport}
                  onChange={(e) => setFilters({...filters, sport: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="country" className="text-white">Country</Label>
                <Input
                  id="country"
                  placeholder="USA, Germany, UK..."
                  value={filters.country}
                  onChange={(e) => setFilters({...filters, country: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="position" className="text-white">Position</Label>
                <Input
                  id="position"
                  placeholder="PG, QB, SF..."
                  value={filters.position}
                  onChange={(e) => setFilters({...filters, position: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="minRanking" className="text-white">Min Rank</Label>
                <Input
                  id="minRanking"
                  type="number"
                  placeholder="1"
                  value={filters.minRanking}
                  onChange={(e) => setFilters({...filters, minRanking: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="maxRanking" className="text-white">Max Rank</Label>
                <Input
                  id="maxRanking"
                  type="number"
                  placeholder="100"
                  value={filters.maxRanking}
                  onChange={(e) => setFilters({...filters, maxRanking: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="search" className="text-white">Search</Label>
                <Input
                  id="search"
                  placeholder="Athlete name..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={loadRankings}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Apply Filters
              </Button>
              <Button 
                variant="outline"
                onClick={() => setFilters({sport: '', country: '', position: '', minRanking: '', maxRanking: '', searchTerm: ''})}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rankings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
            <TabsTrigger value="global" className="text-white">Global Top 100</TabsTrigger>
            <TabsTrigger value="usa" className="text-white">USA Rankings</TabsTrigger>
            <TabsTrigger value="europe" className="text-white">European Rankings</TabsTrigger>
            <TabsTrigger value="international" className="text-white">International</TabsTrigger>
            <TabsTrigger value="rising" className="text-white">Rising Stars</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-slate-400">Loading rankings...</p>
            </div>
          ) : (
            <>
              <TabsContent value="global" className="space-y-4">
                {rankings.map((athlete, index) => (
                  <Card key={athlete.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(index + 1)}
                            <Badge className={`px-3 py-1 text-lg font-bold ${getRankingBadge(index + 1)}`}>
                              #{index + 1}
                            </Badge>
                            {athlete.garScore && (
                              <Badge variant="outline" className="text-blue-400 border-blue-400 ml-2">
                                GAR: {athlete.garScore}
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-white">{athlete.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <span>{athlete.position}</span>
                              <span>•</span>
                              <span>{athlete.sport}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {athlete.city}, {athlete.country}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{athlete.school}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`${getStatusColor(athlete.recruiting.status)} text-white`}>
                              {athlete.recruiting.status}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {athlete.recruiting.offers} offers
                            </span>
                          </div>
                          
                          <div className="text-sm text-slate-400">
                            <div>National: #{athlete.ranking.national}</div>
                            <div>Position: #{athlete.ranking.position}</div>
                          </div>
                          
                          {athlete.recruiting.commitment && (
                            <div className="text-sm text-green-400 mt-1">
                              Committed to {athlete.recruiting.commitment}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* GAR Breakdown Display */}
                      {athlete.garBreakdown && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">{athlete.garBreakdown.technical}</div>
                            <div className="text-xs text-slate-400">Technical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">{athlete.garBreakdown.physical}</div>
                            <div className="text-xs text-slate-400">Physical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-400">{athlete.garBreakdown.tactical}</div>
                            <div className="text-xs text-slate-400">Tactical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-400">{athlete.garBreakdown.mental}</div>
                            <div className="text-xs text-slate-400">Mental</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-400">{athlete.garBreakdown.consistency}</div>
                            <div className="text-xs text-slate-400">Consistency</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Social Media & Highlights */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-2">
                          {athlete.socialMedia && Object.keys(athlete.socialMedia).map((platform, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {platform}
                            </Badge>
                          ))}
                          {athlete.highlights && (
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {athlete.highlights.length} highlights
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          GAR Ranked
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="usa" className="space-y-4">
                {rankings?.rankings.filter(a => a.country === 'USA').map((athlete, index) => (
                  <Card key={athlete.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(athlete.ranking.national)}
                            <Badge className={`px-3 py-1 text-lg font-bold ${getRankingBadge(athlete.ranking.national)}`}>
                              #{athlete.ranking.national}
                            </Badge>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-white">{athlete.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <span>{athlete.position}</span>
                              <span>•</span>
                              <span>{athlete.sport}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {athlete.city}, {athlete.state}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{athlete.school}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`${getStatusColor(athlete.recruiting.status)} text-white`}>
                              {athlete.recruiting.status}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {athlete.recruiting.offers} offers
                            </span>
                          </div>
                          
                          <div className="text-sm text-slate-400">
                            <div>Overall: #{athlete.ranking.overall}</div>
                            <div>Position: #{athlete.ranking.position}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="europe" className="space-y-4">
                {rankings?.rankings.filter(a => a.country !== 'USA' && a.country !== 'Mexico' && a.country !== 'Brazil').map((athlete, index) => (
                  <Card key={athlete.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(athlete.ranking.regional)}
                            <Badge className={`px-3 py-1 text-lg font-bold ${getRankingBadge(athlete.ranking.regional)}`}>
                              #{athlete.ranking.regional}
                            </Badge>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-white">{athlete.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <span>{athlete.position}</span>
                              <span>•</span>
                              <span>{athlete.sport}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {athlete.city}, {athlete.country}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{athlete.school}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`${getStatusColor(athlete.recruiting.status)} text-white`}>
                              {athlete.recruiting.status}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {athlete.recruiting.offers} offers
                            </span>
                          </div>
                          
                          <div className="text-sm text-slate-400">
                            <div>Global: #{athlete.ranking.overall}</div>
                            <div>Position: #{athlete.ranking.position}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="international" className="space-y-4">
                {rankings?.rankings.filter(a => a.country === 'Mexico' || a.country === 'Brazil').map((athlete, index) => (
                  <Card key={athlete.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(athlete.ranking.regional)}
                            <Badge className={`px-3 py-1 text-lg font-bold ${getRankingBadge(athlete.ranking.regional)}`}>
                              #{athlete.ranking.regional}
                            </Badge>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-white">{athlete.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <span>{athlete.position}</span>
                              <span>•</span>
                              <span>{athlete.sport}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {athlete.city}, {athlete.country}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{athlete.school}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`${getStatusColor(athlete.recruiting.status)} text-white`}>
                              {athlete.recruiting.status}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {athlete.recruiting.offers} offers
                            </span>
                          </div>
                          
                          <div className="text-sm text-slate-400">
                            <div>Global: #{athlete.ranking.overall}</div>
                            <div>Position: #{athlete.ranking.position}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="rising" className="space-y-4">
                {rankings?.rankings.filter(a => a.ranking.overall <= 50).map((athlete, index) => (
                  <Card key={athlete.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <Badge className="bg-green-500 text-white px-3 py-1 text-lg font-bold">
                              #{athlete.ranking.overall}
                            </Badge>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-white">{athlete.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <span>{athlete.position}</span>
                              <span>•</span>
                              <span>{athlete.sport}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {athlete.city}, {athlete.country}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{athlete.school}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={`${getStatusColor(athlete.recruiting.status)} text-white`}>
                              {athlete.recruiting.status}
                            </Badge>
                            <span className="text-sm text-slate-400">
                              {athlete.recruiting.offers} offers
                            </span>
                          </div>
                          
                          <div className="text-sm text-slate-400">
                            <div>National: #{athlete.ranking.national}</div>
                            <div>Position: #{athlete.ranking.position}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}