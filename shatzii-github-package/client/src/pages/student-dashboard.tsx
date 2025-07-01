import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, BookOpen, Code, Users, Award, Target, TrendingUp, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface StudentProgress {
  studentId: string;
  name: string;
  email: string;
  cohort: string;
  program: 'full-time' | 'part-time';
  currentPhase: number;
  currentWeek: number;
  totalWeeks: number;
  completionPercentage: number;
  specialization?: string;
  mentor: string;
  nextMilestone: string;
  currentProject: string;
  skillsAcquired: string[];
  hoursCompleted: number;
  totalHours: number;
  gpa: number;
  attendance: number;
  certifications: string[];
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  estimatedHours: number;
  category: 'theory' | 'practical' | 'project' | 'assessment';
}

interface Mentor {
  name: string;
  title: string;
  avatar: string;
  expertise: string[];
  nextMeeting: string;
  lastFeedback: string;
}

interface JobOpportunity {
  id: string;
  company: string;
  title: string;
  salary: string;
  location: string;
  matchScore: number;
  requirements: string[];
  applicationDeadline: string;
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch student data
  const { data: studentData, isLoading: studentLoading } = useQuery<StudentProgress>({
    queryKey: ['/api/student/progress'],
    enabled: true
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery<Assignment[]>({
    queryKey: ['/api/student/assignments'],
    enabled: true
  });

  const { data: mentorData, isLoading: mentorLoading } = useQuery<Mentor>({
    queryKey: ['/api/student/mentor'],
    enabled: true
  });

  const { data: jobOpportunities, isLoading: jobsLoading } = useQuery<JobOpportunity[]>({
    queryKey: ['/api/student/job-opportunities'],
    enabled: true
  });

  // Mock data for demonstration
  const mockStudentData: StudentProgress = {
    studentId: 'STU-2025-001',
    name: 'Alex Chen',
    email: 'alex.chen@student.shatzii.com',
    cohort: 'January 2025',
    program: 'full-time',
    currentPhase: 2,
    currentWeek: 18,
    totalWeeks: 48,
    completionPercentage: 37.5,
    specialization: 'Healthcare AI',
    mentor: 'Dr. Sarah Johnson',
    nextMilestone: 'Mid-term Project Presentation',
    currentProject: 'HIPAA-Compliant Patient Data AI System',
    skillsAcquired: [
      'Python/TypeScript', 'React Development', 'AI Model Training',
      'Database Design', 'Docker Containerization', 'Healthcare Compliance'
    ],
    hoursCompleted: 720,
    totalHours: 1920,
    gpa: 3.8,
    attendance: 96,
    certifications: ['Shatzii Foundation AI', 'Healthcare AI Specialist']
  };

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Build Healthcare AI Chatbot',
      description: 'Create a HIPAA-compliant chatbot for patient intake using Ollama and custom models',
      dueDate: '2025-07-15',
      status: 'in-progress',
      difficulty: 'advanced',
      points: 150,
      estimatedHours: 40,
      category: 'project'
    },
    {
      id: '2',
      title: 'AI Ethics in Healthcare',
      description: 'Research paper on ethical considerations in medical AI systems',
      dueDate: '2025-07-08',
      status: 'pending',
      difficulty: 'intermediate',
      points: 100,
      estimatedHours: 20,
      category: 'theory'
    },
    {
      id: '3',
      title: 'Database Security Assessment',
      description: 'Conduct security audit of patient database implementation',
      dueDate: '2025-07-05',
      status: 'completed',
      difficulty: 'advanced',
      points: 125,
      estimatedHours: 30,
      category: 'practical'
    }
  ];

  const mockMentor: Mentor = {
    name: 'Dr. Sarah Johnson',
    title: 'Senior AI Architect, Healthcare Division',
    avatar: '/api/placeholder/64/64',
    expertise: ['Healthcare AI', 'HIPAA Compliance', 'Machine Learning', 'System Architecture'],
    nextMeeting: '2025-07-02 14:00',
    lastFeedback: 'Excellent progress on the chatbot project. Focus on improving error handling and user experience.'
  };

  const mockJobOpportunities: JobOpportunity[] = [
    {
      id: '1',
      company: 'MedTech Solutions',
      title: 'Junior AI Engineer - Healthcare',
      salary: '$95,000 - $120,000',
      location: 'San Francisco, CA',
      matchScore: 92,
      requirements: ['Python', 'Healthcare AI', 'HIPAA Compliance'],
      applicationDeadline: '2025-08-15'
    },
    {
      id: '2',
      company: 'AI Health Corp',
      title: 'Healthcare AI Developer',
      salary: '$85,000 - $105,000',
      location: 'Remote',
      matchScore: 88,
      requirements: ['Machine Learning', 'Healthcare Data', 'React'],
      applicationDeadline: '2025-08-20'
    }
  ];

  const currentStudent = studentData || mockStudentData;
  const currentAssignments = assignments || mockAssignments;
  const currentMentor = mentorData || mockMentor;
  const currentJobs = jobOpportunities || mockJobOpportunities;

  const getPhaseInfo = (phase: number) => {
    const phases = [
      { name: 'Foundation', color: 'bg-blue-500', description: 'AI fundamentals and development setup' },
      { name: 'Intermediate', color: 'bg-green-500', description: 'Industry-specific AI development' },
      { name: 'Advanced', color: 'bg-purple-500', description: 'Enterprise-grade systems' },
      { name: 'Specialization', color: 'bg-orange-500', description: 'Real-world client projects' }
    ];

    return phases[phase - 1] || phases[0];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {currentStudent.name}!
              </h1>
              <p className="text-gray-300">
                {currentStudent.cohort} • {currentStudent.specialization} Track
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {currentStudent.completionPercentage}% Complete
              </div>
              <div className="text-sm text-gray-400">
                Week {currentStudent.currentWeek} of {currentStudent.totalWeeks}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">GPA</p>
                  <p className="text-2xl font-bold text-white">{currentStudent.gpa}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Attendance</p>
                  <p className="text-2xl font-bold text-white">{currentStudent.attendance}%</p>
                </div>
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Hours Completed</p>
                  <p className="text-2xl font-bold text-white">{currentStudent.hoursCompleted}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Certifications</p>
                  <p className="text-2xl font-bold text-white">{currentStudent.certifications.length}</p>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="mentor">Mentor</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Overview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Program Progress</CardTitle>
                  <CardDescription>Your journey through the AI internship program</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="text-white">{currentStudent.completionPercentage}%</span>
                    </div>
                    <Progress value={currentStudent.completionPercentage} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((phase) => {
                      const phaseInfo = getPhaseInfo(phase);
                      const isActive = phase === currentStudent.currentPhase;
                      const isCompleted = phase < currentStudent.currentPhase;

                      return (
                        <div key={phase} className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            isCompleted ? 'bg-green-500' : 
                            isActive ? phaseInfo.color : 'bg-gray-600'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${
                                isActive ? 'text-white' : 'text-gray-400'
                              }`}>
                                Phase {phase}: {phaseInfo.name}
                              </span>
                              {isActive && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {phaseInfo.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Current Project */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Current Project</CardTitle>
                  <CardDescription>Your main focus this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        {currentStudent.currentProject}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Building a comprehensive healthcare AI system with HIPAA compliance, 
                        real-time patient data processing, and secure integration with existing 
                        hospital management systems.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Next Milestone:</span>
                      <span className="text-sm text-white">{currentStudent.nextMilestone}</span>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Code className="w-4 h-4 mr-2" />
                      Continue Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills Acquired */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Skills Acquired</CardTitle>
                <CardDescription>Technologies and concepts you've mastered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentStudent.skillsAcquired.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-700 text-white">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="grid gap-4">
              {currentAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(assignment.status)}
                          <h3 className="font-semibold text-white">{assignment.title}</h3>
                          <Badge className={getDifficultyColor(assignment.difficulty)}>
                            {assignment.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3">
                          {assignment.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <span>Points: {assignment.points}</span>
                          <span>Est. Hours: {assignment.estimatedHours}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Button 
                          size="sm" 
                          variant={assignment.status === 'completed' ? 'secondary' : 'default'}
                          className="mb-2"
                        >
                          {assignment.status === 'completed' ? 'Completed' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mentor Tab */}
          <TabsContent value="mentor" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Mentor</CardTitle>
                <CardDescription>Expert guidance throughout your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{currentMentor.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{currentMentor.title}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {currentMentor.expertise.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Next Meeting</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(currentMentor.nextMeeting).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Latest Feedback</h4>
                        <p className="text-sm text-gray-400">{currentMentor.lastFeedback}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Schedule Meeting
                      </Button>
                      <Button size="sm" variant="outline">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Job Opportunities</CardTitle>
                <CardDescription>Positions matched to your skills and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentJobs.map((job) => (
                    <div key={job.id} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{job.title}</h3>
                          <p className="text-sm text-gray-400">{job.company}</p>
                          <p className="text-sm text-gray-500">{job.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm text-gray-400">Match:</span>
                            <Badge className="bg-green-600 text-white">
                              {job.matchScore}%
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-white">{job.salary}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Learning Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border border-slate-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">AI Development Handbook</p>
                      <p className="text-xs text-gray-400">Complete guide to building AI systems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border border-slate-600 rounded-lg">
                    <Code className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium text-white">Code Templates</p>
                      <p className="text-xs text-gray-400">Pre-built components and patterns</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border border-slate-600 rounded-lg">
                    <Target className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-white">Project Examples</p>
                      <p className="text-xs text-gray-400">Real-world implementations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                    <Users className="w-4 h-4 mr-2" />
                    Study Groups
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Office Hours
                  </Button>
                  
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Career Services
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}