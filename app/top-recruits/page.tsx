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
  Star,
  TrendingUp,
  MapPin,
  School,
  Phone,
  Mail,
  Video,
  Eye,
  Users,
  Target,
  RefreshCw,
} from 'lucide-react';

interface AthleteProfile {
  id: string;
  name: string;
  position: string;
  sport: string;
  classYear: string;
  rankings: {
    rivals: number;
    espn: number;
    sports247: number;
    on3: number;
    composite: number;
  };
  physicals: {
    height: string;
    weight: string;
    wingspan?: string;
  };
  academics: {
    gpa: number;
    sat?: number;
    act?: number;
  };
  school: {
    current: string;
    state: string;
    committed?: string;
    offers: string[];
  };
  stats: {
    [key: string]: number;
  };
  contact: {
    email?: string;
    social?: {
      twitter?: string;
      instagram?: string;
      hudl?: string;
    };
  };
  highlights: {
    videos: Array<{
      url: string;
      title: string;
      platform: string;
      views: number;
    }>;
  };
  recruiting: {
    status: 'open' | 'committed' | 'signed';
    timeline: string;
    topSchools: string[];
    recruitingNotes: string;
  };
  sources: Array<{
    platform: string;
    confidence: number;
  }>;
}

export default function TopRecruitsPage() {
  const [athletes, setAthletes] = useState<AthleteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [filters, setFilters] = useState({
    sport: '',
    classYear: '',
    position: '',
    ranking: '',
    status: '',
    state: '',
    search: '',
  });
  const [activeTab, setActiveTab] = useState('database');
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  useEffect(() => {
    fetchAthletes();
  }, [filters]);

  const fetchAthletes = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/recruiting/athletes/database?${params}`);
      const data = await response.json();

      if (data.success) {
        setAthletes(data.athletes);
      }
    } catch (error) {
      console.error('Error fetching athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerScraping = async () => {
    setScraping(true);
    try {
      const response = await fetch('/api/recruiting/athletes/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['Rivals.com', '247Sports', 'ESPN', 'On3', 'Hudl'],
          sports: ['basketball', 'football', 'baseball'],
          classYear: '2025',
          rankings: { maxNational: 100 },
          forceUpdate: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the athletes list after scraping
        await fetchAthletes();
      }
    } catch (error) {
      console.error('Error triggering scrape:', error);
    } finally {
      setScraping(false);
    }
  };

  const contactAthlete = (athlete: AthleteProfile, method: 'email' | 'social') => {
    if (method === 'email' && athlete.contact.email) {
      window.open(
        `mailto:${athlete.contact.email}?subject=Recruiting Opportunity - Go4It Sports Platform`,
      );
    } else if (method === 'social' && athlete.contact.social?.twitter) {
      window.open(`https://twitter.com/${athlete.contact.social.twitter.replace('@', '')}`);
    }
  };

  const watchHighlights = (athlete: AthleteProfile) => {
    if (athlete.highlights.videos.length > 0) {
      window.open(athlete.highlights.videos[0].url, '_blank');
    }
  };

  const addToComparison = (athleteId: string) => {
    setSelectedAthletes((prev) =>
      prev.includes(athleteId) ? prev.filter((id) => id !== athleteId) : [...prev, athleteId],
    );
  };

  const getRankingColor = (ranking: number) => {
    if (ranking <= 5) return 'text-red-400';
    if (ranking <= 25) return 'text-orange-400';
    if (ranking <= 50) return 'text-yellow-400';
    if (ranking <= 100) return 'text-green-400';
    return 'text-slate-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'committed':
        return 'bg-green-500';
      case 'open':
        return 'bg-blue-500';
      case 'signed':
        return 'bg-purple-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading top recruits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-red-500 text-white font-bold text-lg px-6 py-2">
            <Star className="w-5 h-5 mr-2" />
            TOP RECRUITS
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            ELITE RECRUIT DATABASE
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Real-time data from Rivals, 247Sports, ESPN, On3, and Hudl
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Athletes</p>
                  <p className="text-2xl font-bold text-red-400">{athletes.length}</p>
                </div>
                <Users className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Top 25 Recruits</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {athletes.filter((a) => a.rankings.composite <= 25).length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Committed</p>
                  <p className="text-2xl font-bold text-green-400">
                    {athletes.filter((a) => a.recruiting.status === 'committed').length}
                  </p>
                </div>
                <School className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Still Open</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {athletes.filter((a) => a.recruiting.status === 'open').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="database">Recruit Database</TabsTrigger>
            <TabsTrigger value="scraper">Live Scraper</TabsTrigger>
            <TabsTrigger value="comparison">Comparison Tool</TabsTrigger>
          </TabsList>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            {/* Filters */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Filter Recruits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <Input
                    placeholder="Search athletes..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Select
                    value={filters.sport}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, sport: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sports</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.classYear}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, classYear: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.position}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, position: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Positions</SelectItem>
                      <SelectItem value="PG">Point Guard</SelectItem>
                      <SelectItem value="SG">Shooting Guard</SelectItem>
                      <SelectItem value="SF">Small Forward</SelectItem>
                      <SelectItem value="PF">Power Forward</SelectItem>
                      <SelectItem value="C">Center</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.ranking}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, ranking: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Ranking" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Rankings</SelectItem>
                      <SelectItem value="5">Top 5</SelectItem>
                      <SelectItem value="25">Top 25</SelectItem>
                      <SelectItem value="50">Top 50</SelectItem>
                      <SelectItem value="100">Top 100</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="committed">Committed</SelectItem>
                      <SelectItem value="signed">Signed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Athletes List */}
            <div className="space-y-4">
              {athletes.map((athlete) => (
                <Card
                  key={athlete.id}
                  className="bg-slate-800 border-slate-700 hover:border-red-500/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white text-xl">{athlete.name}</h3>
                          <Badge className="bg-blue-500 text-white">
                            #{athlete.rankings.composite}
                          </Badge>
                          <Badge
                            className={`${getStatusColor(athlete.recruiting.status)} text-white`}
                          >
                            {athlete.recruiting.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-sm text-slate-300">
                            <span className="font-medium">{athlete.position}</span> • Class of{' '}
                            {athlete.classYear}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-400">
                              {athlete.school.current}, {athlete.school.state}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2 text-sm">Rankings:</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Composite:</span>
                                <span
                                  className={`font-semibold ${getRankingColor(athlete.rankings.composite)}`}
                                >
                                  #{athlete.rankings.composite}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Rivals:</span>
                                <span
                                  className={`font-semibold ${getRankingColor(athlete.rankings.rivals)}`}
                                >
                                  #{athlete.rankings.rivals}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">247Sports:</span>
                                <span
                                  className={`font-semibold ${getRankingColor(athlete.rankings.sports247)}`}
                                >
                                  #{athlete.rankings.sports247}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-2 text-sm">Stats:</h4>
                            <div className="space-y-1">
                              {Object.entries(athlete.stats)
                                .slice(0, 3)
                                .map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-xs">
                                    <span className="text-slate-400 capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                                    </span>
                                    <span className="text-white font-semibold">{value}</span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-2 text-sm">Physicals:</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Height:</span>
                                <span className="text-white font-semibold">
                                  {athlete.physicals.height}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Weight:</span>
                                <span className="text-white font-semibold">
                                  {athlete.physicals.weight}
                                </span>
                              </div>
                              {athlete.physicals.wingspan && (
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Wingspan:</span>
                                  <span className="text-white font-semibold">
                                    {athlete.physicals.wingspan}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-2 text-sm">Recruiting:</h4>
                            <div className="space-y-1">
                              <div className="text-xs text-slate-400">
                                {athlete.recruiting.status === 'committed' &&
                                athlete.school.committed ? (
                                  <div className="flex items-center gap-1">
                                    <School className="w-3 h-3" />
                                    <span>Committed to {athlete.school.committed}</span>
                                  </div>
                                ) : (
                                  <div>{athlete.school.offers.length} offers</div>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                Top Schools: {athlete.recruiting.topSchools.slice(0, 3).join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Data Sources */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-white mb-2 text-sm">Data Sources:</h4>
                          <div className="flex flex-wrap gap-2">
                            {athlete.sources.map((source, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded text-xs"
                              >
                                <span className="text-slate-300">{source.platform}</span>
                                <span
                                  className={`font-semibold ${getConfidenceColor(source.confidence)}`}
                                >
                                  {source.confidence}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {athlete.contact.email && (
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => contactAthlete(athlete, 'email')}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        )}
                        {athlete.contact.social?.twitter && (
                          <Button
                            size="sm"
                            className="bg-blue-400 hover:bg-blue-500"
                            onClick={() => contactAthlete(athlete, 'social')}
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Social
                          </Button>
                        )}
                        {athlete.highlights.videos.length > 0 && (
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => watchHighlights(athlete)}
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Highlights
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={selectedAthletes.includes(athlete.id) ? 'default' : 'outline'}
                          onClick={() => addToComparison(athlete.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {selectedAthletes.includes(athlete.id) ? 'Remove' : 'Compare'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scraper Tab */}
          <TabsContent value="scraper" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Live Data Scraper
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Supported Platforms</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-sm text-slate-300">Rivals.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-sm text-slate-300">247Sports</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-sm text-slate-300">ESPN</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-sm text-slate-300">On3.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-sm text-slate-300">Hudl</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-2">Data Points</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-sm text-slate-300">Rankings & Ratings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-sm text-slate-300">Stats & Measurements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-sm text-slate-300">Commitments & Offers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-sm text-slate-300">Contact Information</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-sm text-slate-300">Highlight Videos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Manual Scrape</h3>
                      <Button
                        onClick={triggerScraping}
                        disabled={scraping}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {scraping ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Scraping...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Scrape Now
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-slate-400 mb-4">
                      Scrape the latest recruit data from all major platforms. This process takes
                      2-3 minutes.
                    </p>

                    {scraping && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress:</span>
                          <span className="text-red-400">Processing platforms...</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recruit Comparison ({selectedAthletes.length} selected)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Compare Top Recruits</h3>
                  <p className="text-slate-400 mb-6">
                    Select athletes from the database to compare rankings, stats, and recruiting
                    status
                  </p>
                  <div className="text-sm text-slate-400 mb-6">
                    {selectedAthletes.length === 0
                      ? 'No athletes selected for comparison'
                      : `${selectedAthletes.length} athletes selected`}
                  </div>
                  {selectedAthletes.length >= 2 && (
                    <Button className="bg-purple-500 hover:bg-purple-600">
                      <Eye className="w-4 h-4 mr-2" />
                      Compare Selected Athletes
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
