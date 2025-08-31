'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Trophy,
  Calendar,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_VITE_STRIPE_PUBLIC_KEY || process.env.VITE_STRIPE_PUBLIC_KEY || '',
);

export default function GapYearPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const handleEnrollment = async () => {
    setIsLoading(true);
    try {
      // Create checkout session
      const response = await fetch('/api/gap-year/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan === 'monthly' ? 'price_gap_year_monthly' : 'price_gap_year_annual',
          plan: selectedPlan,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your enrollment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Live Daily Training Sessions',
      description: '5 days/week live virtual training with elite coaches and real-time feedback',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Full Platform Access',
      description:
        'Unlimited GAR Analysis, StarPath Pro, Academy courses, and all premium features',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'College Recruitment Boost',
      description: 'Direct exposure to 500+ D1 scouts with verified recruiting dashboard',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Weekly 1-on-1 Coaching',
      description: 'Personal sessions with former NFL/NBA/MLB professional athletes',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'AI-Powered Development',
      description: 'Voice coaching, performance analytics, and personalized training plans',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Academic Reclassification',
      description: 'Strategic grade placement with full NCAA compliance and eligibility',
    },
  ];

  const testimonials = [
    {
      name: 'Marcus Johnson',
      school: 'Now at Duke University',
      quote:
        'The Gap Year program gave me the extra year I needed to develop physically and mentally. I went from unranked to a D1 scholarship.',
      rating: 5,
    },
    {
      name: 'Sarah Williams',
      school: 'Stanford Commit',
      quote:
        'Reclassifying was the best decision for my athletic career. The program helped me improve my GAR score by 40 points.',
      rating: 5,
    },
    {
      name: 'David Chen',
      school: 'UCLA Football',
      quote:
        'The mentorship and training during my gap year transformed me from a good player to an elite athlete.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium mb-6">
              🎓 Strategic Athletic Reclassification Program
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Gap Year Elite Program
            </h1>
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Take a strategic year to reclassify, develop your athletic prowess, and position
              yourself for D1 recruitment success
            </p>
            <div className="flex items-center justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>NCAA Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>100% College Placement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Elite Coaching Staff</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Investment in Your Future</h2>
          <p className="text-xl text-slate-300">Choose the plan that works best for your family</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div
            className={`relative rounded-2xl p-8 transition-all cursor-pointer ${
              selectedPlan === 'monthly'
                ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500 scale-105'
                : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => setSelectedPlan('monthly')}
          >
            {selectedPlan === 'monthly' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST FLEXIBLE
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $999<span className="text-2xl">.95</span>
              </div>
              <p className="text-slate-400">per month</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-semibold">Live training 5 days/week</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Full platform access (all features)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Unlimited GAR assessments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>StarPath Elite & Academy Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </div>

          {/* Annual Plan */}
          <div
            className={`relative rounded-2xl p-8 transition-all cursor-pointer ${
              selectedPlan === 'annual'
                ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500 scale-105'
                : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => setSelectedPlan('annual')}
          >
            {selectedPlan === 'annual' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  SAVE $2,000
                </span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Annual Plan</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $9,999<span className="text-2xl">.00</span>
              </div>
              <p className="text-slate-400">per year (save 17%)</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Everything in Monthly Plan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-bold text-yellow-400">In-person training camps (2x)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-bold text-yellow-400">Priority D1 showcase events</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-bold text-yellow-400">Professional highlight reel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-bold text-yellow-400">Save $2,000 vs monthly</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Enroll Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleEnrollment}
            disabled={isLoading}
            className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? 'Processing...'
              : `Enroll Now - ${selectedPlan === 'monthly' ? '$999.95/mo' : '$9,999/yr'}`}
          </button>
          <p className="text-sm text-slate-400 mt-4">
            🔒 Secure payment via Stripe • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>

      {/* What's Included Section - NEW */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-700">
        <h2 className="text-4xl font-bold text-center mb-4">
          Everything You Get with Gap Year Elite
        </h2>
        <p className="text-xl text-center text-slate-300 mb-12">
          Full access to our entire platform + exclusive Gap Year benefits
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Live Training */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/50">
            <div className="text-3xl mb-3">🔴</div>
            <h3 className="text-xl font-bold text-white mb-3">Live Training Sessions</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Monday-Friday live virtual training</li>
              <li>• Real-time coaching feedback</li>
              <li>• Position-specific skill development</li>
              <li>• Strength & conditioning programs</li>
              <li>• Mental performance coaching</li>
            </ul>
          </div>

          {/* Platform Features */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/50">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-xl font-bold text-white mb-3">Full Platform Access</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                • <strong>GAR Analysis</strong> - Unlimited assessments
              </li>
              <li>
                • <strong>StarPath Elite</strong> - All skill trees unlocked
              </li>
              <li>
                • <strong>Academy Pro</strong> - All courses & tutoring
              </li>
              <li>
                • <strong>AI Voice Coach</strong> - 24/7 guidance
              </li>
              <li>
                • <strong>Recruiting Hub</strong> - Full access
              </li>
            </ul>
          </div>

          {/* Exclusive Benefits */}
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/50">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-white mb-3">Gap Year Exclusives</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Weekly 1-on-1 coaching sessions</li>
              <li>• Personal recruitment coordinator</li>
              <li>• Custom training programs</li>
              <li>• Priority showcase placement</li>
              <li>• Professional highlight reel editing</li>
            </ul>
          </div>
        </div>

        {/* Schedule Overview */}
        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-center mb-6">Your Weekly Training Schedule</h3>
          <div className="grid grid-cols-5 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="text-center">
                <p className="font-bold text-blue-400 mb-2">{day}</p>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">4:00 PM - 5:00 PM</p>
                  <p className="text-sm font-medium text-white">Live Training</p>
                  <p className="text-xs text-slate-400 mt-1">Skills & Drills</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 mt-2">
                  <p className="text-xs text-slate-400">6:00 PM - 7:00 PM</p>
                  <p className="text-sm font-medium text-white">Study Hall</p>
                  <p className="text-xs text-slate-400 mt-1">Academic Support</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-700">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Our Gap Year Program?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-600 transition-all"
            >
              <div className="text-purple-400 mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-slate-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-700">
        <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-400">{testimonial.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-700">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-2">What is athletic reclassification?</h3>
            <p className="text-slate-400">
              Reclassification allows student-athletes to repeat a grade level to gain additional
              physical, mental, and academic development time, improving their chances for college
              recruitment and athletic success.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-2">How does this affect NCAA eligibility?</h3>
            <p className="text-slate-400">
              Our program is fully NCAA compliant. We ensure all academic requirements are met while
              maintaining your eligibility clock for college athletics.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-2">What sports does the program cover?</h3>
            <p className="text-slate-400">
              We support all major sports including football, basketball, soccer, baseball, track &
              field, and more. Our coaching staff includes specialists for each sport.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-2">Can I cancel my subscription?</h3>
            <p className="text-slate-400">
              Yes, the monthly plan can be cancelled anytime. We also offer a 30-day money-back
              guarantee if you're not satisfied with the program.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Athletic Future?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join hundreds of athletes who have successfully reclassified and achieved their D1
            dreams
          </p>
          <button
            onClick={handleEnrollment}
            disabled={isLoading}
            className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Your Gap Year Journey
          </button>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Limited Spots Available
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              100% Secure Payment
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Instant Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
