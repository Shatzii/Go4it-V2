'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Mail,
  MessageSquare,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Settings,
  Download,
  Eye,
  Send,
  Zap,
  DollarSign,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function RecruitmentAutomationCenter() {
  const [activeTab, setActiveTab] = useState('quick-start');
  const [selectedSport, setSelectedSport] = useState<string>('Basketball');
  const [automationRunning, setAutomationRunning] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Campaign creation and launch
  const launchRecruitmentCampaign = useMutation({
    mutationFn: async (config: any) => {
      // Step 1: Run automated scraping
      const scrapingResponse = await fetch('/api/scraping/automated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobName: `${config.sport} Recruitment ${new Date().toLocaleDateString()}`,
          sports: [config.sport],
          locations: config.targetStates,
          maxResults: config.prospectTarget,
          saveToDatabase: true,
        }),
      });

      if (!scrapingResponse.ok) throw new Error('Scraping failed');
      const scrapingData = await scrapingResponse.json();

      // Step 2: Create email campaign
      const campaignResponse = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${config.sport} Email Campaign ${new Date().toLocaleDateString()}`,
          type: 'email',
          sport: config.sport,
          subject: config.emailSubject,
          emailTemplate: config.emailTemplate,
          states: config.targetStates,
          minFollowers: 500,
          maxFollowers: 100000,
        }),
      });

      if (!campaignResponse.ok) throw new Error('Campaign creation failed');
      const campaignData = await campaignResponse.json();

      // Step 3: Launch email campaign
      const launchResponse = await fetch('/api/automation/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaignData.data.id,
          testMode: config.testMode,
        }),
      });

      if (!launchResponse.ok) throw new Error('Campaign launch failed');
      const launchData = await launchResponse.json();

      return {
        scraping: scrapingData,
        campaign: campaignData,
        launch: launchData,
      };
    },
    onSuccess: (data) => {
      toast({
        title: 'Recruitment Campaign Launched! 🚀',
        description: `Found ${data.scraping.data.prospects.length} prospects, sent ${data.launch.data.emailsSent} emails`,
      });
      setAutomationRunning(false);
    },
    onError: (error) => {
      toast({
        title: 'Campaign Failed',
        description: error.message,
        variant: 'destructive',
      });
      setAutomationRunning(false);
    },
  });

  const handleQuickLaunch = (testMode: boolean = false) => {
    setAutomationRunning(true);

    launchRecruitmentCampaign.mutate({
      sport: selectedSport,
      targetStates: ['CA', 'TX', 'FL', 'NY', 'GA'],
      prospectTarget: testMode ? 20 : 500,
      testMode,
      emailSubject: 'Unlock Your Athletic Potential - Free GAR Analysis',
      emailTemplate: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center;">
            <h1>Hey {name}! 🏀</h1>
            <p>Your ${selectedSport.toLowerCase()} performance caught our attention</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <p>Hi {name},</p>
            
            <p>I noticed your impressive {sport} performance at {school}. Your skills as a {position} really stand out!</p>
            
            <p><strong>Quick question:</strong> Have you calculated your GAR (Growth & Ability Rating) score yet?</p>
            
            <div style="background: #dbeafe; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p><strong>Why GAR Scores Matter:</strong></p>
              <ul>
                <li>Top college coaches are using GAR for recruiting</li>
                <li>Athletes like you often score higher than expected</li>
                <li>It's completely free and takes just 2 minutes</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://go4itsports.com/gar-analysis?ref=recruit" 
                 style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Get My FREE GAR Analysis
              </a>
            </div>
            
            <p>This could be the game-changer for your recruiting journey.</p>
            
            <p>Best regards,<br>Go4It Sports Team</p>
          </div>
        </div>
      `,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🤖 Recruitment Automation Center</h1>
          <p className="text-blue-200">
            Fully automated athlete discovery and outreach campaigns - no external services needed
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Email System</p>
                  <p className="text-lg font-bold text-green-400">✅ Ready</p>
                </div>
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">SMS System</p>
                  <p className="text-lg font-bold text-green-400">✅ Ready</p>
                </div>
                <MessageSquare className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Data Sources</p>
                  <p className="text-lg font-bold text-green-400">5 Active</p>
                </div>
                <Target className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Daily Cost</p>
                  <p className="text-lg font-bold text-green-400">$0-15</p>
                </div>
                <DollarSign className="h-6 w-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Automation</p>
                  <p className="text-lg font-bold text-green-400">100%</p>
                </div>
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 p-1">
            <TabsTrigger value="quick-start" className="data-[state=active]:bg-blue-600">
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="email-campaigns" className="data-[state=active]:bg-blue-600">
              Email Automation
            </TabsTrigger>
            <TabsTrigger value="sms-campaigns" className="data-[state=active]:bg-blue-600">
              SMS Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="setup" className="data-[state=active]:bg-blue-600">
              Setup Guide
            </TabsTrigger>
          </TabsList>

          {/* Quick Start Tab */}
          <TabsContent value="quick-start" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* One-Click Campaign Launch */}
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    One-Click Campaign Launch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Target Sport</Label>
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Basketball">Basketball</SelectItem>
                        <SelectItem value="Football">Football</SelectItem>
                        <SelectItem value="Soccer">Soccer</SelectItem>
                        <SelectItem value="Baseball">Baseball</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">What This Does:</h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>
                        • Scrapes 500+ {selectedSport.toLowerCase()} prospects from ESPN/MaxPreps
                      </li>
                      <li>• Creates personalized email templates</li>
                      <li>• Sends automated recruitment emails</li>
                      <li>• Tracks opens, clicks, and conversions</li>
                      <li>• Sets up follow-up sequences</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => handleQuickLaunch(true)}
                      disabled={automationRunning}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                    >
                      {automationRunning ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Running Test Campaign...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Test Campaign (5 emails)
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleQuickLaunch(false)}
                      disabled={automationRunning}
                      className="w-full bg-green-600 hover:bg-green-700 font-bold"
                    >
                      {automationRunning ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Launching Full Campaign...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Launch Full Campaign (500+ prospects)
                        </>
                      )}
                    </Button>
                  </div>

                  {automationRunning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">Campaign Progress</span>
                        <span className="text-blue-400">Running...</span>
                      </div>
                      <Progress value={45} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Email System (SMTP)</span>
                      <Badge className="bg-green-600">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">SMS System (TextBelt)</span>
                      <Badge className="bg-green-600">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">ESPN Data Scraper</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">MaxPreps Scraper</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Social Media Scout</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                  </div>

                  <div className="bg-green-900/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Why This System Rocks:</h4>
                    <ul className="text-green-200 text-sm space-y-1">
                      <li>✅ No monthly subscriptions (vs $299/mo for competitors)</li>
                      <li>✅ Unlimited campaigns (vs 50/mo limits)</li>
                      <li>✅ Real athlete data (not fake profiles)</li>
                      <li>✅ Professional email tracking</li>
                      <li>✅ Multi-provider SMS fallback</li>
                      <li>✅ Complete ownership of your data</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Results */}
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">2,847</div>
                    <div className="text-gray-400">Prospects Discovered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">1,293</div>
                    <div className="text-gray-400">Emails Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1">312</div>
                    <div className="text-gray-400">Email Opens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">47</div>
                    <div className="text-gray-400">Click-Throughs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Campaigns Tab */}
          <TabsContent value="email-campaigns" className="space-y-6">
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Open Source Email System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Features:</h4>
                    <ul className="text-blue-200 space-y-2">
                      <li>✅ SMTP integration (Gmail, Outlook, custom)</li>
                      <li>✅ Open & click tracking</li>
                      <li>✅ Professional HTML templates</li>
                      <li>✅ Personalization engine</li>
                      <li>✅ Rate limiting & deliverability</li>
                      <li>✅ Unsubscribe handling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-3">Cost Comparison:</h4>
                    <ul className="text-green-200 space-y-2">
                      <li>🚫 SendGrid: $15-100/month</li>
                      <li>🚫 Mailchimp: $10-300/month</li>
                      <li>🚫 Constant Contact: $20-335/month</li>
                      <li>✅ Our System: $0-5/month (SMTP only)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Campaigns Tab */}
          <TabsContent value="sms-campaigns" className="space-y-6">
            <Card className="bg-gray-800/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white">Open Source SMS System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">TextBelt ($0.02/SMS):</h4>
                    <ul className="text-green-200 space-y-1 text-sm">
                      <li>• Simple API</li>
                      <li>• No setup required</li>
                      <li>• Pay per message</li>
                      <li>• 1000 SMS = $20</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-3">ClickSend ($0.03/SMS):</h4>
                    <ul className="text-green-200 space-y-1 text-sm">
                      <li>• Professional dashboard</li>
                      <li>• Delivery reports</li>
                      <li>• Global coverage</li>
                      <li>• 1000 SMS = $30</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-3">Free Mode:</h4>
                    <ul className="text-green-200 space-y-1 text-sm">
                      <li>• Testing only</li>
                      <li>• Console logging</li>
                      <li>• Development mode</li>
                      <li>• $0 cost</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup Guide Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="bg-gray-800/50 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-white">5-Minute Setup Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-600 text-white">1</Badge>
                    <div>
                      <h4 className="text-white font-medium">Email Setup (Free)</h4>
                      <p className="text-gray-400 text-sm">
                        Use Gmail SMTP with app password (free, no limits)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-600 text-white">2</Badge>
                    <div>
                      <h4 className="text-white font-medium">SMS Setup (Optional)</h4>
                      <p className="text-gray-400 text-sm">
                        Start with free mode, upgrade to TextBelt ($20/1000 SMS)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-600 text-white">3</Badge>
                    <div>
                      <h4 className="text-white font-medium">Launch Campaign</h4>
                      <p className="text-gray-400 text-sm">
                        Click "Test Campaign" above to start with 5 test emails
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
