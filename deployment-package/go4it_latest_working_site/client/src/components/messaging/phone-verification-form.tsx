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
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sendVerificationCode, verifyCode, checkSmsStatus } from '@/services/sms-service';
import { useQuery } from '@tanstack/react-query';
import { 
  PhoneCall, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Shield, 
  Smartphone 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';

export const PhoneVerificationForm: React.FC = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  
  // Fetch SMS service status
  const { data: smsStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/sms/status'],
    queryFn: async () => {
      return await checkSmsStatus();
    }
  });
  
  // Fetch current user's verification status
  const { data: userVerificationStatus, isLoading: isVerificationStatusLoading, refetch: refetchVerificationStatus } = useQuery({
    queryKey: ['/api/user/phone-verification-status'],
    queryFn: async () => {
      return await apiRequest('/api/user/phone-verification-status');
    }
  });
  
  // Form validation schema for phone number
  const phoneFormSchema = z.object({
    phoneNumber: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^\+?[0-9()\-\s]+$/, 'Phone number must contain only digits, spaces, and the following characters: +()-'),
  });

  // Form validation schema for verification code
  const verificationFormSchema = z.object({
    code: z.string()
      .min(6, 'Verification code must be at least 6 digits')
      .max(6, 'Verification code must be exactly 6 digits')
      .regex(/^[0-9]+$/, 'Verification code must contain only digits'),
  });

  // Phone number form
  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });
  
  // Verification code form
  const verificationForm = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: '',
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

  // Handle phone number form submission
  const onPhoneSubmit = async (values: z.infer<typeof phoneFormSchema>) => {
    setIsSending(true);
    
    try {
      // Format phone number for sending
      const formattedPhone = formatPhoneForSending(values.phoneNumber);
      setPhoneNumber(formattedPhone);
      
      // Send verification code
      const result = await sendVerificationCode(formattedPhone);
      
      if (result.success) {
        toast({
          title: 'Verification Code Sent',
          description: `We've sent a verification code to ${formattedPhone}. Please enter it below.`,
        });
        
        // Move to verification step
        setStep('verify');
      } else {
        toast({
          title: 'Failed to Send',
          description: result.message || 'Failed to send verification code. Please try again.',
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
  
  // Handle verification code form submission
  const onVerificationSubmit = async (values: z.infer<typeof verificationFormSchema>) => {
    setIsVerifying(true);
    
    try {
      // Verify the code
      const result = await verifyCode(phoneNumber, values.code);
      
      if (result.success) {
        toast({
          title: 'Phone Verified',
          description: 'Your phone number has been successfully verified!',
        });
        
        // Update verification status
        setVerificationSuccess(true);
        
        // Refetch the verification status
        refetchVerificationStatus();
      } else {
        toast({
          title: 'Verification Failed',
          description: result.message || 'Failed to verify code. Please check the code and try again.',
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
      setIsVerifying(false);
    }
  };
  
  // Handle resending verification code
  const handleResendCode = async () => {
    setIsSending(true);
    
    try {
      // Resend verification code
      const result = await sendVerificationCode(phoneNumber);
      
      if (result.success) {
        toast({
          title: 'Code Resent',
          description: `We've sent a new verification code to ${phoneNumber}.`,
        });
      } else {
        toast({
          title: 'Failed to Resend',
          description: result.message || 'Failed to resend verification code. Please try again.',
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
  
  // Handle going back to phone number step
  const handleBackToPhone = () => {
    setStep('send');
  };
  
  // Start a new verification process
  const handleStartNewVerification = () => {
    setVerificationSuccess(false);
    setStep('send');
    phoneForm.reset({ phoneNumber: '' });
    verificationForm.reset({ code: '' });
    setPhoneNumber('');
  };
  
  // Service not ready alert
  if (!isStatusLoading && smsStatus && !smsStatus.ready) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Phone Verification <PhoneCall size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Verify your phone number to receive SMS notifications
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
  if (isStatusLoading || isVerificationStatusLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Phone Verification <PhoneCall size={18} className="text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  // Already verified state
  if (userVerificationStatus?.phoneVerified) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Phone Verification <PhoneCall size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Verify your phone number to receive SMS notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Phone Already Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              Your phone number ({userVerificationStatus.phoneNumber}) is already verified. You will now receive SMS notifications.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleStartNewVerification} 
            variant="outline" 
            className="mt-4 w-full"
          >
            Verify a Different Number
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Verification success state
  if (verificationSuccess) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Phone Verification <PhoneCall size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Verify your phone number to receive SMS notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center">Verification Successful!</h3>
            <p className="text-center text-muted-foreground">
              Your phone number has been verified. You will now receive SMS notifications.
            </p>
            
            <Button 
              onClick={handleStartNewVerification} 
              className="mt-6"
            >
              Verify Another Number
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Step 1: Enter phone number
  if (step === 'send') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Phone Verification <PhoneCall size={18} className="text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Verify your phone number to receive SMS notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
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
                      We'll send a verification code to this number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="pt-4">
            <Alert className="bg-primary/5 border-primary/10">
              <Shield className="h-4 w-4" />
              <AlertTitle>Why verify your phone?</AlertTitle>
              <AlertDescription>
                Verifying your phone number allows us to send you important notifications, alerts, and updates via SMS.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Step 2: Enter verification code
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Phone Verification <PhoneCall size={18} className="text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Enter the verification code sent to your phone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <span>Code sent to:</span>
          <span className="font-medium">{phoneNumber}</span>
        </div>
        
        <Form {...verificationForm}>
          <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
            <FormField
              control={verificationForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      {...field}
                      maxLength={6}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the 6-digit code we sent to your phone
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={handleBackToPhone}
                disabled={isSending || isVerifying}
              >
                Back
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="pt-2 text-center">
          <Button 
            variant="link" 
            onClick={handleResendCode}
            disabled={isSending}
            className="text-sm h-auto p-0"
          >
            {isSending ? (
              <>
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              "Didn't receive a code? Send again"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Standard message rates may apply for SMS messages</p>
      </CardFooter>
    </Card>
  );
};