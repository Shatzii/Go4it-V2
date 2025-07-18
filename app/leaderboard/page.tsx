'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Crown, 
  Star, 
  TrendingUp, 
  Share2, 
  Award,
  Users,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';

const TOTAL_SPOTS = 100;
const CURRENT_MEMBERS = 27;

export default function LeaderboardPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading verified members
    setTimeout(() => {
      const mockMembers = Array.from({ length: CURRENT_MEMBERS }, (_, i) => ({
        id: i + 1,
        name: `Verified Athlete ${i + 1}`,
        sport: ['Football', 'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Track'][Math.floor(Math.random() * 6)],
        location: ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Ohio'][Math.floor(Math.random() * 6)],
        joinDate: new Date(2025, 0, Math.floor(Math.random() * 18) + 1).toLocaleDateString(),
        garScore: Math.floor(Math.random() * 30) + 70,
        referrals: Math.floor(Math.random() * 15),
        badge: i < 10 ? 'founder' : i < 20 ? 'early' : 'verified',
        isCurrentUser: i === 12 // Mock current user
      }));
      setMembers(mockMembers);
      setLoading(false);
    }, 1000);
  }, []);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'founder': return 'bg-yellow-500 text-black';
      case 'early': return 'bg-blue-500 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case 'founder': return 'FOUNDER';
      case 'early': return 'EARLY';
      default: return 'VERIFIED';
    }
  };

  const progressPercentage = (CURRENT_MEMBERS / TOTAL_SPOTS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              VERIFIED 100 LEADERBOARD
            </h1>
          </div>
          
          <p className="text-xl text-slate-300 mb-8">
            The founding members who locked in their legendary status
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-white">Progress to 100 Members</span>
              <span className="text-lg font-semibold text-yellow-400">{CURRENT_MEMBERS}/100</span>
            </div>
            <Progress value={progressPercentage} className="h-4 bg-slate-700" />
            <p className="text-sm text-slate-400 mt-2">
              {100 - CURRENT_MEMBERS} spots remaining • Each member is verified for life
            </p>
          </div>
        </div>

        {/* Vienna Event Banner */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">First Verified Combine Event</h2>
          </div>
          <div className="flex items-center justify-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>Vienna, Austria</span>
            </div>
            <div>•</div>
            <div>July 22-24, 2025</div>
            <div>•</div>
            <div className="text-yellow-400">Friday Night Lights @ 7PM</div>
          </div>
        </div>

        {/* Top 10 Founders */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Top 10 Founders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-slate-700 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              members.slice(0, 10).map((member, index) => (
                <Card key={member.id} className={`${member.isCurrentUser ? 'ring-2 ring-yellow-400' : ''} bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-xl">#{index + 1}</span>
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-2 -right-2">
                            <Crown className="w-6 h-6 text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white">{member.name}</h3>
                          {member.isCurrentUser && (
                            <Badge className="bg-green-500 text-white text-xs">YOU</Badge>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm">{member.sport} • {member.location}</p>
                        <Badge className={`${getBadgeColor(member.badge)} text-xs font-bold mt-2`}>
                          {getBadgeText(member.badge)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">GAR Score</span>
                        <span className="text-white font-semibold">{member.garScore}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Referrals</span>
                        <span className="text-green-400 font-semibold">{member.referrals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Joined</span>
                        <span className="text-slate-300 text-sm">{member.joinDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* All Members Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            All Verified Members
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 20 }).map((_, i) => (
                <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-16 bg-slate-700 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              members.map((member) => (
                <Card key={member.id} className={`${member.isCurrentUser ? 'ring-2 ring-yellow-400' : ''} bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">#{member.id}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-sm">{member.name}</h3>
                          {member.isCurrentUser && (
                            <Badge className="bg-green-500 text-white text-xs">YOU</Badge>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs">{member.sport}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={`${getBadgeColor(member.badge)} text-xs`}>
                        {getBadgeText(member.badge)}
                      </Badge>
                      <span className="text-slate-300 text-xs">{member.joinDate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Join CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">
                  Join The Legendary Few
                </h3>
              </div>
              <p className="text-slate-300 mb-6">
                Only {100 - CURRENT_MEMBERS} spots left to become a founding member with lifetime access.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/lifetime'}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  SECURE YOUR SPOT
                </Button>
                <Button 
                  onClick={() => {
                    const shareText = `🔥 Check out The Verified 100 Leaderboard! Only ${100 - CURRENT_MEMBERS} spots left for lifetime membership. Vienna event July 22-24! #Verified100 #LifetimeAthlete`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'The Verified 100 Leaderboard',
                        text: shareText,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  variant="outline"
                  className="border-slate-600 text-slate-300 px-8 py-3"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}