'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Shield, CreditCard } from 'lucide-react';
import Link from 'next/link';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
  tier: string;
}

function CheckoutForm({ clientSecret, tier }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'succeeded' | 'failed'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?tier=${tier}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error(error.message || 'Payment failed');
        setPaymentStatus('failed');
      } else {
        setPaymentStatus('succeeded');
        toast.success('Payment successful! Welcome to Go4It Sports!');
        // Redirect to success page
        setTimeout(() => {
          window.location.href = `/checkout/success?tier=${tier}`;
        }, 1500);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment processing failed');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'succeeded') {
    return (
      <div className="text-center py-8">
        <div className="bg-green-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-300 mb-4">
          Welcome to the {tier.charAt(0).toUpperCase() + tier.slice(1)} tier of Go4It Sports!
        </p>
        <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Complete Subscription
          </div>
        )}
      </Button>

      <div className="text-center text-sm text-gray-400">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            <span>Secure Payment</span>
          </div>
          <span>•</span>
          <span>Cancel Anytime</span>
          <span>•</span>
          <span>7-Day Free Trial</span>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') || 'pro';
  const clientSecret = searchParams.get('client_secret');
  const [loading, setLoading] = useState(true);
  const [tierInfo, setTierInfo] = useState<any>(null);

  useEffect(() => {
    if (!clientSecret) {
      toast.error('Invalid checkout session');
      return;
    }

    fetchTierInfo();
  }, [tier]);

  const fetchTierInfo = async () => {
    try {
      const response = await fetch('/api/stripe/create-subscription');
      const result = await response.json();

      if (result.success && result.data?.tiers) {
        const selectedTier = result.data.tiers.find((t: any) => t.id === tier);
        setTierInfo(selectedTier);
      }
    } catch (error) {
      console.error('Error fetching tier info:', error);
      toast.error('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <ArrowLeft className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Checkout Session</h2>
          <p className="text-gray-300 mb-6">Please start the subscription process again.</p>
          <Link href="/pricing">
            <Button className="bg-blue-500 hover:bg-blue-600">Back to Pricing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/pricing"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>

            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Subscription</h1>
            <p className="text-gray-300">
              You're one step away from unlocking your athletic potential
            </p>
          </div>

          {/* Order Summary */}
          {tierInfo && (
            <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Order Summary</span>
                  {tierInfo.popular && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Most Popular
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{tierInfo.name} Plan</h3>
                    <p className="text-sm text-gray-400">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${tierInfo.price}</div>
                    <div className="text-sm text-gray-400">per month</div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-medium mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {tierInfo.features?.slice(0, 4).map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {tierInfo.features?.length > 4 && (
                      <li className="text-sm text-gray-400">
                        + {tierInfo.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Form */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#8b5cf6',
                      colorBackground: '#1f2937',
                      colorText: '#ffffff',
                      colorDanger: '#ef4444',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm clientSecret={clientSecret} tier={tier} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
