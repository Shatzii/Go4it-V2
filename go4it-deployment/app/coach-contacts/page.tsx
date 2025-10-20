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
import {
  Mail,
  Phone,
  School,
  Users,
  Database,
  Search,
  Filter,
  CheckCircle,
  Globe,
  MapPin,
  Trophy,
} from 'lucide-react';

interface Coach {
  coachId: string;
  firstName: string;
  lastName: string;
  title: string;
  sport: string;
  gender: string;
  email?: string;
  phone?: string;
  officePhone?: string;
  recruitingEmail?: string;
  yearsAtSchool?: number;
  totalYearsCoaching?: number;
  recruitingTerritory?: string[];
  recruitingFocus?: string[];
  preferredContactMethod?: string;
  twitterHandle?: string;
  linkedinProfile?: string;
  contactVerified: boolean;
  lastVerified?: string;
  responseRate?: number;

  // College information
  collegeId: string;
  collegeName: string;
  collegeShortName?: string;
  mascot?: string;
  division: string;
  subdivision?: string;
  conference?: string;
  city: string;
  state: string;
  type: string;
  enrollment?: number;
  website?: string;
  athleticsWebsite?: string;
  athleticDirector?: string;
  athleticDirectorEmail?: string;
  athleticDirectorPhone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactsVerified: boolean;
}

interface CoachStats {
  totalCoaches: number;
  verifiedContacts: number;
  divisions: Record<string, number>;
  topSports: { sport: string; count: number }[];
}

export default function ComprehensiveCoachContactsPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CoachStats | null>(null);
  const [filters, setFilters] = useState({
    division: '',
    state: '',
    sport: '',
    gender: '',
    conference: '',
    search: '',
  });
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append('limit', '100');

      const response = await fetch(`/api/coaches/comprehensive?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setCoaches(data.coaches);
        setStats(data.statistics);
      } else {
        console.error('Failed to fetch coaches:', data.error);
      }
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" value to empty string for API calls
    const apiValue = value === 'all' ? '' : value;
    setFilters((prev) => ({ ...prev, [key]: apiValue }));
  };

  const searchCoaches = () => {
    fetchCoaches();
  };

  const resetFilters = () => {
    setFilters({
      division: '',
      state: '',
      sport: '',
      gender: '',
      conference: '',
      search: '',
    });
    setTimeout(fetchCoaches, 100);
  };

  const getContactMethods = (coach: Coach) => {
    const methods = [];
    if (coach.email) methods.push({ type: 'email', value: coach.email, primary: true });
    if (coach.recruitingEmail && coach.recruitingEmail !== coach.email) {
      methods.push({ type: 'recruiting-email', value: coach.recruitingEmail, primary: false });
    }
    if (coach.phone) methods.push({ type: 'phone', value: coach.phone, primary: true });
    if (coach.officePhone && coach.officePhone !== coach.phone) {
      methods.push({ type: 'office-phone', value: coach.officePhone, primary: false });
    }
    return methods;
  };

  const getDivisionColor = (division: string) => {
    const colors = {
      D1: 'bg-red-100 text-red-800',
      D2: 'bg-blue-100 text-blue-800',
      D3: 'bg-green-100 text-green-800',
      NAIA: 'bg-purple-100 text-purple-800',
      NJCAA: 'bg-orange-100 text-orange-800',
    };
    return colors[division as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getGenderColor = (gender: string) => {
    const colors = {
      men: 'bg-blue-50 text-blue-700',
      women: 'bg-pink-50 text-pink-700',
      coed: 'bg-purple-50 text-purple-700',
    };
    return colors[gender as keyof typeof colors] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
              <Database className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Comprehensive Coach Contacts</h1>
              <p className="text-slate-400">
                Access ALL NCAA (D1, D2, D3), NAIA, and Junior College coaching contacts
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stats.totalCoaches.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">Total Coaches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stats.verifiedContacts.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">Verified</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {Object.entries(stats.divisions).map(([division, count]) => (
                <Card key={division} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {count.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">{division}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="search" className="data-[state=active]:bg-slate-700">
              <Search className="h-4 w-4 mr-2" />
              Search Coaches
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              <Database className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Filters */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Search</label>
                    <Input
                      placeholder="Coach name, school, city..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Division</label>
                    <Select
                      value={filters.division}
                      onValueChange={(value) => handleFilterChange('division', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="All divisions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Divisions</SelectItem>
                        <SelectItem value="D1">NCAA Division I</SelectItem>
                        <SelectItem value="D2">NCAA Division II</SelectItem>
                        <SelectItem value="D3">NCAA Division III</SelectItem>
                        <SelectItem value="NAIA">NAIA</SelectItem>
                        <SelectItem value="NJCAA">NJCAA (Junior College)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">State</label>
                    <Select
                      value={filters.state}
                      onValueChange={(value) => handleFilterChange('state', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="All states" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="Alabama">Alabama</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Illinois">Illinois</SelectItem>
                        <SelectItem value="Indiana">Indiana</SelectItem>
                        <SelectItem value="Iowa">Iowa</SelectItem>
                        <SelectItem value="Kansas">Kansas</SelectItem>
                        <SelectItem value="Louisiana">Louisiana</SelectItem>
                        <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                        <SelectItem value="Michigan">Michigan</SelectItem>
                        <SelectItem value="North Carolina">North Carolina</SelectItem>
                        <SelectItem value="Ohio">Ohio</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Sport</label>
                    <Select
                      value={filters.sport}
                      onValueChange={(value) => handleFilterChange('sport', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="All sports" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sports</SelectItem>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="baseball">Baseball</SelectItem>
                        <SelectItem value="softball">Softball</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                        <SelectItem value="track and field">Track & Field</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="golf">Golf</SelectItem>
                        <SelectItem value="volleyball">Volleyball</SelectItem>
                        <SelectItem value="wrestling">Wrestling</SelectItem>
                        <SelectItem value="lacrosse">Lacrosse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Gender</label>
                    <Select
                      value={filters.gender}
                      onValueChange={(value) => handleFilterChange('gender', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="All programs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        <SelectItem value="men">Men's Programs</SelectItem>
                        <SelectItem value="women">Women's Programs</SelectItem>
                        <SelectItem value="coed">Coed Programs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Conference</label>
                    <Input
                      placeholder="SEC, Big Ten, ACC..."
                      value={filters.conference}
                      onChange={(e) => handleFilterChange('conference', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={searchCoaches}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? 'Searching...' : 'Search Coaches'}
                  </Button>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Coach Contacts ({coaches.length.toLocaleString()} results)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400">Loading comprehensive coach database...</div>
                  </div>
                ) : coaches.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No coaches found matching your criteria. Try adjusting your filters.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coaches.map((coach) => (
                      <Card
                        key={coach.coachId}
                        className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-colors"
                      >
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Coach Info */}
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-bold text-white">
                                    {coach.firstName} {coach.lastName}
                                  </h3>
                                  <p className="text-slate-300">{coach.title}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge className={getDivisionColor(coach.division)}>
                                      {coach.division}
                                    </Badge>
                                    <Badge className={getGenderColor(coach.gender)}>
                                      {coach.gender}'s {coach.sport}
                                    </Badge>
                                  </div>
                                </div>
                                {coach.contactVerified && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>

                              {/* Experience */}
                              {(coach.yearsAtSchool || coach.totalYearsCoaching) && (
                                <div className="text-sm text-slate-400">
                                  {coach.yearsAtSchool && `${coach.yearsAtSchool} years at school`}
                                  {coach.yearsAtSchool && coach.totalYearsCoaching && ' • '}
                                  {coach.totalYearsCoaching &&
                                    `${coach.totalYearsCoaching} total coaching`}
                                </div>
                              )}
                            </div>

                            {/* College Info */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <School className="h-4 w-4 text-slate-400" />
                                <div>
                                  <h4 className="font-semibold text-white">
                                    {coach.collegeShortName || coach.collegeName}
                                  </h4>
                                  {coach.mascot && (
                                    <p className="text-sm text-slate-400">{coach.mascot}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <MapPin className="h-4 w-4" />
                                {coach.city}, {coach.state}
                              </div>

                              {coach.conference && (
                                <Badge
                                  variant="outline"
                                  className="border-slate-500 text-slate-300"
                                >
                                  {coach.conference}
                                </Badge>
                              )}

                              {coach.enrollment && (
                                <div className="text-sm text-slate-400">
                                  {coach.enrollment.toLocaleString()} students
                                </div>
                              )}
                            </div>

                            {/* Contact Methods */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-white">Contact Information</h5>
                              <div className="space-y-2">
                                {getContactMethods(coach).map((method, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    {method.type.includes('email') ? (
                                      <Mail className="h-4 w-4 text-slate-400" />
                                    ) : (
                                      <Phone className="h-4 w-4 text-slate-400" />
                                    )}
                                    <div>
                                      <div className="text-sm text-white">{method.value}</div>
                                      <div className="text-xs text-slate-400">
                                        {method.type === 'email' && 'Primary Email'}
                                        {method.type === 'recruiting-email' && 'Recruiting Email'}
                                        {method.type === 'phone' && 'Phone'}
                                        {method.type === 'office-phone' && 'Office Phone'}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Social Media */}
                              {(coach.twitterHandle || coach.linkedinProfile) && (
                                <div className="pt-2 space-y-1">
                                  {coach.twitterHandle && (
                                    <div className="text-sm text-slate-400">
                                      Twitter: @{coach.twitterHandle}
                                    </div>
                                  )}
                                  {coach.linkedinProfile && (
                                    <div className="text-sm text-slate-400">
                                      LinkedIn: {coach.linkedinProfile}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Recruiting Info */}
                              {coach.recruitingTerritory &&
                                coach.recruitingTerritory.length > 0 && (
                                  <div className="pt-2">
                                    <div className="text-xs text-slate-400 mb-1">
                                      Recruiting Territory
                                    </div>
                                    <div className="text-sm text-slate-300">
                                      {coach.recruitingTerritory.join(', ')}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Database Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Division Breakdown
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(stats.divisions).map(([division, count]) => (
                            <div key={division} className="flex justify-between items-center">
                              <Badge className={getDivisionColor(division)}>{division}</Badge>
                              <span className="text-white font-medium">
                                {count.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Top Sports</h4>
                        <div className="space-y-2">
                          {stats.topSports.map((sport, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-slate-300 capitalize">{sport.sport}</span>
                              <span className="text-white font-medium">
                                {sport.count.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">Coverage Summary</h4>
                      <p className="text-slate-300">
                        Our comprehensive database includes coaching contacts from all NCAA
                        divisions (D1, D2, D3), NAIA institutions, and Junior Colleges (NJCAA). This
                        provides student athletes with access to thousands of coaching contacts
                        across all competitive levels and geographic regions.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400">Loading analytics...</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
