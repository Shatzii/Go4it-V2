'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  TrendingUp,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Trophy,
  Target,
  Send,
  Plus,
  Filter,
  Loader2,
} from 'lucide-react';

interface Recruit {
  id: number;
  name: string;
  position: string;
  gradYear: number;
  location: string;
  rating: number;
  status: 'contacted' | 'interested' | 'visiting' | 'offered' | 'committed';
  lastContact: string;
  nextFollowup?: string;
}

interface Communication {
  id: number;
  recruitId: number;
  type: 'email' | 'call' | 'text' | 'visit';
  date: string;
  subject: string;
  notes: string;
}

interface Offer {
  id: number;
  recruitId: number;
  amount: number;
  type: 'scholarship' | 'walkon' | 'preferred';
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: string;
}

export default function RecruitingHubPage() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [recruits, setRecruits] = useState<Recruit[]>([
    {
      id: 1,
      name: 'Jordan Matthews',
      position: 'QB',
      gradYear: 2026,
      location: 'Atlanta, GA',
      rating: 95,
      status: 'offered',
      lastContact: '2 days ago',
      nextFollowup: '2025-11-08',
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      position: 'WR',
      gradYear: 2026,
      location: 'Miami, FL',
      rating: 92,
      status: 'interested',
      lastContact: '5 days ago',
      nextFollowup: '2025-11-10',
    },
  ]);
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: 1,
      recruitId: 1,
      type: 'email',
      date: '2025-11-02',
      subject: 'Scholarship Offer Follow-up',
      notes: 'Discussed program details and academic support',
    },
  ]);
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 1,
      recruitId: 1,
      amount: 50000,
      type: 'scholarship',
      status: 'pending',
      expiresAt: '2025-12-01',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    contacted: 'bg-slate-500',
    interested: 'bg-blue-500',
    visiting: 'bg-purple-500',
    offered: 'bg-yellow-500',
    committed: 'bg-green-500',
  };

  const logCommunication = async (type: string, recruitId: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiting/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, recruitId, date: new Date().toISOString() }),
      });
      if (response.ok) {
        const newComm = await response.json();
        setCommunications([newComm, ...communications]);
      }
    } catch (error) {
      // Failed to log communication
    } finally {
      setLoading(false);
    }
  };

  const createOffer = async (recruitId: number, amount: number, type: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/recruiting/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recruitId, amount, type, expiresAt: '2025-12-31' }),
      });
      if (response.ok) {
        const newOffer = await response.json();
        setOffers([...offers, newOffer]);
      }
    } catch (error) {
      // Failed to create offer
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Recruiting <span className="text-[#00D4FF]">Hub</span>
            </h1>
            <p className="text-slate-400">
              Advanced CRM for coach communications, offer management, and timeline tracking
            </p>
          </div>
          <Button className="bg-[#00D4FF] text-slate-950 hover:bg-[#00D4FF]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Recruit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Recruits</p>
                  <p className="text-3xl font-black text-white mt-1">247</p>
                </div>
                <Users className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Offers Out</p>
                  <p className="text-3xl font-black text-white mt-1">23</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Committed</p>
                  <p className="text-3xl font-black text-white mt-1">12</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Follow-ups</p>
                  <p className="text-3xl font-black text-white mt-1">8</p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Value</p>
                  <p className="text-3xl font-black text-white mt-1">$1.2M</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Recruiting Timeline</CardTitle>
                <CardDescription>Track all recruiting activities and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recruits.map((recruit) => (
                    <div
                      key={recruit.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-[#00D4FF]/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{recruit.rating}</span>
                        </div>
                        <div>
                          <div className="font-bold text-white">{recruit.name}</div>
                          <div className="text-sm text-slate-400">
                            {recruit.position} • Class of {recruit.gradYear} • {recruit.location}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={statusColors[recruit.status]}>{recruit.status}</Badge>
                            <span className="text-xs text-slate-400">Last contact: {recruit.lastContact}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-slate-700">
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-700">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-700">
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Communication Log</CardTitle>
                    <CardDescription>All interactions with recruits and families</CardDescription>
                  </div>
                  <Button className="bg-[#00D4FF] text-slate-950">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communications.map((comm) => {
                    const recruit = recruits.find((r) => r.id === comm.recruitId);
                    const icons = {
                      email: <Mail className="w-5 h-5" />,
                      call: <Phone className="w-5 h-5" />,
                      text: <MessageSquare className="w-5 h-5" />,
                      visit: <Calendar className="w-5 h-5" />,
                    };
                    const colors = {
                      email: 'bg-blue-500/20 text-blue-400',
                      call: 'bg-green-500/20 text-green-400',
                      text: 'bg-purple-500/20 text-purple-400',
                      visit: 'bg-yellow-500/20 text-yellow-400',
                    };
                    return (
                      <div key={comm.id} className="flex gap-4 p-4 bg-slate-800/50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[comm.type]}`}>
                          {icons[comm.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-semibold text-white">{comm.subject}</div>
                            <span className="text-xs text-slate-400">{comm.date}</span>
                          </div>
                          <div className="text-sm text-slate-400 mb-2">
                            {recruit?.name} • {comm.type.toUpperCase()}
                          </div>
                          <div className="text-sm text-slate-300">{comm.notes}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Scholarship Offers</CardTitle>
                    <CardDescription>Manage all active and pending offers</CardDescription>
                  </div>
                  <Button className="bg-[#00D4FF] text-slate-950">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Offer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {offers.map((offer) => {
                    const recruit = recruits.find((r) => r.id === offer.recruitId);
                    const statusColors = {
                      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                      accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
                      declined: 'bg-red-500/20 text-red-400 border-red-500/30',
                    };
                    return (
                      <div
                        key={offer.id}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{recruit?.name}</div>
                            <div className="text-sm text-slate-400">
                              {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)} •{' '}
                              ${offer.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Expires: {offer.expiresAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusColors[offer.status]}>{offer.status}</Badge>
                          <Button size="sm" variant="outline" className="border-slate-700">
                            <Send className="w-4 h-4 mr-1" />
                            Resend
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Recruiting Pipeline</CardTitle>
                <CardDescription>Visual funnel of recruiting progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">87</div>
                      <div className="text-xs text-slate-400">Contacted</div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">62</div>
                      <div className="text-xs text-slate-400">Interested</div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">34</div>
                      <div className="text-xs text-slate-400">Visiting</div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">23</div>
                      <div className="text-xs text-slate-400">Offered</div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">12</div>
                      <div className="text-xs text-slate-400">Committed</div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '52%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-[#00D4FF]/30">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-[#00D4FF]" />
                    <div>
                      <div className="font-bold text-white">Conversion Rate: 13.8%</div>
                      <div className="text-sm text-slate-400">
                        12 commitments from 87 initial contacts
                      </div>
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
