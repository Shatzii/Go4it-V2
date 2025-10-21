'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Check, Star, Zap, Crown, ArrowRight, Shield, Sparkles } from 'lucide-react';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  // Mock user ID - in real app this would come from authentication
  const mockUserId = 'user_12345';
  const mockUserEmail = 'athlete@example.com';

  useEffect(() => {
    fetchSubscriptionTiers();
  }, []);

  const fetchSubscriptionTiers = async () => {
    try {
      const response = await fetch('/api/stripe/create-subscription');
      const result = await response.json();

      if (result.success && result.data?.tiers) {
        setSubscriptionTiers(result.data.tiers);
      }
    } catch (error) {
      console.error('Error fetching subscription tiers:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (processingTier) return;

    setProcessingTier(tier.id);

    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: mockUserId,
          email: mockUserEmail,
          tier: tier.id,
          name: 'John Athlete',
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.clientSecret) {
        // In a real app, this would redirect to a Stripe checkout page
        // or open a payment modal with the client secret
        window.location.href = `/checkout?tier=${tier.id}&client_secret=${result.data.clientSecret}`;
      } else {
        throw new Error(result.message || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to start subscription process');
    } finally {
      setProcessingTier(null);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'starter':
        return <Star className="w-6 h-6" />;
      case 'pro':
        return <Zap className="w-6 h-6" />;
      case 'elite':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'starter':
        return 'text-blue-500';
      case 'pro':
        return 'text-purple-500';
      case 'elite':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-500/20 p-3 rounded-full backdrop-blur-sm border border-blue-500/30">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Athletic Journey
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock advanced AI-powered training, social media automation, and recruitment tools to
            accelerate your athletic performance and college prospects.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span
              className={`text-sm ${billingInterval === 'month' ? 'text-white' : 'text-gray-400'}`}
            >
              Monthly
            </span>
            <Switch
              checked={billingInterval === 'year'}
              onCheckedChange={(checked) => setBillingInterval(checked ? 'year' : 'month')}
            />
            <span
              className={`text-sm ${billingInterval === 'year' ? 'text-white' : 'text-gray-400'}`}
            >
              Yearly
            </span>
            <Badge
              variant="secondary"
              className="ml-2 bg-green-500/20 text-green-400 border-green-500/30"
            >
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative overflow-hidden backdrop-blur-md border-2 transition-all duration-300 hover:scale-105 ${
                tier.popular
                  ? 'border-purple-500/50 bg-purple-500/10 shadow-2xl shadow-purple-500/20'
                  : 'border-gray-700/50 bg-gray-900/50 hover:border-blue-500/30'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div
                  className={`mx-auto mb-4 p-3 rounded-full bg-gradient-to-r ${
                    tier.id === 'starter'
                      ? 'from-blue-500/20 to-cyan-500/20'
                      : tier.id === 'pro'
                        ? 'from-purple-500/20 to-pink-500/20'
                        : 'from-amber-500/20 to-yellow-500/20'
                  } backdrop-blur-sm border ${
                    tier.id === 'starter'
                      ? 'border-blue-500/30'
                      : tier.id === 'pro'
                        ? 'border-purple-500/30'
                        : 'border-amber-500/30'
                  }`}
                >
                  <div className={getTierColor(tier.id)}>{getTierIcon(tier.id)}</div>
                </div>

                <CardTitle className="text-2xl font-bold text-white mb-2">{tier.name}</CardTitle>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    ${billingInterval === 'year' ? (tier.price * 10).toFixed(0) : tier.price}
                  </span>
                  <span className="text-gray-400 ml-1">
                    /{billingInterval === 'year' ? 'year' : 'month'}
                  </span>
                </div>

                {billingInterval === 'year' && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    2 months free
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Separator className="bg-gray-700" />

                <Button
                  onClick={() => handleSubscribe(tier)}
                  disabled={processingTier !== null}
                  className={`w-full py-3 font-semibold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {processingTier === tier.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Feature Comparison</h2>

          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-700">
              <div className="text-white font-semibold">Features</div>
              <div className="text-center text-blue-400 font-semibold">Starter</div>
              <div className="text-center text-purple-400 font-semibold">Pro</div>
              <div className="text-center text-amber-400 font-semibold">Elite</div>
            </div>

            {[
              {
                feature: 'GAR Video Analysis',
                starter: 'Basic',
                pro: 'Advanced',
                elite: 'Advanced + AI',
              },
              {
                feature: 'Social Media Accounts',
                starter: '3',
                pro: 'Unlimited',
                elite: 'Unlimited',
              },
              { feature: 'AI Coaching', starter: false, pro: true, elite: true },
              { feature: 'Recruitment Tools', starter: false, pro: 'Basic', elite: 'Advanced' },
              { feature: 'Team Management', starter: false, pro: false, elite: true },
              { feature: 'Custom Training Plans', starter: false, pro: false, elite: true },
              { feature: 'Priority Support', starter: false, pro: true, elite: 'Dedicated' },
            ].map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700/50 last:border-b-0"
              >
                <div className="text-gray-300">{row.feature}</div>
                <div className="text-center text-gray-400">
                  {typeof row.starter === 'boolean' ? (
                    row.starter ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      '—'
                    )
                  ) : (
                    row.starter
                  )}
                </div>
                <div className="text-center text-gray-400">
                  {typeof row.pro === 'boolean' ? (
                    row.pro ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      '—'
                    )
                  ) : (
                    row.pro
                  )}
                </div>
                <div className="text-center text-gray-400">
                  {typeof row.elite === 'boolean' ? (
                    row.elite ? (
                      <Check className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      '—'
                    )
                  ) : (
                    row.elite
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-sm">Cancel Anytime</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="text-sm">7-Day Free Trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
