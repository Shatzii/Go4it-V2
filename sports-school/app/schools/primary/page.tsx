'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StandaloneNavigation from '@/app/schools/standalone-navigation';
import {
  Zap,
  Shield,
  Star,
  Trophy,
  Book,
  Users,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

// Placeholder components for missing imports
const AssignmentList = ({
  userId,
  courseId,
  schoolTheme,
}: {
  userId: string;
  courseId: string;
  schoolTheme: string;
}) => (
  <Card>
    <CardContent className="text-center py-8">
      <div className="text-4xl mb-4">🦸‍♂️</div>
      <h3 className="text-lg font-semibold mb-2">No SuperHero Missions Yet!</h3>
      <p className="text-gray-600">Check back soon for exciting learning adventures!</p>
    </CardContent>
  </Card>
);

const GradeSummary = ({
  userId,
  courseId,
  schoolTheme,
}: {
  userId: string;
  courseId: string;
  schoolTheme: string;
}) => (
  <Card>
    <CardContent className="text-center py-8">
      <div className="text-4xl mb-4">🏆</div>
      <h3 className="text-lg font-semibold mb-2">Grade Summary</h3>
      <p className="text-gray-600">Your superhero progress will appear here!</p>
    </CardContent>
  </Card>
);

export default function PrimarySchoolPage() {
  const [selectedGrade, setSelectedGrade] = useState('K');

  const gradePrograms = {
    K: {
      name: 'Kindergarten Heroes',
      description: 'Building foundational superpowers',
      subjects: ['Number Magic', 'Letter Adventures', 'Science Discovery', 'Art Expression'],
    },
    '1': {
      name: 'First Grade Champions',
      description: 'Reading and math adventures begin',
      subjects: ['Math Adventures', 'Reading Heroes', 'Nature Explorers', 'Creative Arts'],
    },
    '2': {
      name: 'Second Grade Defenders',
      description: 'Expanding knowledge and skills',
      subjects: ['Number Superheroes', 'Story Champions', 'Science Investigators', 'Music Magic'],
    },
    '3': {
      name: 'Third Grade Guardians',
      description: 'Mastering core concepts',
      subjects: ['Math Masters', 'Reading Legends', 'Science Detectives', 'Drama Fun'],
    },
    '4': {
      name: 'Fourth Grade Warriors',
      description: 'Advanced problem solving',
      subjects: ['Advanced Math', 'Literature Heroes', 'Earth Science', 'Digital Arts'],
    },
    '5': {
      name: 'Fifth Grade Leaders',
      description: 'Preparing for middle school',
      subjects: ['Pre-Algebra', 'Classic Literature', 'Physical Science', 'Theater Arts'],
    },
    '6': {
      name: 'Sixth Grade Legends',
      description: 'Transition to advanced learning',
      subjects: ['Algebra Prep', 'Advanced Reading', 'Life Science', 'Performance Arts'],
    },
  };

  const neurodivergentSupports = [
    {
      type: 'ADHD Support',
      icon: <Zap className="h-5 w-5" />,
      features: ['Movement breaks', 'Fidget tools', 'Visual schedules', 'Shortened tasks'],
    },
    {
      type: 'Dyslexia Support',
      icon: <Book className="h-5 w-5" />,
      features: ['Audio support', 'Dyslexia fonts', 'Reading overlays', 'Phonics games'],
    },
    {
      type: 'Autism Support',
      icon: <Shield className="h-5 w-5" />,
      features: ['Predictable routines', 'Social stories', 'Sensory breaks', 'Clear expectations'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <StandaloneNavigation
        schoolPath="/schools/primary"
        schoolName="Primary SuperHero School"
        schoolTheme="SuperHero Learning Adventure (K-6)"
        gradeLevel="Kindergarten - 6th Grade"
        themeColor="from-red-500 to-orange-500"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Primary SuperHero School
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where every child discovers their unique superpowers through personalized learning
            adventures
          </p>
        </div>

        {/* Grade Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Choose Your Grade Level</CardTitle>
            <CardDescription>
              Select your grade to see your personalized superhero learning program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(gradePrograms).map(([grade, program]) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? 'default' : 'outline'}
                  className={`h-20 flex flex-col ${selectedGrade === grade ? 'bg-red-500 text-white' : ''}`}
                  onClick={() => setSelectedGrade(grade)}
                >
                  <span className="text-lg font-bold">Grade {grade}</span>
                  <span className="text-sm">{program.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Grade Program */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span>{gradePrograms[selectedGrade].name}</span>
            </CardTitle>
            <CardDescription>{gradePrograms[selectedGrade].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gradePrograms[selectedGrade].subjects.map((subject) => (
                <Card key={subject} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{subject}</h4>
                    <Progress value={Math.floor(Math.random() * 100)} className="mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Neurodivergent Support Systems */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Neurodivergent Support Systems</span>
            </CardTitle>
            <CardDescription>
              Specialized accommodations and tools for every type of learner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {neurodivergentSupports.map((support) => (
                <Card key={support.type} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      {support.icon}
                      <span>{support.type}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {support.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Tabs */}
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-6">
            <AssignmentList userId="1" courseId="1" schoolTheme="superhero" />
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <GradeSummary userId="1" courseId="1" schoolTheme="superhero" />
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Superhero-Themed Learning Adventures</CardTitle>
                <CardDescription>
                  Every lesson is an adventure where students develop their academic superpowers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Math Adventures</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Number Hero Training (Basic Operations)</li>
                      <li>• Geometry Guardian Missions</li>
                      <li>• Fraction Fighter Challenges</li>
                      <li>• Problem-Solving Superhero Quests</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Reading Heroes</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Phonics Power Training</li>
                      <li>• Comprehension Champion Missions</li>
                      <li>• Vocabulary Vigilante Adventures</li>
                      <li>• Creative Writing Hero Stories</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Learning Technology</CardTitle>
                <CardDescription>
                  Advanced technology that adapts to each child's unique learning style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold">AI Tutor</h4>
                    <p className="text-sm text-gray-600">Personalized learning companion</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">Adaptive Content</h4>
                    <p className="text-sm text-gray-600">Adjusts to learning pace</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <h4 className="font-semibold">Achievement System</h4>
                    <p className="text-sm text-gray-600">Motivating progress tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Game-Based Assessment</CardTitle>
                <CardDescription>
                  Fun, stress-free ways to measure and track student progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Hero Missions: Project-based assessments disguised as adventures</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>
                      Power-Up Challenges: Skill-building mini-games with immediate feedback
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Portfolio Powers: Digital showcase of student work and growth</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Team Trials: Collaborative assessments promoting peer learning</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Support Network</CardTitle>
                <CardDescription>
                  Every hero needs a support team - we provide comprehensive assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Student Support
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Individual learning plans</li>
                      <li>• Peer mentoring programs</li>
                      <li>• Emotional regulation tools</li>
                      <li>• Social skills development</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Family Support
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Parent training workshops</li>
                      <li>• Home learning resources</li>
                      <li>• Regular progress conferences</li>
                      <li>• 24/7 support hotline</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Student Access Portal */}
        <Card className="mb-8 border-2 border-blue-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-slate-900">
              Student Learning Portal
            </CardTitle>
            <CardDescription className="text-center text-slate-700">
              Access your personalized superhero learning dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-400 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900">Student Dashboard</h3>
                  <p className="text-sm text-slate-800 mb-4">
                    Access your courses, progress, and achievements
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => (window.location.href = '/schools/primary/student-dashboard')}
                  >
                    🦸‍♂️ Enter SuperHero Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900">AI Tutor Chat</h3>
                  <p className="text-sm text-slate-800 mb-4">
                    Get help from Dean Wonder, your AI superhero tutor
                  </p>
                  <Button
                    className="w-full border-2 border-green-400 text-slate-900 hover:bg-green-50"
                    variant="outline"
                    onClick={() => (window.location.href = '/dashboard')}
                  >
                    🤖 Chat with Dean Wonder
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900">Sensory Breaks</h3>
                  <p className="text-sm text-slate-800 mb-4">
                    Take personalized breaks to stay focused and regulated
                  </p>
                  <Button
                    className="w-full border-2 border-purple-400 text-slate-900 hover:bg-purple-50"
                    variant="outline"
                    onClick={() => (window.location.href = '/dashboard')}
                  >
                    🧘‍♂️ Take a Break
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Learning Tools */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span>Quick Learning Tools</span>
            </CardTitle>
            <CardDescription>Jump right into your superhero learning adventures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col border-2 border-blue-300 text-slate-900 hover:bg-blue-50"
                onClick={() => (window.location.href = '/dashboard')}
              >
                <BookOpen className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm">📚 My Courses</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col"
                onClick={() => (window.location.href = '/assignments')}
              >
                <Target className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm">Assignments</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col"
                onClick={() => (window.location.href = '/progress')}
              >
                <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm">My Progress</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col"
                onClick={() => (window.location.href = '/achievements')}
              >
                <Trophy className="h-6 w-6 mb-2 text-yellow-600" />
                <span className="text-sm">Achievements</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Unleash Your Child's Superpowers?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the SuperHero School where every child discovers their unique learning abilities
              and thrives
            </p>
            <div className="space-x-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => (window.location.href = '/register')}
              >
                Schedule Tour
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => (window.location.href = '/apply')}
              >
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
