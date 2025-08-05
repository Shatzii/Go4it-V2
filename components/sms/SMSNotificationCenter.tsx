'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SMSStats {
  totalSent: number;
  totalFailed: number;
  totalUsers: number;
  lastSent: string;
}

interface SMSTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
}

export default function SMSNotificationCenter() {
  const [stats, setStats] = useState<SMSStats>({
    totalSent: 0,
    totalFailed: 0,
    totalUsers: 0,
    lastSent: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [recipients, setRecipients] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<any>(null);

  const templates: SMSTemplate[] = [
    {
      id: 'payment_confirmation',
      name: 'Payment Confirmation',
      category: 'Billing',
      template: '✅ Payment confirmed: ${{amount}} for {{description}}. Thank you!',
      variables: ['amount', 'description']
    },
    {
      id: 'gar_score',
      name: 'GAR Score Update',
      category: 'Performance',
      template: '🏆 GAR Analysis Complete! Your score: {{score}}/100. {{improvement}}',
      variables: ['score', 'improvement']
    },
    {
      id: 'coach_reminder',
      name: 'Coach Session Reminder',
      category: 'Coaching',
      template: '⏰ Reminder: {{sessionType}} with {{coachName}} in 30 minutes.',
      variables: ['sessionType', 'coachName']
    },
    {
      id: 'emergency_alert',
      name: 'Emergency Alert',
      category: 'Safety',
      template: '🚨 ALERT: {{alertType}} - {{message}}. Check go4it.app for updates.',
      variables: ['alertType', 'message']
    },
    {
      id: 'camp_registration',
      name: 'Camp Registration',
      category: 'Camps',
      template: '✅ {{childName}} registered for {{campName}} on {{date}}. We can\'t wait!',
      variables: ['childName', 'campName', 'date']
    }
  ];

  const sendSMS = async () => {
    if (!customMessage.trim() && !selectedTemplate) {
      alert('Please enter a message or select a template');
      return;
    }

    if (!recipients.trim()) {
      alert('Please enter recipient phone numbers');
      return;
    }

    setIsSending(true);
    try {
      const phoneNumbers = recipients.split(',').map(p => p.trim()).filter(p => p);
      const recipientData = phoneNumbers.map(phone => ({
        phone,
        message: customMessage || templates.find(t => t.id === selectedTemplate)?.template || ''
      }));

      const response = await fetch('/api/sms/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientData,
          type: 'manual'
        })
      });

      const result = await response.json();
      setSendResults(result);
      
      if (result.success) {
        setCustomMessage('');
        setRecipients('');
        // Refresh stats
        loadStats();
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
      setSendResults({ success: false, error: 'Failed to send SMS' });
    }
    setIsSending(false);
  };

  const loadStats = async () => {
    try {
      // In production, this would fetch real stats from database
      setStats({
        totalSent: 1247,
        totalFailed: 23,
        totalUsers: 156,
        lastSent: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Failed to load SMS stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* SMS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Sent</p>
                <p className="text-2xl font-bold text-green-400">{stats.totalSent}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Failed</p>
                <p className="text-2xl font-bold text-red-400">{stats.totalFailed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Last Sent</p>
                <p className="text-sm font-medium text-white">{stats.lastSent}</p>
              </div>
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send SMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              Send SMS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message Template
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id} className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span>{template.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {template.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Custom Message
              </label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your custom message..."
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                maxLength={160}
              />
              <p className="text-xs text-slate-400 mt-1">
                {customMessage.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Recipients (Phone Numbers)
              </label>
              <Textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="+1234567890, +1987654321, ..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
              <p className="text-xs text-slate-400 mt-1">
                Separate multiple numbers with commas
              </p>
            </div>

            <Button
              onClick={sendSMS}
              disabled={isSending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? 'Sending...' : 'Send SMS'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-400" />
              SMS Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map(template => (
                <div key={template.id} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{template.name}</h4>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{template.template}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Results */}
      {sendResults && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Send Results</CardTitle>
          </CardHeader>
          <CardContent>
            {sendResults.success ? (
              <div className="space-y-2">
                <p className="text-green-400">
                  ✅ Successfully sent {sendResults.totalSent} messages
                </p>
                {sendResults.totalFailed > 0 && (
                  <p className="text-red-400">
                    ❌ Failed to send {sendResults.totalFailed} messages
                  </p>
                )}
              </div>
            ) : (
              <p className="text-red-400">❌ {sendResults.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}