import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  Users,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  Trophy,
  Target,
  FileText,
  Video,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CollegeMatch {
  id: string;
  name: string;
  location: string;
  state: string;
  division: 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO';
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
    financial: string;
  };
  coachContact: {
    name: string;
    email: string;
    phone: string;
    lastContact?: string;
  };
  programInfo: {
    teamSize: number;
    conference: string;
    recentRecord: string;
    facilities: string[];
  };
  isApplied: boolean;
  isInterested: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface ApplicationProgress {
  schoolId: string;
  school: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  completedSteps: number;
  totalSteps: number;
  nextDeadline: string;
  requiredDocuments: {
    name: string;
    completed: boolean;
    dueDate: string;
    type: 'academic' | 'athletic' | 'financial';
  }[];
  scholarshipOffer?: {
    amount: string;
    type: 'full' | 'partial' | 'academic' | 'athletic';
    conditions: string[];
  };
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
  garScore: number;
  recommendation: 'highly_recommend' | 'recommend' | 'consider' | 'not_recommend';
}

interface RecruitmentMatcherProps {
  userProfile: {
    garScore: number;
    sport: string;
    gpa: number;
    satScore?: number;
    actScore?: number;
    graduationYear: number;
    preferredStates: string[];
    divisionPreferences: string[];
  };
}

export default function RecruitmentMatcher({ userProfile }: RecruitmentMatcherProps) {
  const [collegeMatches, setCollegeMatches] = useState<CollegeMatch[]>([]);
  const [applications, setApplications] = useState<ApplicationProgress[]>([]);
  const [scoutingReports, setScoutingReports] = useState<ScoutingReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    division: 'all',
    state: 'all',
    scholarship: 'all',
    matchThreshold: 70
  });
  const [selectedCollege, setSelectedCollege] = useState<CollegeMatch | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    generateCollegeMatches();
    generateApplicationProgress();
    generateScoutingReports();
  }, [userProfile]);

  const generateCollegeMatches = () => {
    const sampleMatches: CollegeMatch[] = [
      {
        id: '1',
        name: 'Stanford University',
        location: 'Stanford, CA',
        state: 'California',
        division: 'D1',
        sport: userProfile.sport,
        matchPercentage: 92,
        scholarshipAvailable: true,
        estimatedScholarship: '$45,000 - $55,000',
        academicRequirements: { gpa: 3.8, sat: 1450, act: 32 },
        athleticRequirements: { minGAR: 90, competitionLevel: 'National' },
        deadlines: {
          application: '2025-01-15',
          athletics: '2025-02-01',
          financial: '2025-03-01'
        },
        coachContact: {
          name: 'Sarah Johnson',
          email: 'sjohnson@stanford.edu',
          phone: '(650) 723-4000'
        },
        programInfo: {
          teamSize: 25,
          conference: 'Pac-12',
          recentRecord: '18-4 (2024)',
          facilities: ['Olympic Training Center', 'Advanced Analytics Lab', 'Recovery Center']
        },
        isApplied: false,
        isInterested: true,
        priority: 'high'
      },
      {
        id: '2',
        name: 'University of Florida',
        location: 'Gainesville, FL',
        state: 'Florida',
        division: 'D1',
        sport: userProfile.sport,
        matchPercentage: 88,
        scholarshipAvailable: true,
        estimatedScholarship: '$35,000 - $42,000',
        academicRequirements: { gpa: 3.5, sat: 1320, act: 28 },
        athleticRequirements: { minGAR: 85, competitionLevel: 'Regional' },
        deadlines: {
          application: '2025-02-01',
          athletics: '2025-02-15',
          financial: '2025-03-15'
        },
        coachContact: {
          name: 'Mike Rodriguez',
          email: 'mrodriguez@ufl.edu',
          phone: '(352) 392-3000',
          lastContact: '2025-05-15'
        },
        programInfo: {
          teamSize: 28,
          conference: 'SEC',
          recentRecord: '22-8 (2024)',
          facilities: ['State-of-the-art Training Complex', 'Sports Medicine Center']
        },
        isApplied: true,
        isInterested: true,
        priority: 'high'
      },
      {
        id: '3',
        name: 'Williams College',
        location: 'Williamstown, MA',
        state: 'Massachusetts',
        division: 'D3',
        sport: userProfile.sport,
        matchPercentage: 85,
        scholarshipAvailable: false,
        estimatedScholarship: 'Academic Aid Available',
        academicRequirements: { gpa: 3.7, sat: 1400, act: 31 },
        athleticRequirements: { minGAR: 82, competitionLevel: 'Regional' },
        deadlines: {
          application: '2025-01-01',
          athletics: '2025-01-15',
          financial: '2025-02-15'
        },
        coachContact: {
          name: 'Jennifer Adams',
          email: 'jadams@williams.edu',
          phone: '(413) 597-2366'
        },
        programInfo: {
          teamSize: 20,
          conference: 'NESCAC',
          recentRecord: '15-3 (2024)',
          facilities: ['Renovated Athletic Center', 'Academic Support Center']
        },
        isApplied: false,
        isInterested: false,
        priority: 'medium'
      }
    ];
    setCollegeMatches(sampleMatches);
  };

  const generateApplicationProgress = () => {
    const sampleApplications: ApplicationProgress[] = [
      {
        schoolId: '2',
        school: 'University of Florida',
        status: 'in_progress',
        completedSteps: 6,
        totalSteps: 10,
        nextDeadline: '2025-07-15',
        requiredDocuments: [
          { name: 'Official Transcripts', completed: true, dueDate: '2025-06-30', type: 'academic' },
          { name: 'Athletic Resume', completed: true, dueDate: '2025-06-30', type: 'athletic' },
          { name: 'Highlight Video', completed: false, dueDate: '2025-07-15', type: 'athletic' },
          { name: 'Letters of Recommendation', completed: false, dueDate: '2025-07-20', type: 'academic' },
          { name: 'Personal Statement', completed: true, dueDate: '2025-07-01', type: 'academic' },
          { name: 'Financial Aid Forms', completed: false, dueDate: '2025-08-01', type: 'financial' }
        ]
      }
    ];
    setApplications(sampleApplications);
  };

  const generateScoutingReports = () => {
    const sampleReports: ScoutingReport[] = [
      {
        id: '1',
        scoutName: 'David Thompson',
        organization: 'Elite Sports Recruiting',
        date: '2025-05-20',
        sport: userProfile.sport,
        overallRating: 8.5,
        strengths: ['Exceptional speed and agility', 'Strong game awareness', 'Natural leadership qualities'],
        areasForImprovement: ['Consistency under pressure', 'Technical refinement needed'],
        notes: 'Outstanding athlete with high potential. Shows great coachability and work ethic. Recommend for D1 programs.',
        followUpScheduled: true,
        garScore: userProfile.garScore,
        recommendation: 'highly_recommend'
      },
      {
        id: '2',
        scoutName: 'Maria Santos',
        organization: 'College Sports Network',
        date: '2025-04-15',
        sport: userProfile.sport,
        overallRating: 7.8,
        strengths: ['Technical skills', 'Academic excellence', 'Team player'],
        areasForImprovement: ['Physical conditioning', 'Competition experience'],
        notes: 'Well-rounded student-athlete. Strong academic profile makes them attractive to competitive programs.',
        followUpScheduled: false,
        garScore: userProfile.garScore - 2,
        recommendation: 'recommend'
      }
    ];
    setScoutingReports(sampleReports);
  };

  const handleExpressInterest = (collegeId: string) => {
    setCollegeMatches(prev => prev.map(college => 
      college.id === collegeId 
        ? { ...college, isInterested: !college.isInterested }
        : college
    ));
  };

  const handleStartApplication = (collegeId: string) => {
    const college = collegeMatches.find(c => c.id === collegeId);
    if (college) {
      setCollegeMatches(prev => prev.map(c => 
        c.id === collegeId ? { ...c, isApplied: true } : c
      ));

      const newApplication: ApplicationProgress = {
        schoolId: collegeId,
        school: college.name,
        status: 'not_started',
        completedSteps: 0,
        totalSteps: 8,
        nextDeadline: college.deadlines.application,
        requiredDocuments: [
          { name: 'Application Form', completed: false, dueDate: college.deadlines.application, type: 'academic' },
          { name: 'Official Transcripts', completed: false, dueDate: college.deadlines.application, type: 'academic' },
          { name: 'Athletic Resume', completed: false, dueDate: college.deadlines.athletics, type: 'athletic' },
          { name: 'Highlight Video', completed: false, dueDate: college.deadlines.athletics, type: 'athletic' },
          { name: 'Coach Recommendation', completed: false, dueDate: college.deadlines.athletics, type: 'athletic' },
          { name: 'Personal Statement', completed: false, dueDate: college.deadlines.application, type: 'academic' }
        ]
      };

      setApplications(prev => [...prev, newApplication]);
    }
  };

  const filteredColleges = collegeMatches.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDivision = filters.division === 'all' || college.division === filters.division;
    const matchesState = filters.state === 'all' || college.state === filters.state;
    const matchesScholarship = filters.scholarship === 'all' || 
                              (filters.scholarship === 'available' && college.scholarshipAvailable) ||
                              (filters.scholarship === 'none' && !college.scholarshipAvailable);
    const matchesThreshold = college.matchPercentage >= filters.matchThreshold;

    return matchesSearch && matchesDivision && matchesState && matchesScholarship && matchesThreshold;
  });

  const renderCollegeMatches = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search colleges by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.division}
            onChange={(e) => setFilters(prev => ({ ...prev, division: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Divisions</option>
            <option value="D1">Division I</option>
            <option value="D2">Division II</option>
            <option value="D3">Division III</option>
            <option value="NAIA">NAIA</option>
            <option value="JUCO">Junior College</option>
          </select>
          <select
            value={filters.scholarship}
            onChange={(e) => setFilters(prev => ({ ...prev, scholarship: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Schools</option>
            <option value="available">Scholarships Available</option>
            <option value="none">No Athletic Scholarships</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredColleges.map((college) => (
          <motion.div
            key={college.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={cn(
              "hover:shadow-lg transition-shadow cursor-pointer",
              college.priority === 'high' && "border-l-4 border-l-green-500",
              college.priority === 'medium' && "border-l-4 border-l-yellow-500",
              college.priority === 'low' && "border-l-4 border-l-gray-400"
            )}
            onClick={() => setSelectedCollege(college)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{college.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{college.division}</Badge>
                      <Badge variant="secondary">{college.sport}</Badge>
                      {college.isApplied && <Badge className="bg-blue-100 text-blue-700">Applied</Badge>}
                      {college.isInterested && <Badge className="bg-green-100 text-green-700">Interested</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{college.matchPercentage}%</div>
                    <div className="text-xs text-gray-500">Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {college.location}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Academic Requirements</div>
                      <div className="text-sm">
                        GPA: {college.academicRequirements.gpa}+ | 
                        SAT: {college.academicRequirements.sat}+
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Athletic Requirements</div>
                      <div className="text-sm">
                        GAR: {college.athleticRequirements.minGAR}+ | 
                        Level: {college.athleticRequirements.competitionLevel}
                      </div>
                    </div>
                  </div>

                  {college.scholarshipAvailable && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Scholarship Available</span>
                      </div>
                      <div className="text-sm text-green-700">{college.estimatedScholarship}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Key Deadlines</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        App: {new Date(college.deadlines.application).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Athletic: {new Date(college.deadlines.athletics).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!college.isInterested && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpressInterest(college.id);
                        }}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Express Interest
                      </Button>
                    )}
                    {!college.isApplied && (
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartApplication(college.id);
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Start Application
                      </Button>
                    )}
                    {college.isApplied && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        View Application
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Applications Started</h3>
          <p className="text-gray-600 mb-6">Start your college application process by expressing interest in schools</p>
        </div>
      ) : (
        applications.map((app) => (
          <Card key={app.schoolId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{app.school}</CardTitle>
                <Badge variant={
                  app.status === 'accepted' ? 'default' :
                  app.status === 'rejected' ? 'destructive' :
                  app.status === 'submitted' ? 'secondary' : 'outline'
                }>
                  {app.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{app.completedSteps}/{app.totalSteps} completed</span>
                  </div>
                  <Progress value={(app.completedSteps / app.totalSteps) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Next Deadline</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-orange-500" />
                      {new Date(app.nextDeadline).toLocaleDateString()}
                    </div>
                  </div>
                  {app.scholarshipOffer && (
                    <div>
                      <div className="text-sm font-medium mb-2">Scholarship Offer</div>
                      <div className="text-sm text-green-600 font-medium">
                        {app.scholarshipOffer.amount} ({app.scholarshipOffer.type})
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium mb-3">Required Documents</div>
                  <div className="space-y-2">
                    {app.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {doc.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-500" />
                          )}
                          <span className="text-sm">{doc.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          Due: {new Date(doc.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Continue Application
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderScoutingReports = () => (
    <div className="space-y-6">
      {scoutingReports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Scouting Report</CardTitle>
                <div className="text-sm text-gray-600">
                  {report.scoutName} • {report.organization}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{report.overallRating}/10</div>
                <div className="text-xs text-gray-500">Overall Rating</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  GAR Score: {report.garScore}
                </div>
                <Badge variant={
                  report.recommendation === 'highly_recommend' ? 'default' :
                  report.recommendation === 'recommend' ? 'secondary' :
                  report.recommendation === 'consider' ? 'outline' : 'destructive'
                }>
                  {report.recommendation.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-green-600 mb-2">Strengths</div>
                  <ul className="text-sm space-y-1">
                    {report.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-600 mb-2">Areas for Improvement</div>
                  <ul className="text-sm space-y-1">
                    {report.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Scout Notes</div>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{report.notes}</p>
              </div>

              {report.followUpScheduled && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Follow-up scheduled</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            College Recruitment Center
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger value="matches" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Search className="w-4 h-4" />
            College Matches
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <FileText className="w-4 h-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="scouting" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Award className="w-4 h-4" />
            Scouting Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderCollegeMatches()}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderApplications()}
          </div>
        </TabsContent>

        <TabsContent value="scouting" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderScoutingReports()}
          </div>
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {selectedCollege && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{selectedCollege.name}</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedCollege(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Program Information</h3>
                      <div className="space-y-2 text-sm">
                        <div>Team Size: {selectedCollege.programInfo.teamSize} players</div>
                        <div>Conference: {selectedCollege.programInfo.conference}</div>
                        <div>Recent Record: {selectedCollege.programInfo.recentRecord}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Facilities</h3>
                      <ul className="text-sm space-y-1">
                        {selectedCollege.programInfo.facilities.map((facility, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {facility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Coach Contact</h3>
                      <div className="space-y-2 text-sm">
                        <div>{selectedCollege.coachContact.name}</div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedCollege.coachContact.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedCollege.coachContact.phone}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Application Deadlines</h3>
                      <div className="space-y-2 text-sm">
                        <div>Application: {new Date(selectedCollege.deadlines.application).toLocaleDateString()}</div>
                        <div>Athletics: {new Date(selectedCollege.deadlines.athletics).toLocaleDateString()}</div>
                        <div>Financial Aid: {new Date(selectedCollege.deadlines.financial).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Coach
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}