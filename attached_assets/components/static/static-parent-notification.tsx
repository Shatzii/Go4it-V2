"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  Shield, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  Settings,
  User,
  Phone,
  Mail,
  CheckCircle,
  X
} from 'lucide-react';

interface StaticParentNotificationProps {
  childUserId?: string;
}

export function StaticParentNotification({ childUserId }: StaticParentNotificationProps) {
  // Mock static data for demonstration
  const staticAlerts = [
    {
      id: '1',
      type: 'safety',
      severity: 'medium',
      message: 'No suspicious activity detected',
      timestamp: '2024-01-15T14:30:00Z',
      platform: 'Instagram',
      resolved: false
    },
    {
      id: '2',
      type: 'content',
      severity: 'low',
      message: 'Content monitoring active',
      timestamp: '2024-01-15T10:15:00Z',
      platform: 'TikTok',
      resolved: true
    }
  ];

  const staticSettings = {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    alertLevel: 'medium' as const,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staticAlerts.map((alert) => (
              <Alert key={alert.id} className={`${
                alert.severity === 'high' ? 'border-red-500' :
                alert.severity === 'medium' ? 'border-yellow-500' :
                'border-green-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      alert.severity === 'high' ? 'text-red-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`} />
                    <div>
                      <AlertDescription className="font-medium">
                        {alert.message}
                      </AlertDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        <span>Platform: {alert.platform}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={alert.resolved ? 'default' : 'secondary'}>
                    {alert.resolved ? 'Resolved' : 'Active'}
                  </Badge>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Alerts</span>
              <Badge variant={staticSettings.emailAlerts ? 'default' : 'secondary'}>
                {staticSettings.emailAlerts ? 'On' : 'Off'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Alerts</span>
              <Badge variant={staticSettings.smsAlerts ? 'default' : 'secondary'}>
                {staticSettings.smsAlerts ? 'On' : 'Off'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <Badge variant={staticSettings.pushNotifications ? 'default' : 'secondary'}>
                {staticSettings.pushNotifications ? 'On' : 'Off'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Alert Level</span>
              <Badge variant="outline">{staticSettings.alertLevel}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Quiet Hours</span>
              <Badge variant={staticSettings.quietHours.enabled ? 'default' : 'secondary'}>
                {staticSettings.quietHours.enabled ? 
                  `${staticSettings.quietHours.start} - ${staticSettings.quietHours.end}` : 
                  'Disabled'
                }
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}