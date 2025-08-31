'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Video,
  Calendar,
  Clock,
  Users,
  Star,
  Play,
  CreditCard,
  Shield,
  Award,
  Mic,
  Camera,
  Settings,
} from 'lucide-react';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  coach: string;
  coachRating: number;
  startTime: string;
  duration: number;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  category: string;
  status: 'live' | 'scheduled' | 'ended';
  equipment: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  preview?: string;
}

export default function LiveClassesPage() {
  const [selectedTab, setSelectedTab] = useState('live');
  const [isStreaming, setIsStreaming] = useState(false);

  const liveClasses: LiveClass[] = [
    {
      id: 'class_001',
      title: 'High-Intensity Conditioning Circuit',
      description:
        'Full-body conditioning workout focusing on explosive movements and cardiovascular endurance. Perfect for athletes looking to improve game-day stamina.',
      coach: 'Coach Sarah Williams',
      coachRating: 4.8,
      startTime: 'Now',
      duration: 60,
      price: 25,
      maxAttendees: 50,
      currentAttendees: 34,
      category: 'Conditioning',
      status: 'live',
      equipment: ['Resistance bands', 'Dumbbells', 'Mat'],
      level: 'intermediate',
    },
    {
      id: 'class_002',
      title: 'Olympic Lifting Technique',
      description:
        'Master the fundamentals of clean & jerk and snatch with proper form guidance. Includes mobility work and progression exercises.',
      coach: 'Coach Marcus Johnson',
      coachRating: 4.9,
      startTime: '3:00 PM',
      duration: 90,
      price: 35,
      maxAttendees: 25,
      currentAttendees: 18,
      category: 'Strength',
      status: 'scheduled',
      equipment: ['Barbell', 'Weight plates', 'Lifting shoes'],
      level: 'advanced',
    },
    {
      id: 'class_003',
      title: 'Speed & Agility Fundamentals',
      description:
        'Develop explosive speed and change of direction. Includes ladder drills, cone work, and sprint mechanics.',
      coach: 'Coach David Rodriguez',
      coachRating: 5.0,
      startTime: '5:30 PM',
      duration: 75,
      price: 30,
      maxAttendees: 40,
      currentAttendees: 12,
      category: 'Speed',
      status: 'scheduled',
      equipment: ['Agility ladder', 'Cones', 'Resistance bands'],
      level: 'beginner',
    },
  ];

  const categories = ['All', 'Strength', 'Conditioning', 'Speed', 'Recovery', 'Nutrition'];

  const joinClass = (classItem: LiveClass) => {
    if (classItem.status === 'live') {
      // Open live stream interface
      window.location.href = `/stream/${classItem.id}`;
    } else {
      // Process payment and reserve spot
      const paymentData = {
        classId: classItem.id,
        className: classItem.title,
        coach: classItem.coach,
        price: classItem.price,
        startTime: classItem.startTime,
      };

      const params = new URLSearchParams(paymentData as any);
      window.location.href = `/payment/class?${params.toString()}`;
    }
  };

  const startHosting = () => {
    // Coach streaming interface
    window.location.href = '/host-stream';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Video className="w-12 h-12 text-red-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Live Training Classes
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Join live training sessions with elite coaches from anywhere
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Live Streaming</Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Interactive Training
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Expert Coaches
            </Badge>
          </div>
        </div>

        {/* Coach Actions */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Are you a coach?</h3>
                <p className="text-slate-300">
                  Host your own live classes and earn up to $200/hour
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button onClick={startHosting} className="bg-purple-600 hover:bg-purple-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Streaming
                </Button>
                <Button
                  onClick={() => (window.location.href = '/coach-signup')}
                  variant="outline"
                  className="border-slate-600"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join as Coach
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              Live Now
            </TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="on-demand">On-Demand</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {liveClasses
                .filter((c) => c.status === 'live')
                .map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="bg-slate-800 border-red-500/50 shadow-lg shadow-red-500/20"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <Video className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{classItem.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                LIVE
                              </Badge>
                              <span className="text-sm text-slate-400">
                                {classItem.currentAttendees} watching
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            ${classItem.price}
                          </div>
                          <div className="text-xs text-slate-400">{classItem.duration} min</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-slate-300 text-sm">{classItem.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-white">{classItem.coach}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-slate-400">{classItem.coachRating}</span>
                          </div>
                        </div>
                        <Badge
                          className={
                            classItem.level === 'beginner'
                              ? 'bg-green-500/20 text-green-400'
                              : classItem.level === 'intermediate'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {classItem.level}
                        </Badge>
                      </div>

                      <div>
                        <h5 className="font-medium text-white text-sm mb-2">Equipment Needed:</h5>
                        <div className="flex flex-wrap gap-1">
                          {classItem.equipment.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => joinClass(classItem)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Join Live Class
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses
                .filter((c) => c.status === 'scheduled')
                .map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{classItem.title}</CardTitle>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-400">${classItem.price}</div>
                          <div className="text-xs text-slate-400">{classItem.duration} min</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-400">{classItem.startTime}</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {classItem.category}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-slate-300 text-sm">{classItem.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Coach: {classItem.coach}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-slate-400">{classItem.coachRating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Spots Available</span>
                        <span className="text-white">
                          {classItem.maxAttendees - classItem.currentAttendees}
                        </span>
                      </div>

                      <Button
                        onClick={() => joinClass(classItem)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Reserve Spot
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="on-demand" className="space-y-6">
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">On-Demand Library Coming Soon</h3>
              <p className="text-slate-400 mb-6">
                Access recorded sessions and training programs anytime, anywhere
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">Get Notified</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Secure Payments</h3>
              <p className="text-slate-400 text-sm">
                Protected by Stripe with instant refunds for cancelled classes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Mic className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Interactive Sessions</h3>
              <p className="text-slate-400 text-sm">
                Ask questions, get real-time feedback, and interact with coaches
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Certified Coaches</h3>
              <p className="text-slate-400 text-sm">
                All coaches are certified professionals with proven track records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Model Info */}
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join the Live Training Revolution
            </h3>
            <p className="text-slate-300 text-lg mb-6">
              Train with elite coaches, connect with athletes worldwide, and accelerate your
              performance
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                <p className="text-slate-300">Revenue Share for Coaches</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                <p className="text-slate-300">Classes Available</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
                <p className="text-slate-300">Athletes Training Daily</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 px-8 py-3">
                <CreditCard className="w-5 h-5 mr-2" />
                Browse Live Classes
              </Button>
              <Button
                onClick={() => (window.location.href = '/coaches-corner')}
                variant="outline"
                className="border-slate-600 text-slate-300 px-8 py-3"
              >
                <Users className="w-5 h-5 mr-2" />
                Meet Our Coaches
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
