import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  DollarSign, 
  MapPin, 
  Calendar, 
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Award,
  Clock,
  Target
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import StarRating from "../enhanced/star-rating";

interface CollegeMatch {
  id: string;
  name: string;
  location: string;
  division: string;
  sport: string;
  matchPercentage: number;
  scholarshipAvailable: boolean;
  estimatedScholarship: string;
  academicRequirements: {
    gpa: number;
    sat: number;
    act: number;
  };
  athleticRequirements: {
    minGAR: number;
    competitionLevel: string;
  };
  deadlines: {
    application: string;
    athletics: string;
  };
  coachContact: {
    name: string;
    email: string;
    lastContact: string;
  };
  isApplied: boolean;
  isInterested: boolean;
}

interface ApplicationProgress {
  school: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  completedSteps: number;
  totalSteps: number;
  nextDeadline: string;
  requiredDocuments: {
    name: string;
    completed: boolean;
    dueDate: string;
  }[];
}

interface ScoutingReport {
  id: string;
  scoutName: string;
  organization: string;
  date: string;
  sport: string;
  overallRating: number;
  strengths: string[];
  areasForImprovement: string[];
  notes: string;
  followUpScheduled: boolean;
}

export default function ScholarshipRecruitment() {
  const [selectedSport, setSelectedSport] = useState('basketball');
  const [searchLocation, setSearchLocation] = useState('');

  const collegeMatches: CollegeMatch[] = [
    {
      id: '1',
      name: 'Duke University',
      location: 'Durham, NC',
      division: 'Division I',
      sport: 'Basketball',
      matchPercentage: 94,
      scholarshipAvailable: true,
      estimatedScholarship: 'Full Ride ($85,000/year)',
      academicRequirements: {
        gpa: 3.7,
        sat: 1350,
        act: 31
      },
      athleticRequirements: {
        minGAR: 88,
        competitionLevel: 'Elite High School/AAU'
      },
      deadlines: {
        application: '2024-01-15',
        athletics: '2024-12-31'
      },
      coachContact: {
        name: 'Coach Mike Johnson',
        email: 'mjohnson@duke.edu',
        lastContact: '2024-11-15'
      },
      isApplied: false,
      isInterested: true
    },
    {
      id: '2',
      name: 'Stanford University',
      location: 'Stanford, CA',
      division: 'Division I',
      sport: 'Basketball',
      matchPercentage: 89,
      scholarshipAvailable: true,
      estimatedScholarship: 'Partial ($45,000/year)',
      academicRequirements: {
        gpa: 3.9,
        sat: 1480,
        act: 33
      },
      athleticRequirements: {
        minGAR: 85,
        competitionLevel: 'Elite High School'
      },
      deadlines: {
        application: '2024-01-05',
        athletics: '2024-12-20'
      },
      coachContact: {
        name: 'Coach Sarah Williams',
        email: 'swilliams@stanford.edu',
        lastContact: 'Not contacted'
      },
      isApplied: true,
      isInterested: true
    },
    {
      id: '3',
      name: 'University of Connecticut',
      location: 'Storrs, CT',
      division: 'Division I',
      sport: 'Basketball',
      matchPercentage: 96,
      scholarshipAvailable: true,
      estimatedScholarship: 'Full Ride ($75,000/year)',
      academicRequirements: {
        gpa: 3.5,
        sat: 1200,
        act: 27
      },
      athleticRequirements: {
        minGAR: 82,
        competitionLevel: 'High School Varsity'
      },
      deadlines: {
        application: '2024-02-01',
        athletics: '2024-01-15'
      },
      coachContact: {
        name: 'Coach Tony Martinez',
        email: 'tmartinez@uconn.edu',
        lastContact: '2024-12-01'
      },
      isApplied: false,
      isInterested: false
    }
  ];

  const applicationProgress: ApplicationProgress[] = [
    {
      school: 'Stanford University',
      status: 'in_progress',
      completedSteps: 6,
      totalSteps: 10,
      nextDeadline: '2024-12-20',
      requiredDocuments: [
        { name: 'Athletic Resume', completed: true, dueDate: '2024-12-15' },
        { name: 'Highlight Video', completed: true, dueDate: '2024-12-15' },
        { name: 'Academic Transcripts', completed: false, dueDate: '2024-12-18' },
        { name: 'Coach Recommendation', completed: false, dueDate: '2024-12-20' }
      ]
    },
    {
      school: 'UCLA',
      status: 'submitted',
      completedSteps: 10,
      totalSteps: 10,
      nextDeadline: '2024-01-15',
      requiredDocuments: [
        { name: 'Athletic Resume', completed: true, dueDate: '2024-11-30' },
        { name: 'Highlight Video', completed: true, dueDate: '2024-11-30' },
        { name: 'Academic Transcripts', completed: true, dueDate: '2024-12-01' },
        { name: 'Coach Recommendation', completed: true, dueDate: '2024-12-01' }
      ]
    }
  ];

  const scoutingReports: ScoutingReport[] = [
    {
      id: '1',
      scoutName: 'David Thompson',
      organization: 'ESPN Recruiting',
      date: '2024-11-20',
      sport: 'Basketball',
      overallRating: 92,
      strengths: [
        'Exceptional court vision and passing ability',
        'Strong defensive fundamentals',
        'High basketball IQ and leadership qualities'
      ],
      areasForImprovement: [
        'Improve three-point shooting consistency',
        'Develop stronger finish through contact'
      ],
      notes: 'Elite prospect with tremendous potential. Shows maturity beyond years and natural leadership on court.',
      followUpScheduled: true
    },
    {
      id: '2',
      scoutName: 'Maria Rodriguez',
      organization: 'Blue Star Basketball',
      date: '2024-10-15',
      sport: 'Basketball',
      overallRating: 88,
      strengths: [
        'Outstanding athleticism and speed',
        'Excellent rebounding for position',
        'Strong work ethic and coachability'
      ],
      areasForImprovement: [
        'Ball handling in traffic',
        'Free throw shooting'
      ],
      notes: 'High-ceiling player with room to grow. Physical tools are impressive and attitude is excellent.',
      followUpScheduled: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'text-slate-400 bg-slate-400/20';
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/20';
      case 'submitted': return 'text-blue-400 bg-blue-400/20';
      case 'under_review': return 'text-purple-400 bg-purple-400/20';
      case 'accepted': return 'text-green-400 bg-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-cyan-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-green-400" />
            Scholarship & Recruitment Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">12</div>
              <p className="text-slate-400 text-sm">College Matches</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
              <p className="text-slate-400 text-sm">Active Applications</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">$180K</div>
              <p className="text-slate-400 text-sm">Potential Scholarships</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">8</div>
              <p className="text-slate-400 text-sm">Coach Contacts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="matches" className="data-[state=active]:bg-green-500">
            College Matches
          </TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-blue-500">
            Applications
          </TabsTrigger>
          <TabsTrigger value="scouting" className="data-[state=active]:bg-purple-500">
            Scouting Reports
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-orange-500">
            Resources
          </TabsTrigger>
        </TabsList>

        {/* College Matches Tab */}
        <TabsContent value="matches">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1"
              />
              <Button className="neon-glow">
                <Target className="w-4 h-4 mr-2" />
                Find Matches
              </Button>
            </div>

            <div className="space-y-4">
              {collegeMatches.map((college) => (
                <Card key={college.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-1">{college.name}</h4>
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                              <MapPin className="w-4 h-4" />
                              {college.location}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {college.division} • {college.sport}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold mb-1 ${getMatchColor(college.matchPercentage)}`}>
                              {college.matchPercentage}%
                            </div>
                            <p className="text-xs text-slate-400">Match Score</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Coach Contact</span>
                            <span className="text-white">{college.coachContact.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Last Contact</span>
                            <span className={college.coachContact.lastContact === 'Not contacted' ? 'text-red-400' : 'text-green-400'}>
                              {college.coachContact.lastContact}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-white mb-3">Requirements</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Min GPA</span>
                            <span className="text-white">{college.academicRequirements.gpa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Min SAT</span>
                            <span className="text-white">{college.academicRequirements.sat}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Min GAR</span>
                            <span className="text-cyan-400">{college.athleticRequirements.minGAR}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="font-medium text-white mb-2">Deadlines</h6>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Application</span>
                              <span className="text-yellow-400">{college.deadlines.application}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Athletics</span>
                              <span className="text-yellow-400">{college.deadlines.athletics}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg p-4 mb-4 border border-green-500/30">
                          <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            Scholarship Estimate
                          </h5>
                          <p className="text-green-400 font-semibold">{college.estimatedScholarship}</p>
                        </div>

                        <div className="flex gap-2 mb-3">
                          <Button 
                            size="sm" 
                            className={college.isInterested ? 'border-green-400 text-green-400 hover:bg-green-400/10' : 'neon-glow'}
                            variant={college.isInterested ? 'outline' : 'default'}
                          >
                            {college.isInterested ? 'Interested' : 'Mark Interest'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                          >
                            Contact Coach
                          </Button>
                        </div>

                        <Button 
                          className={`w-full ${college.isApplied ? 'border-blue-400 text-blue-400 hover:bg-blue-400/10' : 'neon-glow'}`}
                          variant={college.isApplied ? 'outline' : 'default'}
                        >
                          {college.isApplied ? 'View Application' : 'Start Application'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <div className="space-y-6">
            {applicationProgress.map((app, index) => (
              <Card key={index} className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">{app.school}</h4>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {Math.round((app.completedSteps / app.totalSteps) * 100)}%
                      </div>
                      <p className="text-xs text-slate-400">Complete</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-white mb-3">Progress Overview</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Steps Completed</span>
                          <span className="text-white">{app.completedSteps}/{app.totalSteps}</span>
                        </div>
                        <Progress value={(app.completedSteps / app.totalSteps) * 100} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Next Deadline</span>
                          <span className="text-yellow-400">{app.nextDeadline}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-white mb-3">Required Documents</h5>
                      <div className="space-y-2">
                        {app.requiredDocuments.map((doc, docIndex) => (
                          <div key={docIndex} className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
                            <div className="flex items-center gap-2">
                              {doc.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                              )}
                              <span className="text-sm text-white">{doc.name}</span>
                            </div>
                            <span className="text-xs text-slate-400">{doc.dueDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="neon-glow">
                      <FileText className="w-4 h-4 mr-2" />
                      Continue Application
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scouting Reports Tab */}
        <TabsContent value="scouting">
          <div className="space-y-6">
            {scoutingReports.map((report) => (
              <Card key={report.id} className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-1">{report.scoutName}</h4>
                      <p className="text-slate-400">{report.organization}</p>
                      <p className="text-sm text-slate-500">{report.date}</p>
                    </div>
                    <div className="text-center">
                      <StarRating garScore={report.overallRating} size="lg" />
                      <p className="text-xs text-slate-400 mt-1">Overall Rating</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="font-medium text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        Strengths
                      </h5>
                      <ul className="space-y-2">
                        {report.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        Areas for Improvement
                      </h5>
                      <ul className="space-y-2">
                        {report.areasForImprovement.map((area, index) => (
                          <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-white mb-2">Scout Notes</h5>
                    <p className="text-sm text-slate-300">{report.notes}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {report.followUpScheduled ? (
                        <Badge className="verified-badge">
                          <Clock className="w-3 h-3 mr-1" />
                          Follow-up Scheduled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                          No Follow-up
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10">
                      Schedule Follow-up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-orange-500/30 achievement-glow">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">Application Guide</h4>
                <p className="text-sm text-slate-400 mb-4">Step-by-step college application process</p>
                <Button className="border-orange-400 text-orange-400 hover:bg-orange-400/10" variant="outline">
                  Download Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/30 achievement-glow">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">Scholarship Database</h4>
                <p className="text-sm text-slate-400 mb-4">Comprehensive scholarship opportunities</p>
                <Button className="border-green-400 text-green-400 hover:bg-green-400/10" variant="outline">
                  Browse Scholarships
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/30 achievement-glow">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">Coach Directory</h4>
                <p className="text-sm text-slate-400 mb-4">Connect with college coaches</p>
                <Button className="border-blue-400 text-blue-400 hover:bg-blue-400/10" variant="outline">
                  Find Coaches
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}