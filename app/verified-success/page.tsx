'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Download,
  Share2,
  Crown
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifiedSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [memberNumber, setMemberNumber] = useState<number>(0);
  
  useEffect(() => {
    // Generate member number (simulated - in production, this would come from the backend)
    const randomMemberNumber = Math.floor(Math.random() * 100) + 1;
    setMemberNumber(randomMemberNumber);
  }, []);

  const membership = searchParams.get('membership');
  const event = searchParams.get('event');

  const handleShareSuccess = () => {
    const shareText = `🔥 I'm one of The Verified 100! Lifetime member #${memberNumber} of Go4It Sports. Zero monthly fees, lifetime GAR Score access, and early access to all features. #Verified100 #LifetimeAthlete #GARScoreElite`;
    
    if (navigator.share) {
      navigator.share({
        title: 'The Verified 100 - Lifetime Member',
        text: shareText,
        url: window.location.origin + '/lifetime'
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Success message copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-12 h-12 text-black" />
            </div>
            <Badge className="mb-4 bg-green-600 text-white text-lg px-6 py-3">
              PAYMENT SUCCESSFUL
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            WELCOME TO THE VERIFIED 100
          </h1>
          
          <p className="text-xl text-slate-300 mb-6">
            You are now <strong>Lifetime Member #{memberNumber}</strong>
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span className="text-lg">Verified for Life • Never Pay Again</span>
          </div>
        </div>

        {/* Member Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Your Lifetime Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Full GAR Score Testing (Every Combine)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Profile Updates & Star Re-Ratings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">AI Coaching Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Early Access to Features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">GAR Leaderboard Placement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">NIL & Recruiting Tools (2025-2026)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                Your First Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">Vienna, Austria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">July 22-24, 2025</span>
                </div>
                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-white font-semibold mb-2">Event Schedule:</p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Friday Night Lights - July 22, 7:00 PM</li>
                    <li>• Saturday Combines - July 23, 8:00 AM</li>
                    <li>• Sunday Elite Showcases - July 24, 10:00 AM</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={handleShareSuccess}
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:text-white px-8 py-3"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Success
            </Button>
          </div>
          
          <p className="text-sm text-slate-400">
            You will receive a confirmation email with event details and your digital membership badge.
          </p>
        </div>

        {/* Digital Badge Preview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 text-white">Your Digital Badge</h3>
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <div className="text-center">
                <Badge className="mb-2 bg-yellow-500 text-black font-bold">
                  VERIFIED 100 MEMBER
                </Badge>
                <p className="text-white font-semibold">Lifetime Member #{memberNumber}</p>
                <p className="text-sm text-slate-300">Go4It Sports Platform</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}