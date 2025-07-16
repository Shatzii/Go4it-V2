'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Trophy, Target, Zap, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'

const pricingTiers = [
  {
    id: 'free',
    name: 'Free Profile',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with recruiting',
    popular: false,
    features: [
      'Create athlete profile',
      'Upload highlight videos',
      'Contact college coaches',
      'Basic recruiting tools',
      'Access to coach database',
      'Profile sharing',
      'Basic analytics'
    ],
    limitations: [
      'Limited video uploads (5 per month)',
      'Basic profile customization',
      'Standard support'
    ],
    icon: Star,
    color: 'bg-slate-600',
    textColor: 'text-slate-100'
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    period: 'month',
    description: 'Enhanced features for serious athletes',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited video uploads',
      'AI-powered coaching',
      'StarPath skill progression',
      'Advanced profile customization',
      'Priority coach matching',
      'Enhanced analytics dashboard',
      'Email support',
      'Recruiting timeline tracking',
      'Profile optimization tips'
    ],
    icon: Target,
    color: 'bg-blue-600',
    textColor: 'text-white'
  },
  {
    id: 'pro',
    name: 'Pro Athlete',
    price: 49,
    period: 'month',
    description: 'Professional tools for elite performance',
    popular: false,
    features: [
      'Everything in Starter',
      'Monthly GAR analysis',
      'Advanced AI coaching',
      'Recruiting strategy consultation',
      'College fit assessment',
      'Performance predictions',
      'Scholarship opportunity alerts',
      'Direct coach messaging',
      'Video analysis tools'
    ],
    icon: Trophy,
    color: 'bg-purple-600',
    textColor: 'text-white'
  },
  {
    id: 'elite',
    name: 'Elite Academy',
    price: 99,
    period: 'month',
    description: 'Complete academy experience',
    popular: false,
    features: [
      'Everything in Pro',
      'Full academy access',
      'Personal coaching sessions',
      'College preparation program',
      'NCAA compliance monitoring',
      'Academic support',
      'Mental performance training',
      'Nutrition planning',
      'Live coaching calls',
      'Priority customer success'
    ],
    icon: Crown,
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    textColor: 'text-white'
  }
]

const oneTimeServices = [
  {
    id: 'gar-analysis',
    name: 'GAR Analysis',
    price: 49,
    description: 'Comprehensive Growth and Ability Rating analysis',
    features: [
      'Detailed video analysis',
      'Performance scoring',
      'Strengths & weaknesses report',
      'Improvement recommendations',
      'College readiness assessment',
      'Shareable coach report'
    ],
    icon: Zap,
    color: 'bg-green-600',
    popular: true
  }
]

const annualDiscounts = {
  starter: { monthly: 19, annual: 190, savings: 38 },
  pro: { monthly: 49, annual: 490, savings: 98 },
  elite: { monthly: 99, annual: 990, savings: 198 }
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const router = useRouter()

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free') {
      router.push('/register')
      return
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          priceId: tierId,
          isAnnual
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create subscription')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }

  const handleOneTimePayment = async (serviceId: string) => {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify({
          serviceId,
          amount: oneTimeServices.find(s => s.id === serviceId)?.price || 49
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Payment error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Athletic Journey
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From free profile creation to elite academy access - find the perfect plan for your recruiting and development goals
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8 bg-slate-800 rounded-lg p-1 w-fit mx-auto">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAnnual
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                isAnnual
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Annual
              <Badge variant="secondary" className="ml-2 bg-green-600 text-white">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* One-Time Services */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            One-Time Services
          </h2>
          <div className="max-w-md mx-auto">
            {oneTimeServices.map((service) => {
              const Icon = service.icon
              return (
                <Card
                  key={service.id}
                  className={`bg-slate-800 border-slate-700 ${
                    service.popular ? 'ring-2 ring-green-500' : ''
                  } hover:shadow-xl transition-shadow duration-300`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{service.name}</CardTitle>
                    <CardDescription className="text-slate-300">
                      {service.description}
                    </CardDescription>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">
                          ${service.price}
                        </span>
                        <span className="text-slate-400 ml-2">
                          one-time
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => handleOneTimePayment(service.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Get Analysis
                    </Button>

                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Subscription Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon
            const annualPrice = annualDiscounts[tier.id as keyof typeof annualDiscounts]
            const displayPrice = isAnnual && annualPrice ? annualPrice.annual : tier.price
            const displayPeriod = isAnnual && annualPrice ? 'year' : tier.period
            
            return (
              <Card
                key={tier.id}
                className={`relative bg-slate-800 border-slate-700 ${
                  tier.popular ? 'ring-2 ring-blue-500' : ''
                } hover:shadow-xl transition-shadow duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-lg ${tier.color} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${tier.textColor}`} />
                  </div>
                  <CardTitle className="text-white">{tier.name}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {tier.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">
                        ${displayPrice}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-slate-400 ml-2">
                          /{displayPeriod}
                        </span>
                      )}
                    </div>
                    {isAnnual && annualPrice && (
                      <div className="text-sm text-green-400 mt-1">
                        Save ${annualPrice.savings}/year
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full ${
                      tier.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-slate-700 hover:bg-slate-600'
                    } text-white`}
                  >
                    {tier.price === 0 ? 'Get Started Free' : 'Start Subscription'}
                  </Button>

                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {tier.limitations && (
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-500 mb-2">Limitations:</p>
                      {tier.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-4 h-4 text-slate-500 flex-shrink-0">•</span>
                          <span className="text-xs text-slate-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-left">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-left">
                  Yes, you can change your subscription plan at any time. Upgrades take effect immediately, and downgrades occur at the end of your current billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-left">What happens to my free profile?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-left">
                  Your free profile and uploaded videos remain accessible forever. Premium features are added on top of your existing free account.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-left">Are there team or bulk discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-left">
                  Yes! Teams of 5+ athletes receive 25% off, and schools/clubs get custom pricing. Contact us for bulk pricing options.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-left">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-left">
                  Absolutely. Cancel your subscription anytime with one click. You'll retain access until the end of your current billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Need Help Choosing?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Our team is here to help you find the perfect plan for your athletic journey.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule a Call
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  )
}