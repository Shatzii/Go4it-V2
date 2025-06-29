import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sendNotification, checkSmsStatus } from '@/services/sms-service';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { 
  MessageSquare, 
  RefreshCw, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: number;
  name: string;
  role: string;
  phoneVerified: boolean;
}

interface UserGroup {
  id: string;
  name: string;
  count: number;
  description: string;
}

export const SmsNotificationForm: React.FC = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [lastMessageSent, setLastMessageSent] = useState<string>('');
  const [recipientCount, setRecipientCount] = useState<number>(0);
  
  // Fetch SMS service status
  const { data: smsStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/sms/status'],
    queryFn: async () => {
      return await checkSmsStatus();
    }
  });
  
  // Fetch available users with phone numbers
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['/api/users/with-phones'],
    queryFn: async () => {
      return await apiRequest('/api/users/with-phones');
    }
  });
  
  // Predefined user groups - would typically come from an API
  const userGroups: UserGroup[] = [
    { 
      id: 'verified', 
      name: 'All Verified Users', 
      count: users?.filter((user: User) => user.phoneVerified).length || 0,
      description: 'All users with verified phone numbers'
    },
    { 
      id: 'athletes', 
      name: 'Athletes', 
      count: users?.filter((user: User) => user.role === 'athlete' && user.phoneVerified).length || 0,
      description: 'All athletes with verified phone numbers'
    },
    { 
      id: 'coaches', 
      name: 'Coaches', 
      count: users?.filter((user: User) => user.role === 'coach' && user.phoneVerified).length || 0,
      description: 'All coaches with verified phone numbers'
    },
    { 
      id: 'parents', 
      name: 'Parents', 
      count: users?.filter((user: User) => user.role === 'parent' && user.phoneVerified).length || 0,
      description: 'All parents with verified phone numbers'
    },
    { 
      id: 'admins', 
      name: 'Administrators', 
      count: users?.filter((user: User) => user.role === 'admin' && user.phoneVerified).length || 0,
      description: 'All administrators with verified phone numbers'
    }
  ];
  
  // Form validation schema
  const formSchema = z.object({
    message: z.string()
      .min(1, 'Message is required')
      .max(160, 'SMS messages are limited to 160 characters'),
    recipient: z.enum(['group', 'individual']).default('group'),
    groupId: z.string().optional(),
    templateId: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      recipient: 'group',
    },
  });
  
  // Template messages for quick selection
  const messageTemplates = [
    { id: 'event', title: 'Event Reminder', message: 'Reminder: Your scheduled event is coming up soon. Please check your calendar for details.' },
    { id: 'update', title: 'Application Update', message: 'We\'ve updated our application with new features! Log in to explore the improvements.' },
    { id: 'alert', title: 'Important Alert', message: 'Important: Please check your account for a time-sensitive notification that requires your attention.' },
    { id: 'welcome', title: 'Welcome Message', message: 'Welcome to our platform! We\'re excited to have you join our community.' },
  ];
  
  // Handle selecting a message template
  const handleSelectTemplate = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      form.setValue('message', template.message);
    }
  };
  
  // Handle selecting a user group
  const handleSelectGroup = (groupId: string) => {
    setSelectedGroup(groupId);
    form.setValue('groupId', groupId);
    
    const group = userGroups.find(g => g.id === groupId);
    
    // Update recipient count based on selected group
    if (group) {
      setRecipientCount(group.count);
      
      // Get user IDs for the selected group
      if (groupId === 'verified') {
        setSelectedUsers(users?.filter((user: User) => user.phoneVerified).map((user: User) => user.id) || []);
      } else {
        const role = groupId === 'athletes' ? 'athlete' : groupId === 'coaches' ? 'coach' : groupId === 'parents' ? 'parent' : 'admin';
        setSelectedUsers(users?.filter((user: User) => user.role === role && user.phoneVerified).map((user: User) => user.id) || []);
      }
    } else {
      setRecipientCount(0);
      setSelectedUsers([]);
    }
  };
  
  // Handle selecting individual users
  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
      setRecipientCount(selectedUsers.length + 1);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      setRecipientCount(selectedUsers.length - 1);
    }
    setSelectedGroup(null);
    form.setValue('groupId', undefined);
  };
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No Recipients Selected',
        description: 'Please select at least one recipient for your message.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Send the notification to selected users
      const result = await sendNotification(selectedUsers, values.message);
      
      if (result.success) {
        toast({
          title: 'Message Sent',
          description: `Your SMS has been sent to ${result.deliveredCount} recipients.`,
        });
        
        setLastMessageSent(values.message);
        setShowSuccess(true);
        
        // Reset form
        form.reset({
          message: '',
          recipient: 'group',
        });
        
        // Reset selections
        setSelectedUsers([]);
        setSelectedGroup(null);
        setRecipientCount(0);
      } else {
        toast({
          title: 'Failed to Send',
          description: result.message || 'Failed to send SMS. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Check if a user is selected
  const isUserSelected = (userId: number) => {
    return selectedUsers.includes(userId);
  };
  
  // Get verified users
  const getVerifiedUsers = () => {
    return users?.filter((user: User) => user.phoneVerified) || [];
  };
  
  // Calculate character count and remaining characters
  const characterCount = form.watch('message')?.length || 0;
  const remainingCharacters = 160 - characterCount;
  
  // Reset the success state
  const resetSuccessState = () => {
    setShowSuccess(false);
    setLastMessageSent('');
  };
  
  // Service not ready alert
  if (!isStatusLoading && smsStatus && !smsStatus.ready) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            SMS Notifications <Users size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Send SMS notifications to multiple users at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>SMS Service Not Available</AlertTitle>
            <AlertDescription>
              {smsStatus.message || 'The SMS service is currently unavailable. Please ensure Twilio credentials are properly configured.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Loading state
  if (isStatusLoading || isUsersLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            SMS Notifications <Users size={18} className="text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  // Success state
  if (showSuccess) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            SMS Notifications <Users size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Send SMS notifications to multiple users at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Message Sent Successfully</AlertTitle>
            <AlertDescription className="text-green-700">
              Your message has been sent to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-2">
            <div>
              <h3 className="text-sm font-medium">Message Sent:</h3>
              <p className="mt-1 text-sm bg-primary/5 p-3 rounded-md">{lastMessageSent}</p>
            </div>
          </div>
          
          <Button 
            onClick={resetSuccessState} 
            className="mt-4 w-full"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // No verified users found
  if (getVerifiedUsers().length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            SMS Notifications <Users size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Send SMS notifications to multiple users at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Verified Phone Numbers</AlertTitle>
            <AlertDescription>
              There are no users with verified phone numbers yet. Users must verify their phone numbers before they can receive SMS notifications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          SMS Notifications <Users size={18} className="text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Send SMS notifications to multiple users at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">1. Choose Recipients</h3>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">User Groups</div>
                  <div className="grid grid-cols-1 gap-2">
                    {userGroups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => handleSelectGroup(group.id)}
                        className={`text-left px-3 py-2 rounded-md border text-sm ${
                          selectedGroup === group.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>{group.name}</div>
                          <Badge variant="outline">{group.count}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {group.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="users">
                    <AccordionTrigger className="text-sm font-medium">
                      Select Individual Users
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea className="h-64 rounded-md border">
                        <div className="p-4 space-y-2">
                          {getVerifiedUsers().map((user: User) => (
                            <div key={user.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`user-${user.id}`}
                                checked={isUserSelected(user.id)}
                                onCheckedChange={(checked) => 
                                  handleSelectUser(user.id, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`user-${user.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                              >
                                {user.name}
                                <Badge variant="outline" className="ml-2">
                                  {user.role}
                                </Badge>
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">2. Compose Message</h3>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Quick Templates</div>
                  <Select onValueChange={handleSelectTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your message here..."
                          className="resize-none h-32"
                          {...field}
                          maxLength={160}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <FormDescription>
                          SMS notifications are delivered to verified phone numbers
                        </FormDescription>
                        <span className={remainingCharacters < 20 ? 'text-orange-500' : ''}>
                          {characterCount}/160 characters
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="px-4 py-3 bg-muted rounded-md text-sm flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <div>
                    <span className="font-medium">Recipients: </span>
                    <span>{recipientCount} user{recipientCount !== 1 ? 's' : ''} selected</span>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSending || selectedUsers.length === 0 || !form.watch('message')}
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    `Send to ${recipientCount} Recipient${recipientCount !== 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Standard message rates may apply when users receive SMS messages</p>
      </CardFooter>
    </Card>
  );
};