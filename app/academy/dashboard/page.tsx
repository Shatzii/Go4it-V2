'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Users, BookOpen, Trophy, Target, TrendingUp, AlertCircle } from 'lucide-react';
import StudentDashboard from '../../../components/academy/StudentDashboard';
import TeacherDashboard from '../../../components/academy/TeacherDashboard';
import CourseDiscovery from '../../../components/academy/CourseDiscovery';
import Link from 'next/link';

interface NCAAData {
  coreGpa: number;
  totalCoreUnits: number;
  requiredCoreUnits: number;
  ncaaStatus: string;
  divisionIStatus: string;
  missingRequirements: string[];
  recommendedActions: string[];
}

interface GARData {
  avgGarScore: number;
  avgReadiness: number;
  trend: string;
  totalSessions: number;
}

export default function AcademyDashboard() {
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(true);
  const [ncaaData, setNcaaData] = useState<NCAAData | null>(null);
  const [garData, setGarData] = useState<GARData | null>(null);

  useEffect(() => {
    // Fetch user role and StarPath data
    const fetchData = async () => {
      try {
        const [roleRes, ncaaRes, garRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/starpath/ncaa/summary'),
          fetch('/api/starpath/gar/metrics?period=weekly'),
        ]);

        if (roleRes.ok) {
          const userData = await roleRes.json();
          setUserRole(userData.user?.isAdmin ? 'admin' : 'student');
        }

        if (ncaaRes.ok) {
          const ncaaJson = await ncaaRes.json();
          setNcaaData(ncaaJson.summary);
        }

        if (garRes.ok) {
          const garJson = await garRes.json();
          setGarData(garJson.current);
        }
      } catch (error) {
        // Silently fail - tiles will show default/empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
            Academy Dashboard
          </h1>
          <p className="text-slate-400">
            {userRole === 'teacher' || userRole === 'admin'
              ? 'Manage your courses and track student progress'
              : 'Access your courses and track your academic progress'}
          </p>
        </div>

        {/* StarPath + NCAA Overview Tiles (Students Only) */}
        {userRole === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* NCAA Eligibility Tile */}
            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  NCAA Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ncaaData ? (
                  <>
                    <div className="text-3xl font-bold text-white mb-2">
                      {ncaaData.coreGpa.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-400 mb-3">
                      Core GPA • {ncaaData.totalCoreUnits}/{ncaaData.requiredCoreUnits} units
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                      ncaaData.ncaaStatus === 'eligible' ? 'bg-green-500/20 text-green-400' :
                      ncaaData.ncaaStatus === 'on_track' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {ncaaData.ncaaStatus === 'eligible' && '✓ Eligible'}
                      {ncaaData.ncaaStatus === 'on_track' && '→ On Track'}
                      {ncaaData.ncaaStatus === 'at_risk' && '⚠ At Risk'}
                      {ncaaData.ncaaStatus === 'ineligible' && '✗ Action Needed'}
                    </div>
                    {ncaaData.missingRequirements.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Missing:</div>
                        <div className="text-xs text-slate-300">
                          {ncaaData.missingRequirements[0]}
                          {ncaaData.missingRequirements.length > 1 && ` + ${ncaaData.missingRequirements.length - 1} more`}
                        </div>
                      </div>
                    )}
                    <Link href="/dashboard/starpath">
                      <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                        View Full StarPath
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-sm text-slate-400">
                    <div className="mb-2">No NCAA data available</div>
                    <Link href="/audit/book">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        Get $299 Credit Audit
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GAR Performance Tile */}
            <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  GAR Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {garData ? (
                  <>
                    <div className="text-3xl font-bold text-white mb-2">
                      {garData.avgGarScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-slate-400 mb-3">
                      Avg GAR Score • {garData.totalSessions} sessions
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                      garData.trend === 'improving' ? 'bg-green-500/20 text-green-400' :
                      garData.trend === 'stable' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {garData.trend === 'improving' && <TrendingUp className="w-3 h-3" />}
                      {garData.trend.toUpperCase()}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Readiness:</div>
                      <div className="text-sm font-bold text-white">
                        {garData.avgReadiness.toFixed(1)}/10
                      </div>
                    </div>
                    <Link href="/gar">
                      <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                        View GAR Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-sm text-slate-400">
                    <div className="mb-2">No GAR sessions yet</div>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      Start GAR Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Tile */}
            <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-cyan-400" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ncaaData?.recommendedActions && ncaaData.recommendedActions.length > 0 ? (
                  <div className="space-y-3">
                    {ncaaData.recommendedActions.slice(0, 2).map((action, idx) => (
                      <div key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></div>
                        <span>{action}</span>
                      </div>
                    ))}
                    <Link href="/dashboard/studio">
                      <Button size="sm" className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700">
                        Go to Studio
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">
                    <div className="mb-2">You&apos;re on track!</div>
                    <div className="text-xs text-slate-500">
                      Keep up your excellent work in Studio and training.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Role Switcher for Admin/Teachers */}
        {(userRole === 'admin' || userRole === 'teacher') && (
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setUserRole('student')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Student View
              </Button>
              <Button
                size="sm"
                variant={userRole === 'teacher' ? 'default' : 'ghost'}
                onClick={() => setUserRole('teacher')}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Teacher View
              </Button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">
              {userRole === 'teacher' ? 'My Classes' : 'Browse Courses'}
            </TabsTrigger>
            <TabsTrigger value="discovery">Course Discovery</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {userRole === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
          </TabsContent>

          <TabsContent value="courses">
            {userRole === 'teacher' ? <TeacherDashboard /> : <CourseDiscovery />}
          </TabsContent>

          <TabsContent value="discovery">
            <CourseDiscovery />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
