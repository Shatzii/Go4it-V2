'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trophy,
  MapPin,
  Users,
  TrendingUp,
  Star,
  Award,
  Globe,
  Target,
  Crown,
  Medal,
  Search,
  Filter,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('football');
  const [activeRegion, setActiveRegion] = useState('usa');
  const [activeGender, setActiveGender] = useState('men');
  const [filters, setFilters] = useState({
    sport: 'all',
    country: 'all',
    position: '',
    minRanking: '',
    maxRanking: '',
    searchTerm: '',
  });

  useEffect(() => {
    loadRankings();
  }, [activeTab, activeRegion, activeGender, filters]);

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
          sport: activeTab,
          region:
            activeRegion === 'usa'
              ? 'USA'
              : activeRegion === 'europe'
                ? 'Europe'
                : activeRegion === 'global'
                  ? null
                  : null,
          gender: activeGender,
          maxResults: 100,
        }),
      });

      const data = await response.json();

      if (data.success) {
        let filteredAthletes = data.athletes || [];

        // Apply additional filters
        if (filters.country && filters.country !== 'all') {
          filteredAthletes = filteredAthletes.filter((athlete) =>
            athlete.country?.toLowerCase().includes(filters.country.toLowerCase()),
          );
        }

        if (filters.position) {
          filteredAthletes = filteredAthletes.filter((athlete) =>
            athlete.position?.toLowerCase().includes(filters.position.toLowerCase()),
          );
        }

        if (filters.searchTerm) {
          filteredAthletes = filteredAthletes.filter(
            (athlete) =>
              athlete.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
              athlete.sport?.toLowerCase().includes(filters.searchTerm.toLowerCase()),
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
      case 'committed':
        return 'bg-green-500';
      case 'open':
        return 'bg-blue-500';
      case 'interested':
        return 'bg-yellow-500';
      case 'decommitted':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
            Real-time global athlete rankings and performance analytics
          </p>
        </div>

        {/* Stats Overview */}
        {rankings && rankings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Athletes</p>
                    <p className="text-2xl font-bold text-white">{rankings.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Top GAR Score</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.max(...rankings.map((r) => r.garScore || 0))}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Elite Athletes</p>
                    <p className="text-2xl font-bold text-white">
                      {rankings.filter((r) => (r.garScore || 0) >= 85).length}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Countries</p>
                    <p className="text-2xl font-bold text-white">
                      {new Set(rankings.map((r) => r.country)).size}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Results Count */}
        {rankings && rankings.length > 0 && (
          <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Showing {rankings.length} athletes</p>
                <p className="text-sm text-slate-400">
                  Ranked by GAR Score • Last updated: {new Date().toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-slate-300 border-slate-600">
                  Global Rankings
                </Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  GAR Powered
                </Badge>
              </div>
            </div>
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
                <Label htmlFor="sport" className="text-white">
                  Sport
                </Label>
                <Input
                  id="sport"
                  placeholder="Basketball, Football..."
                  value={filters.sport}
                  onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-white">
                  Country
                </Label>
                <Input
                  id="country"
                  placeholder="USA, Germany, UK..."
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="position" className="text-white">
                  Position
                </Label>
                <Input
                  id="position"
                  placeholder="PG, QB, SF..."
                  value={filters.position}
                  onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="minRanking" className="text-white">
                  Min Rank
                </Label>
                <Input
                  id="minRanking"
                  type="number"
                  placeholder="1"
                  value={filters.minRanking}
                  onChange={(e) => setFilters({ ...filters, minRanking: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="maxRanking" className="text-white">
                  Max Rank
                </Label>
                <Input
                  id="maxRanking"
                  type="number"
                  placeholder="100"
                  value={filters.maxRanking}
                  onChange={(e) => setFilters({ ...filters, maxRanking: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="search" className="text-white">
                  Search
                </Label>
                <Input
                  id="search"
                  placeholder="Athlete name..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={loadRankings} className="bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    sport: '',
                    country: '',
                    position: '',
                    minRanking: '',
                    maxRanking: '',
                    searchTerm: '',
                  })
                }
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top 100 Search */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Top 100 Athletes Search
            </CardTitle>
            <p className="text-slate-400">Search through the top 100 ranked athletes worldwide</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, sport, or country..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select
                value={filters.sport}
                onValueChange={(value) => setFilters({ ...filters, sport: value })}
              >
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="track">Track & Field</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.country}
                onValueChange={(value) => setFilters({ ...filters, country: value })}
              >
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadRankings} className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Search Top 100
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    sport: 'all',
                    country: 'all',
                    position: '',
                    minRanking: '',
                    maxRanking: '',
                    searchTerm: '',
                  })
                }
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Top 100 Rankings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="football" className="text-white">
              American Football
            </TabsTrigger>
            <TabsTrigger value="basketball" className="text-white">
              Basketball
            </TabsTrigger>
            <TabsTrigger value="soccer" className="text-white">
              Soccer
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-slate-400">Loading rankings...</p>
            </div>
          ) : (
            <>
              <TabsContent value="football" className="space-y-4">
                <div className="mb-4 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    American Football Top 100
                  </h3>
                  <p className="text-slate-300">
                    Independent rankings: USA Top 100, Europe Top 30, Global Top 100
                  </p>
                </div>

                {/* Regional Tabs for Football */}
                <div className="mb-4">
                  <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveRegion('usa')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'usa'
                          ? 'bg-green-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      USA Top 100
                    </button>
                    <button
                      onClick={() => setActiveRegion('europe')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'europe'
                          ? 'bg-green-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Europe Top 30
                    </button>
                    <button
                      onClick={() => setActiveRegion('global')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'global'
                          ? 'bg-green-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Global Top 100
                    </button>
                  </div>
                </div>
                {rankings.map((athlete, index) => (
                  <Card
                    key={athlete.id}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(index + 1)}
                            <Badge
                              className={`px-3 py-1 text-lg font-bold ${getRankingBadge(index + 1)}`}
                            >
                              #{index + 1}
                            </Badge>
                            {athlete.garScore && (
                              <Badge
                                variant="outline"
                                className="text-blue-400 border-blue-400 ml-2"
                              >
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
                            <Badge
                              className={`${getStatusColor(athlete.recruiting.status)} text-white`}
                            >
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
                            <div className="text-lg font-bold text-blue-400">
                              {athlete.garBreakdown.technical}
                            </div>
                            <div className="text-xs text-slate-400">Technical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                              {athlete.garBreakdown.physical}
                            </div>
                            <div className="text-xs text-slate-400">Physical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-400">
                              {athlete.garBreakdown.tactical}
                            </div>
                            <div className="text-xs text-slate-400">Tactical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-400">
                              {athlete.garBreakdown.mental}
                            </div>
                            <div className="text-xs text-slate-400">Mental</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-400">
                              {athlete.garBreakdown.consistency}
                            </div>
                            <div className="text-xs text-slate-400">Consistency</div>
                          </div>
                        </div>
                      )}

                      {/* Social Media & Highlights */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-2">
                          {athlete.socialMedia &&
                            Object.keys(athlete.socialMedia).map((platform, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs border-slate-600 text-slate-400"
                              >
                                {platform}
                              </Badge>
                            ))}
                          {athlete.highlights && (
                            <Badge
                              variant="outline"
                              className="text-xs border-slate-600 text-slate-400"
                            >
                              {athlete.highlights.length} highlights
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">GAR Ranked</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="basketball" className="space-y-4">
                <div className="mb-4 p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Basketball Top 100</h3>
                  <p className="text-slate-300">
                    Men's and Women's rankings: USA Top 100, Europe Top 100, Global Top 100
                  </p>
                </div>

                {/* Gender Tabs for Basketball */}
                <div className="mb-4">
                  <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveGender('men')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeGender === 'men'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Men's Basketball
                    </button>
                    <button
                      onClick={() => setActiveGender('women')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeGender === 'women'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Women's Basketball
                    </button>
                  </div>
                </div>

                {/* Regional Tabs for Basketball */}
                <div className="mb-4">
                  <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveRegion('usa')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'usa'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      USA Top 100
                    </button>
                    <button
                      onClick={() => setActiveRegion('europe')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'europe'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Europe Top 100
                    </button>
                    <button
                      onClick={() => setActiveRegion('global')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'global'
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Global Top 100
                    </button>
                  </div>
                </div>
                {rankings.map((athlete, index) => (
                  <Card
                    key={athlete.id}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(index + 1)}
                            <Badge
                              className={`px-3 py-1 text-lg font-bold ${getRankingBadge(index + 1)}`}
                            >
                              #{index + 1}
                            </Badge>
                            {athlete.garScore && (
                              <Badge
                                variant="outline"
                                className="text-blue-400 border-blue-400 ml-2"
                              >
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="soccer" className="space-y-4">
                <div className="mb-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Soccer Top 100</h3>
                  <p className="text-slate-300">
                    Men's and Women's rankings: USA Top 100, Europe Top 100, Global Top 100
                  </p>
                </div>

                {/* Gender Tabs for Soccer */}
                <div className="mb-4">
                  <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveGender('men')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeGender === 'men'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Men's Soccer
                    </button>
                    <button
                      onClick={() => setActiveGender('women')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeGender === 'women'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Women's Soccer
                    </button>
                  </div>
                </div>

                {/* Regional Tabs for Soccer */}
                <div className="mb-4">
                  <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveRegion('usa')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'usa'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      USA Top 100
                    </button>
                    <button
                      onClick={() => setActiveRegion('europe')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'europe'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Europe Top 100
                    </button>
                    <button
                      onClick={() => setActiveRegion('global')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeRegion === 'global'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      Global Top 100
                    </button>
                  </div>
                </div>
                {rankings.map((athlete, index) => (
                  <Card
                    key={athlete.id}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(index + 1)}
                            <Badge
                              className={`px-3 py-1 text-lg font-bold ${getRankingBadge(index + 1)}`}
                            >
                              #{index + 1}
                            </Badge>
                            {athlete.garScore && (
                              <Badge
                                variant="outline"
                                className="text-blue-400 border-blue-400 ml-2"
                              >
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="usa" className="space-y-4">
                <div className="mb-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">USA Top 100</h3>
                  <p className="text-slate-300">
                    Top 100 Athletes from United States - all sports combined
                  </p>
                </div>
                {rankings.map((athlete, index) => (
                  <Card
                    key={athlete.id}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(index + 1)}
                            <Badge
                              className={`px-3 py-1 text-lg font-bold ${getRankingBadge(index + 1)}`}
                            >
                              #{index + 1}
                            </Badge>
                            {athlete.garScore && (
                              <Badge
                                variant="outline"
                                className="text-blue-400 border-blue-400 ml-2"
                              >
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="europe" className="space-y-4">
                <div className="mb-4 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                  <h3 className="text-lg font-semibold text-indigo-400 mb-2">Europe Top 100</h3>
                  <p className="text-slate-300">
                    Top 100 Athletes from Europe - all sports combined
                  </p>
                </div>
                {rankings.map((athlete, index) => (
                  <Card
                    key={athlete.id}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(index + 1)}
                            <Badge
                              className={`px-3 py-1 text-lg font-bold ${getRankingBadge(index + 1)}`}
                            >
                              #{index + 1}
                            </Badge>
                            {athlete.garScore && (
                              <Badge
                                variant="outline"
                                className="text-blue-400 border-blue-400 ml-2"
                              >
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="global" className="space-y-4">
                <div className="mb-4 p-4 bg-slate-900/20 rounded-lg border border-slate-500/30">
                  <h3 className="text-lg font-semibold text-slate-400 mb-2">Global Top 100</h3>
                  <p className="text-slate-300">
                    Top 100 Athletes worldwide - all sports and regions combined
                  </p>
                </div>
                {rankings.map((athlete, index) => (
                  <Card
                    key={athlete.id}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(index + 1)}
                            <Badge
                              className={`px-3 py-1 text-lg font-bold ${getRankingBadge(index + 1)}`}
                            >
                              #{index + 1}
                            </Badge>
                            {athlete.garScore && (
                              <Badge
                                variant="outline"
                                className="text-blue-400 border-blue-400 ml-2"
                              >
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
                                {athlete.city}, {athlete.state}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{athlete.school}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              className={`${getStatusColor(athlete.recruiting.status)} text-white`}
                            >
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
                <div className="mb-4 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                  <h3 className="text-lg font-semibold text-indigo-400 mb-2">Europe Top 100</h3>
                  <p className="text-slate-300">
                    Top 100 Athletes from Europe - all sports combined
                  </p>
                </div>
                {rankings.map((athlete, index) => (
                  <Card
                    key={athlete.id}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRankingIcon(athlete.ranking.regional)}
                            <Badge
                              className={`px-3 py-1 text-lg font-bold ${getRankingBadge(athlete.ranking.regional)}`}
                            >
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
                            <Badge
                              className={`${getStatusColor(athlete.recruiting.status)} text-white`}
                            >
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
                {rankings?.rankings
                  .filter((a) => a.country === 'Mexico' || a.country === 'Brazil')
                  .map((athlete, index) => (
                    <Card
                      key={athlete.id}
                      className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getRankingIcon(athlete.ranking.regional)}
                              <Badge
                                className={`px-3 py-1 text-lg font-bold ${getRankingBadge(athlete.ranking.regional)}`}
                              >
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
                              <Badge
                                className={`${getStatusColor(athlete.recruiting.status)} text-white`}
                              >
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
                {rankings?.rankings
                  .filter((a) => a.ranking.overall <= 50)
                  .map((athlete, index) => (
                    <Card
                      key={athlete.id}
                      className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
                    >
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
                              <Badge
                                className={`${getStatusColor(athlete.recruiting.status)} text-white`}
                              >
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
