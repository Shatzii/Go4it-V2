'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/nextjs';
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  UserX,
  UserPlus,
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useUser();

  return (
    <ProtectedRoute requiredRole="admin" fallbackUrl="/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-slate-300">Welcome back, {user?.name}</p>
            </div>
            <Badge className="bg-red-100 text-red-800 border-red-300">
              <Shield className="w-4 h-4 mr-2" />
              Administrator
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Users</p>
                    <p className="text-2xl font-bold text-white">2,847</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Sessions</p>
                    <p className="text-2xl font-bold text-white">1,234</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">System Health</p>
                    <p className="text-2xl font-bold text-white">98.5%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Alerts</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Management */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New User
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View All Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Suspended Users
                </Button>
              </CardContent>
            </Card>

            {/* System Management */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <Database className="w-4 h-4 mr-2" />
                  Database Console
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Admin Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white">User account created: demo@go4it.com</span>
                  </div>
                  <span className="text-sm text-slate-400">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-white">System backup completed successfully</span>
                  </div>
                  <span className="text-sm text-slate-400">6 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-white">Database maintenance scheduled</span>
                  </div>
                  <span className="text-sm text-slate-400">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <span className="text-white">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <span className="text-white">API Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                  <span className="text-white">AI Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-yellow-400">Limited</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
