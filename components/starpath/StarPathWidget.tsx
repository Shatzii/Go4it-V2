'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Target, TrendingUp, Zap, Crown, GraduationCap } from 'lucide-react';

interface StarPathWidgetProps {
  compact?: boolean;
}

export default function StarPathWidget({ compact = false }: StarPathWidgetProps) {
  // Mock data - would come from API
  const data = {
    starRating: 3.5,
    currentLevel: 18,
    totalXP: 12450,
    xpProgress: 75,
    ncaaStatus: 'on_track',
    scholarshipOffers: 2,
    avgGarScore: 82.5,
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-slate-600 fill-current absolute" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-slate-600 fill-current" />
        );
      }
    }
    return stars;
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {renderStars(data.starRating)}
            </div>
            <Badge className="bg-purple-600">
              Level {data.currentLevel}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>XP Progress</span>
              <span>{data.xpProgress}%</span>
            </div>
            <Progress value={data.xpProgress} className="h-1.5" />
          </div>
          <Button 
            size="sm" 
            className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => window.location.href = '/starpath-gamification'}
          >
            <Crown className="w-4 h-4 mr-2" />
            View StarPath
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Your StarPath
          </h3>
          <Badge className="bg-purple-600">
            Level {data.currentLevel}
          </Badge>
        </div>

        {/* Star Rating */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-1">
            {renderStars(data.starRating)}
            <span className="ml-2 text-2xl font-bold text-white">{data.starRating}</span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              {data.totalXP.toLocaleString()} XP
            </span>
            <span className="text-white font-semibold">{data.xpProgress}%</span>
          </div>
          <Progress value={data.xpProgress} className="h-2" />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-blue-600/10 rounded border border-blue-600/30">
            <GraduationCap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{data.ncaaStatus === 'on_track' ? '78%' : 'N/A'}</div>
            <div className="text-xs text-slate-400">NCAA</div>
          </div>
          
          <div className="text-center p-2 bg-green-600/10 rounded border border-green-600/30">
            <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{data.avgGarScore}</div>
            <div className="text-xs text-slate-400">GAR</div>
          </div>
          
          <div className="text-center p-2 bg-purple-600/10 rounded border border-purple-600/30">
            <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{data.scholarshipOffers}</div>
            <div className="text-xs text-slate-400">Offers</div>
          </div>
        </div>

        {/* CTA */}
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={() => window.location.href = '/starpath-gamification'}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Full StarPath Progress
        </Button>
      </CardContent>
    </Card>
  );
}
