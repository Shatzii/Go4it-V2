'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  DollarSign,
  Share2,
  Copy,
  CheckCircle,
  TrendingUp,
  Gift,
  Mail,
  MessageSquare,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from 'lucide-react';

interface Referral {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'signed_up' | 'converted';
  signupDate?: string;
  conversionDate?: string;
  reward: number;
}

export default function ReferralProgramPage() {
  const [referralCode, setReferralCode] = useState('GO4IT-JM2026');
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: 1,
      name: 'Tyler Jackson',
      email: 'tyler.j@email.com',
      status: 'converted',
      signupDate: '2025-10-15',
      conversionDate: '2025-10-22',
      reward: 50,
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      email: 'sarah.m@email.com',
      status: 'signed_up',
      signupDate: '2025-11-01',
      reward: 25,
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.d@email.com',
      status: 'pending',
      reward: 0,
    },
  ]);

  const referralUrl = `https://go4it.app/join?ref=${referralCode}`;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Join Go4it with my referral&body=Hey! I've been using Go4it to level up my athletic performance. Join using my link: ${referralUrl}`;
  };

  const shareViaSMS = () => {
    window.location.href = `sms:?body=Check out Go4it! Use my referral code: ${referralCode} or join here: ${referralUrl}`;
  };

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Leveling up my game with @Go4it! Join me: ${referralUrl}`,
      '_blank'
    );
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${referralUrl}`, '_blank');
  };

  const totalEarned = referrals.reduce((acc, r) => acc + r.reward, 0);
  const conversionRate =
    referrals.length > 0
      ? ((referrals.filter((r) => r.status === 'converted').length / referrals.length) * 100).toFixed(1)
      : 0;

  const statusConfig = {
    pending: { color: 'bg-slate-500', text: 'Pending' },
    signed_up: { color: 'bg-blue-500', text: 'Signed Up' },
    converted: { color: 'bg-green-500', text: 'Converted' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Referral <span className="text-[#00D4FF]">Program</span>
          </h1>
          <p className="text-slate-400">
            Earn rewards by inviting teammates and friends to join Go4it
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Earned</p>
                  <p className="text-3xl font-black text-white mt-1">${totalEarned}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Referrals</p>
                  <p className="text-3xl font-black text-white mt-1">{referrals.length}</p>
                </div>
                <Users className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Converted</p>
                  <p className="text-3xl font-black text-white mt-1">
                    {referrals.filter((r) => r.status === 'converted').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Conversion Rate</p>
                  <p className="text-3xl font-black text-white mt-1">{conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code Section */}
        <Card className="bg-gradient-to-r from-[#00D4FF]/10 to-purple-500/10 border-[#00D4FF]/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#00D4FF]" />
              Your Referral Code
            </CardTitle>
            <CardDescription>Share your unique code or link to earn rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={referralCode}
                readOnly
                className="bg-slate-900/50 border-slate-700 text-white font-mono text-lg"
              />
              <Button onClick={copyReferralCode} className="bg-[#00D4FF] text-slate-950">
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                value={referralUrl}
                readOnly
                className="bg-slate-900/50 border-slate-700 text-white text-sm"
              />
              <Button onClick={copyReferralUrl} variant="outline" className="border-slate-700">
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>

            {/* Share Buttons */}
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Share via:</p>
              <div className="grid grid-cols-4 gap-2">
                <Button onClick={shareViaEmail} variant="outline" className="border-slate-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button onClick={shareViaSMS} variant="outline" className="border-slate-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS
                </Button>
                <Button onClick={shareViaTwitter} variant="outline" className="border-slate-700">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button onClick={shareViaFacebook} variant="outline" className="border-slate-700">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Structure */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Reward Structure</CardTitle>
            <CardDescription>Here&apos;s how you earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">$25</div>
                <div className="text-sm text-slate-400">When they sign up</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-green-500/30">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">$50</div>
                <div className="text-sm text-slate-400">When they subscribe</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                  <Gift className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">10%</div>
                <div className="text-sm text-slate-400">Recurring commission</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Your Referrals</CardTitle>
            <CardDescription>Track the status of people you&apos;ve referred</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((referral) => {
                const config = statusConfig[referral.status];
                return (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {referral.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-white">{referral.name}</div>
                        <div className="text-sm text-slate-400">{referral.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {referral.signupDate && (
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Signed up</div>
                          <div className="text-sm text-slate-300">{referral.signupDate}</div>
                        </div>
                      )}
                      {referral.reward > 0 && (
                        <div className="px-3 py-1 bg-green-500/20 rounded-lg">
                          <span className="text-green-400 font-bold">${referral.reward}</span>
                        </div>
                      )}
                      <Badge className={`${config.color} text-white`}>{config.text}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
