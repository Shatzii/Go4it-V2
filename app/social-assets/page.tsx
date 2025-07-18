'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, 
  Instagram, 
  Twitter, 
  Video, 
  Image as ImageIcon,
  Copy,
  Crown,
  Trophy,
  Star,
  Calendar,
  MapPin,
  Users,
  Zap,
  Target,
  Award
} from 'lucide-react';

const SPOTS_REMAINING = 73;

export default function SocialAssetsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('countdown');
  const [customText, setCustomText] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [sportName, setSportName] = useState('');
  const [athleteName, setAthleteName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const templates = [
    {
      id: 'countdown',
      name: 'Countdown Post',
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-500',
      description: 'Eye-catching countdown with spots remaining',
      dimensions: '1080x1080'
    },
    {
      id: 'story',
      name: 'Story Template',
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-purple-500',
      description: 'Vertical story format with Vienna event',
      dimensions: '1080x1920'
    },
    {
      id: 'twitter-card',
      name: 'Twitter Card',
      platform: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500',
      description: 'Twitter-optimized visual with key stats',
      dimensions: '1200x675'
    },
    {
      id: 'tiktok-cover',
      name: 'TikTok Cover',
      platform: 'TikTok',
      icon: Video,
      color: 'bg-black',
      description: 'Video thumbnail with bold text',
      dimensions: '1080x1920'
    },
    {
      id: 'member-badge',
      name: 'Member Badge',
      platform: 'Universal',
      icon: Crown,
      color: 'bg-yellow-500',
      description: 'Digital badge for verified members',
      dimensions: '512x512'
    },
    {
      id: 'leaderboard',
      name: 'Leaderboard Post',
      platform: 'Universal',
      icon: Trophy,
      color: 'bg-orange-500',
      description: 'Leaderboard position announcement',
      dimensions: '1080x1080'
    }
  ];

  const generateAsset = async (templateId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on template
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const [width, height] = template.dimensions.split('x').map(Number);
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Add gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b'); // slate-800
    gradient.addColorStop(1, '#0f172a'); // slate-900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Set common styles
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';

    switch (templateId) {
      case 'countdown':
        await generateCountdownPost(ctx, width, height);
        break;
      case 'story':
        await generateStoryTemplate(ctx, width, height);
        break;
      case 'twitter-card':
        await generateTwitterCard(ctx, width, height);
        break;
      case 'tiktok-cover':
        await generateTikTokCover(ctx, width, height);
        break;
      case 'member-badge':
        await generateMemberBadge(ctx, width, height);
        break;
      case 'leaderboard':
        await generateLeaderboardPost(ctx, width, height);
        break;
    }
  };

  const generateCountdownPost = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Main title
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('THE VERIFIED 100', width / 2, 150);

    // Spots remaining - large
    ctx.font = 'bold 120px Arial';
    ctx.fillStyle = '#f97316'; // orange-500
    ctx.fillText(`${SPOTS_REMAINING}`, width / 2, 300);

    // Spots remaining text
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SPOTS REMAINING', width / 2, 350);

    // Vienna event
    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#3b82f6'; // blue-500
    ctx.fillText('VIENNA • JULY 22-24', width / 2, 450);

    // Friday Night Lights
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('Friday Night Lights @ 7PM', width / 2, 500);

    // Price
    ctx.font = 'bold 84px Arial';
    ctx.fillStyle = '#10b981'; // green-500
    ctx.fillText('$100', width / 2, 650);

    // Lifetime text
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('LIFETIME ACCESS', width / 2, 690);

    // Bottom text
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('ONCE GONE, THEY\'RE GONE FOREVER', width / 2, 800);

    // URL
    ctx.font = '24px Arial';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('go4itsports.org/lifetime', width / 2, 950);
  };

  const generateStoryTemplate = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Background accent
    ctx.fillStyle = '#1e293b40'; // slate-800 with opacity
    ctx.fillRect(50, 200, width - 100, height - 400);

    // Title
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('VERIFIED 100', width / 2, 300);

    // Member number (if provided)
    if (memberNumber) {
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`I'M MEMBER #${memberNumber}`, width / 2, 400);
    }

    // Athlete name (if provided)
    if (athleteName) {
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#3b82f6'; // blue-500
      ctx.fillText(athleteName, width / 2, 500);
    }

    // Sport (if provided)
    if (sportName) {
      ctx.font = '28px Arial';
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.fillText(sportName, width / 2, 550);
    }

    // Vienna event
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('VIENNA EVENT', width / 2, 700);
    ctx.fillText('JULY 22-24', width / 2, 750);

    // Benefits
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    const benefits = [
      '✓ Lifetime GAR Score Testing',
      '✓ AI Coaching Reports',
      '✓ NCAA Eligibility Tools',
      '✓ Recruitment Analytics',
      '✓ Early Access to Features'
    ];
    benefits.forEach((benefit, i) => {
      ctx.fillText(benefit, 100, 900 + (i * 40));
    });

    // Price
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#10b981'; // green-500
    ctx.fillText('$100 ONCE • LIFETIME ACCESS', width / 2, 1400);

    // Spots remaining
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#f97316'; // orange-500
    ctx.fillText(`Only ${SPOTS_REMAINING} spots left!`, width / 2, 1500);

    // Hashtags
    ctx.font = '20px Arial';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('#Verified100 #LifetimeAthlete #ViennaEvent', width / 2, 1700);
  };

  const generateTwitterCard = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Title
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('THE VERIFIED 100', width / 2, 100);

    // Stats grid
    const stats = [
      { label: 'Spots Left', value: SPOTS_REMAINING, color: '#f97316' },
      { label: 'Price', value: '$100', color: '#10b981' },
      { label: 'Access', value: 'LIFETIME', color: '#3b82f6' }
    ];

    stats.forEach((stat, i) => {
      const x = (width / 4) + (i * (width / 4));
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = stat.color;
      ctx.fillText(stat.value, x, 250);
      
      ctx.font = '18px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(stat.label, x, 280);
    });

    // Vienna event
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('VIENNA EVENT • JULY 22-24', width / 2, 400);

    // Bottom text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('FOUNDERS GET LIFETIME STATUS', width / 2, 500);
    ctx.fillText('EVERYONE ELSE? PAY PER EVENT', width / 2, 530);

    // URL
    ctx.font = '20px Arial';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('go4itsports.org/lifetime', width / 2, 600);
  };

  const generateTikTokCover = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Large impact text
    ctx.font = 'bold 88px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('$100', width / 2, 400);

    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FOR LIFE?', width / 2, 470);

    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = '#10b981'; // green-500
    ctx.fillText('BELIEVE IT', width / 2, 600);

    // Spots remaining
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#f97316'; // orange-500
    ctx.fillText(`Only ${SPOTS_REMAINING} spots left`, width / 2, 800);

    // Vienna
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#3b82f6'; // blue-500
    ctx.fillText('VIENNA • JULY 22-24', width / 2, 900);

    // Bottom text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('THE VERIFIED 100', width / 2, 1200);

    // Hashtags
    ctx.font = '20px Arial';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('#Verified100 #LifetimeAthlete', width / 2, 1400);
  };

  const generateMemberBadge = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Circle background
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 200, 0, 2 * Math.PI);
    ctx.fill();

    // Crown icon (simplified)
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.font = '72px Arial';
    ctx.fillText('👑', width / 2, height / 2 - 30);

    // Badge text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('VERIFIED 100', width / 2, height / 2 + 20);

    // Member number
    if (memberNumber) {
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#fbbf24'; // yellow-400
      ctx.fillText(`MEMBER #${memberNumber}`, width / 2, height / 2 + 50);
    }

    // Bottom text
    ctx.font = '16px Arial';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('Go4It Sports', width / 2, height / 2 + 80);
  };

  const generateLeaderboardPost = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Title
    ctx.font = 'bold 56px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText('LEADERBOARD UPDATE', width / 2, 120);

    // Member info
    if (memberNumber && athleteName) {
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`#${memberNumber} - ${athleteName}`, width / 2, 250);
    }

    // Sport
    if (sportName) {
      ctx.font = '32px Arial';
      ctx.fillStyle = '#3b82f6'; // blue-500
      ctx.fillText(sportName, width / 2, 300);
    }

    // Stats
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#10b981'; // green-500
    ctx.fillText('VERIFIED MEMBER', width / 2, 450);

    // Vienna event
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('VIENNA BOUND', width / 2, 550);
    ctx.fillText('JULY 22-24', width / 2, 590);

    // Bottom stats
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText(`${SPOTS_REMAINING} spots remaining`, width / 2, 750);

    // URL
    ctx.font = '20px Arial';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.fillText('go4itsports.org/leaderboard', width / 2, 900);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `verified-100-${selectedTemplate}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('Image copied to clipboard!');
        }
      });
    } catch (err) {
      console.error('Failed to copy image:', err);
      alert('Failed to copy image. Try downloading instead.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-500 text-white font-bold text-lg px-6 py-2">
            SOCIAL MEDIA ASSETS
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VIRAL CONTENT GENERATOR
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Create professional social media assets to promote The Verified 100 membership
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Choose Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <div
                        key={template.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedTemplate === template.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 ${template.color} rounded-full flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{template.name}</h3>
                            <p className="text-xs text-slate-400">{template.dimensions}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300">{template.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Customize Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Member Number</Label>
                  <Input
                    value={memberNumber}
                    onChange={(e) => setMemberNumber(e.target.value)}
                    placeholder="27"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Athlete Name</Label>
                  <Input
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Sport</Label>
                  <Input
                    value={sportName}
                    onChange={(e) => setSportName(e.target.value)}
                    placeholder="Football"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Custom Text</Label>
                  <Textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Additional text for your post..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas and Controls */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => generateAsset(selectedTemplate)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Generate
                    </Button>
                    <Button
                      onClick={downloadImage}
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={copyImageToClipboard}
                      variant="outline"
                      className="border-slate-600 text-slate-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    className="border border-slate-600 rounded-lg max-w-full max-h-96"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Select a template from the left sidebar</li>
                  <li>Customize with your member number, name, and sport</li>
                  <li>Click "Generate" to create your asset</li>
                  <li>Download the image or copy to clipboard</li>
                  <li>Share on your social media platforms</li>
                </ol>
                
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 font-semibold mb-2">Pro Tips:</p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Use consistent hashtags: #Verified100 #LifetimeAthlete #ViennaEvent</li>
                    <li>• Post during peak engagement hours (7-9 PM)</li>
                    <li>• Include a call-to-action in your caption</li>
                    <li>• Share your personal story about joining</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}