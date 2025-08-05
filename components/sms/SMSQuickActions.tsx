'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, AlertTriangle, Trophy, Calendar, Users } from 'lucide-react';
import { useSMSNotifications } from '@/hooks/useSMSNotifications';

interface SMSQuickActionsProps {
  context?: 'payment' | 'gar' | 'coaching' | 'emergency' | 'recruiting' | 'general';
  contextData?: any;
}

export default function SMSQuickActions({ context = 'general', contextData }: SMSQuickActionsProps) {
  const [lastSent, setLastSent] = useState<string>('');
  const { 
    sendPaymentConfirmation, 
    sendGARUpdate, 
    sendCoachReminder, 
    sendEmergencyAlert,
    isSending 
  } = useSMSNotifications();

  const quickActions = {
    payment: [
      {
        label: 'Send Payment Confirmation',
        icon: <MessageSquare className="w-4 h-4" />,
        action: () => handlePaymentConfirmation(),
        variant: 'default' as const,
        disabled: !contextData?.amount || !contextData?.customerPhone
      }
    ],
    gar: [
      {
        label: 'Send GAR Score Update',
        icon: <Trophy className="w-4 h-4" />,
        action: () => handleGARUpdate(),
        variant: 'default' as const,
        disabled: !contextData?.garScore || !contextData?.athletePhone
      }
    ],
    coaching: [
      {
        label: 'Send Session Reminder',
        icon: <Calendar className="w-4 h-4" />,
        action: () => handleCoachReminder(),
        variant: 'default' as const,
        disabled: !contextData?.sessionTime || !contextData?.athletePhone
      }
    ],
    emergency: [
      {
        label: 'Send Emergency Alert',
        icon: <AlertTriangle className="w-4 h-4" />,
        action: () => handleEmergencyAlert(),
        variant: 'destructive' as const,
        disabled: !contextData?.message || !contextData?.affectedUsers
      }
    ],
    recruiting: [
      {
        label: 'Send Scout Alert',
        icon: <Users className="w-4 h-4" />,
        action: () => handleRecruitingAlert(),
        variant: 'default' as const,
        disabled: !contextData?.schoolName || !contextData?.athletePhone
      }
    ],
    general: [
      {
        label: 'Quick Payment SMS',
        icon: <MessageSquare className="w-4 h-4" />,
        action: () => sendQuickSMS('payment'),
        variant: 'outline' as const,
        disabled: false
      },
      {
        label: 'Quick GAR SMS',
        icon: <Trophy className="w-4 h-4" />,
        action: () => sendQuickSMS('gar'),
        variant: 'outline' as const,
        disabled: false
      },
      {
        label: 'Emergency Alert',
        icon: <AlertTriangle className="w-4 h-4" />,
        action: () => sendQuickSMS('emergency'),
        variant: 'destructive' as const,
        disabled: false
      }
    ]
  };

  const handlePaymentConfirmation = async () => {
    if (!contextData?.customerPhone || !contextData?.amount) return;
    
    const success = await sendPaymentConfirmation({
      customerPhone: contextData.customerPhone,
      amount: contextData.amount,
      description: contextData.description || 'Go4It Sports Payment',
      status: 'succeeded',
      paymentIntentId: contextData.paymentIntentId
    });

    if (success) {
      setLastSent(`Payment confirmation sent to ${contextData.customerPhone}`);
    }
  };

  const handleGARUpdate = async () => {
    if (!contextData?.athletePhone || !contextData?.garScore) return;
    
    const success = await sendGARUpdate({
      athletePhone: contextData.athletePhone,
      parentPhone: contextData.parentPhone,
      athleteName: contextData.athleteName || 'Athlete',
      garScore: contextData.garScore,
      improvements: contextData.improvements || ['Keep up the great work!'],
      videoTitle: contextData.videoTitle || 'Training Video'
    });

    if (success) {
      setLastSent(`GAR score update sent to ${contextData.athletePhone}`);
    }
  };

  const handleCoachReminder = async () => {
    if (!contextData?.athletePhone || !contextData?.sessionTime) return;
    
    const success = await sendCoachReminder({
      athletePhone: contextData.athletePhone,
      coachName: contextData.coachName || 'Your Coach',
      sessionDate: contextData.sessionDate || new Date().toISOString(),
      sessionTime: contextData.sessionTime,
      sessionType: contextData.sessionType || 'Training Session',
      notificationType: 'reminder',
      sessionId: contextData.sessionId
    });

    if (success) {
      setLastSent(`Coach reminder sent to ${contextData.athletePhone}`);
    }
  };

  const handleEmergencyAlert = async () => {
    if (!contextData?.message || !contextData?.affectedUsers) return;
    
    const success = await sendEmergencyAlert({
      alertType: contextData.alertType || 'General Alert',
      message: contextData.message,
      affectedUsers: contextData.affectedUsers,
      severity: contextData.severity || 'medium'
    });

    if (success) {
      setLastSent(`Emergency alert sent to ${contextData.affectedUsers.length} users`);
    }
  };

  const handleRecruitingAlert = async () => {
    // Implementation for recruiting alerts
    setLastSent('Recruiting alert functionality coming soon');
  };

  const sendQuickSMS = async (type: string) => {
    // Implementation for quick SMS sending
    setLastSent(`Quick ${type} SMS functionality coming soon`);
  };

  const currentActions = quickActions[context as keyof typeof quickActions] || quickActions.general;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-400" />
          SMS Quick Actions
          <Badge variant="outline" className="ml-auto">
            {context}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {currentActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="sm"
              onClick={action.action}
              disabled={action.disabled || isSending}
              className="flex items-center gap-2"
            >
              {action.icon}
              {isSending ? 'Sending...' : action.label}
            </Button>
          ))}
        </div>

        {lastSent && (
          <div className="mt-3 p-2 bg-green-600/20 border border-green-600/30 rounded text-green-400 text-sm">
            ✅ {lastSent}
          </div>
        )}

        {context !== 'general' && contextData && (
          <div className="mt-3 p-2 bg-slate-700 rounded text-xs text-slate-300">
            <strong>Context Data:</strong> {JSON.stringify(contextData, null, 2).substring(0, 100)}...
          </div>
        )}
      </CardContent>
    </Card>
  );
}