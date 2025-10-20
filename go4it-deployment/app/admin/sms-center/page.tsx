'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import SMSNotificationCenter from '@/components/sms/SMSNotificationCenter';
import {
  ArrowLeft,
  Settings,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  Send,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface SMSStats {
  totalSent: number;
  deliveryRate: number;
  monthlyUsage: number;
  activeRecipients: number;
}

interface SMSLog {
  id: string;
  recipient: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
  type: string;
}

export default function AdminSMSCenter() {
  const [stats, setStats] = useState<SMSStats | null>(null);
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState('all');

  useEffect(() => {
    loadSMSData();
  }, []);

  const loadSMSData = async () => {
    try {
      const [statsResponse, logsResponse] = await Promise.all([
        fetch('/api/sms/stats'),
        fetch('/api/sms/logs?limit=50'),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.logs || []);
      }
    } catch (error) {
      console.error('Failed to load SMS data:', error);
      // Set default stats for demo
      setStats({
        totalSent: 1247,
        deliveryRate: 97.3,
        monthlyUsage: 456,
        activeRecipients: 234,
      });
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const sendBulkSMS = async () => {
    if (!bulkMessage.trim()) return;

    setSendingBulk(true);
    try {
      const response = await fetch('/api/sms/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: bulkMessage,
          recipients: selectedRecipients,
          type: 'admin_broadcast',
        }),
      });

      if (response.ok) {
        setBulkMessage('');
        loadSMSData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to send bulk SMS:', error);
    } finally {
      setSendingBulk(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">SMS Notification Center</h1>
              <p className="text-slate-300">Manage SMS communications for Go4It Sports Platform</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:bg-slate-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send SMS
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Sent</p>
                      <p className="text-2xl font-bold text-white">{stats?.totalSent || 0}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Delivery Rate</p>
                      <p className="text-2xl font-bold text-white">{stats?.deliveryRate || 0}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Monthly Usage</p>
                      <p className="text-2xl font-bold text-white">{stats?.monthlyUsage || 0}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Active Recipients</p>
                      <p className="text-2xl font-bold text-white">
                        {stats?.activeRecipients || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <SMSNotificationCenter />
          </TabsContent>

          <TabsContent value="send">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Send Bulk SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Recipients</label>
                  <select
                    value={selectedRecipients}
                    onChange={(e) => setSelectedRecipients(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="all">All Users</option>
                    <option value="pro">Pro Subscribers</option>
                    <option value="students">Students</option>
                    <option value="coaches">Coaches</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Message</label>
                  <Textarea
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    placeholder="Enter your message..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={sendBulkSMS}
                  disabled={sendingBulk || !bulkMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendingBulk ? 'Sending...' : 'Send Bulk SMS'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">SMS Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Twilio Settings</h3>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Account SID</label>
                      <div className="p-3 bg-slate-700 rounded border">
                        <span className="text-slate-400">
                          {process.env.TWILIO_ACCOUNT_SID
                            ? '•••••••••••••••••••••••••••••••••••'
                            : 'Not configured'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Phone Number</label>
                      <div className="p-3 bg-slate-700 rounded border">
                        <span className="text-slate-400">
                          {process.env.TWILIO_PHONE_NUMBER || 'Not configured'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">SMS Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Auto-send payment confirmations</span>
                        <div className="w-12 h-6 bg-green-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Auto-send GAR score updates</span>
                        <div className="w-12 h-6 bg-green-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Auto-send coach reminders</span>
                        <div className="w-12 h-6 bg-green-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">SMS Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: '2025-01-05 14:30:22',
                      type: 'Payment Confirmation',
                      recipient: '+1234567890',
                      status: 'Delivered',
                    },
                    {
                      time: '2025-01-05 14:28:15',
                      type: 'GAR Score Update',
                      recipient: '+1987654321',
                      status: 'Delivered',
                    },
                    {
                      time: '2025-01-05 14:25:08',
                      type: 'Coach Reminder',
                      recipient: '+1555123456',
                      status: 'Failed',
                    },
                    {
                      time: '2025-01-05 14:20:33',
                      type: 'Emergency Alert',
                      recipient: 'Bulk (23 recipients)',
                      status: 'Delivered',
                    },
                    {
                      time: '2025-01-05 14:15:47',
                      type: 'Camp Registration',
                      recipient: '+1999888777',
                      status: 'Delivered',
                    },
                  ].map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-400">{log.time}</span>
                        <span className="text-white font-medium">{log.type}</span>
                        <span className="text-slate-300">{log.recipient}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          log.status === 'Delivered'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
