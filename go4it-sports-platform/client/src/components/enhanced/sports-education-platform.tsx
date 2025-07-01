import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Video, 
  Users, 
  Brain, 
  Target, 
  Award,
  Clock,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Calendar,
  PlayCircle
} from "lucide-react";

interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  progress: number;
  type: 'video' | 'interactive' | 'assessment' | 'live';
}

interface EducationPlatformProps {
  userId: number;
}

export default function SportsEducationPlatform({ userId }: EducationPlatformProps) {
  const currentCourses = [
    {
      id: 1,
      title: "Mental Performance Training",
      category: "Psychology",
      instructor: "Dr. Sarah Chen",
      progress: 65,
      totalModules: 12,
      completedModules: 8,
      nextSession: "Tomorrow, 3:00 PM",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "Biomechanics & Movement Analysis",
      category: "Physical Science",
      instructor: "Coach Mike Rodriguez",
      progress: 40,
      totalModules: 15,
      completedModules: 6,
      nextSession: "Friday, 2:00 PM",
      difficulty: "Advanced"
    },
    {
      id: 3,
      title: "Nutrition for Peak Performance",
      category: "Health & Wellness",
      instructor: "Lisa Thompson, RD",
      progress: 85,
      totalModules: 8,
      completedModules: 7,
      nextSession: "Monday, 11:00 AM",
      difficulty: "Beginner"
    }
  ];

  const upcomingModules: CourseModule[] = [
    {
      id: "1",
      title: "Visualization Techniques for Game Day",
      description: "Learn advanced mental imagery for performance enhancement",
      duration: "45 min",
      completed: false,
      progress: 0,
      type: "video"
    },
    {
      id: "2", 
      title: "Force Production Analysis",
      description: "Interactive biomechanics lab session",
      duration: "60 min",
      completed: false,
      progress: 0,
      type: "interactive"
    },
    {
      id: "3",
      title: "Recovery Nutrition Assessment",
      description: "Test your knowledge of post-workout nutrition",
      duration: "30 min",
      completed: false,
      progress: 0,
      type: "assessment"
    }
  ];

  const liveEvents = [
    {
      id: 1,
      title: "Q&A with Former Pro Athletes",
      host: "Marcus Johnson & Emma Rodriguez",
      time: "Today, 7:00 PM EST",
      attendees: 234,
      topic: "Overcoming Performance Anxiety"
    },
    {
      id: 2,
      title: "Scholarship Workshop",
      host: "College Recruiting Team",
      time: "Saturday, 2:00 PM EST",
      attendees: 156,
      topic: "NCAA Eligibility & Application Process"
    }
  ];

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'interactive': return Brain;
      case 'assessment': return Target;
      case 'live': return Users;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Dashboard */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">3</div>
              <p className="text-slate-400 text-sm">Active Courses</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">21</div>
              <p className="text-slate-400 text-sm">Modules Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">47</div>
              <p className="text-slate-400 text-sm">Learning Hours</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">5</div>
              <p className="text-slate-400 text-sm">Certificates Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Current Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentCourses.map((course) => (
              <div key={course.id} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{course.title}</h4>
                    <p className="text-slate-400 text-sm mb-2">Instructor: {course.instructor}</p>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">{course.progress}%</div>
                    <p className="text-xs text-slate-400">{course.completedModules}/{course.totalModules} modules</p>
                  </div>
                </div>
                
                <Progress value={course.progress} className="mb-4 h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    Next: {course.nextSession}
                  </div>
                  <Button variant="outline" size="sm" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                    Continue Learning
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Up Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingModules.map((module) => {
              const IconComponent = getModuleIcon(module.type);
              return (
                <div key={module.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700 achievement-glow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-cyan-400/20 rounded-lg p-2">
                      <IconComponent className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-white text-sm mb-1">{module.title}</h5>
                      <p className="text-xs text-slate-400 mb-2">{module.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {module.duration}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full neon-glow text-xs">
                    <PlayCircle className="w-3 h-3 mr-2" />
                    Start Module
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Live Events & Workshops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveEvents.map((event) => (
              <div key={event.id} className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                    <p className="text-sm text-slate-400 mb-2">Hosted by {event.host}</p>
                    <p className="text-xs text-purple-400">{event.topic}</p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Live
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{event.time}</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees} attending
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400/10">
                    Join Event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Learning Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/30 border-green-500/30 achievement-glow">
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Mental Training</h4>
            <p className="text-sm text-slate-400 mb-4">Daily mindfulness and focus exercises</p>
            <Button variant="outline" size="sm" className="border-green-400 text-green-400 hover:bg-green-400/10">
              Start Session
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-orange-500/30 achievement-glow">
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Study Groups</h4>
            <p className="text-sm text-slate-400 mb-4">Connect with peers for collaborative learning</p>
            <Button variant="outline" size="sm" className="border-orange-400 text-orange-400 hover:bg-orange-400/10">
              Find Groups
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-blue-500/30 achievement-glow">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="font-semibold text-white mb-2">Ask Experts</h4>
            <p className="text-sm text-slate-400 mb-4">Get answers from certified trainers</p>
            <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
              Ask Question
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}