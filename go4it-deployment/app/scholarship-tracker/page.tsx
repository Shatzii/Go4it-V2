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
  DollarSign,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';

interface Scholarship {
  id: string;
  name: string;
  school: string;
  amount: number;
  type: 'athletic' | 'academic' | 'need-based' | 'merit';
  deadline: string;
  status: 'available' | 'applied' | 'pending' | 'awarded' | 'declined';
  requirements: string[];
  sport?: string;
  eligibility: {
    gpa: number;
    testScore: number;
    athleticLevel: string;
  };
  competitiveness: 'low' | 'medium' | 'high';
  renewability: boolean;
  lastUpdated: string;
}

interface ScholarshipTracker {
  totalApplied: number;
  totalAwarded: number;
  totalValue: number;
  pendingApplications: number;
  successRate: number;
  averageAmount: number;
}

export default function ScholarshipTrackerPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [tracker, setTracker] = useState<ScholarshipTracker>({
    totalApplied: 0,
    totalAwarded: 0,
    totalValue: 0,
    pendingApplications: 0,
    successRate: 0,
    averageAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/scholarships');
      const data = await response.json();

      if (data.success) {
        setScholarships(data.scholarships);
        setTracker(data.tracker);
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-blue-500';
      case 'applied':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-orange-500';
      case 'awarded':
        return 'bg-green-500';
      case 'declined':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'athletic':
        return 'bg-red-500';
      case 'academic':
        return 'bg-blue-500';
      case 'need-based':
        return 'bg-green-500';
      case 'merit':
        return 'bg-purple-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getCompetitivenessColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredScholarships = scholarships.filter((s) => {
    if (activeTab === 'available') return s.status === 'available';
    if (activeTab === 'applied') return s.status === 'applied' || s.status === 'pending';
    if (activeTab === 'awarded') return s.status === 'awarded';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading scholarship data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-yellow-500 text-black font-bold text-lg px-6 py-2">
            <DollarSign className="w-5 h-5 mr-2" />
            SCHOLARSHIP TRACKER
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            SCHOLARSHIP OPPORTUNITIES
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Track, apply, and manage your scholarship applications in one place
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Applied</p>
                  <p className="text-2xl font-bold text-blue-400">{tracker.totalApplied}</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Awarded</p>
                  <p className="text-2xl font-bold text-green-400">{tracker.totalAwarded}</p>
                </div>
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Value</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(tracker.totalValue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-400">{tracker.successRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="awarded">Awarded</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Scholarships Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScholarships.map((scholarship) => (
                <Card
                  key={scholarship.id}
                  className="bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                        <p className="text-sm text-slate-300 mt-1">{scholarship.school}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">
                          {formatCurrency(scholarship.amount)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {scholarship.renewability ? 'Renewable' : 'One-time'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={`${getStatusColor(scholarship.status)} text-white`}>
                        {scholarship.status.toUpperCase()}
                      </Badge>
                      <Badge className={`${getTypeColor(scholarship.type)} text-white`}>
                        {scholarship.type.toUpperCase()}
                      </Badge>
                      {scholarship.sport && (
                        <Badge variant="outline" className="text-slate-300">
                          {scholarship.sport}
                        </Badge>
                      )}
                    </div>

                    {/* Requirements */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-white mb-2 text-sm">Requirements:</h4>
                      <div className="space-y-1">
                        {scholarship.requirements.slice(0, 3).map((req, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs text-slate-300"
                          >
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-400">
                          {scholarship.eligibility.gpa}
                        </div>
                        <div className="text-xs text-slate-400">Min GPA</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-green-400">
                          {scholarship.eligibility.testScore}
                        </div>
                        <div className="text-xs text-slate-400">Min SAT</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-sm font-semibold ${getCompetitivenessColor(scholarship.competitiveness)}`}
                        >
                          {scholarship.competitiveness.toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-400">Competition</div>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-slate-300">
                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                      </span>
                      {new Date(scholarship.deadline) <
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {scholarship.status === 'available' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Apply Now
                        </Button>
                      )}
                      {scholarship.status === 'applied' && (
                        <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600" disabled>
                          <Clock className="w-3 h-3 mr-1" />
                          Application Submitted
                        </Button>
                      )}
                      {scholarship.status === 'awarded' && (
                        <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                          <Award className="w-3 h-3 mr-1" />
                          Awarded
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredScholarships.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">No scholarships found in this category</div>
                <Button onClick={() => setActiveTab('available')} variant="outline">
                  View Available Scholarships
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Progress Section */}
        <div className="mt-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Scholarship Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Application Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Applications Submitted</span>
                    <span className="text-sm text-slate-300">{tracker.totalApplied}/20</span>
                  </div>
                  <Progress value={(tracker.totalApplied / 20) * 100} className="h-2" />
                </div>

                {/* Success Rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Success Rate</span>
                    <span className="text-sm text-slate-300">{tracker.successRate}%</span>
                  </div>
                  <Progress value={tracker.successRate} className="h-2" />
                </div>

                {/* Financial Goal */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-300">Financial Goal</span>
                    <span className="text-sm text-slate-300">
                      {formatCurrency(tracker.totalValue)}/{formatCurrency(100000)}
                    </span>
                  </div>
                  <Progress value={(tracker.totalValue / 100000) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <DollarSign className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">Maximize Your Scholarships</h3>
              <p className="text-slate-300 mb-6">
                Get personalized recommendations and deadline reminders to never miss an opportunity
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Get Recommendations
                </Button>
                <Button variant="outline">Set Reminders</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
