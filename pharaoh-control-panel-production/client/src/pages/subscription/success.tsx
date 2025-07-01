import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  // Get session ID from URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  // Process the subscription completion
  useEffect(() => {
    const processSubscription = async () => {
      if (!sessionId) {
        setError('Missing session ID');
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest('GET', `/api/subscription/success?session_id=${sessionId}`);
        
        if (response.ok) {
          const data = await response.json();
          setSubscriptionDetails(data);
          
          toast({
            title: 'Subscription activated',
            description: 'Your subscription has been successfully activated',
            variant: 'default',
          });
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to process subscription');
        }
      } catch (error) {
        setError('An unexpected error occurred');
        console.error('Subscription processing error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processSubscription();
  }, [sessionId, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-1000 p-4">
      <Card className="w-full max-w-md bg-dark-900 border-dark-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Subscription Status</CardTitle>
          <CardDescription className="text-gray-400">
            {isLoading ? 'Processing your subscription...' : 'Thank you for your subscription!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Spinner size="lg" className="mb-4" />
              <p className="text-gray-300">Processing your subscription...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              <p className="font-medium mb-2">An error occurred</p>
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setLocation('/subscription')}
              >
                Return to Subscription Page
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/20 text-green-500 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-medium text-white">
                {subscriptionDetails?.plan === 'premium' ? 'Premium' : 'Enterprise'} Plan Activated
              </h3>
              
              <p className="text-gray-300">
                Your subscription has been successfully activated. You now have access to all the premium features.
              </p>
              
              <div className="bg-dark-800 rounded-lg p-4 w-full mt-4">
                <p className="text-gray-300 mb-2">Current Plan: <span className="text-white font-medium capitalize">{user?.plan || 'Premium'}</span></p>
                <p className="text-gray-300 mb-2">Status: <span className="text-green-400 font-medium">Active</span></p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          {!isLoading && !error && (
            <div className="space-y-4 w-full">
              <Button 
                className="w-full"
                onClick={() => setLocation('/dashboard')}
              >
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation('/marketplace')}
              >
                Explore AI Marketplace
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}