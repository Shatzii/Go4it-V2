'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AICoachWidget } from '@/components/ai-coach/AICoachWidget';
import {
  Target,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  GraduationCap,
  MapPin,
  Star,
  Mic,
  Brain,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
} from 'lucide-react';

export default function RecruitingReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('overview');
  const [aiCoachActive, setAiCoachActive] = useState(false);

  const recruitingData = {
    overview: {
      garScore: 78,
      position: 'Quarterback',
      grade: '11th',
      height: '6\'1"',
      weight: '185 lbs',
      gpa: 3.7,
      acts: 28,
      eligibilityStatus: 'NCAA Eligible',
      marketValue: 'High Interest',
    },
    highlights: {
      videoCount: 15,
      gameFootage: 8,
      practiceFootage: 7,
      totalViews: 1247,
      coachViews: 89,
      avgRating: 4.2,
    },
    schools: [
      {
        name: 'State University',
        division: 'D1',
        interest: 'High',
        contact: 'Recent',
        status: 'Actively Recruiting',
        fit: 92,
        distance: '45 miles',
        lastContact: '3 days ago',
      },
      {
        name: 'Regional College',
        division: 'D2',
        interest: 'Very High',
        contact: 'Regular',
        status: 'Scholarship Offer',
        fit: 88,
        distance: '120 miles',
        lastContact: '1 week ago',
      },
      {
        name: 'Tech Institute',
        division: 'D3',
        interest: 'Medium',
        contact: 'Initial',
        status: 'Watching',
        fit: 75,
        distance: '200 miles',
        lastContact: '2 weeks ago',
      },
    ],
    timeline: [
      {
        date: '2024-01-15',
        event: 'Scholarship Offer - Regional College',
        type: 'offer',
        importance: 'high',
      },
      {
        date: '2024-01-10',
        event: 'Coach Visit - State University',
        type: 'visit',
        importance: 'high',
      },
      {
        date: '2024-01-05',
        event: 'Highlight Reel Updated',
        type: 'content',
        importance: 'medium',
      },
      {
        date: '2024-01-01',
        event: 'GAR Score Improvement (+5 points)',
        type: 'performance',
        importance: 'high',
      },
    ],
    analytics: {
      profileViews: 1247,
      coachContacts: 23,
      campInvites: 5,
      showcaseAttended: 3,
      socialMediaFollowers: 890,
      recruitingRank: {
        state: 15,
        region: 45,
        national: 180,
      },
    },
  };

  const improvementAreas = [
    {
      area: 'Academic Performance',
      current: 3.7,
      target: 3.8,
      priority: 'Medium',
      actions: ['Focus on core classes', 'Study hall participation', 'Tutoring if needed'],
    },
    {
      area: 'Test Scores',
      current: 28,
      target: 30,
      priority: 'High',
      actions: ['ACT prep course', 'Practice tests', 'Test-taking strategies'],
    },
    {
      area: 'Highlight Reel',
      current: 'Q3 2023',
      target: 'Current Season',
      priority: 'High',
      actions: ['Add recent game footage', 'Include practice highlights', 'Professional editing'],
    },
    {
      area: 'Social Media Presence',
      current: 890,
      target: 1500,
      priority: 'Low',
      actions: ['Consistent posting', 'Engage with coaches', 'Share training updates'],
    },
  ];

  const getInterestColor = (interest: string) => {
    switch (interest.toLowerCase()) {
      case 'very high':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'high':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Recruiting Reports
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Comprehensive analysis of your recruitment journey with AI insights
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              College Matching
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              AI Analysis
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Performance Tracking
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* AI Coach Integration */}
          <div className="lg:col-span-1">
            <AICoachWidget
              feature="recruiting_reports"
              context={{
                recruitingData: recruitingData.overview,
                rankings: recruitingData.analytics.recruitingRank,
                highlights: recruitingData.highlights,
                targetSchools: recruitingData.schools,
                improvementAreas,
              }}
              className="mb-6"
            />

            {/* Quick Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {recruitingData.overview.garScore}
                    </div>
                    <p className="text-sm text-slate-300">GAR Score</p>
                  </div>

                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {recruitingData.analytics.coachContacts}
                    </div>
                    <p className="text-sm text-slate-300">Coach Contacts</p>
                  </div>

                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      #{recruitingData.analytics.recruitingRank.state}
                    </div>
                    <p className="text-sm text-slate-300">State Ranking</p>
                  </div>

                  <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {
                        recruitingData.schools.filter(
                          (s) => s.interest === 'High' || s.interest === 'Very High',
                        ).length
                      }
                    </div>
                    <p className="text-sm text-slate-300">High Interest Schools</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schools">Target Schools</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="improvement">Action Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Player Profile */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Player Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Position</p>
                          <p className="text-white font-medium">
                            {recruitingData.overview.position}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Grade</p>
                          <p className="text-white font-medium">{recruitingData.overview.grade}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Height</p>
                          <p className="text-white font-medium">{recruitingData.overview.height}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Weight</p>
                          <p className="text-white font-medium">{recruitingData.overview.weight}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-600 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">GPA</p>
                            <p className="text-white font-medium">{recruitingData.overview.gpa}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">ACT Score</p>
                            <p className="text-white font-medium">{recruitingData.overview.acts}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {recruitingData.overview.eligibilityStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Highlight Reel Stats */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Highlight Reel Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Total Videos</p>
                          <p className="text-white font-medium">
                            {recruitingData.highlights.videoCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Total Views</p>
                          <p className="text-white font-medium">
                            {recruitingData.highlights.totalViews.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Coach Views</p>
                          <p className="text-white font-medium">
                            {recruitingData.highlights.coachViews}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Avg Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <p className="text-white font-medium">
                              {recruitingData.highlights.avgRating}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-600 pt-4">
                        <div className="text-sm">
                          <p className="text-slate-400 mb-2">Content Breakdown</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-300">Game Footage</span>
                              <span className="text-white">
                                {recruitingData.highlights.gameFootage}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Practice Footage</span>
                              <span className="text-white">
                                {recruitingData.highlights.practiceFootage}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="schools" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recruitingData.schools.map((school, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{school.name}</CardTitle>
                          <Badge className={getInterestColor(school.interest)}>
                            {school.interest}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span>{school.division}</span>
                          <span>•</span>
                          <span>{school.distance}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300">Program Fit</span>
                            <span className="text-white">{school.fit}%</span>
                          </div>
                          <Progress value={school.fit} className="h-2" />
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status</span>
                            <span className="text-white font-medium">{school.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Last Contact</span>
                            <span className="text-white">{school.lastContact}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-600">
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Phone className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-slate-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            Visit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-400" />
                      Recruiting Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recruitingData.timeline.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-lg"
                        >
                          <div
                            className={`w-3 h-3 rounded-full mt-2 ${
                              event.importance === 'high'
                                ? 'bg-red-400'
                                : event.importance === 'medium'
                                  ? 'bg-yellow-400'
                                  : 'bg-green-400'
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-white">{event.event}</h4>
                              <span className="text-sm text-slate-400">{event.date}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recruiting Rankings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                        <div className="text-3xl font-bold text-yellow-400 mb-1">
                          #{recruitingData.analytics.recruitingRank.state}
                        </div>
                        <p className="text-sm text-slate-300">State Ranking</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                          <div className="text-xl font-bold text-blue-400 mb-1">
                            #{recruitingData.analytics.recruitingRank.region}
                          </div>
                          <p className="text-xs text-slate-300">Regional</p>
                        </div>
                        <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                          <div className="text-xl font-bold text-purple-400 mb-1">
                            #{recruitingData.analytics.recruitingRank.national}
                          </div>
                          <p className="text-xs text-slate-300">National</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Engagement Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Profile Views</p>
                          <p className="text-2xl font-bold text-white">
                            {recruitingData.analytics.profileViews.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Camp Invites</p>
                          <p className="text-2xl font-bold text-white">
                            {recruitingData.analytics.campInvites}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Showcases</p>
                          <p className="text-2xl font-bold text-white">
                            {recruitingData.analytics.showcaseAttended}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Social Followers</p>
                          <p className="text-2xl font-bold text-white">
                            {recruitingData.analytics.socialMediaFollowers.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="improvement" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {improvementAreas.map((area, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{area.area}</CardTitle>
                          <div className="flex items-center gap-2">
                            <AlertCircle className={`w-4 h-4 ${getPriorityColor(area.priority)}`} />
                            <Badge variant="outline" className={getPriorityColor(area.priority)}>
                              {area.priority} Priority
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Current</p>
                            <p className="text-white font-medium">{area.current}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Target</p>
                            <p className="text-white font-medium">{area.target}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-white text-sm mb-2">Action Items:</h5>
                          <ul className="space-y-1">
                            {area.actions.map((action, actionIndex) => (
                              <li
                                key={actionIndex}
                                className="flex items-center gap-2 text-sm text-slate-300"
                              >
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
