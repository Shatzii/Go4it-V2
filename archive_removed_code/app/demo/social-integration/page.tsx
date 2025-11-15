'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Plus,
  CheckCircle,
  Users,
  Send,
  Zap,
  ArrowRight,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const platformIcons = {
  instagram: { icon: Instagram, color: 'text-purple-500', gradient: 'from-purple-600 to-pink-600' },
  twitter: { icon: Twitter, color: 'text-blue-500', gradient: 'from-blue-400 to-blue-600' },
  facebook: { icon: Facebook, color: 'text-blue-600', gradient: 'from-blue-600 to-blue-800' },
  linkedin: { icon: Linkedin, color: 'text-blue-700', gradient: 'from-blue-700 to-blue-900' },
  youtube: { icon: Youtube, color: 'text-red-600', gradient: 'from-red-600 to-red-800' },
};

export default function SocialIntegrationDemo() {
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [testPost, setTestPost] = useState(
    "🏀 This basketball player's GAR score went from 67 to 89 in just 6 weeks!\n\n• Improved shooting accuracy by 23%\n• Increased vertical jump 4 inches  \n• Landed 3 D1 scholarship offers\n\nReady to unlock YOUR potential? Try GAR Analysis free! 👆\n\n#Basketball #AthleteGrowth #GAR #Go4ItSports #Recruiting",
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get platform configurations
  const { data: platformsData } = useQuery({
    queryKey: ['/api/social-media/connect'],
  });

  // Get connected accounts
  const { data: accountsData } = useQuery({
    queryKey: ['/api/social-media/connect?userId=demo_user'],
  });

  // Connect account mutation
  const connectAccount = useMutation({
    mutationFn: async (connectionData: any) => {
      const response = await fetch('/api/social-media/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionData),
      });
      if (!response.ok) throw new Error('Connection failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Account Connected!',
        description: `${data.data.platform} account @${data.data.username} connected successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-media/connect'] });
      setStep(3); // Move to posting step
    },
    onError: (error) => {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Test post mutation
  const createPost = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch('/api/social-media/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Post failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Post Published!',
        description: 'Successfully demonstrated social media posting',
      });
      setStep(4); // Move to results step
    },
    onError: (error) => {
      toast({
        title: 'Post Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const availablePlatforms = (platformsData as any)?.data?.supportedPlatforms || [
    { platform: 'instagram', name: 'Instagram', limits: { charactersPerPost: 2200 } },
    { platform: 'twitter', name: 'Twitter', limits: { charactersPerPost: 280 } },
    { platform: 'facebook', name: 'Facebook', limits: { charactersPerPost: 63206 } },
    { platform: 'linkedin', name: 'LinkedIn', limits: { charactersPerPost: 3000 } },
    { platform: 'youtube', name: 'YouTube', limits: { charactersPerPost: 5000 } }
  ];
  const connectedAccounts = (accountsData as any)?.data?.accounts || [];

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setStep(2);
  };

  const handleConnect = () => {
    if (!selectedPlatform || !username) {
      toast({
        title: 'Missing Information',
        description: 'Please provide platform and username',
        variant: 'destructive',
      });
      return;
    }

    connectAccount.mutate({
      userId: 'demo_user',
      platform: selectedPlatform,
      manualConnection: true,
      username,
      accountUrl: `https://${selectedPlatform}.com/${username}`,
    });
  };

  const handleTestPost = () => {
    if (connectedAccounts.length === 0) {
      toast({
        title: 'No Accounts Connected',
        description: 'Please connect an account first',
        variant: 'destructive',
      });
      return;
    }

    createPost.mutate({
      accountIds: [connectedAccounts[0].id],
      content: { text: testPost },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <LinkIcon className="h-10 w-10 text-blue-400" />
            Social Media Integration Demo
          </h1>
          <p className="text-blue-200">
            See how Go4It Sports integrates with your social media accounts for automated posting
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <ArrowRight
                    className={`h-4 w-4 mx-2 ${
                      step > stepNumber ? 'text-blue-400' : 'text-gray-500'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Platform Selection */}
          {step === 1 && (
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Step 1: Select a Platform to Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePlatforms.map((platform: any) => {
                    const platformInfo =
                      platformIcons[platform.platform as keyof typeof platformIcons];
                    const IconComponent = platformInfo?.icon;

                    return (
                      <Card
                        key={platform.platform}
                        className="bg-gray-700/50 border-gray-600/30 cursor-pointer hover:border-blue-500/50 transition-all"
                        onClick={() => handlePlatformSelect(platform.platform)}
                      >
                        <div className={`h-2 bg-gradient-to-r ${platformInfo?.gradient}`} />
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            {IconComponent && (
                              <IconComponent className={`h-8 w-8 ${platformInfo.color}`} />
                            )}
                            <div>
                              <h3 className="text-white font-medium">{platform.name}</h3>
                              <p className="text-gray-400 text-sm">
                                {platform.limits.charactersPerPost} chars max
                              </p>
                            </div>
                          </div>

                          <div className="text-sm text-gray-300">
                            <p className="mb-1">✓ Content generation</p>
                            <p className="mb-1">✓ Smart optimization</p>
                            <p>✓ Analytics tracking</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Account Connection */}
          {step === 2 && selectedPlatform && (
            <Card className="bg-gray-800/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Step 2: Connect Your{' '}
                  {availablePlatforms.find((p: any) => p.platform === selectedPlatform)?.name}{' '}
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <LinkIcon className="h-4 w-4" />
                  <AlertDescription>
                    For this demo, we'll use manual connection. In production, you'd use OAuth for
                    full automation.
                  </AlertDescription>
                </Alert>

                <div className="max-w-md mx-auto space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Your Username</Label>
                    <Input
                      placeholder={`@your${selectedPlatform}username`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleConnect}
                      disabled={connectAccount.isPending || !username}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {connectAccount.isPending ? 'Connecting...' : 'Connect Account'}
                    </Button>
                    <Button variant="outline" onClick={() => setStep(1)} className="px-4">
                      Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Test Posting */}
          {step === 3 && (
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Step 3: Test Social Media Posting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Connected Account Display */}
                {connectedAccounts.length > 0 && (
                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <h4 className="text-white font-medium">Connected Account</h4>
                    </div>
                    {connectedAccounts.map((account: any) => (
                      <div key={account.id} className="flex items-center gap-3">
                        {platformIcons[account.platform as keyof typeof platformIcons]?.icon &&
                          React.createElement(
                            platformIcons[account.platform as keyof typeof platformIcons].icon,
                            {
                              className: `h-5 w-5 ${platformIcons[account.platform as keyof typeof platformIcons].color}`,
                            },
                          )}
                        <span className="text-white capitalize">{account.platform}</span>
                        <span className="text-gray-400">@{account.username}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Test Post Content */}
                <div className="space-y-2">
                  <Label className="text-white">Demo Post Content</Label>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-line text-sm">{testPost}</p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    This is sample content showcasing Go4It Sports features
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleTestPost}
                    disabled={createPost.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {createPost.isPending ? (
                      'Posting...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Test Post Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Success Results */}
          {step === 4 && (
            <Card className="bg-gray-800/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Integration Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="bg-green-900/20 p-6 rounded-lg border border-green-500/30 mb-6">
                    <h3 className="text-white font-semibold mb-2">
                      ✅ Social Media Integration Working
                    </h3>
                    <p className="text-gray-300">
                      Your account has been connected and the test post was successfully processed!
                    </p>
                  </div>

                  {/* Features Enabled */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium">AI Content Generation</h4>
                      <p className="text-gray-400 text-sm">Automatic viral content creation</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <h4 className="text-white font-medium">Multi-Platform Posting</h4>
                      <p className="text-gray-400 text-sm">Post to all platforms simultaneously</p>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Access Your Social Media Tools:</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() => window.open('/admin/social-hub', '_blank')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Social Media Hub
                      </Button>

                      <Button
                        onClick={() => window.open('/admin/social-accounts', '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Manage Accounts
                      </Button>

                      <Button
                        onClick={() => window.open('/admin/viral-content', '_blank')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Viral Content Generator
                      </Button>

                      <Button
                        onClick={() => window.open('/admin/social-media', '_blank')}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Campaign Automation
                      </Button>
                    </div>

                    <Button
                      onClick={() => {
                        setStep(1);
                        setSelectedPlatform('');
                        setUsername('');
                      }}
                      variant="outline"
                      className="mt-4"
                    >
                      Try Another Platform
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
