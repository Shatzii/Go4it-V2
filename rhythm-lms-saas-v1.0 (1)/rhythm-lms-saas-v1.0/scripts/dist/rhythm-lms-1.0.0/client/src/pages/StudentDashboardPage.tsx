import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import ProgressTracker from '@/components/shared/ProgressTracker';

// Student Dashboard Page
// This is the main dashboard for students to view their progress, achievements,
// and learning path, styled with superhero themes
const StudentDashboardPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const params = useParams();
  
  // Mock studentId (in production this would come from auth context)
  const studentId = params.id || '1';
  const [selectedTheme, setSelectedTheme] = useState<string>('focus-force');
  
  // Fetch student data
  const { data: student, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['/api/students', studentId],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch student progress
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/students', studentId, 'progress'],
    staleTime: 30000, // 30 seconds
  });
  
  // Fetch student achievements
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['/api/students', studentId, 'achievements'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch student's curriculum path
  const { data: curriculumPath, isLoading: isLoadingCurriculum } = useQuery({
    queryKey: ['/api/students', studentId, 'curriculum-paths'],
    staleTime: 60000, // 1 minute
  });
  
  // Get student name (with fallback for loading state)
  const studentName = student && typeof student === 'object' && 'firstName' in student && 'lastName' in student 
    ? `${student.firstName} ${student.lastName}` : 'Student';
  
  // Get superhero identity (with fallback)
  const superheroIdentity = student && typeof student === 'object' && 'superheroIdentity' in student
    ? student.superheroIdentity : 'Learning Hero';
  
  // Get state code (with fallback)
  const stateCode = student && typeof student === 'object' && 'stateCode' in student
    ? student.stateCode : 'TX';
  
  // Format progress data for progress tracker
  const getProgressItems = () => {
    if (!progress || !Array.isArray(progress) || progress.length === 0) {
      return [];
    }
    
    return progress.map((item: any) => ({
      id: item.id.toString(),
      name: item.objectiveTitle || item.standardTitle || 'Learning Objective',
      progress: item.masteryLevel || 0,
      status: item.status,
      category: item.subject,
      superheroTheme: selectedTheme,
    }));
  };
  
  // Format achievements for display
  const getAchievements = () => {
    if (!achievements || achievements.length === 0) {
      return [];
    }
    
    return achievements.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      icon: item.iconUrl,
      earnedDate: new Date(item.earnedDate).toLocaleDateString(),
      type: item.category,
    }));
  };
  
  // Get upcoming activities
  const getUpcomingActivities = () => {
    if (!curriculumPath || !curriculumPath.length) {
      return [];
    }
    
    // Use the first curriculum path (in a real app, would get the active one)
    const path = curriculumPath[0];
    
    if (!path.units || typeof path.units !== 'string') {
      return [];
    }
    
    // Parse units from JSON string
    try {
      const units = JSON.parse(path.units);
      
      // Extract activities from units
      let activities: any[] = [];
      if (Array.isArray(units)) {
        units.forEach((unit: any) => {
          if (unit.activities && Array.isArray(unit.activities)) {
            activities = [
              ...activities,
              ...unit.activities.map((activity: any) => ({
                id: activity.id,
                title: activity.title,
                type: activity.type,
                duration: activity.duration,
                subject: unit.subject,
                dueDate: activity.dueDate,
              }))
            ];
          }
        });
      }
      
      // Sort by due date and take first 5
      return activities
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error parsing curriculum path units:', error);
      return [];
    }
  };
  
  // Helper function to get theme colors
  const getThemeColors = () => {
    switch (selectedTheme) {
      case 'focus-force':
        return {
          primary: 'from-purple-600 to-indigo-700',
          secondary: 'text-purple-500',
          accent: 'bg-purple-600',
          icon: 'text-purple-400',
        };
      case 'pattern-pioneers':
        return {
          primary: 'from-blue-600 to-cyan-700',
          secondary: 'text-blue-500',
          accent: 'bg-blue-600',
          icon: 'text-blue-400',
        };
      case 'sensory-squad':
        return {
          primary: 'from-teal-600 to-emerald-700',
          secondary: 'text-teal-500',
          accent: 'bg-teal-600',
          icon: 'text-teal-400',
        };
      case 'vision-voyagers':
        return {
          primary: 'from-orange-600 to-amber-700',
          secondary: 'text-orange-500',
          accent: 'bg-orange-600',
          icon: 'text-orange-400',
        };
      default:
        return {
          primary: 'from-indigo-600 to-violet-700',
          secondary: 'text-indigo-500',
          accent: 'bg-indigo-600',
          icon: 'text-indigo-400',
        };
    }
  };
  
  const themeColors = getThemeColors();
  
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Hero Header with Student Info */}
      <header className={`bg-gradient-to-r ${themeColors.primary} py-12 px-4 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-40 left-40 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center">
            <div className="mr-6">
              {student?.avatarUrl ? (
                <img 
                  src={student.avatarUrl} 
                  alt={studentName} 
                  className="w-24 h-24 rounded-full border-4 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-dark-800 border-4 border-white/20 flex items-center justify-center">
                  <i className="ri-user-6-line text-4xl text-gray-400"></i>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-1">{studentName}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <i className="ri-superhero-line mr-1"></i>
                  <span>{superheroIdentity}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/20" />
                <div className="flex items-center">
                  <i className="ri-map-pin-line mr-1"></i>
                  <span>{stateCode}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-white/20" />
                <div className="flex items-center">
                  <i className="ri-book-line mr-1"></i>
                  <span>Grade {student?.gradeLevel || 'K-12'}</span>
                </div>
              </div>
            </div>
            
            <div className="ml-auto flex gap-2">
              <Button 
                variant="ghost" 
                className="bg-white/10 hover:bg-white/20 border border-white/10"
                onClick={() => setLocation(`/profile/${studentId}`)}
              >
                <i className="ri-user-settings-line mr-1"></i>
                Edit Profile
              </Button>
            </div>
          </div>
          
          {/* Theme Selector */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm text-white/70">Superhero Theme:</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-full w-8 h-8 p-0 flex items-center justify-center ${
                  selectedTheme === 'focus-force' ? 'bg-white/20' : 'bg-white/5'
                }`}
                onClick={() => setSelectedTheme('focus-force')}
              >
                <div className="w-5 h-5 rounded-full bg-purple-500"></div>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-full w-8 h-8 p-0 flex items-center justify-center ${
                  selectedTheme === 'pattern-pioneers' ? 'bg-white/20' : 'bg-white/5'
                }`}
                onClick={() => setSelectedTheme('pattern-pioneers')}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500"></div>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-full w-8 h-8 p-0 flex items-center justify-center ${
                  selectedTheme === 'sensory-squad' ? 'bg-white/20' : 'bg-white/5'
                }`}
                onClick={() => setSelectedTheme('sensory-squad')}
              >
                <div className="w-5 h-5 rounded-full bg-teal-500"></div>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-full w-8 h-8 p-0 flex items-center justify-center ${
                  selectedTheme === 'vision-voyagers' ? 'bg-white/20' : 'bg-white/5'
                }`}
                onClick={() => setSelectedTheme('vision-voyagers')}
              >
                <div className="w-5 h-5 rounded-full bg-orange-500"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-dark-800">
              <i className="ri-dashboard-line mr-1"></i> Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-dark-800">
              <i className="ri-line-chart-line mr-1"></i> Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-dark-800">
              <i className="ri-medal-line mr-1"></i> Achievements
            </TabsTrigger>
            <TabsTrigger value="learning-path" className="data-[state=active]:bg-dark-800">
              <i className="ri-road-map-line mr-1"></i> Learning Path
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress Summary */}
              <Card className="bg-dark-800 border-dark-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <i className={`ri-line-chart-line mr-2 ${themeColors.icon}`}></i>
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingProgress ? (
                    <div className="py-6 text-center text-gray-500">
                      <i className="ri-loader-4-line animate-spin text-2xl mb-2"></i>
                      <p>Loading progress...</p>
                    </div>
                  ) : progress?.length > 0 ? (
                    <div>
                      <div className="mb-4">
                        <div className="text-3xl font-bold mb-1">
                          {Math.round(
                            progress.reduce((acc: number, curr: any) => acc + (curr.masteryLevel || 0), 0) / 
                            progress.length
                          )}%
                        </div>
                        <div className="text-sm text-gray-400">Overall Mastery</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-dark-900 rounded-md p-3">
                          <div className="text-xl font-semibold mb-1">
                            {progress.filter((p: any) => p.status === 'completed' || p.status === 'mastered').length}
                          </div>
                          <div className="text-xs text-gray-400">Completed</div>
                        </div>
                        <div className="bg-dark-900 rounded-md p-3">
                          <div className="text-xl font-semibold mb-1">
                            {progress.filter((p: any) => p.status === 'mastered').length}
                          </div>
                          <div className="text-xs text-gray-400">Mastered</div>
                        </div>
                      </div>
                      
                      <Button 
                        className={themeColors.accent}
                        onClick={() => document.querySelector('[data-value="progress"]')?.click()}
                      >
                        View Details
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <i className="ri-bar-chart-box-line text-2xl mb-2"></i>
                      <p>No progress data yet</p>
                      <Button 
                        variant="link" 
                        className={themeColors.secondary}
                        onClick={() => setLocation('/curriculum-generator')}
                      >
                        Create Learning Path
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Achievements Summary */}
              <Card className="bg-dark-800 border-dark-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <i className={`ri-medal-line mr-2 ${themeColors.icon}`}></i>
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAchievements ? (
                    <div className="py-6 text-center text-gray-500">
                      <i className="ri-loader-4-line animate-spin text-2xl mb-2"></i>
                      <p>Loading achievements...</p>
                    </div>
                  ) : achievements?.length > 0 ? (
                    <div>
                      <div className="mb-4">
                        <div className="text-3xl font-bold mb-1">
                          {achievements.length}
                        </div>
                        <div className="text-sm text-gray-400">Total Achievements</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getAchievements().slice(0, 5).map(achievement => (
                          <Badge 
                            key={achievement.id} 
                            className={`${themeColors.accent} hover:${themeColors.accent}`}
                          >
                            {achievement.name}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        className={themeColors.accent}
                        onClick={() => document.querySelector('[data-value="achievements"]')?.click()}
                      >
                        View All
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <i className="ri-award-line text-2xl mb-2"></i>
                      <p>No achievements yet</p>
                      <p className="text-xs mt-2">Complete activities to earn achievements</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Upcoming Activities */}
              <Card className="bg-dark-800 border-dark-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <i className={`ri-calendar-todo-line mr-2 ${themeColors.icon}`}></i>
                    Upcoming Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingCurriculum ? (
                    <div className="py-6 text-center text-gray-500">
                      <i className="ri-loader-4-line animate-spin text-2xl mb-2"></i>
                      <p>Loading activities...</p>
                    </div>
                  ) : getUpcomingActivities().length > 0 ? (
                    <div className="space-y-3">
                      {getUpcomingActivities().map((activity: any) => (
                        <div 
                          key={activity.id} 
                          className="bg-dark-900 rounded-md p-3 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-xs text-gray-400">{activity.subject}</div>
                          </div>
                          <div className="text-sm">
                            {new Date(activity.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        className={themeColors.accent}
                        onClick={() => document.querySelector('[data-value="learning-path"]')?.click()}
                      >
                        View All
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <i className="ri-calendar-line text-2xl mb-2"></i>
                      <p>No upcoming activities</p>
                      <Button 
                        variant="link" 
                        className={themeColors.secondary}
                        onClick={() => setLocation('/curriculum-generator')}
                      >
                        Create Learning Path
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card className="bg-dark-800 border-dark-700 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className={`ri-history-line mr-2 ${themeColors.icon}`}></i>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would be populated with actual activity data from the API */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${themeColors.accent}`}>
                      <i className="ri-edit-line text-white"></i>
                    </div>
                    <div>
                      <div className="font-medium">Completed "Introduction to Fractions" activity</div>
                      <div className="text-sm text-gray-400">Today at 10:23 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${themeColors.accent}`}>
                      <i className="ri-medal-line text-white"></i>
                    </div>
                    <div>
                      <div className="font-medium">Earned "Math Explorer" achievement</div>
                      <div className="text-sm text-gray-400">Yesterday at 3:45 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${themeColors.accent}`}>
                      <i className="ri-test-tube-line text-white"></i>
                    </div>
                    <div>
                      <div className="font-medium">Scored 85% on "Properties of Matter" quiz</div>
                      <div className="text-sm text-gray-400">2 days ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className={`ri-bar-chart-grouped-line mr-2 ${themeColors.icon}`}></i>
                      Learning Progress
                    </CardTitle>
                    <CardDescription>
                      Track your mastery of learning objectives and standards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProgress ? (
                      <div className="py-12 text-center text-gray-500">
                        <i className="ri-loader-4-line animate-spin text-3xl mb-2"></i>
                        <p>Loading progress data...</p>
                      </div>
                    ) : getProgressItems().length > 0 ? (
                      <ProgressTracker 
                        items={getProgressItems()} 
                        variant="superhero" 
                        showCategory
                        onItemClick={(item) => console.log('Clicked item:', item)}
                      />
                    ) : (
                      <div className="py-12 text-center text-gray-500">
                        <i className="ri-bar-chart-box-line text-3xl mb-2"></i>
                        <p>No progress data yet</p>
                        <p className="text-sm mt-2 max-w-md mx-auto">
                          Complete activities and assessments to track your learning progress
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-dark-800 border-dark-700 mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <i className={`ri-bar-chart-horizontal-line mr-2 ${themeColors.icon}`}></i>
                      Subject Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProgress ? (
                      <div className="py-6 text-center text-gray-500">
                        <i className="ri-loader-4-line animate-spin text-xl mb-2"></i>
                        <p>Loading...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* This would be dynamic based on actual subjects */}
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Mathematics</span>
                            <span>78%</span>
                          </div>
                          <div className="w-full bg-dark-700 h-2 rounded-full">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Science</span>
                            <span>65%</span>
                          </div>
                          <div className="w-full bg-dark-700 h-2 rounded-full">
                            <div className="bg-green-600 h-full rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Language Arts</span>
                            <span>92%</span>
                          </div>
                          <div className="w-full bg-dark-700 h-2 rounded-full">
                            <div className="bg-purple-600 h-full rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Social Studies</span>
                            <span>45%</span>
                          </div>
                          <div className="w-full bg-dark-700 h-2 rounded-full">
                            <div className="bg-orange-600 h-full rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <i className={`ri-time-line mr-2 ${themeColors.icon}`}></i>
                      Time Spent Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold mb-2">24h 35m</div>
                      <div className="text-sm text-gray-400">Total learning time</div>
                      
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-dark-900 rounded-md p-3">
                          <div className="text-xl font-medium">18</div>
                          <div className="text-xs text-gray-400">Activities</div>
                        </div>
                        <div className="bg-dark-900 rounded-md p-3">
                          <div className="text-xl font-medium">7</div>
                          <div className="text-xs text-gray-400">Assessments</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className={`ri-award-line mr-2 ${themeColors.icon}`}></i>
                      Achievement Collection
                    </CardTitle>
                    <CardDescription>
                      Your earned achievements and superhero badges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAchievements ? (
                      <div className="py-12 text-center text-gray-500">
                        <i className="ri-loader-4-line animate-spin text-3xl mb-2"></i>
                        <p>Loading achievements...</p>
                      </div>
                    ) : getAchievements().length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {getAchievements().map(achievement => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-dark-900 rounded-lg border border-dark-700 overflow-hidden"
                          >
                            <div className={`bg-gradient-to-r ${themeColors.primary} p-4 flex justify-center`}>
                              {achievement.icon ? (
                                <img 
                                  src={achievement.icon} 
                                  alt={achievement.name}
                                  className="h-16 w-16"
                                />
                              ) : (
                                <i className="ri-medal-fill text-5xl text-yellow-300"></i>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-1">{achievement.name}</h3>
                              <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{achievement.type}</span>
                                <span>Earned: {achievement.earnedDate}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-500">
                        <i className="ri-medal-line text-3xl mb-2"></i>
                        <p>No achievements yet</p>
                        <p className="text-sm mt-2 max-w-md mx-auto">
                          Complete activities and meet goals to earn achievements and unlock your superhero powers!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-dark-800 border-dark-700 mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <i className={`ri-flashlight-line mr-2 ${themeColors.icon}`}></i>
                      Superhero Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="inline-block rounded-full p-2 bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
                        <div className="bg-dark-800 rounded-full p-4">
                          <i className="ri-shield-star-line text-4xl text-indigo-400"></i>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold mb-1">Level 7</div>
                      <div className="text-sm text-gray-400 mb-3">Superhero Apprentice</div>
                      
                      <div className="w-full bg-dark-700 h-2 rounded-full mb-2">
                        <div className={`${themeColors.accent} h-full rounded-full`} style={{ width: '65%' }}></div>
                      </div>
                      <div className="text-xs text-gray-400">35 XP needed for Level 8</div>
                      
                      <Button className={`mt-4 ${themeColors.accent}`}>
                        <i className="ri-award-line mr-1"></i> View Powers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <i className={`ri-trophy-line mr-2 ${themeColors.icon}`}></i>
                      Achievement Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-dark-900 rounded-md p-3 flex justify-between">
                        <span className="text-gray-400">Total Achievements</span>
                        <span className="font-medium">{getAchievements().length || 0}</span>
                      </div>
                      
                      <div className="bg-dark-900 rounded-md p-3 flex justify-between">
                        <span className="text-gray-400">Academic</span>
                        <span className="font-medium">
                          {getAchievements().filter(a => a.type === 'academic').length || 0}
                        </span>
                      </div>
                      
                      <div className="bg-dark-900 rounded-md p-3 flex justify-between">
                        <span className="text-gray-400">Superhero</span>
                        <span className="font-medium">
                          {getAchievements().filter(a => a.type === 'superhero').length || 0}
                        </span>
                      </div>
                      
                      <div className="bg-dark-900 rounded-md p-3 flex justify-between">
                        <span className="text-gray-400">Milestone</span>
                        <span className="font-medium">
                          {getAchievements().filter(a => a.type === 'milestone').length || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Learning Path Tab */}
          <TabsContent value="learning-path" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className={`ri-road-map-line mr-2 ${themeColors.icon}`}></i>
                      Learning Journey
                    </CardTitle>
                    <CardDescription>
                      Your personalized curriculum pathway
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingCurriculum ? (
                      <div className="py-12 text-center text-gray-500">
                        <i className="ri-loader-4-line animate-spin text-3xl mb-2"></i>
                        <p>Loading learning path...</p>
                      </div>
                    ) : curriculumPath && curriculumPath.length > 0 ? (
                      <div className="relative">
                        {/* Path visualization */}
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-dark-700"></div>
                        
                        <div className="space-y-6">
                          {/* This would be dynamic based on actual curriculum path */}
                          <div className="relative flex">
                            <div className={`w-16 h-16 rounded-full ${themeColors.accent} flex items-center justify-center z-10`}>
                              <i className="ri-number-1 text-xl text-white"></i>
                            </div>
                            <div className="flex-1 ml-6 bg-dark-900 rounded-lg p-4">
                              <h3 className="text-lg font-medium mb-1">Foundations</h3>
                              <p className="text-gray-400 mb-3">Master the core concepts and skills</p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Introduction to Numbers</span>
                                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                                    Completed
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Basic Operations</span>
                                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                                    Completed
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Fractions Fundamentals</span>
                                  <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-800">
                                    In Progress
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative flex">
                            <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center z-10">
                              <i className="ri-number-2 text-xl text-gray-400"></i>
                            </div>
                            <div className="flex-1 ml-6 bg-dark-900 rounded-lg p-4">
                              <h3 className="text-lg font-medium mb-1">Intermediate Concepts</h3>
                              <p className="text-gray-400 mb-3">Build upon your foundational knowledge</p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Decimals and Percentages</span>
                                  <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                                    Locked
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Geometry Basics</span>
                                  <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                                    Locked
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Data and Graphs</span>
                                  <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                                    Locked
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative flex">
                            <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center z-10">
                              <i className="ri-number-3 text-xl text-gray-400"></i>
                            </div>
                            <div className="flex-1 ml-6 bg-dark-900 rounded-lg p-4">
                              <h3 className="text-lg font-medium mb-1">Advanced Applications</h3>
                              <p className="text-gray-400 mb-3">Apply your skills to real-world problems</p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Problem Solving</span>
                                  <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                                    Locked
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Real-World Applications</span>
                                  <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                                    Locked
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center bg-dark-800 rounded p-2">
                                  <span>Final Project</span>
                                  <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                                    Locked
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-gray-500">
                        <i className="ri-route-line text-3xl mb-2"></i>
                        <p>No learning path created yet</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-indigo-700 text-indigo-400"
                          onClick={() => setLocation('/curriculum-generator')}
                        >
                          <i className="ri-magic-line mr-1"></i> Create Learning Path
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-dark-800 border-dark-700 mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <i className={`ri-calendar-check-line mr-2 ${themeColors.icon}`}></i>
                      Upcoming Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingCurriculum ? (
                      <div className="py-6 text-center text-gray-500">
                        <i className="ri-loader-4-line animate-spin text-xl mb-2"></i>
                        <p>Loading...</p>
                      </div>
                    ) : getUpcomingActivities().length > 0 ? (
                      <div className="space-y-3">
                        {getUpcomingActivities().map((activity: any) => (
                          <div 
                            key={activity.id} 
                            className="bg-dark-900 rounded-md p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-xs text-gray-400">{activity.subject}</div>
                              </div>
                              <Badge variant="outline" className="border-gray-700 text-xs">
                                {activity.duration} min
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2">
                              <div className="text-xs text-gray-500">
                                <i className="ri-calendar-line mr-1"></i>
                                {new Date(activity.dueDate).toLocaleDateString()}
                              </div>
                              <Button size="sm" variant="ghost" className={themeColors.secondary}>
                                Start
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-gray-500">
                        <i className="ri-calendar-line text-2xl mb-2"></i>
                        <p>No upcoming activities</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-dark-800 border-dark-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <i className={`ri-lightbulb-line mr-2 ${themeColors.icon}`}></i>
                      Learning Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-dark-900 rounded-md p-3">
                        <div className="font-medium mb-1">Fraction Operations</div>
                        <div className="text-xs text-gray-400 mb-2">
                          Based on your progress in Fractions Fundamentals
                        </div>
                        <Button size="sm" variant="outline" className="w-full border-gray-700">
                          View Resource
                        </Button>
                      </div>
                      
                      <div className="bg-dark-900 rounded-md p-3">
                        <div className="font-medium mb-1">Measurement Skills</div>
                        <div className="text-xs text-gray-400 mb-2">
                          Recommended to prepare for upcoming geometry unit
                        </div>
                        <Button size="sm" variant="outline" className="w-full border-gray-700">
                          View Resource
                        </Button>
                      </div>
                      
                      <div className="bg-dark-900 rounded-md p-3">
                        <div className="font-medium mb-1">Math Vocabulary</div>
                        <div className="text-xs text-gray-400 mb-2">
                          Strengthen your math language skills
                        </div>
                        <Button size="sm" variant="outline" className="w-full border-gray-700">
                          View Resource
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboardPage;