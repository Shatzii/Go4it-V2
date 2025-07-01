import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  Check, 
  CreditCard, 
  Download, 
  Lock, 
  Server, 
  ShieldCheck, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Subscription plan type
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  description: string;
  features: string[];
  limits: {
    servers: number;
    models: number;
    historyDays: number;
    supportLevel: string;
  };
  recommended?: boolean;
  mostPopular?: boolean;
}

// Subscription info type
interface SubscriptionInfo {
  plan: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
}

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isConfirmingDowngrade, setIsConfirmingDowngrade] = useState<boolean>(false);
  const [isConfirmingUpgrade, setIsConfirmingUpgrade] = useState<boolean>(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Fetch user subscription
  const { 
    data: subscription, 
    isLoading: isLoadingSubscription,
    refetch: refetchSubscription
  } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch payment methods
  const { 
    data: paymentMethods = [], 
    isLoading: isLoadingPaymentMethods
  } = useQuery({
    queryKey: ['/api/payment-methods'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/payment-methods');
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      return response.json();
    },
    enabled: !!user && !!subscription,
  });

  // Pricing plans
  const plans: Record<string, SubscriptionPlan[]> = {
    monthly: [
      {
        id: 'starter-monthly',
        name: 'Starter',
        price: 9.99,
        billingPeriod: 'monthly',
        description: 'Perfect for small projects and personal servers',
        features: [
          'Single server monitoring',
          'Basic self-healing automation',
          'Core AI models',
          'Email support',
          '7-day log retention'
        ],
        limits: {
          servers: 1,
          models: 3,
          historyDays: 7,
          supportLevel: 'Email'
        }
      },
      {
        id: 'pro-monthly',
        name: 'Pro',
        price: 29.99,
        billingPeriod: 'monthly',
        description: 'Ideal for businesses with multiple servers',
        features: [
          'Up to 5 servers',
          'Advanced self-healing',
          'All marketplace AI models',
          'Priority support',
          '30-day log retention',
          'Custom alerts'
        ],
        limits: {
          servers: 5,
          models: 10,
          historyDays: 30,
          supportLevel: 'Priority'
        },
        mostPopular: true
      },
      {
        id: 'enterprise-monthly',
        name: 'Enterprise',
        price: 99.99,
        billingPeriod: 'monthly',
        description: 'For large-scale server deployments',
        features: [
          'Unlimited servers',
          'Custom AI models',
          'Advanced analytics',
          'Dedicated support',
          '90-day log retention',
          'Multi-user access',
          'Custom integrations'
        ],
        limits: {
          servers: -1, // Unlimited
          models: -1, // Unlimited
          historyDays: 90,
          supportLevel: 'Dedicated'
        }
      }
    ],
    yearly: [
      {
        id: 'starter-yearly',
        name: 'Starter',
        price: 99.99,
        billingPeriod: 'yearly',
        description: 'Perfect for small projects and personal servers',
        features: [
          'Single server monitoring',
          'Basic self-healing automation',
          'Core AI models',
          'Email support',
          '7-day log retention'
        ],
        limits: {
          servers: 1,
          models: 3,
          historyDays: 7,
          supportLevel: 'Email'
        }
      },
      {
        id: 'pro-yearly',
        name: 'Pro',
        price: 299.99,
        billingPeriod: 'yearly',
        description: 'Ideal for businesses with multiple servers',
        features: [
          'Up to 5 servers',
          'Advanced self-healing',
          'All marketplace AI models',
          'Priority support',
          '30-day log retention',
          'Custom alerts'
        ],
        limits: {
          servers: 5,
          models: 10,
          historyDays: 30,
          supportLevel: 'Priority'
        },
        mostPopular: true,
        recommended: true
      },
      {
        id: 'enterprise-yearly',
        name: 'Enterprise',
        price: 999.99,
        billingPeriod: 'yearly',
        description: 'For large-scale server deployments',
        features: [
          'Unlimited servers',
          'Custom AI models',
          'Advanced analytics',
          'Dedicated support',
          '90-day log retention',
          'Multi-user access',
          'Custom integrations'
        ],
        limits: {
          servers: -1, // Unlimited
          models: -1, // Unlimited
          historyDays: 90,
          supportLevel: 'Dedicated'
        }
      }
    ]
  };

  // Mock subscription data for development
  const mockSubscription: SubscriptionInfo = {
    plan: 'starter-monthly',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Use actual subscription data if available, otherwise use mock
  const userSubscription = subscription || mockSubscription;

  // Get the user's current plan details
  const getCurrentPlanDetails = () => {
    const planId = userSubscription?.plan;
    if (!planId) return null;
    
    // Check monthly plans
    const monthlyPlan = plans.monthly.find(p => p.id === planId);
    if (monthlyPlan) return monthlyPlan;
    
    // Check yearly plans
    const yearlyPlan = plans.yearly.find(p => p.id === planId);
    if (yearlyPlan) return yearlyPlan;
    
    return null;
  };

  // Current plan
  const currentPlan = getCurrentPlanDetails();
  
  // Subscribe to a plan
  const subscribeToPlan = async (plan: SubscriptionPlan) => {
    try {
      setIsProcessing(true);
      // Instead of actual Stripe integration, we're just mocking success
      setTimeout(() => {
        toast({
          title: "Subscription updated",
          description: `You are now subscribed to the ${plan.name} plan.`,
        });
        setIsProcessing(false);
        setIsConfirmingUpgrade(false);
        // Refetch subscription data
        refetchSubscription();
      }, 1500);
      
      // With actual Stripe integration, this would be something like:
      // const response = await apiRequest('POST', '/api/subscription', { planId: plan.id });
      // if (!response.ok) throw new Error('Failed to subscribe');
      // const data = await response.json();
      // window.location.href = data.checkoutUrl;
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setIsProcessing(true);
      // Mock cancellation
      setTimeout(() => {
        toast({
          title: "Subscription canceled",
          description: "Your subscription will be active until the end of the billing period.",
        });
        setIsProcessing(false);
        setIsConfirmingCancel(false);
        // Refetch subscription data
        refetchSubscription();
      }, 1500);
      
      // With actual Stripe integration:
      // const response = await apiRequest('POST', '/api/subscription/cancel');
      // if (!response.ok) throw new Error('Failed to cancel');
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "There was an error canceling your subscription. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Check if a plan is upgradable
  const isUpgrade = (plan: SubscriptionPlan) => {
    if (!currentPlan) return true;
    
    // Get the plan tiers for comparison
    const tiers = {
      'starter-monthly': 1,
      'pro-monthly': 2,
      'enterprise-monthly': 3,
      'starter-yearly': 4,
      'pro-yearly': 5,
      'enterprise-yearly': 6
    };
    
    return tiers[plan.id] > tiers[currentPlan.id];
  };

  // Get action button text
  const getActionButtonText = (plan: SubscriptionPlan) => {
    if (!currentPlan) return 'Subscribe';
    if (plan.id === currentPlan.id) return 'Current Plan';
    return isUpgrade(plan) ? 'Upgrade' : 'Downgrade';
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Subscription</span> Management
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        {/* Current subscription */}
        {userSubscription && currentPlan && (
          <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Current Subscription</h2>
                <p className="text-slate-400">
                  You are currently on the {currentPlan.name} plan
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`px-3 py-1 ${
                  userSubscription.status === 'active' 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : userSubscription.status === 'past_due'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-rose-500 hover:bg-rose-600'
                }`}>
                  {userSubscription.status === 'active' 
                    ? 'Active' 
                    : userSubscription.status === 'past_due'
                    ? 'Past Due'
                    : 'Canceled'}
                </Badge>
                {userSubscription.cancelAtPeriodEnd && (
                  <Badge variant="outline" className="border-rose-500 text-rose-400">
                    Cancels on renewal
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="mb-2 flex items-center">
                  <Server className="mr-2 h-5 w-5 text-blue-500" />
                  <h3 className="font-medium text-white">Server Limit</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {currentPlan.limits.servers === -1 ? 'Unlimited' : currentPlan.limits.servers}
                </p>
                <p className="text-sm text-slate-400">servers you can monitor</p>
              </div>
              
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="mb-2 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
                  <h3 className="font-medium text-white">AI Model Limit</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {currentPlan.limits.models === -1 ? 'Unlimited' : currentPlan.limits.models}
                </p>
                <p className="text-sm text-slate-400">AI models you can install</p>
              </div>
              
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="mb-2 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-emerald-500" />
                  <h3 className="font-medium text-white">Billing Period</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(currentPlan.price)}/{currentPlan.billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </p>
                <p className="text-sm text-slate-400">
                  Renews on {formatDate(userSubscription.currentPeriodEnd)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              {!userSubscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  className="border-rose-500 text-rose-400 hover:bg-rose-950/20"
                  onClick={() => setIsConfirmingCancel(true)}
                >
                  Cancel Subscription
                </Button>
              )}
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/subscription/manage-payment'}
              >
                Manage Payment Methods
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-400 hover:border-blue-500 hover:text-white"
                onClick={() => window.location.href = '/subscription/billing-history'}
              >
                Billing History
              </Button>
            </div>
          </div>
        )}

        {/* Pricing plans */}
        <div>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Choose Your Plan
            </h2>
            <p className="mt-2 text-slate-400">
              Select the plan that works best for your needs
            </p>
          </div>
          
          <div className="mb-8 flex justify-center">
            <Tabs 
              value={billingPeriod} 
              onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
              className="w-full max-w-xs"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly <Badge className="ml-1 bg-blue-600">Save 20%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans[billingPeriod].map((plan) => (
              <Card 
                key={plan.id} 
                className={`border-slate-800 ${
                  plan.mostPopular 
                    ? 'relative border-blue-500/50 shadow-lg shadow-blue-500/10' 
                    : ''
                } ${
                  currentPlan?.id === plan.id
                    ? 'bg-gradient-to-b from-blue-950/50 to-slate-900'
                    : 'bg-slate-900'
                }`}
              >
                {plan.mostPopular && (
                  <div className="absolute -right-1 top-6 z-10 bg-blue-600 px-6 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                {plan.recommended && (
                  <div className="absolute -right-1 top-6 z-10 bg-indigo-600 px-6 py-1 text-xs font-semibold text-white">
                    Recommended
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{formatPrice(plan.price)}</span>
                    <span className="text-slate-400">/{plan.billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-slate-300">
                        <div className="mr-2 rounded-full bg-blue-500/10 p-1">
                          <Check className="h-4 w-4 text-blue-500" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className={`w-full ${
                      currentPlan?.id === plan.id
                        ? 'cursor-default bg-slate-700'
                        : isUpgrade(plan)
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    disabled={currentPlan?.id === plan.id || isProcessing}
                    onClick={() => {
                      setSelectedPlan(plan);
                      if (currentPlan) {
                        if (isUpgrade(plan)) {
                          setIsConfirmingUpgrade(true);
                        } else {
                          setIsConfirmingDowngrade(true);
                        }
                      } else {
                        setIsConfirmingUpgrade(true);
                      }
                    }}
                  >
                    {getActionButtonText(plan)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Features comparison */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-xl font-bold text-white">
            Features Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-4 text-left text-sm font-medium text-slate-400">Feature</th>
                  <th className="py-4 text-center text-sm font-medium text-slate-400">Starter</th>
                  <th className="py-4 text-center text-sm font-medium text-slate-400">Pro</th>
                  <th className="py-4 text-center text-sm font-medium text-slate-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-4 text-left text-sm text-white">Servers</td>
                  <td className="py-4 text-center text-sm text-white">1</td>
                  <td className="py-4 text-center text-sm text-white">5</td>
                  <td className="py-4 text-center text-sm text-white">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 text-left text-sm text-white">AI Models</td>
                  <td className="py-4 text-center text-sm text-white">3</td>
                  <td className="py-4 text-center text-sm text-white">10</td>
                  <td className="py-4 text-center text-sm text-white">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 text-left text-sm text-white">Self-Healing</td>
                  <td className="py-4 text-center text-sm text-white">Basic</td>
                  <td className="py-4 text-center text-sm text-white">Advanced</td>
                  <td className="py-4 text-center text-sm text-white">Advanced</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 text-left text-sm text-white">Log Retention</td>
                  <td className="py-4 text-center text-sm text-white">7 days</td>
                  <td className="py-4 text-center text-sm text-white">30 days</td>
                  <td className="py-4 text-center text-sm text-white">90 days</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 text-left text-sm text-white">Custom Alerts</td>
                  <td className="py-4 text-center text-sm text-slate-500">
                    <AlertCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="py-4 text-center text-sm text-emerald-500">
                    <Check className="mx-auto h-5 w-5" />
                  </td>
                  <td className="py-4 text-center text-sm text-emerald-500">
                    <Check className="mx-auto h-5 w-5" />
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 text-left text-sm text-white">Custom Integrations</td>
                  <td className="py-4 text-center text-sm text-slate-500">
                    <AlertCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="py-4 text-center text-sm text-slate-500">
                    <AlertCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="py-4 text-center text-sm text-emerald-500">
                    <Check className="mx-auto h-5 w-5" />
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 text-left text-sm text-white">Multi-User Access</td>
                  <td className="py-4 text-center text-sm text-slate-500">
                    <AlertCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="py-4 text-center text-sm text-slate-500">
                    <AlertCircle className="mx-auto h-5 w-5" />
                  </td>
                  <td className="py-4 text-center text-sm text-emerald-500">
                    <Check className="mx-auto h-5 w-5" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 text-left text-sm text-white">Support Level</td>
                  <td className="py-4 text-center text-sm text-white">Email</td>
                  <td className="py-4 text-center text-sm text-white">Priority</td>
                  <td className="py-4 text-center text-sm text-white">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-white">How do subscriptions work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Subscriptions are billed either monthly or yearly, depending on your preference.
                  You can upgrade, downgrade, or cancel your subscription at any time. When you upgrade,
                  you'll be prorated for the remainder of your billing cycle.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-white">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Yes, you can cancel your subscription at any time. Your subscription will remain active
                  until the end of your current billing period, after which it will not renew.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-white">What happens if I exceed my limits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  If you exceed your plan's limits, you'll be notified and given the option to upgrade
                  to a higher tier. We won't automatically upgrade you or charge extra fees.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-white">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied
                  with the service, contact our support team within 14 days of your initial purchase for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Upgrade confirmation dialog */}
      <Dialog open={isConfirmingUpgrade} onOpenChange={setIsConfirmingUpgrade}>
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Subscription</DialogTitle>
            <DialogDescription className="text-slate-400">
              {currentPlan 
                ? 'You are about to upgrade your subscription plan.' 
                : 'You are about to subscribe to a new plan.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <h4 className="mb-2 font-medium text-white">{selectedPlan.name} Plan</h4>
                <div className="mb-4 flex items-baseline">
                  <span className="text-2xl font-bold text-white">{formatPrice(selectedPlan.price)}</span>
                  <span className="ml-1 text-slate-400">/{selectedPlan.billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <ul className="space-y-2">
                  {selectedPlan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-300">
                      <Check className="mr-2 h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-blue-500" />
                  <p className="text-sm text-blue-400">
                    Secure payment processing by Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmingUpgrade(false)}
              disabled={isProcessing}
              className="border-slate-700 hover:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedPlan && subscribeToPlan(selectedPlan)}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>Confirm</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downgrade confirmation dialog */}
      <Dialog open={isConfirmingDowngrade} onOpenChange={setIsConfirmingDowngrade}>
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Downgrade</DialogTitle>
            <DialogDescription className="text-slate-400">
              You are about to downgrade your subscription plan.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && currentPlan && (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <h4 className="font-medium text-amber-400">Important Note</h4>
                    <p className="text-sm text-slate-300">
                      Downgrading from {currentPlan.name} to {selectedPlan.name} will reduce your available features.
                      The changes will take effect at the end of your current billing period:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-400">
                      <li>• Server limit: {currentPlan.limits.servers === -1 ? 'Unlimited' : currentPlan.limits.servers} → {selectedPlan.limits.servers === -1 ? 'Unlimited' : selectedPlan.limits.servers}</li>
                      <li>• AI model limit: {currentPlan.limits.models === -1 ? 'Unlimited' : currentPlan.limits.models} → {selectedPlan.limits.models === -1 ? 'Unlimited' : selectedPlan.limits.models}</li>
                      <li>• Log retention: {currentPlan.limits.historyDays} days → {selectedPlan.limits.historyDays} days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmingDowngrade(false)}
              disabled={isProcessing}
              className="border-slate-700 hover:border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedPlan && subscribeToPlan(selectedPlan)}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>Confirm Downgrade</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation dialog */}
      <Dialog open={isConfirmingCancel} onOpenChange={setIsConfirmingCancel}>
        <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Cancel Subscription</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to cancel your subscription?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
              <div className="flex items-start">
                <AlertCircle className="mr-2 mt-0.5 h-5 w-5 text-rose-500" />
                <div>
                  <h4 className="font-medium text-rose-400">Important</h4>
                  <p className="text-sm text-slate-300">
                    Your subscription will remain active until the end of the current billing period. After that:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-400">
                    <li>• You'll lose access to premium features</li>
                    <li>• Server monitoring will be limited</li>
                    <li>• Advanced AI models will be unavailable</li>
                    <li>• Historical data beyond the free tier limits will be lost</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmingCancel(false)}
              disabled={isProcessing}
              className="border-slate-700 hover:border-slate-600"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={cancelSubscription}
              disabled={isProcessing}
              variant="destructive"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>Cancel Subscription</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;