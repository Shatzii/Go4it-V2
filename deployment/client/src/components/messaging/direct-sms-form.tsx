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
import { sendSms, checkSmsStatus } from '@/services/sms-service';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, RefreshCw, AlertTriangle, CheckCircle2, Clock, ArrowDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

export const DirectSmsForm: React.FC = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<Array<{to: string; message: string; timestamp: Date}>>([]);
  
  // Fetch SMS service status
  const { data: smsStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/sms/status'],
    queryFn: async () => {
      return await checkSmsStatus();
    }
  });
  
  // Form validation schema
  const formSchema = z.object({
    phoneNumber: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^\+?[0-9()\-\s]+$/, 'Phone number must contain only digits, spaces, and the following characters: +()-'),
    message: z.string()
      .min(1, 'Message is required')
      .max(160, 'SMS messages are limited to 160 characters'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      message: '',
    },
  });
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except + at the beginning
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Keep + only at the beginning if it exists
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.substring(1).replace(/\+/g, '');
    } else {
      cleaned = cleaned.replace(/\+/g, '');
    }
    
    // Format the number for US style if no + at the beginning
    if (!cleaned.startsWith('+') && cleaned.length > 0) {
      if (cleaned.length <= 3) {
        return cleaned;
      } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 14)}`;
      }
    }
    
    return cleaned;
  };
  
  // Handle input change for phone number to apply formatting
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange(formattedValue);
  };
  
  // Add country code if missing
  const formatPhoneForSending = (phoneNumber: string): string => {
    // If already has country code with +, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // Extract digits only from formatted phone number
    const digits = phoneNumber.replace(/\D/g, '');
    
    if (digits.startsWith('1')) {
      return `+${digits}`;
    }
    return `+1${digits}`; // Default to US country code
  };
  
  // Format timestamp for display
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // If same day, show time only
    if (messageDate.getTime() === today.getTime()) {
      return 'Today at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    // If yesterday, show "Yesterday" and time
    if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    // Otherwise show full date and time
    return date.toLocaleDateString([], {
      month: 'short', 
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString([], {
      hour: '2-digit', 
      minute:'2-digit'
    });
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSending(true);
    
    try {
      // Format phone number for sending
      const formattedPhone = formatPhoneForSending(values.phoneNumber);
      
      // Send SMS
      const result = await sendSms(formattedPhone, values.message);
      
      if (result.success) {
        toast({
          title: 'Message Sent',
          description: `Your message was successfully sent to ${formattedPhone}.`,
        });
        
        // Add to message history
        setMessageHistory(prev => [
          {
            to: formattedPhone,
            message: values.message,
            timestamp: new Date()
          },
          ...prev
        ]);
        
        // Reset message field but keep phone number
        form.reset({
          phoneNumber: values.phoneNumber,
          message: '',
        });
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
  
  // Calculate character count and remaining characters
  const characterCount = form.watch('message')?.length || 0;
  const remainingCharacters = 160 - characterCount;
  
  // Clear message history
  const clearHistory = () => {
    setMessageHistory([]);
  };
  
  // Service not ready alert
  if (!isStatusLoading && smsStatus && !smsStatus.ready) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Direct SMS <MessageSquare size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Send SMS messages directly to phone numbers
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
  if (isStatusLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Direct SMS <MessageSquare size={18} className="text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Direct SMS <MessageSquare size={18} className="text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Send SMS messages directly to phone numbers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(555) 123-4567"
                      {...field}
                      onChange={(e) => handlePhoneNumberChange(e, field.onChange)}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the recipient's phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message here..."
                      className="resize-none h-24"
                      {...field}
                      maxLength={160}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormDescription>
                      Standard message rates may apply
                    </FormDescription>
                    <span className={remainingCharacters < 20 ? 'text-orange-500' : ''}>
                      {characterCount}/160 characters
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </div>
          </form>
        </Form>
        
        {messageHistory.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Recent Messages
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearHistory}
                className="h-7 text-xs"
              >
                Clear History
              </Button>
            </div>
            
            <ScrollArea className="h-48 rounded-md border">
              <div className="p-4 space-y-3">
                {messageHistory.map((msg, index) => (
                  <div key={index} className="bg-primary/5 p-3 rounded-md space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm truncate max-w-[200px]">
                        To: {msg.to}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground block">
        <div className="flex items-center gap-1 text-primary">
          <ArrowDown className="h-3 w-3" />
          <span className="text-xs">Scroll to see message history</span>
        </div>
      </CardFooter>
    </Card>
  );
};