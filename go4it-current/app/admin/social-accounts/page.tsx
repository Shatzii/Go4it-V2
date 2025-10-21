'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BarChart3,
  Settings,
  Trash2,
  ExternalLink,
  AlertTriangle,
  Link as LinkIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
};

const platformColors = {
  instagram: 'from-purple-600 to-pink-600',
  twitter: 'from-blue-400 to-blue-600',
  facebook: 'from-blue-600 to-blue-800',
  linkedin: 'from-blue-700 to-blue-900',
  youtube: 'from-red-600 to-red-800',
  tiktok: 'from-black to-gray-800',
};

export default function SocialAccountsManager() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [manualConnectionData, setManualConnectionData] = useState({
    platform: '',
    username: '',
    accountUrl: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get connected accounts
  const { data: accountsData, isLoading } = useQuery({
    queryKey: ['/api/social-media/connect?userId=demo_user'],
  });

  // Get platform configurations
  const { data: platformsData } = useQuery({
    queryKey: ['/api/social-media/connect'],
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
      setConnectingPlatform(null);
      setManualConnectionData({ platform: '', username: '', accountUrl: '' });
    },
    onError: (error) => {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
      setConnectingPlatform(null);
    },
  });

  const connectedAccounts = accountsData?.data?.accounts || [];
  const availablePlatforms = platformsData?.data?.supportedPlatforms || [];

  const handleOAuthConnect = (platform: string) => {
    setConnectingPlatform(platform);

    // In production, this would open OAuth popup
    setTimeout(() => {
      connectAccount.mutate({
        userId: 'demo_user',
        platform,
        authCode: `demo_auth_code_${Date.now()}`,
        redirectUri: `${window.location.origin}/auth/callback/${platform}`,
      });
    }, 2000);
  };

  const handleManualConnect = () => {
    if (!manualConnectionData.platform || !manualConnectionData.username) {
      toast({
        title: 'Missing Information',
        description: 'Please provide platform and username',
        variant: 'destructive',
      });
      return;
    }

    connectAccount.mutate({
      userId: 'demo_user',
      platform: manualConnectionData.platform,
      manualConnection: true,
      username: manualConnectionData.username,
      accountUrl: manualConnectionData.accountUrl,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'bg-green-600',
      expired: 'bg-yellow-600',
      error: 'bg-red-600',
      pending: 'bg-gray-600',
    };

    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <LinkIcon className="h-10 w-10 text-blue-400" />
            Social Media Accounts
          </h1>
          <p className="text-blue-200">
            Connect and manage your social media accounts for automated posting and analytics
          </p>
        </div>

        {/* Connection Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Connected</p>
                  <p className="text-2xl font-bold text-white">{connectedAccounts.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Followers</p>
                  <p className="text-2xl font-bold text-white">
                    {connectedAccounts
                      .reduce((sum: number, acc: any) => sum + (acc.followers || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Platforms</p>
                  <p className="text-2xl font-bold text-white">{availablePlatforms.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Active Posts</p>
                  <p className="text-2xl font-bold text-white">47</p>
                </div>
                <Settings className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 p-1 grid grid-cols-3 w-full">
            <TabsTrigger value="accounts" className="data-[state=active]:bg-blue-600">
              Connected Accounts
            </TabsTrigger>
            <TabsTrigger value="connect" className="data-[state=active]:bg-blue-600">
              Add Accounts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Connected Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            {connectedAccounts.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-600/30">
                <CardContent className="p-8 text-center">
                  <LinkIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Accounts Connected</h3>
                  <p className="text-gray-400 mb-4">
                    Connect your social media accounts to enable automated posting and analytics
                  </p>
                  <Button
                    onClick={() => setActiveTab('connect')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedAccounts.map((account: any) => {
                  const IconComponent =
                    platformIcons[account.platform as keyof typeof platformIcons];
                  const gradientColor =
                    platformColors[account.platform as keyof typeof platformColors];

                  return (
                    <Card
                      key={account.id}
                      className="bg-gray-800/50 border-gray-600/30 overflow-hidden"
                    >
                      <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
                            <div>
                              <h3 className="text-white font-medium capitalize">
                                {account.platform}
                              </h3>
                              <p className="text-gray-400 text-sm">@{account.username}</p>
                            </div>
                          </div>
                          {getStatusIcon(account.connectionStatus)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Status</span>
                          {getStatusBadge(account.connectionStatus)}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Followers</span>
                          <span className="text-white">
                            {account.followers?.toLocaleString() || '0'}
                          </span>
                        </div>

                        {account.isVerified && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Verified</span>
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Last Sync</span>
                          <span className="text-white text-sm">
                            {new Date(account.lastSync).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => window.open(account.profileUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 border-red-400/50 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Add Accounts Tab */}
          <TabsContent value="connect" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Connect your social media accounts to enable automated posting, scheduling, and
                analytics tracking.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlatforms.map((platform: any) => {
                const IconComponent =
                  platformIcons[platform.platform as keyof typeof platformIcons];
                const gradientColor =
                  platformColors[platform.platform as keyof typeof platformColors];
                const isConnected = connectedAccounts.some(
                  (acc: any) => acc.platform === platform.platform,
                );
                const isConnecting = connectingPlatform === platform.platform;

                return (
                  <Card key={platform.platform} className="bg-gray-800/50 border-gray-600/30">
                    <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
                          <div>
                            <h3 className="text-white font-medium">{platform.name}</h3>
                            {isConnected && (
                              <Badge className="bg-green-600 text-xs mt-1">Connected</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-300">
                        <p className="font-medium mb-2">Features:</p>
                        <ul className="space-y-1">
                          {platform.features.canPost && <li>• Automated posting</li>}
                          {platform.features.canSchedule && <li>• Content scheduling</li>}
                          {platform.features.canAnalyze && <li>• Analytics tracking</li>}
                          {platform.features.canMessage && <li>• Direct messaging</li>}
                        </ul>
                      </div>

                      <div className="text-sm text-gray-400">
                        <p>Limit: {platform.limits.postsPerDay} posts/day</p>
                        <p>Characters: {platform.limits.charactersPerPost}</p>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={() => handleOAuthConnect(platform.platform)}
                          disabled={isConnected || isConnecting}
                          className={`w-full bg-gradient-to-r ${gradientColor} hover:opacity-90`}
                        >
                          {isConnecting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Connecting...
                            </>
                          ) : isConnected ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Connected
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Connect via OAuth
                            </>
                          )}
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full"
                              disabled={isConnected}
                              onClick={() =>
                                setManualConnectionData({
                                  ...manualConnectionData,
                                  platform: platform.platform,
                                })
                              }
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Manual Connection
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Add {platform.name} Account Manually
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  Manual connection provides content generation but requires you to
                                  post manually.
                                </AlertDescription>
                              </Alert>

                              <div className="space-y-2">
                                <Label className="text-white">Username</Label>
                                <Input
                                  placeholder="@yourusername"
                                  value={manualConnectionData.username}
                                  onChange={(e) =>
                                    setManualConnectionData({
                                      ...manualConnectionData,
                                      username: e.target.value,
                                    })
                                  }
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-white">Profile URL (Optional)</Label>
                                <Input
                                  placeholder={`https://${platform.platform}.com/yourusername`}
                                  value={manualConnectionData.accountUrl}
                                  onChange={(e) =>
                                    setManualConnectionData({
                                      ...manualConnectionData,
                                      accountUrl: e.target.value,
                                    })
                                  }
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>

                              <Button
                                onClick={handleManualConnect}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={connectAccount.isPending}
                              >
                                {connectAccount.isPending ? 'Adding Account...' : 'Add Account'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Account Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {connectedAccounts.length > 0 ? (
                    <div className="space-y-4">
                      {connectedAccounts.map((account: any) => (
                        <div
                          key={account.id}
                          className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="capitalize text-white font-medium">
                              {account.platform}
                            </div>
                            <div className="text-gray-400">@{account.username}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {account.followers?.toLocaleString() || '0'}
                            </div>
                            <div className="text-gray-400 text-sm">followers</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Connect accounts to see analytics</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">Engagement Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">8.7%</div>
                      <div className="text-gray-400">Average Engagement Rate</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">2.4K</div>
                        <div className="text-gray-400 text-sm">Total Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">467</div>
                        <div className="text-gray-400 text-sm">Comments</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
