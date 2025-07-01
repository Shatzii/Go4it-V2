import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Settings, 
  FileText, 
  Trophy, 
  Menu,
  Users,
  BarChart3,
  Database,
  Shield,
  Globe,
  Palette,
  Activity,
  TrendingUp,
  UserCheck,
  Video,
  Star
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalContent: number;
  totalSports: number;
  activeUsers: number;
  contentUpdates: number;
  systemHealth: number;
}

export default function AdminDashboard() {
  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    totalContent: 23,
    totalSports: 12,
    activeUsers: 834,
    contentUpdates: 5,
    systemHealth: 98
  });

  // Fetch real data from CMS
  const { data: content = [] } = useQuery<any[]>({
    queryKey: ["/api/cms/content"],
  });

  const { data: sports = [] } = useQuery<any[]>({
    queryKey: ["/api/cms/sports"],
  });

  const { data: settings = [] } = useQuery<any[]>({
    queryKey: ["/api/cms/settings"],
  });

  const quickActions = [
    {
      title: "Content Management",
      description: "Create and edit pages, announcements, and features",
      icon: FileText,
      href: "/cms-admin",
      color: "bg-blue-500",
      count: content.length
    },
    {
      title: "Sports Configuration",
      description: "Manage sports, skills, and training programs",
      icon: Trophy,
      href: "/cms-admin",
      color: "bg-green-500",
      count: sports.length
    },
    {
      title: "User Management",
      description: "View and manage platform users",
      icon: Users,
      href: "/admin-users",
      color: "bg-purple-500",
      count: stats.totalUsers
    },
    {
      title: "System Settings",
      description: "Configure platform settings and preferences",
      icon: Settings,
      href: "/cms-admin",
      color: "bg-orange-500",
      count: settings.length
    },
    {
      title: "Analytics",
      description: "View platform performance and user insights",
      icon: BarChart3,
      href: "/admin-analytics",
      color: "bg-cyan-500",
      count: stats.activeUsers
    },
    {
      title: "Database Management",
      description: "Monitor database health and performance",
      icon: Database,
      href: "/admin-database",
      color: "bg-red-500",
      count: stats.systemHealth
    }
  ];

  const recentActivity = [
    {
      type: "content",
      title: "Landing page updated",
      user: "admin",
      timestamp: "2 hours ago",
      icon: FileText
    },
    {
      type: "user",
      title: "New user registration",
      user: "athlete_sarah",
      timestamp: "4 hours ago",
      icon: UserCheck
    },
    {
      type: "sport",
      title: "Basketball drills updated",
      user: "admin",
      timestamp: "6 hours ago",
      icon: Trophy
    },
    {
      type: "video",
      title: "Video analysis completed",
      user: "coach_mike",
      timestamp: "8 hours ago",
      icon: Video
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8" />
          Admin Dashboard
        </h1>
        <p className="text-slate-300 text-lg">
          Manage and monitor the Go4It Sports Platform
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 rounded-lg p-3">
                <Users className="text-blue-500 h-6 w-6" />
              </div>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                +12%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</h3>
            <p className="text-slate-300 text-sm">Total Users</p>
            <div className="mt-3 text-xs text-slate-400">
              {stats.activeUsers} active this week
            </div>
          </CardContent>
        </Card>

        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 rounded-lg p-3">
                <FileText className="text-green-500 h-6 w-6" />
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                +{stats.contentUpdates}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{content.length}</h3>
            <p className="text-slate-300 text-sm">Content Pages</p>
            <div className="mt-3 text-xs text-slate-400">
              {stats.contentUpdates} updated this week
            </div>
          </CardContent>
        </Card>

        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-500/20 rounded-lg p-3">
                <Trophy className="text-cyan-500 h-6 w-6" />
              </div>
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{sports.length}</h3>
            <p className="text-slate-300 text-sm">Sports Programs</p>
            <div className="mt-3 text-xs text-slate-400">
              All sports active
            </div>
          </CardContent>
        </Card>

        <Card className="go4it-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500/20 rounded-lg p-3">
                <Activity className="text-orange-500 h-6 w-6" />
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                Healthy
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.systemHealth}%</h3>
            <p className="text-slate-300 text-sm">System Health</p>
            <Progress value={stats.systemHealth} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="go4it-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={`${action.color} rounded-lg p-2 group-hover:scale-110 transition-transform`}>
                          <action.icon className="text-white h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                          <p className="text-slate-400 text-sm mb-2">{action.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {action.count} items
                            </Badge>
                            <TrendingUp className="text-slate-400 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="go4it-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                    <div className="bg-slate-700 rounded-lg p-2">
                      <activity.icon className="text-slate-300 h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-slate-400 text-xs mb-1">
                        by {activity.user}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8">
        <Card className="go4it-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-500/20 rounded-full p-4 inline-flex mb-3">
                  <Database className="text-green-500 h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold mb-1">Database</h3>
                <p className="text-green-400 text-sm">Operational</p>
                <Progress value={99} className="mt-2 h-2" />
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500/20 rounded-full p-4 inline-flex mb-3">
                  <Video className="text-blue-500 h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold mb-1">AI Services</h3>
                <p className="text-blue-400 text-sm">Active</p>
                <Progress value={95} className="mt-2 h-2" />
              </div>
              
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full p-4 inline-flex mb-3">
                  <Star className="text-cyan-500 h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold mb-1">GAR System</h3>
                <p className="text-cyan-400 text-sm">Running</p>
                <Progress value={98} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}