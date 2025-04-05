import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Film, Trophy, Activity, Users, User, Dumbbell } from "lucide-react";
import { Link } from "wouter";
import LockerRoomChat from "@/components/locker-room-chat";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // If not logged in, show a message
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please login or register to continue.</p>
            <div className="flex gap-4">
              <Link href="/login">
                <a className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Login
                </a>
              </Link>
              <Link href="/register">
                <a className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
                  Register
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">
          Here's what's happening with your athletic journey today.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Locker Room
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Film className="h-4 w-4" /> My Videos
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Achievements
          </TabsTrigger>
          <TabsTrigger value="connections" className="hidden md:flex items-center gap-2">
            <Users className="h-4 w-4" /> Connections
          </TabsTrigger>
          <TabsTrigger value="profile" className="hidden md:flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="training" className="hidden md:flex items-center gap-2">
            <Dumbbell className="h-4 w-4" /> Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile Strength</CardTitle>
                <CardDescription>How complete your profile is</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-4 bg-green-500 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">75% complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">• Uploaded a new highlight video</li>
                  <li className="text-sm">• Earned "Quick Start" badge</li>
                  <li className="text-sm">• Connected with Coach Williams</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Mark your calendar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">• Combine Tour: Jul 15, 2023</li>
                  <li className="text-sm">• Weekly Challenge Deadline: 2 days</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader className="border-b bg-blue-950 text-white">
              <CardTitle>Locker Room Chat</CardTitle>
              <CardDescription className="text-blue-100">
                Connect with teammates and coaches in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <LockerRoomChat />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>My Videos</CardTitle>
              <CardDescription>
                Manage your uploaded videos and highlights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                You haven't uploaded any videos yet. Click the button below to get started.
              </p>
              <div className="text-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Upload New Video
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Track your progress and earned badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                Complete actions on the platform to earn badges and achievements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Connections</CardTitle>
              <CardDescription>
                Manage your network of athletes and coaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                Start building your network by connecting with other athletes and coaches.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Edit Profile
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training</CardTitle>
              <CardDescription>
                Track workouts and training progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                No active training plans. Create your first workout plan to get started.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}