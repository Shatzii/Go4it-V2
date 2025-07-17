'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Phone, Mail, Globe, MapPin, Users, Trophy, Calendar, Filter } from 'lucide-react';

interface School {
  schoolName: string;
  division: string;
  conference: string;
  state: string;
  city: string;
  website: string;
  athleticDirector: {
    name: string;
    email: string;
    phone: string;
  };
  coachingStaff: Record<string, any>;
  programs: string[];
  contactStatus: {
    verified: boolean;
    lastVerified: Date;
    source: string;
    confidence: 'high' | 'medium' | 'low';
  };
}

const DIVISIONS = ['D1', 'D2', 'D3', 'NAIA', 'NJCAA'];
const SPORTS = ['football', 'basketball', 'baseball', 'softball', 'soccer', 'tennis', 'golf', 'track', 'swimming', 'volleyball'];
const STATES = ['Alabama', 'California', 'Florida', 'Georgia', 'Michigan', 'Ohio', 'Texas', 'North Carolina', 'Indiana', 'Massachusetts'];

export default function AthleticContacts() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    division: '',
    state: '',
    sport: '',
    search: ''
  });
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, schools]);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/athletic-contacts');
      const data = await response.json();
      if (data.success) {
        setSchools(data.schools);
        setFilteredSchools(data.schools);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = schools;

    if (filters.division) {
      filtered = filtered.filter(school => school.division === filters.division);
    }

    if (filters.state) {
      filtered = filtered.filter(school => school.state === filters.state);
    }

    if (filters.sport) {
      filtered = filtered.filter(school => school.programs.includes(filters.sport));
    }

    if (filters.search) {
      filtered = filtered.filter(school => 
        school.schoolName.toLowerCase().includes(filters.search.toLowerCase()) ||
        school.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        school.conference.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredSchools(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      division: '',
      state: '',
      sport: '',
      search: ''
    });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-300">Loading athletic department contacts...</p>
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
            <Users className="w-8 h-8 text-primary" />
            Athletic Department Contacts
          </h1>
          <p className="text-slate-300 text-lg">
            Verified contacts for {schools.length} NCAA schools and athletic departments
          </p>
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500 font-medium">PRO Tier Feature</span>
              </div>
              <a href="/pricing" className="text-sm text-yellow-500 hover:text-yellow-400 underline">
                Upgrade to PRO for full contact access
              </a>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Label className="text-slate-300">Search Schools</Label>
                <Input
                  placeholder="School name, city, or conference"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-300">Division</Label>
                <Select value={filters.division} onValueChange={(value) => handleFilterChange('division', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="All divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Divisions</SelectItem>
                    {DIVISIONS.map(div => (
                      <SelectItem key={div} value={div}>{div}</SelectItem>
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
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={clearFilters} variant="outline" className="border-slate-600">
                Clear All Filters
              </Button>
              <span className="text-slate-400">
                Showing {filteredSchools.length} of {schools.length} schools
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{school.schoolName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${school.division === 'D1' ? 'bg-green-500' : school.division === 'D2' ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}>
                        {school.division}
                      </Badge>
                      <Badge variant="outline" className="text-slate-300 border-slate-600">
                        {school.conference}
                      </Badge>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getConfidenceColor(school.contactStatus.confidence)}`} 
                       title={`Contact confidence: ${school.contactStatus.confidence}`}></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{school.city}, {school.state}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-300">
                    <Globe className="w-4 h-4" />
                    <a href={school.website} target="_blank" rel="noopener noreferrer" 
                       className="text-sm hover:text-primary transition-colors">
                      Official Website
                    </a>
                  </div>

                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="font-medium text-white mb-1">Athletic Director</div>
                    <div className="text-sm text-slate-300 space-y-1">
                      <div>{school.athleticDirector.name}</div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>{school.athleticDirector.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{school.athleticDirector.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-white mb-2">Sports Programs</div>
                    <div className="flex flex-wrap gap-1">
                      {school.programs.slice(0, 6).map(sport => (
                        <Badge key={sport} variant="secondary" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                      {school.programs.length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{school.programs.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedSchool(school)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-slate-600"
                      onClick={() => window.open(school.website, '_blank')}
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* School Details Modal */}
        {selectedSchool && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-slate-800 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl">{selectedSchool.schoolName}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${selectedSchool.division === 'D1' ? 'bg-green-500' : selectedSchool.division === 'D2' ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}>
                        {selectedSchool.division}
                      </Badge>
                      <Badge variant="outline" className="text-slate-300 border-slate-600">
                        {selectedSchool.conference}
                      </Badge>
                      <Badge className={`${getConfidenceColor(selectedSchool.contactStatus.confidence)} text-white`}>
                        {selectedSchool.contactStatus.confidence} confidence
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedSchool(null)}
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="contacts" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                    <TabsTrigger value="coaching">Coaching Staff</TabsTrigger>
                    <TabsTrigger value="programs">Programs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="contacts" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-slate-700 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Athletic Director</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="text-white font-medium">{selectedSchool.athleticDirector.name}</div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Mail className="w-4 h-4" />
                              <span>{selectedSchool.athleticDirector.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Phone className="w-4 h-4" />
                              <span>{selectedSchool.athleticDirector.phone}</span>
                            </div>
                            <Button size="sm" className="w-full mt-3">
                              Contact AD
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-700 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">School Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-300">
                              <MapPin className="w-4 h-4" />
                              <span>{selectedSchool.city}, {selectedSchool.state}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Globe className="w-4 h-4" />
                              <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" 
                                 className="hover:text-primary transition-colors">
                                Official Website
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Calendar className="w-4 h-4" />
                              <span>Verified: {new Date(selectedSchool.contactStatus.lastVerified).toLocaleDateString()}</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full mt-3 border-slate-600">
                              Visit Website
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="coaching" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedSchool.coachingStaff).map(([sport, staff]: [string, any]) => (
                        <Card key={sport} className="bg-slate-700 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-white text-lg capitalize">{sport}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <div className="font-medium text-white">Head Coach</div>
                                <div className="text-slate-300">{staff.headCoach}</div>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Mail className="w-4 h-4" />
                                <span>{staff.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Phone className="w-4 h-4" />
                                <span>{staff.phone}</span>
                              </div>
                              {staff.recruitingCoordinator && (
                                <div>
                                  <div className="font-medium text-white">Recruiting Coordinator</div>
                                  <div className="text-slate-300">{staff.recruitingCoordinator}</div>
                                </div>
                              )}
                              <Button size="sm" className="w-full mt-3">
                                Contact Coach
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="programs" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {selectedSchool.programs.map(program => (
                        <Badge key={program} variant="secondary" className="justify-center p-2 capitalize">
                          {program}
                        </Badge>
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