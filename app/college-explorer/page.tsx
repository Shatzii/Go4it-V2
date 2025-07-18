'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { School, MapPin, Users, Trophy, DollarSign, GraduationCap, Star, Search, Filter, Eye, Heart } from 'lucide-react';

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  division: string;
  conference: string;
  enrollment: number;
  acceptance_rate: number;
  tuition: number;
  sports_offered: string[];
  academic_ranking: number;
  athletic_ranking: number;
  campus_type: string;
  mascot: string;
  colors: string[];
  notable_programs: string[];
  recent_achievements: string[];
}

export default function CollegeExplorerPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    division: '',
    sport: '',
    state: '',
    maxTuition: '',
    minAcceptance: '',
    search: ''
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, colleges]);

  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges');
      const data = await response.json();
      
      if (data.success) {
        setColleges(data.colleges);
        setFilteredColleges(data.colleges);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = colleges;
    
    if (filters.division) {
      filtered = filtered.filter(college => 
        college.division === filters.division
      );
    }
    
    if (filters.sport) {
      filtered = filtered.filter(college => 
        college.sports_offered.includes(filters.sport)
      );
    }
    
    if (filters.state) {
      filtered = filtered.filter(college => 
        college.state === filters.state
      );
    }
    
    if (filters.maxTuition) {
      filtered = filtered.filter(college => 
        college.tuition <= parseInt(filters.maxTuition)
      );
    }
    
    if (filters.minAcceptance) {
      filtered = filtered.filter(college => 
        college.acceptance_rate >= parseInt(filters.minAcceptance)
      );
    }
    
    if (filters.search) {
      filtered = filtered.filter(college => 
        college.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        college.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        college.conference.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    setFilteredColleges(filtered);
  };

  const resetFilters = () => {
    setFilters({
      division: '',
      sport: '',
      state: '',
      maxTuition: '',
      minAcceptance: '',
      search: ''
    });
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'D1': return 'bg-red-500';
      case 'D2': return 'bg-blue-500';
      case 'D3': return 'bg-green-500';
      case 'NAIA': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const formatTuition = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading college database...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-green-500 text-white font-bold text-lg px-6 py-2">
            <School className="w-5 h-5 mr-2" />
            COLLEGE EXPLORER
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            DISCOVER YOUR PERFECT COLLEGE
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Explore thousands of colleges with advanced filtering and AI-powered recommendations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{colleges.length}</div>
              <div className="text-sm text-slate-300">Total Colleges</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {colleges.filter(c => c.division === 'D1').length}
              </div>
              <div className="text-sm text-slate-300">Division I</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {new Set(colleges.flatMap(c => c.sports_offered)).size}
              </div>
              <div className="text-sm text-slate-300">Sports Offered</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {new Set(colleges.map(c => c.state)).size}
              </div>
              <div className="text-sm text-slate-300">States Covered</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Colleges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <Input
                  placeholder="Search colleges..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Select value={filters.division} onValueChange={(value) => setFilters(prev => ({ ...prev, division: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Divisions</SelectItem>
                    <SelectItem value="D1">Division I</SelectItem>
                    <SelectItem value="D2">Division II</SelectItem>
                    <SelectItem value="D3">Division III</SelectItem>
                    <SelectItem value="NAIA">NAIA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.sport} onValueChange={(value) => setFilters(prev => ({ ...prev, sport: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sports</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                    <SelectItem value="Soccer">Soccer</SelectItem>
                    <SelectItem value="Baseball">Baseball</SelectItem>
                    <SelectItem value="Track & Field">Track & Field</SelectItem>
                    <SelectItem value="Swimming">Swimming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.maxTuition} onValueChange={(value) => setFilters(prev => ({ ...prev, maxTuition: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Max Tuition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Price</SelectItem>
                    <SelectItem value="25000">Under $25k</SelectItem>
                    <SelectItem value="50000">Under $50k</SelectItem>
                    <SelectItem value="75000">Under $75k</SelectItem>
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

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-slate-300">
            Showing {filteredColleges.length} of {colleges.length} colleges
          </p>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map(college => (
            <Card key={college.id} className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{college.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                      <MapPin className="w-4 h-4" />
                      {college.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getDivisionColor(college.division)} text-white mb-1`}>
                      {college.division}
                    </Badge>
                    <div className="text-xs text-slate-400">{college.conference}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">{college.acceptance_rate}%</div>
                    <div className="text-xs text-slate-300">Acceptance Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">{formatNumber(college.enrollment)}</div>
                    <div className="text-xs text-slate-300">Enrollment</div>
                  </div>
                </div>

                {/* Tuition */}
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-purple-400">{formatTuition(college.tuition)}</div>
                  <div className="text-xs text-slate-300">Annual Tuition</div>
                </div>

                {/* Sports */}
                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2 text-sm">Sports Offered</h4>
                  <div className="flex flex-wrap gap-1">
                    {college.sports_offered.slice(0, 4).map((sport, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {sport}
                      </Badge>
                    ))}
                    {college.sports_offered.length > 4 && (
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        +{college.sports_offered.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rankings */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-orange-400">#{college.academic_ranking}</div>
                    <div className="text-xs text-slate-400">Academic Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-yellow-400">#{college.athletic_ranking}</div>
                    <div className="text-xs text-slate-400">Athletic Rank</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Heart className="w-3 h-3 mr-1" />
                    Add to List
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">No colleges match your criteria</div>
            <Button onClick={resetFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <School className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">
                Find Your Perfect Match
              </h3>
              <p className="text-slate-300 mb-6">
                Use our AI-powered matching system to discover colleges that fit your profile
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-green-500 hover:bg-green-600">
                  Start Matching
                </Button>
                <Button variant="outline">
                  Compare Colleges
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}