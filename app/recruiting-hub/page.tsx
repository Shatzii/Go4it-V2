'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { School, Phone, Mail, MapPin, Trophy, Users, Star, Search, Filter, Eye, MessageSquare } from 'lucide-react';

interface CollegeContact {
  id: string;
  school: string;
  coach: string;
  position: string;
  sport: string;
  division: string;
  email: string;
  phone: string;
  location: string;
  recentActivity: string;
  responseRate: number;
  recruitingFocus: string[];
}

interface RecruitingMatch {
  id: string;
  athleteId: string;
  schoolId: string;
  school: string;
  division: string;
  sport: string;
  matchScore: number;
  academicFit: number;
  athleticFit: number;
  geographicFit: number;
  scholarshipPotential: number;
  reasons: string[];
  timeline: string;
  nextSteps: string[];
}

export default function RecruitingHubPage() {
  const [activeTab, setActiveTab] = useState('matches');
  const [contacts, setContacts] = useState<CollegeContact[]>([]);
  const [matches, setMatches] = useState<RecruitingMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    division: '',
    sport: '',
    location: '',
    search: ''
  });

  useEffect(() => {
    fetchRecruitingData();
  }, []);

  const fetchRecruitingData = async () => {
    try {
      const [contactsRes, matchesRes] = await Promise.all([
        fetch('/api/recruiting/contacts'),
        fetch('/api/recruiting/matches')
      ]);
      
      const contactsData = await contactsRes.json();
      const matchesData = await matchesRes.json();
      
      if (contactsData.success) setContacts(contactsData.contacts);
      if (matchesData.success) setMatches(matchesData.matches);
    } catch (error) {
      console.error('Error fetching recruiting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading recruiting data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-500 text-white font-bold text-lg px-6 py-2">
            <Trophy className="w-5 h-5 mr-2" />
            RECRUITING HUB
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            COLLEGE RECRUITING
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Advanced recruiting tools with AI-powered college matching and direct coach contacts
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="matches">AI Matches</TabsTrigger>
            <TabsTrigger value="contacts">Coach Contacts</TabsTrigger>
            <TabsTrigger value="tracker">Recruiting Tracker</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* AI Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  AI-Powered College Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {matches.slice(0, 6).map(match => (
                    <Card key={match.id} className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{match.school}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getDivisionColor(match.division)} text-white`}>
                                {match.division}
                              </Badge>
                              <span className="text-sm text-slate-300">{match.sport}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getMatchColor(match.matchScore)}`}>
                              {match.matchScore}%
                            </div>
                            <div className="text-xs text-slate-400">Match Score</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Fit Scores */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-400">{match.academicFit}%</div>
                            <div className="text-xs text-slate-400">Academic Fit</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-400">{match.athleticFit}%</div>
                            <div className="text-xs text-slate-400">Athletic Fit</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-400">{match.geographicFit}%</div>
                            <div className="text-xs text-slate-400">Geographic Fit</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-orange-400">{match.scholarshipPotential}%</div>
                            <div className="text-xs text-slate-400">Scholarship Potential</div>
                          </div>
                        </div>

                        {/* Reasons */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-white mb-2 text-sm">Why This Match:</h4>
                          <div className="space-y-1">
                            {match.reasons.slice(0, 3).map((reason, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs text-slate-300">
                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                {reason}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Badge variant="outline" className="text-xs">
                              {match.timeline}
                            </Badge>
                            <span>Recruiting Timeline</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Contact Coach
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Direct Coach Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Input
                    placeholder="Search coaches or schools..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Select value={filters.division} onValueChange={(value) => setFilters(prev => ({ ...prev, division: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="All Divisions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Divisions</SelectItem>
                      <SelectItem value="D1">Division 1</SelectItem>
                      <SelectItem value="D2">Division 2</SelectItem>
                      <SelectItem value="D3">Division 3</SelectItem>
                      <SelectItem value="NAIA">NAIA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.sport} onValueChange={(value) => setFilters(prev => ({ ...prev, sport: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="All Sports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sports</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="Track">Track & Field</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="California">California</SelectItem>
                      <SelectItem value="Texas">Texas</SelectItem>
                      <SelectItem value="Florida">Florida</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Contacts List */}
                <div className="space-y-4">
                  {contacts.slice(0, 8).map(contact => (
                    <Card key={contact.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div>
                                <h3 className="font-semibold text-white">{contact.coach}</h3>
                                <p className="text-sm text-slate-300">{contact.position}</p>
                              </div>
                              <Badge className={`${getDivisionColor(contact.division)} text-white`}>
                                {contact.division}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center gap-1 text-sm text-slate-300">
                                <School className="w-4 h-4" />
                                {contact.school}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-300">
                                <MapPin className="w-4 h-4" />
                                {contact.location}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {contact.phone}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-400 mb-1">
                              {contact.responseRate}%
                            </div>
                            <div className="text-xs text-slate-400 mb-2">Response Rate</div>
                            <div className="text-xs text-slate-300">{contact.recentActivity}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                          <div className="flex flex-wrap gap-1">
                            {contact.recruitingFocus.slice(0, 3).map((focus, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-600 text-slate-200 text-xs">
                                {focus}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View Profile
                            </Button>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Contact
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

          {/* Recruiting Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recruiting Pipeline Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Track Your Recruiting Progress</h3>
                  <p className="text-slate-400 mb-6">Monitor contacts, visits, offers, and commitments</p>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Start Tracking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recruiting Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Advanced Recruiting Analytics</h3>
                  <p className="text-slate-400 mb-6">Performance metrics, success rates, and predictions</p>
                  <Button className="bg-purple-500 hover:bg-purple-600">
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}