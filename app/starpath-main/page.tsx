'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  PlayCircle, 
  CheckCircle, 
  Lock,
  ArrowRight,
  BarChart3,
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Brain
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// StarPath Level Configuration
const STARPATH_LEVELS = [
  {
    level: 1,
    name: "Rookie",
    description: "Building fundamental skills",
    color: "bg-slate-600",
    textColor: "text-slate-300",
    garRange: "0-40",
    requirements: ["Basic movement patterns", "Fundamental techniques", "Fitness baseline"]
  },
  {
    level: 2,
    name: "Developing",
    description: "Improving core abilities", 
    color: "bg-blue-600",
    textColor: "text-blue-300",
    garRange: "41-55",
    requirements: ["Consistent technique", "Improved conditioning", "Game understanding"]
  },
  {
    level: 3,
    name: "Competitive",
    description: "High school varsity level",
    color: "bg-green-600", 
    textColor: "text-green-300",
    garRange: "56-70",
    requirements: ["Advanced skills", "Leadership qualities", "Strategic thinking"]
  },
  {
    level: 4,
    name: "Elite",
    description: "College recruitment ready",
    color: "bg-purple-600",
    textColor: "text-purple-300", 
    garRange: "71-85",
    requirements: ["College-level performance", "Mental toughness", "Recruitment portfolio"]
  },
  {
    level: 5,
    name: "All-Star",
    description: "Division I scholarship level",
    color: "bg-yellow-600",
    textColor: "text-yellow-300",
    garRange: "86-100",
    requirements: ["Elite performance", "Leadership impact", "Scholarship offers"]
  }
]

export default function StarPathMainPage() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState(2)
  const [garScore, setGarScore] = useState(52)
  const [completedDrills, setCompletedDrills] = useState(12)
  const [totalDrills, setTotalDrills] = useState(25)
  const [weeklyProgress, setWeeklyProgress] = useState(68)

  // Get current level info
  const currentLevelInfo = STARPATH_LEVELS[currentLevel - 1]
  const nextLevelInfo = STARPATH_LEVELS[currentLevel] || null

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold">StarPath</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Your gamified journey from beginner to 5-star athlete. Complete AI-generated drills, 
            track real workouts, and advance through levels toward college recruitment.
          </p>
        </div>

        {/* Current Status Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${currentLevelInfo.color} mr-2`}></div>
                <span className="text-2xl font-bold">{currentLevelInfo.name}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{currentLevelInfo.description}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">GAR Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{garScore}</div>
              <p className="text-sm text-slate-400">Range: {currentLevelInfo.garRange}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{completedDrills}/{totalDrills}</div>
              <Progress value={(completedDrills / totalDrills) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{weeklyProgress}%</div>
              <Progress value={weeklyProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* StarPath Progression Visual */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Your StarPath Journey
            </CardTitle>
            <CardDescription>
              Progress through 5 levels to become an elite athlete ready for college recruitment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-8 right-8 h-1 bg-slate-700 rounded"></div>
              <div 
                className="absolute top-8 left-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded transition-all duration-1000"
                style={{ width: `${((currentLevel - 1) / 4) * 100}%` }}
              ></div>

              {/* Level Nodes */}
              <div className="flex justify-between relative z-10">
                {STARPATH_LEVELS.map((level, index) => {
                  const isCompleted = level.level < currentLevel
                  const isCurrent = level.level === currentLevel
                  const isLocked = level.level > currentLevel

                  return (
                    <div key={level.level} className="flex flex-col items-center">
                      {/* Node Circle */}
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300
                        ${isCompleted ? `${level.color} border-transparent` : ''}
                        ${isCurrent ? `${level.color} border-white shadow-lg` : ''}
                        ${isLocked ? 'bg-slate-700 border-slate-600' : ''}
                      `}>
                        {isCompleted && <CheckCircle className="w-6 h-6 text-white" />}
                        {isCurrent && <Star className="w-6 h-6 text-white" />}
                        {isLocked && <Lock className="w-6 h-6 text-slate-400" />}
                      </div>

                      {/* Level Info */}
                      <div className="text-center mt-3 max-w-24">
                        <div className={`font-semibold ${isCurrent ? level.textColor : 'text-slate-400'}`}>
                          {level.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          GAR {level.garRange}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="training" className="data-[state=active]:bg-blue-600">
              <Target className="w-4 h-4 mr-2" />
              Training Hub
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-green-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Progress Tracking
            </TabsTrigger>
            <TabsTrigger value="college-path" className="data-[state=active]:bg-purple-600">
              <GraduationCap className="w-4 h-4 mr-2" />
              College Path
            </TabsTrigger>
          </TabsList>

          {/* Training Hub */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Drill Plan */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-400" />
                    Today's AI Training Plan
                  </CardTitle>
                  <CardDescription>
                    Personalized drills for Level {currentLevel} advancement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Ball Handling Fundamentals</h4>
                        <p className="text-sm text-slate-400">15 minutes • Skill Development</p>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Shooting Form Analysis</h4>
                        <p className="text-sm text-slate-400">20 minutes • Video Required</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg opacity-50">
                      <div>
                        <h4 className="font-semibold">Agility Ladder Work</h4>
                        <p className="text-sm text-slate-400">10 minutes • Conditioning</p>
                      </div>
                      <Badge variant="secondary">Locked</Badge>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Generate New Workout Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Achievement System */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>
                    Unlock badges as you progress through StarPath
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300">Consistency King</h4>
                        <p className="text-xs text-slate-400">7 days of training in a row</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-300">Skill Builder</h4>
                        <p className="text-xs text-slate-400">Improved GAR by 5 points</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-slate-700 rounded-lg opacity-50">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center mr-3">
                        <Trophy className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-400">Level Up!</h4>
                        <p className="text-xs text-slate-500">Reach Level 3 • 13 drills remaining</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tracking */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track your improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Shooting Accuracy</span>
                        <span className="text-green-400">+8% this week</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Ball Handling</span>
                        <span className="text-blue-400">+12% this week</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fitness Level</span>
                        <span className="text-purple-400">+5% this week</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>

                  <Button className="w-full mt-4" onClick={() => router.push('/gar-upload')}>
                    Upload New Performance Video
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Workout History</CardTitle>
                  <CardDescription>Your recent training sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Ball Handling Session</h4>
                        <p className="text-sm text-slate-400">Today • 25 minutes</p>
                      </div>
                      <Badge className="bg-green-600">Completed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Shooting Practice</h4>
                        <p className="text-sm text-slate-400">Yesterday • 30 minutes</p>
                      </div>
                      <Badge className="bg-green-600">Completed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Agility Training</h4>
                        <p className="text-sm text-slate-400">2 days ago • 20 minutes</p>
                      </div>
                      <Badge className="bg-green-600">Completed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* College Path */}
          <TabsContent value="college-path" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-purple-400" />
                    NCAA Recruitment Status
                  </CardTitle>
                  <CardDescription>
                    Your progress toward college recruitment eligibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Academic Eligibility</span>
                      <Badge className="bg-green-600">On Track</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Performance Level</span>
                      <Badge className="bg-blue-600">Level {currentLevel}/5</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Highlight Reel</span>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Coach Contacts</span>
                      <Badge variant="outline">3 Interested</Badge>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    Access College Path Tools
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-orange-400" />
                    Scholarship Opportunities
                  </CardTitle>
                  <CardDescription>
                    Potential scholarships based on your current level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-lg">
                      <h4 className="font-semibold text-purple-300">Division II Prospects</h4>
                      <p className="text-sm text-slate-400">12 schools showing interest</p>
                      <div className="text-xs text-slate-500 mt-1">Reach Level 3 for more opportunities</div>
                    </div>

                    <div className="p-3 bg-slate-700 rounded-lg opacity-50">
                      <h4 className="font-semibold text-slate-400">Division I Prospects</h4>
                      <p className="text-sm text-slate-500">Requires Level 4+ performance</p>
                      <div className="text-xs text-slate-600 mt-1">Continue training to unlock</div>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    View All Opportunities
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Next Steps CTA */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-800 mt-12">
          <CardHeader>
            <CardTitle className="text-center">Ready to Level Up?</CardTitle>
            <CardDescription className="text-center">
              Complete {totalDrills - completedDrills} more drills to advance to Level {currentLevel + 1}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Today's Training
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                View Training Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}