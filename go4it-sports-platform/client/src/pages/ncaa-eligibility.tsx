import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EligibilityCalculator from "@/components/ncaa/eligibility-calculator";
import { StarDisplay, getStarRatingFromGAR } from "@/components/gar/star-rating-system";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Users,
  Star
} from "lucide-react";

export default function NCAAEligibility() {
  const { user } = useAuth();
  
  const { data: garScores } = useQuery({
    queryKey: [`/api/gar-scores/${(user as any)?.id}`],
    enabled: !!(user as any)?.id,
  });

  const { data: academicRecord } = useQuery({
    queryKey: [`/api/academic/${(user as any)?.id}`],
    enabled: !!(user as any)?.id,
  });

  const scores = garScores || [];
  const latestScore = scores[0];
  const currentGAR = latestScore?.overallScore || 0;

  // Sample student athlete profiles with NCAA eligibility status
  const studentProfiles = [
    {
      id: "1",
      name: "Emma Rodriguez",
      sport: "Basketball",
      garScore: 78.5,
      gpa: 3.7,
      satScore: 1250,
      coreGPA: 3.6,
      coreCourses: 16,
      eligibilityStatus: "eligible",
      division: "D1",
      avatar: "ER",
      gradientFrom: "from-green-500",
      gradientTo: "to-blue-500"
    },
    {
      id: "2", 
      name: "Marcus Thompson",
      sport: "Football",
      garScore: 65.2,
      gpa: 3.2,
      satScore: 1100,
      coreGPA: 3.1,
      coreCourses: 14,
      eligibilityStatus: "needs_improvement",
      division: "D2",
      avatar: "MT",
      gradientFrom: "from-orange-500",
      gradientTo: "to-red-500"
    },
    {
      id: "3",
      name: "Sofia Chen",
      sport: "Soccer",
      garScore: 82.3,
      gpa: 3.9,
      satScore: 1380,
      coreGPA: 3.8,
      coreCourses: 18,
      eligibilityStatus: "eligible",
      division: "D1",
      avatar: "SC",
      gradientFrom: "from-purple-500",
      gradientTo: "to-pink-500"
    }
  ];

  const getEligibilityColor = (status: string) => {
    switch (status) {
      case "eligible": return "text-green-600 bg-green-100";
      case "needs_improvement": return "text-orange-600 bg-orange-100";
      case "not_eligible": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getEligibilityIcon = (status: string) => {
    switch (status) {
      case "eligible": return CheckCircle;
      case "needs_improvement": return AlertTriangle;
      case "not_eligible": return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <GraduationCap className="w-8 h-8" />
          NCAA Eligibility Center
        </h1>
        <p className="text-slate-300 text-lg">
          Track academic progress and ensure NCAA eligibility for college athletics
        </p>
      </div>

      {/* Current User Status */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="go4it-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500/20 rounded-lg p-3">
                  <Star className="text-blue-500 h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{currentGAR}</h3>
              <p className="text-slate-300 text-sm mb-3">Current GAR Score</p>
              <StarDisplay rating={currentGAR} size="sm" />
            </CardContent>
          </Card>

          <Card className="go4it-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500/20 rounded-lg p-3">
                  <BookOpen className="text-green-500 h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {academicRecord?.gpa || "N/A"}
              </h3>
              <p className="text-slate-300 text-sm mb-3">Current GPA</p>
            </CardContent>
          </Card>

          <Card className="go4it-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/20 rounded-lg p-3">
                  <Trophy className="text-purple-500 h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {academicRecord?.creditsCompleted || 0}
              </h3>
              <p className="text-slate-300 text-sm mb-3">Credits Completed</p>
            </CardContent>
          </Card>

          <Card className="go4it-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500/20 rounded-lg p-3">
                  <Calendar className="text-yellow-500 h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {academicRecord?.graduationYear || 2026}
              </h3>
              <p className="text-slate-300 text-sm mb-3">Graduation Year</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700 mb-8">
          <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <GraduationCap className="w-4 h-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Users className="w-4 h-4" />
            Student Profiles
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <BookOpen className="w-4 h-4" />
            Requirements
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Target className="w-4 h-4" />
            Academic Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <EligibilityCalculator />
        </TabsContent>

        <TabsContent value="profiles" className="mt-6">
          <div className="space-y-6">
            <Card className="go4it-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Student Athlete Profiles
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {studentProfiles.map((profile) => {
                  const starRating = getStarRatingFromGAR(profile.garScore);
                  const StatusIcon = getEligibilityIcon(profile.eligibilityStatus);
                  
                  return (
                    <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${profile.gradientFrom} ${profile.gradientTo} rounded-full flex items-center justify-center text-white font-bold`}>
                              {profile.avatar}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{profile.name}</h3>
                              <p className="text-gray-600 text-sm">{profile.sport}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEligibilityColor(profile.eligibilityStatus)}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {profile.eligibilityStatus.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* GAR Score & Stars */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">{profile.garScore}</div>
                              <div className="text-xs text-gray-500">GAR Score</div>
                            </div>
                            <div className="text-right">
                              <StarDisplay rating={profile.garScore} size="sm" />
                              <div className="text-xs text-gray-500 mt-1">{starRating.title}</div>
                            </div>
                          </div>

                          {/* Academic Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold">{profile.gpa}</div>
                              <div className="text-xs text-gray-600">GPA</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold">{profile.coreGPA}</div>
                              <div className="text-xs text-gray-600">Core GPA</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold">{profile.satScore}</div>
                              <div className="text-xs text-gray-600">SAT Score</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold">{profile.coreCourses}</div>
                              <div className="text-xs text-gray-600">Core Courses</div>
                            </div>
                          </div>

                          {/* Target Division */}
                          <div className="text-center">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              profile.division === 'D1' ? 'bg-gold-100 text-gold-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              <Trophy className="w-4 h-4 mr-1" />
                              Division {profile.division}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="text-center p-6">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm text-gray-600">Eligible Students</div>
                </Card>
                <Card className="text-center p-6">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-gray-600">Needs Improvement</div>
                </Card>
                <Card className="text-center p-6">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">75.3</div>
                  <div className="text-sm text-gray-600">Average GAR Score</div>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  division: "Division I",
                  minGPA: 2.3,
                  coreCourses: 16,
                  subjects: {
                    English: 4,
                    Math: 3,
                    Science: 2,
                    "Social Studies": 2,
                    Additional: 5
                  },
                  testScores: "SAT: 400+ | ACT: 37+",
                  sliding: true
                },
                {
                  division: "Division II", 
                  minGPA: 2.2,
                  coreCourses: 16,
                  subjects: {
                    English: 3,
                    Math: 2,
                    Science: 2,
                    "Social Studies": 2,
                    Additional: 7
                  },
                  testScores: "SAT: 400+ | ACT: 37+",
                  sliding: false
                },
                {
                  division: "Division III",
                  minGPA: 0,
                  coreCourses: 0,
                  subjects: {},
                  testScores: "No minimum",
                  sliding: false
                }
              ].map((div, index) => (
                <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-gold-500" />
                      {div.division}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium">Minimum Core GPA</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {div.minGPA > 0 ? div.minGPA : 'No minimum'}
                        </div>
                      </div>
                      
                      {div.coreCourses > 0 && (
                        <div>
                          <div className="font-medium mb-2">Core Courses Required: {div.coreCourses}</div>
                          <div className="space-y-1 text-sm">
                            {Object.entries(div.subjects).map(([subject, count]) => (
                              <div key={subject} className="flex justify-between">
                                <span>{subject}:</span>
                                <span className="font-medium">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="font-medium">Test Scores</div>
                        <div className="text-sm">{div.testScores}</div>
                        {div.sliding && (
                          <div className="text-xs text-gray-600 mt-1">
                            *Sliding scale with GPA
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Four-Year Academic Planning Guide</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Freshman & Sophomore Years",
                      icon: BookOpen,
                      color: "text-blue-500",
                      items: [
                        "Focus on core academic courses",
                        "Maintain strong GPA (3.0+)",
                        "Begin understanding NCAA requirements",
                        "Start developing study habits",
                        "Track athletic progress with GAR scoring"
                      ]
                    },
                    {
                      title: "Junior & Senior Years",
                      icon: Trophy,
                      color: "text-green-500", 
                      items: [
                        "Complete all core course requirements",
                        "Take SAT/ACT multiple times if needed",
                        "Register with NCAA Eligibility Center",
                        "Apply to colleges and for athletic aid",
                        "Maintain high GAR scores for recruitment"
                      ]
                    }
                  ].map((section, index) => (
                    <Card key={index} className="border-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <section.icon className={`w-5 h-5 ${section.color}`} />
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Important Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Register with NCAA Eligibility Center during junior year</li>
                    <li>• Maintain strong GAR scores to attract college recruiters</li>
                    <li>• Only NCAA-approved courses count toward core requirements</li>
                    <li>• Test scores and GPA work on sliding scale for D1 and D2</li>
                    <li>• International students have additional requirements</li>
                    <li>• Use Go4It Sports platform to track both athletic and academic progress</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}