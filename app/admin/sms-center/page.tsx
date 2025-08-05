'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SMSNotificationCenter from '@/components/sms/SMSNotificationCenter';
import { ArrowLeft, Settings, MessageSquare, BarChart3, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminSMSCenter() {
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
            <SMSNotificationCenter />
          </TabsContent>

          <TabsContent value="send">
            <SMSNotificationCenter />
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
                          {process.env.TWILIO_ACCOUNT_SID ? '•••••••••••••••••••••••••••••••••••' : 'Not configured'}
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
                    { time: '2025-01-05 14:30:22', type: 'Payment Confirmation', recipient: '+1234567890', status: 'Delivered' },
                    { time: '2025-01-05 14:28:15', type: 'GAR Score Update', recipient: '+1987654321', status: 'Delivered' },
                    { time: '2025-01-05 14:25:08', type: 'Coach Reminder', recipient: '+1555123456', status: 'Failed' },
                    { time: '2025-01-05 14:20:33', type: 'Emergency Alert', recipient: 'Bulk (23 recipients)', status: 'Delivered' },
                    { time: '2025-01-05 14:15:47', type: 'Camp Registration', recipient: '+1999888777', status: 'Delivered' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-400">{log.time}</span>
                        <span className="text-white font-medium">{log.type}</span>
                        <span className="text-slate-300">{log.recipient}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.status === 'Delivered' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
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