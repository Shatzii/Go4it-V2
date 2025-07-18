'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Crown,
  Share2,
  Download,
  Copy,
  Instagram,
  Twitter,
  MessageSquare,
  Video,
  Camera,
  Mic
} from 'lucide-react';

const TOTAL_SPOTS = 100;
const SPOTS_TAKEN = 27;
const SPOTS_REMAINING = TOTAL_SPOTS - SPOTS_TAKEN;

export default function Verified100PromoPage() {
  const [copied, setCopied] = useState('');

  const socialPosts = [
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-500',
      content: "🔥 I'm joining The Verified 100! \n\nOnly 100 athletes get LIFETIME access to:\n✅ GAR Score Testing\n✅ AI Coaching\n✅ NCAA Tools\n✅ Recruitment Analytics\n\n$100 once. Never pay again.\n\nFirst combine: Vienna, July 22-24 🇦🇹\n\n#Verified100 #LifetimeAthlete #GARScoreElite #Go4ItSports",
      hashtags: "#Verified100 #LifetimeAthlete #GARScoreElite #Go4ItSports #ViennaEvent #FridayNightLights"
    },
    {
      platform: 'TikTok',
      icon: Video,
      color: 'bg-black',
      content: "POV: You paid $100 once and never have to pay for sports analytics again 🔥\n\nThe Verified 100 is DIFFERENT:\n• Lifetime GAR Score testing\n• AI coaching forever\n• First 100 athletes ONLY\n• Vienna event July 22-24\n\nThis is how legends are made ⚡",
      hashtags: "#Verified100 #LifetimeAthlete #GARScore #SportsAnalytics #Vienna #FridayNightLights"
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500',
      content: "🚨 THE VERIFIED 100 IS LIVE\n\n$100 = Lifetime access to:\n→ GAR Score testing\n→ AI coaching\n→ NCAA eligibility tools\n→ Recruitment analytics\n\nFirst combine: Vienna 🇦🇹 July 22-24\nFriday Night Lights @ 7PM\n\nOnly 73 spots left ⏰",
      hashtags: "#Verified100 #LifetimeAthlete #GARScoreElite #Vienna #SportsAnalytics"
    }
  ];

  const contentIdeas = [
    {
      type: 'Video',
      title: 'Why I Joined The Verified 100',
      description: 'Short video explaining the value of lifetime membership',
      script: "I just locked in my spot in The Verified 100. Here's why: [Show calculator] Other platforms charge $1,000+ per year. Go4It? $100 ONCE. Forever. GAR Score testing, AI coaching, NCAA tools, recruitment help - everything I need to go pro. Vienna event July 22-24 is where legends are made. 73 spots left.",
      duration: '30-60 seconds'
    },
    {
      type: 'Story Series',
      title: 'Road to Vienna',
      description: 'Document your journey to the Vienna event',
      script: "Day 1: Just joined The Verified 100 💪\nDay 2: Training with AI coach recommendations\nDay 3: Uploaded highlight reel\n...\nDay 30: Vienna bound! 🇦🇹",
      duration: 'Daily posts'
    },
    {
      type: 'Comparison Post',
      title: 'The Math That Made Me Join',
      description: 'Show cost comparison with other platforms',
      script: "NCSA: $1,320/year\nSportsRecruits: $399/year\nStack Sports: $270/year\n\nGo4It Verified 100: $100 ONCE\n\nAfter 1 year: I save $1,220+\nAfter 4 years: I save $4,000+\n\nThis was the easiest decision ever.",
      duration: 'Single post'
    }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const shareContent = (platform: string, content: string) => {
    const encodedContent = encodeURIComponent(content);
    const url = 'https://go4itsports.org/lifetime';
    
    let shareUrl = '';
    switch (platform) {
      case 'Instagram':
        // Instagram doesn't support direct sharing, copy to clipboard
        copyToClipboard(content, 'Instagram');
        break;
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}&url=${url}`;
        window.open(shareUrl, '_blank');
        break;
      case 'TikTok':
        copyToClipboard(content, 'TikTok');
        break;
      default:
        copyToClipboard(content, platform);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-yellow-500 text-black font-bold text-lg px-6 py-2">
            VERIFIED 100 PROMO KIT
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            DRIVE LEGENDARY SIGN-UPS
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Everything you need to create viral content and drive massive sign-ups for The Verified 100 launch
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{SPOTS_REMAINING}</div>
              <div className="text-slate-300">Spots Left</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">$100</div>
              <div className="text-slate-300">One-Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">♾️</div>
              <div className="text-slate-300">Lifetime</div>
            </div>
          </div>
        </div>

        {/* Social Media Posts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Ready-to-Post Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialPosts.map((post, index) => {
              const Icon = post.icon;
              return (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${post.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-white">{post.platform}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-900 p-4 rounded-lg">
                        <p className="text-slate-300 text-sm whitespace-pre-line">{post.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => shareContent(post.platform, post.content)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(post.content, post.platform)}
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          <Copy className="w-4 h-4" />
                          {copied === post.platform ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="text-xs text-slate-400">
                        <strong>Hashtags:</strong> {post.hashtags}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Content Ideas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Viral Content Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contentIdeas.map((idea, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      {idea.type === 'Video' && <Video className="w-5 h-5 text-purple-500" />}
                      {idea.type === 'Story Series' && <Camera className="w-5 h-5 text-purple-500" />}
                      {idea.type === 'Comparison Post' && <TrendingUp className="w-5 h-5 text-purple-500" />}
                    </div>
                    <CardTitle className="text-white text-lg">{idea.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-300 text-sm">{idea.description}</p>
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <p className="text-slate-300 text-sm whitespace-pre-line">{idea.script}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{idea.duration}</span>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(idea.script, idea.type)}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied === idea.type ? 'Copied!' : 'Copy Script'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Messaging */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Messaging Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Value Proposition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-slate-300">
                  <strong>The Hook:</strong> "$100 FOR LIFE? BELIEVE IT."
                </div>
                <div className="text-slate-300">
                  <strong>The Math:</strong> Other platforms: $1,000+/year. Go4It: $100 once.
                </div>
                <div className="text-slate-300">
                  <strong>The Urgency:</strong> "First 100 only. Once gone, they're gone forever."
                </div>
                <div className="text-slate-300">
                  <strong>The Event:</strong> "Vienna July 22-24. Friday Night Lights @ 7PM."
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-6 h-6 text-blue-400" />
                  Emotional Triggers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-slate-300">
                  <strong>FOMO:</strong> "Be one of the FIRST. Be VERIFIED for LIFE."
                </div>
                <div className="text-slate-300">
                  <strong>Exclusivity:</strong> "This is your invite to the inner circle."
                </div>
                <div className="text-slate-300">
                  <strong>Legacy:</strong> "Be early. Be legendary."
                </div>
                <div className="text-slate-300">
                  <strong>Community:</strong> "Founders get lifetime status. Everyone else? Pay per event."
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Ready to Create Legendary Members?
              </h3>
              <p className="text-slate-300 mb-6">
                Use these assets to drive massive sign-ups and build the ultimate founding member community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open('/lifetime', '_blank')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  View Lifetime Page
                </Button>
                <Button 
                  onClick={() => copyToClipboard('https://go4itsports.org/lifetime', 'URL')}
                  variant="outline"
                  className="border-slate-600 text-slate-300 px-8 py-3"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  {copied === 'URL' ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}