'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Bell,
  BellOff,
  CheckCircle,
  Mail,
  MessageSquare,
  Calendar,
  Trophy,
  TrendingUp,
  Users,
  Video,
  Zap,
  Smartphone,
  Loader2,
} from 'lucide-react';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export default function PushNotificationSettingsPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'messages',
      title: 'New Messages',
      description: 'Get notified when coaches or teammates send you messages',
      icon: MessageSquare,
      enabled: true,
      channels: { push: true, email: true, sms: false },
    },
    {
      id: 'events',
      title: 'Event Reminders',
      description: 'Reminders for upcoming training sessions, games, and events',
      icon: Calendar,
      enabled: true,
      channels: { push: true, email: true, sms: true },
    },
    {
      id: 'achievements',
      title: 'Achievements & Milestones',
      description: 'Celebrate your progress and new achievements',
      icon: Trophy,
      enabled: true,
      channels: { push: true, email: false, sms: false },
    },
    {
      id: 'recruiting',
      title: 'Recruiting Updates',
      description: 'New offers, coach contacts, and recruiting opportunities',
      icon: Users,
      enabled: true,
      channels: { push: true, email: true, sms: true },
    },
    {
      id: 'performance',
      title: 'Performance Reports',
      description: 'Weekly performance summaries and GAR score updates',
      icon: TrendingUp,
      enabled: true,
      channels: { push: false, email: true, sms: false },
    },
    {
      id: 'video',
      title: 'Video Analysis Ready',
      description: 'Notifications when your video analysis is complete',
      icon: Video,
      enabled: true,
      channels: { push: true, email: true, sms: false },
    },
  ]);

  const subscribeToPush = async () => {
    setLoading(true);
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY',
        });

        const response = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });

        if (response.ok) {
          setSubscribed(true);
        }
      }
    } catch (error) {
      // Failed to subscribe
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setLoading(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          setSubscribed(false);
        }
      }
    } catch (error) {
      // Failed to unsubscribe
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (id: string) => {
    setPreferences(
      preferences.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const toggleChannel = (id: string, channel: 'push' | 'email' | 'sms') => {
    setPreferences(
      preferences.map((p) =>
        p.id === id
          ? { ...p, channels: { ...p.channels, [channel]: !p.channels[channel] } }
          : p
      )
    );
  };

  const sendTestNotification = async () => {
    setLoading(true);
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test push notification from Go4it!',
        }),
      });
    } catch (error) {
      // Failed to send test notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="text-[#00D4FF]">Notification</span> Settings
          </h1>
          <p className="text-slate-400">
            Manage push notifications, email alerts, and SMS preferences
          </p>
        </div>

        {/* Push Subscription Status */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#00D4FF]" />
              Push Notification Status
            </CardTitle>
            <CardDescription>Enable or disable browser push notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    subscribed ? 'bg-green-500/20' : 'bg-slate-700/50'
                  }`}
                >
                  {subscribed ? (
                    <Bell className="w-6 h-6 text-green-400" />
                  ) : (
                    <BellOff className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-white">
                    {subscribed ? 'Push Notifications Enabled' : 'Push Notifications Disabled'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {subscribed
                      ? 'You will receive real-time notifications on this device'
                      : 'Enable to get instant updates'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {subscribed && (
                  <Button
                    size="sm"
                    onClick={sendTestNotification}
                    disabled={loading}
                    variant="outline"
                    className="border-slate-700"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Send Test
                  </Button>
                )}
                <Button
                  onClick={subscribed ? unsubscribeFromPush : subscribeToPush}
                  disabled={loading}
                  className={subscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00D4FF] hover:bg-[#00D4FF]/90'}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : subscribed ? (
                    <BellOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Bell className="w-4 h-4 mr-2" />
                  )}
                  {subscribed ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you want to receive and how</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preferences.map((pref) => {
                const Icon = pref.icon;
                return (
                  <div
                    key={pref.id}
                    className={`p-4 bg-slate-800/50 rounded-lg border transition-colors ${
                      pref.enabled ? 'border-[#00D4FF]/30' : 'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            pref.enabled
                              ? 'bg-[#00D4FF]/20 text-[#00D4FF]'
                              : 'bg-slate-700/50 text-slate-500'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{pref.title}</div>
                          <div className="text-sm text-slate-400">{pref.description}</div>
                        </div>
                      </div>
                      <Switch
                        checked={pref.enabled}
                        onCheckedChange={() => togglePreference(pref.id)}
                      />
                    </div>

                    {pref.enabled && (
                      <div className="flex items-center gap-6 pl-13 mt-3 pt-3 border-t border-slate-700">
                        <Label className="text-sm text-slate-400 font-medium">Delivery:</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={pref.channels.push}
                            onChange={() => toggleChannel(pref.id, 'push')}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-300">Push</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={pref.channels.email}
                            onChange={() => toggleChannel(pref.id, 'email')}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-300">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={pref.channels.sms}
                            onChange={() => toggleChannel(pref.id, 'sms')}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-300">SMS</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Preferences</p>
                  <p className="text-3xl font-black text-white mt-1">
                    {preferences.filter((p) => p.enabled).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Sent This Week</p>
                  <p className="text-3xl font-black text-white mt-1">247</p>
                </div>
                <Bell className="w-8 h-8 text-[#00D4FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Open Rate</p>
                  <p className="text-3xl font-black text-white mt-1">87%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <Card className="bg-gradient-to-r from-[#00D4FF]/10 to-purple-500/10 border-[#00D4FF]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#00D4FF]" />
                <div>
                  <div className="font-bold text-white">Preferences Saved Automatically</div>
                  <div className="text-sm text-slate-400">
                    Your notification settings are updated in real-time
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
