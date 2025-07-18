'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Trophy, Star, Users, MapPin, Calendar, Filter, Eye } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/verification-badge';

interface VerifiedAthlete {
  id: number;
  name: string;
  sport: string;
  position: string;
  garScore: number;
  verified: boolean;
  verificationDate: string;
  achievements: string[];
  stats: {
    gpa: number;
    satScore: number;
    heightInches: number;
    weightPounds: number;
  };
}

export default function VerifiedAthletesPage() {
  const [athletes, setAthletes] = useState<VerifiedAthlete[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<VerifiedAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sport: '',
    minGarScore: '',
    search: ''
  });

  useEffect(() => {
    fetchVerifiedAthletes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, athletes]);

  const fetchVerifiedAthletes = async () => {
    try {
      const response = await fetch('/api/verified-athletes');
      const data = await response.json();
      
      if (data.success) {
        setAthletes(data.athletes);
        setFilteredAthletes(data.athletes);
      }
    } catch (error) {
      console.error('Error fetching verified athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = athletes;
    
    if (filters.sport) {
      filtered = filtered.filter(athlete => 
        athlete.sport.toLowerCase().includes(filters.sport.toLowerCase())
      );
    }
    
    if (filters.minGarScore) {
      filtered = filtered.filter(athlete => 
        athlete.garScore >= parseInt(filters.minGarScore)
      );
    }
    
    if (filters.search) {
      filtered = filtered.filter(athlete => 
        athlete.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        athlete.position.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    setFilteredAthletes(filtered);
  };

  const resetFilters = () => {
    setFilters({
      sport: '',
      minGarScore: '',
      search: ''
    });
  };

  const sports = [...new Set(athletes.map(a => a.sport))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading verified athletes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-500 text-white font-bold text-lg px-6 py-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            VERIFIED ATHLETES
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GAR-VERIFIED ATHLETES
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Athletes who have completed official GAR Score analysis and received verification
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{athletes.length}</div>
              <div className="text-sm text-slate-300">Total Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {athletes.length > 0 ? Math.round(athletes.reduce((sum, a) => sum + a.garScore, 0) / athletes.length) : 0}
              </div>
              <div className="text-sm text-slate-300">Avg GAR Score</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{sports.length}</div>
              <div className="text-sm text-slate-300">Sports Represented</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {athletes.filter(a => a.garScore >= 90).length}
              </div>
              <div className="text-sm text-slate-300">Elite Level (90+)</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Athletes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by name or position..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Select value={filters.sport} onValueChange={(value) => setFilters(prev => ({ ...prev, sport: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sports</SelectItem>
                    {sports.map(sport => (
                      <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.minGarScore} onValueChange={(value) => setFilters(prev => ({ ...prev, minGarScore: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Min GAR Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Score</SelectItem>
                    <SelectItem value="80">80+</SelectItem>
                    <SelectItem value="85">85+</SelectItem>
                    <SelectItem value="90">90+</SelectItem>
                    <SelectItem value="95">95+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button onClick={resetFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAthletes.map(athlete => (
            <Card key={athlete.id} className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{athlete.name}</CardTitle>
                  <VerificationBadge isVerified={athlete.verified} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span>{athlete.sport}</span>
                  <span>•</span>
                  <span>{athlete.position}</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* GAR Score */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-400 mb-2">{athlete.garScore}</div>
                  <div className="text-sm text-slate-300">GAR Score</div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(athlete.garScore / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">{athlete.stats.gpa}</div>
                    <div className="text-xs text-slate-300">GPA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">{athlete.stats.satScore}</div>
                    <div className="text-xs text-slate-300">SAT</div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-2 text-sm">Achievements</h4>
                  <div className="flex flex-wrap gap-1">
                    {athlete.achievements.slice(0, 3).map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {achievement}
                      </Badge>
                    ))}
                    {athlete.achievements.length > 3 && (
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        +{athlete.achievements.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Verification Date */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>Verified: {new Date(athlete.verificationDate).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
                    <Eye className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Trophy className="w-3 h-3 mr-1" />
                    Compare
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAthletes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">No verified athletes match your criteria</div>
            <Button onClick={resetFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-blue-400 mx-auto mb-4 drop-shadow-[0_0_16px_rgba(59,130,246,0.6)]" />
              <h3 className="text-2xl font-bold mb-4 text-white">
                Get Your GAR Verification
              </h3>
              <p className="text-slate-300 mb-6">
                Join these elite athletes with official GAR Score analysis and verification
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Start GAR Analysis
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}