import React, { useState } from 'react';
import { DirectSmsForm } from '@/components/messaging/direct-sms-form';
import { PhoneVerificationForm } from '@/components/messaging/phone-verification-form';
import { SmsNotificationForm } from '@/components/messaging/sms-notification-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MessageSquare, PhoneCall, Users, InfoIcon, Bell } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkSmsStatus } from '@/services/sms-service';
import { useQuery } from '@tanstack/react-query';
// This functionality will be implemented later
// import { askSecrets } from '@/lib/ask-secrets';
import { Button } from '@/components/ui/button';

export default function SmsMessagingPage() {
  const [tabValue, setTabValue] = useState<string>('verify'); // Defaulting to verification tab
  
  // Check if Twilio credentials are configured
  const { data: smsStatus } = useQuery({
    queryKey: ['/api/sms/status'],
    queryFn: async () => {
      return await checkSmsStatus();
    }
  });
  
  // Handle requesting Twilio credentials
  const handleRequestCredentials = () => {
    alert('To enable SMS functionality, please configure Twilio credentials in the environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)');
    // This will be implemented with the askSecrets function in the future
  };
  
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">SMS Messaging</h1>
          <p className="text-muted-foreground mt-1">
            Send SMS notifications and messages to athletes, coaches, and parents.
          </p>
        </div>
        
        {!smsStatus?.ready && (
          <Alert className="bg-amber-50 border-amber-200">
            <InfoIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="flex justify-between items-center">
              <span className="text-amber-800">
                SMS messaging requires Twilio credentials. Please configure them to enable SMS functionality.
              </span>
              <Button onClick={handleRequestCredentials} variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                Configure Credentials
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="verify" className="flex-1 flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              <span>Verify Phone</span>
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex-1 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Direct SMS</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="py-6">
            <TabsContent value="verify">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <PhoneVerificationForm />
                </div>
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-primary/5 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <PhoneCall className="h-5 w-5 text-primary" />
                      Why Verify Phone Numbers?
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Phone verification ensures that we can reach users via SMS for important updates, reminders, and alerts.
                      </p>
                      <p>
                        Verified phone numbers allow athletes, coaches, and parents to receive:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Practice and game reminders</li>
                        <li>Schedule changes and cancellations</li>
                        <li>Performance feedback and updates</li>
                        <li>Training plan notifications</li>
                        <li>Important announcements</li>
                      </ul>
                      <p className="text-xs">
                        Our platform prioritizes user privacy. Phone numbers are stored securely and are only used for legitimate communications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="direct">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <DirectSmsForm />
                </div>
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-primary/5 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Direct Messaging Best Practices
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Direct SMS messaging allows coaches and administrators to send personalized messages to individual phone numbers.
                      </p>
                      <div>
                        <p className="font-medium text-foreground">When to use Direct SMS:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Personal feedback to an athlete</li>
                          <li>Individual schedule changes</li>
                          <li>One-on-one communication with parents</li>
                          <li>Quick follow-ups with prospects</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Tips for effective messages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Be clear and concise</li>
                          <li>Identify yourself at the beginning</li>
                          <li>Keep messages under 160 characters when possible</li>
                          <li>Send during appropriate hours (8am-8pm)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <SmsNotificationForm />
                </div>
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-primary/5 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Notification Guidelines
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Bulk SMS notifications allow you to reach multiple users at once with important information.
                      </p>
                      <div>
                        <p className="font-medium text-foreground">Effective uses for notifications:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Practice or game schedule updates</li>
                          <li>Weather-related cancellations</li>
                          <li>Important deadlines and reminders</li>
                          <li>Event announcements</li>
                          <li>Emergency notifications</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Best practices:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Target specific user groups when appropriate</li>
                          <li>Include clear action items when needed</li>
                          <li>Keep messages concise and informative</li>
                          <li>Use templates for consistent messaging</li>
                          <li>Be mindful of message frequency</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}