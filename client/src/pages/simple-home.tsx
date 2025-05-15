import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useSimplifiedAuth } from "@/contexts/simplified-auth-context";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Video, User, Activity, Star, BarChart, Trophy, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SimpleHome() {
  const { user, logout, loading, switchRole } = useSimplifiedAuth();
  const [, navigate] = useLocation();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header/Navigation */}
      <header className="bg-gray-800 py-3 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-blue-500 font-bold text-xl mr-1">Go4It</span>
            <span className="text-white font-bold text-xl">Sports</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar-placeholder.png" alt={user.name} />
                    <AvatarFallback className="bg-blue-700">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-gray-400">{user.email}</p>
                    <p className="text-xs text-blue-500 mt-1">Role: {user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => switchRole('athlete')}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Athlete View</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => switchRole('coach')}
                  className="cursor-pointer"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Coach View</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => switchRole('admin')}
                  className="cursor-pointer"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Admin View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
          <p className="text-gray-400">Current view: <span className="text-blue-500 font-medium">{user.role}</span></p>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video Performance */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg font-medium">Recent Videos</CardTitle>
              <Video className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">QB Throwing Form</p>
                    <p className="text-sm text-gray-400">May 10, 2025</p>
                  </div>
                  <div className="text-blue-500 font-bold">
                    GAR: 8.4
                  </div>
                </div>
                <div className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Cone Drill</p>
                    <p className="text-sm text-gray-400">May 8, 2025</p>
                  </div>
                  <div className="text-blue-500 font-bold">
                    GAR: 7.9
                  </div>
                </div>
                <div className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Passing Routes</p>
                    <p className="text-sm text-gray-400">May 5, 2025</p>
                  </div>
                  <div className="text-blue-500 font-bold">
                    GAR: 8.1
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-gray-700">
              <Button variant="outline" className="w-full text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white">
                Upload New Video
              </Button>
            </CardFooter>
          </Card>

          {/* StarPath Progress */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg font-medium">StarPath™ Progress</CardTitle>
              <Star className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">XP Level: 23</span>
                    <span className="text-sm font-medium">7,845/10,000</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700 rounded-md p-3 text-center">
                    <p className="text-2xl font-bold text-blue-500">12</p>
                    <p className="text-sm text-gray-400">Badges</p>
                  </div>
                  <div className="bg-gray-700 rounded-md p-3 text-center">
                    <p className="text-2xl font-bold text-green-500">8</p>
                    <p className="text-sm text-gray-400">Skills</p>
                  </div>
                  <div className="bg-gray-700 rounded-md p-3 text-center">
                    <p className="text-2xl font-bold text-purple-500">5</p>
                    <p className="text-sm text-gray-400">Streak</p>
                  </div>
                  <div className="bg-gray-700 rounded-md p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-500">3</p>
                    <p className="text-sm text-gray-400">Missions</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-gray-700">
              <Button variant="outline" className="w-full text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white">
                View StarPath
              </Button>
            </CardFooter>
          </Card>

          {/* Activity Feed */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-lg font-medium">Latest Activity</CardTitle>
              <Activity className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-md p-3">
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 text-blue-500 mr-2" />
                    <p><span className="font-medium">Coach Smith</span> <span className="text-gray-400">reviewed your latest video</span></p>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="bg-gray-700 rounded-md p-3">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                    <p><span className="text-gray-400">You earned the</span> <span className="font-medium">Consistency Badge</span></p>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Yesterday</p>
                </div>
                <div className="bg-gray-700 rounded-md p-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-purple-500 mr-2" />
                    <p><span className="text-gray-400">You reached</span> <span className="font-medium">Level 23</span> <span className="text-gray-400">in StarPath</span></p>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-gray-700">
              <Button variant="outline" className="w-full text-green-500 border-green-500 hover:bg-green-500 hover:text-white">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}