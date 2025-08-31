'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Star,
  Clock,
  Calendar,
  Video,
  MessageCircle,
  Trophy,
  Target,
  Play,
  CreditCard,
  Shield,
  Award,
} from 'lucide-react';

interface Coach {
  id: string;
  name: string;
  specialty: string[];
  experience: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  availability: string;
  image: string;
  bio: string;
  credentials: string[];
  successStories: number;
  liveClasses: boolean;
}

export default function CoachesCornerPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  const coaches: Coach[] = [
    {
      id: 'coach_001',
      name: 'Coach Marcus Johnson',
      specialty: ['Strength Training', 'Speed Development', 'Olympic Lifting'],
      experience: '15 years',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 75,
      availability: 'Available',
      image: '/coach-placeholder.jpg',
      bio: 'Former D1 strength coach with expertise in developing elite athletes. Specialized in power development and injury prevention.',
      credentials: ['CSCS Certified', 'USA Weightlifting Level 2', 'NASM-PES'],
      successStories: 45,
      liveClasses: true,
    },
    {
      id: 'coach_002',
      name: 'Coach Sarah Williams',
      specialty: ['Conditioning', 'Agility Training', 'Sport Psychology'],
      experience: '12 years',
      rating: 4.8,
      reviews: 98,
      hourlyRate: 65,
      availability: 'Busy',
      image: '/coach-placeholder.jpg',
      bio: 'Sports psychologist and conditioning specialist focusing on mental toughness and peak performance.',
      credentials: ['ACSM Certified', 'Mental Performance Consultant', 'FMS Level 2'],
      successStories: 67,
      liveClasses: true,
    },
    {
      id: 'coach_003',
      name: 'Coach David Rodriguez',
      specialty: ['Football Specific', 'Position Training', 'Recruiting'],
      experience: '20 years',
      rating: 5.0,
      reviews: 156,
      hourlyRate: 85,
      availability: 'Available',
      image: '/coach-placeholder.jpg',
      bio: 'Former NFL coach with extensive recruiting connections. Specializes in player development and college placement.',
      credentials: ['NFL Coaching Experience', 'AFCA Member', 'Recruiting Specialist'],
      successStories: 89,
      liveClasses: false,
    },
  ];

  const specialties = [
    'All',
    'Strength Training',
    'Conditioning',
    'Speed Development',
    'Position Training',
    'Recruiting',
    'Sport Psychology',
  ];

  const filteredCoaches =
    selectedFilter === 'all'
      ? coaches
      : coaches.filter((coach) =>
          coach.specialty.some((spec) => spec.toLowerCase().includes(selectedFilter.toLowerCase())),
        );

  const bookSession = (coach: Coach, sessionType: 'consultation' | 'training' | 'live_class') => {
    // Integration with Stripe payment system
    const sessionData = {
      coachId: coach.id,
      coachName: coach.name,
      sessionType,
      rate: coach.hourlyRate,
      specialty: coach.specialty[0],
    };

    // Redirect to booking page with coach data
    const params = new URLSearchParams(sessionData as any);
    window.location.href = `/book-session?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Coaches Corner
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Connect with elite coaches for personalized training and mentorship
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Expert Coaches
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Live Sessions
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              1-on-1 Training
            </Badge>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              onClick={() => setSelectedFilter(specialty === 'All' ? 'all' : specialty)}
              variant={
                selectedFilter === (specialty === 'All' ? 'all' : specialty) ? 'default' : 'outline'
              }
              className={`${
                selectedFilter === (specialty === 'All' ? 'all' : specialty)
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'border-slate-600 hover:bg-slate-700'
              }`}
            >
              {specialty}
            </Button>
          ))}
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCoaches.map((coach) => (
            <Card
              key={coach.id}
              className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{coach.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white">{coach.rating}</span>
                        <span className="text-xs text-slate-400">({coach.reviews})</span>
                      </div>
                      <Badge
                        className={
                          coach.availability === 'Available'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }
                      >
                        {coach.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">{coach.bio}</p>

                {/* Specialties */}
                <div>
                  <h5 className="font-medium text-white text-sm mb-2">Specialties:</h5>
                  <div className="flex flex-wrap gap-1">
                    {coach.specialty.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Experience</p>
                    <p className="text-white font-medium">{coach.experience}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Success Stories</p>
                    <p className="text-white font-medium">{coach.successStories}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-slate-600 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400">Rate per hour</span>
                    <span className="text-2xl font-bold text-green-400">${coach.hourlyRate}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => bookSession(coach, 'consultation')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Book Consultation
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => bookSession(coach, 'training')}
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        <Trophy className="w-4 h-4 mr-1" />
                        1-on-1
                      </Button>

                      {coach.liveClasses && (
                        <Button
                          onClick={() => bookSession(coach, 'live_class')}
                          variant="outline"
                          className="border-slate-600 hover:bg-slate-700"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Live Class
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Classes Section */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" />
              Upcoming Live Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">Olympic Lifting Fundamentals</h4>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <Video className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Master the basics of Olympic lifting with proper form and technique
                  </p>
                  <div className="text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Today 3:00 PM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3" />
                      <span>Coach Marcus Johnson</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">$25</span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Join Live
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">Mental Toughness Training</h4>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Calendar className="w-3 h-3 mr-1" />
                      Scheduled
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Build mental resilience and peak performance mindset
                  </p>
                  <div className="text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Tomorrow 7:00 PM - 8:30 PM</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3" />
                      <span>Coach Sarah Williams</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">$35</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Reserve Spot
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">College Recruiting Workshop</h4>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Award className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Navigate the college recruiting process with expert guidance
                  </p>
                  <div className="text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Sat 2:00 PM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3" />
                      <span>Coach David Rodriguez</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">$50</span>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Work with Elite Coaches?
            </h3>
            <p className="text-slate-300 text-lg mb-6">
              Get personalized training, expert advice, and accelerate your athletic development
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                <CreditCard className="w-5 h-5 mr-2" />
                Browse All Coaches
              </Button>
              <Button
                onClick={() => (window.location.href = '/live-classes')}
                variant="outline"
                className="border-slate-600 text-slate-300 px-8 py-3"
              >
                <Video className="w-5 h-5 mr-2" />
                View Live Classes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
