'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trophy, 
  Star, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Timer,
  TrendingUp,
  Award,
  Zap,
  Crown
} from 'lucide-react';

const TOTAL_SPOTS = 100;
const SPOTS_TAKEN = 27; // Dynamic counter
const SPOTS_REMAINING = TOTAL_SPOTS - SPOTS_TAKEN;

export default function LifetimeMembershipPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set event date: July 22, 2025 7:00 PM
    const eventDate = new Date('2025-07-22T19:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLifetimePurchase = async () => {
    try {
      const response = await fetch('/api/lifetime-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          membershipType: 'verified100',
          amount: 100,
          eventId: 'vienna-july-2025'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process membership');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Lifetime membership error:', error);
      alert('Please log in to purchase lifetime membership');
    }
  };

  const progressPercentage = (SPOTS_TAKEN / TOTAL_SPOTS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center">
            <Badge className="mb-6 bg-yellow-500 text-black font-bold text-lg px-6 py-2">
              FOUNDERS CLUB EXCLUSIVE
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              THE VERIFIED 100
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold mb-4 text-white">
              LIFETIME MEMBERSHIP LAUNCH
            </p>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Be one of the FIRST. Be VERIFIED for LIFE.
            </p>
            
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">$100</div>
                <div className="text-slate-300">One-Time Fee</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">{SPOTS_REMAINING}</div>
                <div className="text-slate-300">Spots Left</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgency Bar */}
      <div className="bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold">
                {SPOTS_TAKEN}/100 Verified Athletes Claimed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-slate-700 mb-2" />
            <p className="text-sm text-slate-400">
              {SPOTS_REMAINING} spots remaining • Once gone, they're gone forever
            </p>
          </div>
        </div>
      </div>

      {/* Event Countdown */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-600 text-white text-lg px-4 py-2">
              FIRST VERIFIED COMBINE EVENT
            </Badge>
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <MapPin className="w-8 h-8 text-blue-400" />
              Vienna, Austria • July 22-24, 2025
            </h2>
            <p className="text-xl text-slate-300 mb-6">
              Starting with Friday Night Lights • July 22, 7:00 PM
            </p>
          </div>
          
          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">{timeLeft.days}</div>
              <div className="text-sm text-slate-400">Days</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">{timeLeft.hours}</div>
              <div className="text-sm text-slate-400">Hours</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">{timeLeft.minutes}</div>
              <div className="text-sm text-slate-400">Minutes</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">{timeLeft.seconds}</div>
              <div className="text-sm text-slate-400">Seconds</div>
            </div>
          </div>

          <Alert className="max-w-2xl mx-auto bg-blue-900/30 border-blue-500">
            <Calendar className="w-5 h-5" />
            <AlertDescription className="text-white">
              <strong>Event Schedule:</strong> Friday Night Lights (7 PM) • Saturday Combines (8 AM) • Sunday Elite Showcases (10 AM)
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Value Proposition */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            $100 FOR LIFE? BELIEVE IT.
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            We're launching the GAR Score revolution. You get data, exposure, a verified future. 
            And if you're early? You'll never pay again.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <CardTitle className="text-white">GAR Score Testing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Full GAR Score testing at every combine event. Professional video analysis and performance metrics.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <CardTitle className="text-white">Profile Updates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Regular profile updates and star re-ratings based on your performance improvement.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-8 h-8 text-blue-400" />
                <CardTitle className="text-white">AI Coaching Reports</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Advanced AI coaching reports with personalized training recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-8 h-8 text-purple-400" />
                <CardTitle className="text-white">Early Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Early invites to showcases and NextUp features before general release.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-orange-400" />
                <CardTitle className="text-white">Leaderboard Placement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Permanent placement on the GAR Leaderboard with verified athlete status.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                <CardTitle className="text-white">Future Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                NIL and recruiting tools (2025-2026 rollout) included at no extra cost.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  This is your invite to the inner circle.
                </h3>
                <p className="text-slate-300">
                  No monthly fees. No pay-per-combine. Just performance. Just verified. Forever.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleLifetimePurchase}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg py-6"
                >
                  SECURE MY LIFETIME MEMBERSHIP - $100
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4 text-red-400" />
                    <span>Limited Time</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>First 100 Only</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-4">
            Join the movement. Be legendary.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              #Verified100
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              #LifetimeAthlete
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              #GARScoreElite
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}