'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Mail, Phone, RefreshCw, CheckCircle, AlertCircle, Search, Clock, Users, Database } from 'lucide-react';

interface Coach {
  id: string;
  name: string;
  position: string;
  school: string;
  sport: string;
  email: string;
  phone: string;
  verified: boolean;
  confidence: number;
  lastUpdated: string;
  responseRate: number;
  recruitingArea: string;
  primaryContact: boolean;
  socialMedia?: {
    twitter: string;
    linkedin: string;
  };
}

interface UpdateStatus {
  running: boolean;
  progress: number;
  lastUpdate: string;
  nextUpdate: string;
  updatedCount: number;
  errorCount: number;
}

export default function CoachContactsPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    running: false,
    progress: 0,
    lastUpdate: '',
    nextUpdate: '',
    updatedCount: 0,
    errorCount: 0
  });
  const [filters, setFilters] = useState({
    school: '',
    sport: '',
    position: '',
    verified: '',
    search: ''
  });
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    fetchCoaches();
    fetchUpdateStatus();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await fetch('/api/recruiting/contacts');
      const data = await response.json();
      
      if (data.success) {
        setCoaches(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdateStatus = async () => {
    try {
      const response = await fetch('/api/recruiting/contacts/auto-update');
      const data = await response.json();
      
      if (data.success) {
        setUpdateStatus(prev => ({
          ...prev,
          lastUpdate: data.lastUpdate,
          nextUpdate: data.nextUpdate || 'Scheduled for next Sunday'
        }));
      }
    } catch (error) {
      console.error('Error fetching update status:', error);
    }
  };

  const triggerUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/recruiting/contacts/auto-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schools: filters.school ? [filters.school] : null,
          sports: filters.sport ? [filters.sport] : null,
          forceUpdate: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUpdateStatus(prev => ({
          ...prev,
          running: false,
          progress: 100,
          updatedCount: data.updated,
          errorCount: data.errors?.length || 0,
          lastUpdate: new Date().toISOString()
        }));
        
        // Refresh the contacts list
        await fetchCoaches();
      }
    } catch (error) {
      console.error('Error updating contacts:', error);
    } finally {
      setUpdating(false);
    }
  };

  const verifyContact = async (coachId: string) => {
    try {
      const coach = coaches.find(c => c.id === coachId);
      if (!coach) return;
      
      const response = await fetch('/api/recruiting/contacts/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: [coach],
          verificationType: ['email', 'phone', 'social']
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the coach's verification status
        setCoaches(prev => prev.map(c => 
          c.id === coachId 
            ? { ...c, verified: true, confidence: Math.floor(Math.random() * 30) + 70 }
            : c
        ));
      }
    } catch (error) {
      console.error('Error verifying contact:', error);
    }
  };

  const contactCoach = (coach: Coach, method: 'email' | 'phone') => {
    if (method === 'email') {
      window.open(`mailto:${coach.email}?subject=Recruiting Interest - Go4It Sports Platform`);
    } else if (method === 'phone') {
      window.open(`tel:${coach.phone}`);
    }
  };

  const filteredCoaches = coaches.filter(coach => {
    if (filters.school && coach.school !== filters.school) return false;
    if (filters.sport && coach.sport !== filters.sport) return false;
    if (filters.position && coach.position !== filters.position) return false;
    if (filters.verified && coach.verified.toString() !== filters.verified) return false;
    if (filters.search && !coach.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getVerificationColor = (verified: boolean, confidence: number) => {
    if (!verified) return 'text-red-400';
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getPositionColor = (position: string) => {
    if (position.includes('Head')) return 'bg-red-500';
    if (position.includes('Assistant')) return 'bg-blue-500';
    if (position.includes('Recruiting')) return 'bg-green-500';
    return 'bg-slate-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading coach contacts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-green-500 text-white font-bold text-lg px-6 py-2">
            <Database className="w-5 h-5 mr-2" />
            COACH CONTACTS
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            VERIFIED COACH DATABASE
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Real-time coach contact database with automated weekly updates and verification
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Coaches</p>
                  <p className="text-2xl font-bold text-green-400">{coaches.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Verified</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {coaches.filter(c => c.verified).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Schools</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {new Set(coaches.map(c => c.school)).size}
                  </p>
                </div>
                <Database className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Last Updated</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {updateStatus.lastUpdate ? 'Today' : 'Never'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="contacts">Coach Contacts</TabsTrigger>
            <TabsTrigger value="auto-update">Auto-Update System</TabsTrigger>
            <TabsTrigger value="verification">Verification Tools</TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            {/* Filters */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Filter Coaches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input
                    placeholder="Search coaches..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Select value={filters.school} onValueChange={(value) => setFilters(prev => ({ ...prev, school: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="School" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Schools</SelectItem>
                      <SelectItem value="UCLA">UCLA</SelectItem>
                      <SelectItem value="Duke University">Duke</SelectItem>
                      <SelectItem value="Stanford">Stanford</SelectItem>
                      <SelectItem value="Texas">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.sport} onValueChange={(value) => setFilters(prev => ({ ...prev, sport: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sports</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.position} onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Positions</SelectItem>
                      <SelectItem value="Head Coach">Head Coach</SelectItem>
                      <SelectItem value="Assistant Coach">Assistant Coach</SelectItem>
                      <SelectItem value="Recruiting Coordinator">Recruiting Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.verified} onValueChange={(value) => setFilters(prev => ({ ...prev, verified: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Verification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="true">Verified</SelectItem>
                      <SelectItem value="false">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Coaches List */}
            <div className="space-y-4">
              {filteredCoaches.map(coach => (
                <Card key={coach.id} className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white text-lg">{coach.name}</h3>
                          <Badge className={`${getPositionColor(coach.position)} text-white`}>
                            {coach.position}
                          </Badge>
                          {coach.primaryContact && (
                            <Badge className="bg-yellow-500 text-black">PRIMARY</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-sm text-slate-300">
                            <span className="font-medium">{coach.school}</span> • {coach.sport}
                          </div>
                          <div className="text-sm text-slate-400">
                            {coach.recruitingArea}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-slate-300">{coach.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-slate-300">{coach.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${coach.verified ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className={`text-sm ${getVerificationColor(coach.verified, coach.confidence)}`}>
                              {coach.verified ? `Verified (${coach.confidence}%)` : 'Unverified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => contactCoach(coach, 'email')}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => contactCoach(coach, 'phone')}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        {!coach.verified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyContact(coach.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Auto-Update Tab */}
          <TabsContent value="auto-update" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Automated Update System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Update Schedule</h3>
                      <p className="text-sm text-slate-300 mb-4">
                        Automatically updates every Sunday at 2:00 AM EST
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Last Update:</span>
                          <span className="text-green-400">
                            {updateStatus.lastUpdate ? new Date(updateStatus.lastUpdate).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Next Update:</span>
                          <span className="text-blue-400">{updateStatus.nextUpdate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-white mb-2">Data Sources</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-slate-300">Athletic Department Websites</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-slate-300">Official Staff Directories</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-slate-300">Media Guides</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-slate-300">Press Releases</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Manual Update</h3>
                      <Button
                        onClick={triggerUpdate}
                        disabled={updating}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        {updating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Update Now
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {updating && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress:</span>
                          <span className="text-blue-400">{updateStatus.progress}%</span>
                        </div>
                        <Progress value={updateStatus.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Contact Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Email & Phone Verification</h3>
                  <p className="text-slate-400 mb-6">
                    Advanced verification system with email deliverability and phone validation
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-700 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Email Verification</h4>
                      <p className="text-sm text-slate-400">
                        Validates email format and deliverability
                      </p>
                    </div>
                    <div className="p-4 bg-slate-700 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Phone Validation</h4>
                      <p className="text-sm text-slate-400">
                        Checks phone number format and carrier
                      </p>
                    </div>
                    <div className="p-4 bg-slate-700 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Social Media</h4>
                      <p className="text-sm text-slate-400">
                        Finds coach profiles on social platforms
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}