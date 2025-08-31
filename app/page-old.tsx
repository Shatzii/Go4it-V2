'use client';

// Go4It Sports Landing Page - StarPath Enhanced with Media Integration
import { Star, TrendingUp, GraduationCap, Trophy, CheckCircle, Target, Zap, Crown, Award, MapPin, Calendar, Users, Shield, Play } from 'lucide-react'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import client-side components to prevent hydration issues
const ClientOnly = dynamic(() => import('../components/ClientOnly'), { ssr: false })
const AnimatedCounter = dynamic(() => import('../components/AnimatedCounter'), { ssr: false })
const AnimatedProgressBar = dynamic(() => import('../components/AnimatedProgressBar'), { ssr: false })
const ActivityFeed = dynamic(() => import('../components/ActivityFeed'), { ssr: false })
const InteractiveGARCalculator = dynamic(() => import('../components/InteractiveGARCalculator'), { ssr: false })
const StatisticsCounter = dynamic(() => import('../components/StatisticsCounter'), { ssr: false })

export default function Go4ItHomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use static content to prevent hydration issues
  const heroContent = {
    headline: 'Get Verified. Get Ranked. Get Recruited.',
    subheadline: 'The first AI-powered platform built for neurodivergent student athletes',
    ctaText: 'Start Free. Get Ranked. Go4It.',
    ctaLink: '/register',
    features: [
      'GAR Score Analysis (13 sports)',
      'StarPath XP Progression System', 
      '24/7 AI Coaching Engine'
    ]
  };
  
  const eventsContent = {
    title: 'UPCOMING EVENTS',
    subtitle: 'Elite training camps and competitions to elevate your game',
    events: []
  };
  
  const globalSettings = {
    siteName: 'Go4It Sports',
    tagline: 'Get Verified. Get Ranked. Get Recruited.'
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Limited Time Offer Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-3 px-4 relative overflow-hidden">
        <div className="animate-pulse">
          <span className="font-bold">⚡ LIMITED TIME: Free GAR Analysis with signup - Only 48 hours left!</span>
          <button className="ml-4 bg-white text-red-600 px-3 py-1 rounded font-bold text-sm hover:bg-gray-100 transition-colors">
            Claim Now
          </button>
        </div>
      </div>
      
      {/* Hero Section - Simplified */}
      <section className="hero-bg py-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 glow-text leading-tight">
              GET VERIFIED.<br/>
              GET RANKED.<br/>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GET RECRUITED.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              The AI-powered platform built for neurodivergent student athletes. 
              Choose your path to success.
            </p>
          </div>

          {/* Three Main Pathways */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {/* StarPath - Recreational */}
            <div className="glass-card p-8 border-2 border-blue-500/50 hover:border-blue-400 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">StarPath XP</h3>
              <p className="text-slate-300 mb-6">
                Gamified training system. Level up your skills, earn achievements, compete on leaderboards.
              </p>
              <ul className="text-left space-y-2 mb-6 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Gaming-style progression
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  AI performance tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Global leaderboards
                </li>
              </ul>
              <a href="/starpath" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all inline-block">
                Start Your Journey
              </a>
              <p className="text-sm text-slate-400 mt-2">Free to start</p>
            </div>

            {/* NCAA Recruiting */}
            <div className="glass-card p-8 border-2 border-green-500/50 hover:border-green-400 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">NCAA Recruiting</h3>
              <p className="text-slate-300 mb-6">
                Elite recruiting platform with GAR analysis, college matching, and verified athlete profiles.
              </p>
              <ul className="text-left space-y-2 mb-6 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  GAR score analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  College coach network
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Scholarship tracking
                </li>
              </ul>
              <a href="/recruiting-hub" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all inline-block">
                Get Recruited
              </a>
              <p className="text-sm text-slate-400 mt-2">Premium features</p>
            </div>

            {/* Full Academy */}
            <div className="glass-card p-8 border-2 border-purple-500/50 hover:border-purple-400 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Go4It Academy</h3>
              <p className="text-slate-300 mb-6">
                Full K-12 educational institution with integrated athletics and academic excellence.
              </p>
              <ul className="text-left space-y-2 mb-6 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  Complete K-12 education
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  Elite athletic training
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  College preparation
                </li>
              </ul>
              <a href="/academy" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all inline-block">
                Join Academy
              </a>
              <p className="text-sm text-slate-400 mt-2">Full program</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {mounted && (
              <>
                <StatisticsCounter 
                  number={50000} 
                  label="Student Athletes Verified" 
                  icon={<Trophy className="w-6 h-6 text-yellow-500" />}
                />
                <StatisticsCounter 
                  number={12500} 
                  label="Scholarships Secured" 
                  icon={<GraduationCap className="w-6 h-6 text-green-500" />}
                />
                <StatisticsCounter 
                  number={8750} 
                  label="College Placements" 
                  icon={<Star className="w-6 h-6 text-blue-500" />}
                />
              </>
            )}
            {!mounted && (
              <>
                <div className="glass-card p-6 text-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-2">50,000+</div>
                  <div className="text-slate-400">Student Athletes Verified</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <GraduationCap className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-2">12,500+</div>
                  <div className="text-slate-400">Scholarships Secured</div>
                </div>
                <div className="glass-card p-6 text-center">
                  <Star className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-2">8,750+</div>
                  <div className="text-slate-400">College Placements</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Elite Teams & Training - Simplified */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Elite Teams & Training
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join our competitive teams and training programs for serious athletes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Travel Teams */}
            <div className="glass-card p-8 border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">International Travel Teams</h3>
              <p className="text-slate-300 mb-6">
                Compete internationally in Flag Football, Basketball, and Soccer with elite programs.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">USA Football sanctioned Flag Football</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">European Basketball exposure</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">International Soccer academies</span>
                </div>
              </div>
              <a href="/teams" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all inline-block text-center">
                Join Travel Teams
              </a>
            </div>

            {/* Training Camps */}
            <div className="glass-card p-8 border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">Elite Training Camps</h3>
              <p className="text-slate-300 mb-6">
                Intensive training with NFL alumni, Super Bowl champions, and elite coaches.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">NFL coaching staff</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">GAR analysis included</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">College scout exposure</span>
                </div>
              </div>
              <a href="/events" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all inline-block text-center">
                View Camps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            AI-Powered Athletic Intelligence
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Advanced AI technology designed specifically for neurodivergent athletes
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-3">GAR Analysis</h3>
              <p className="text-slate-300">
                AI-powered performance analysis across 13 sports with instant feedback and improvement recommendations.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-3">AI Study Companion</h3>
              <p className="text-slate-300">
                Personalized learning support with adaptive algorithms that understand your unique learning style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Choose your path and join thousands of athletes already achieving their goals
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/register" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-all text-lg">
              Get Started Free
            </a>
            <a href="/pricing" className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold py-4 px-8 rounded-lg transition-all text-lg">
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
            <span className="neon-text text-lg font-semibold tracking-wider uppercase">Go4It Sports</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="glow-text">{heroContent.headline}</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
            {heroContent.subheadline}
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a href={heroContent.ctaLink || '/register'} className="glow-button text-lg">
              {heroContent.ctaText}
            </a>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Built for athletes who are ready to be seen. Trained. Tracked. And transformed.
          </p>
        </div>
        
        {/* Hero Background Elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Gap Year Program - NEW FEATURED SECTION */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 neon-border rounded-full text-sm font-medium mb-4 animate-pulse neon-text">
              🎓 NEW PROGRAM LAUNCH - INCLUDES LIVE TRAINING & FULL PLATFORM ACCESS
            </div>
            <h2 className="text-5xl font-bold mb-4 glow-text">
              GAP YEAR ELITE PROGRAM
            </h2>
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
              Strategic athletic reclassification with daily live training & unlimited access to all Go4It features
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Take Control of Your Athletic Future
              </h3>
              <p className="text-lg text-slate-300 mb-6">
                Our Gap Year program gives student-athletes the strategic advantage: an extra year to develop physically, mentally, and athletically while maintaining NCAA eligibility.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Live Training 5 Days/Week</strong> - Real-time coaching sessions with NFL/D1 coaches</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Full Platform Access</strong> - All premium features included (GAR, StarPath, Academy)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300"><strong>100% College Placement</strong> - Guaranteed recruitment support with D1 exposure</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Unlimited GAR Analysis</strong> - Monthly assessments with AI voice coaching</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Strategic Reclassification</strong> - NCAA compliant grade placement for eligibility</span>
                </div>
              </div>

              <div className="hero-bg neon-border rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Investment in Excellence</p>
                    <div className="text-4xl font-bold neon-text">
                      $999<span className="text-xl">.95</span>
                      <span className="text-base text-slate-400 font-normal">/month</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm neon-text font-medium">SAVE $2,000</p>
                    <p className="text-xs text-slate-400">with annual plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Trophy className="w-4 h-4 neon-text" />
                  <span>30-day money-back guarantee</span>
                  <span>•</span>
                  <span>Cancel anytime</span>
                </div>
              </div>

              <a href="/gap-year" className="glow-button text-xl px-12 py-4">
                Learn More & Enroll Now
              </a>
            </div>

            <div className="relative">
              <div className="hero-bg neon-border rounded-xl p-8">
                <h4 className="text-2xl font-bold neon-text mb-6 text-center">Success Metrics</h4>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
                    <p className="text-sm text-slate-400">College Placement</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">87%</div>
                    <p className="text-sm text-slate-400">D1 Scholarships</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">+40</div>
                    <p className="text-sm text-slate-400">Avg. GAR Increase</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">250+</div>
                    <p className="text-sm text-slate-400">Alumni Athletes</p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <p className="text-center text-slate-300 italic">
                    "The Gap Year program transformed my son from unranked to a full D1 scholarship at Duke."
                  </p>
                  <p className="text-center text-sm text-slate-400 mt-2">- Marcus Johnson Sr., Parent</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                Limited Spots!
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-2">Featured Coaching Staff:</p>
            <p className="text-blue-400 font-semibold text-lg">
              2x Super Bowl Champion Derrick Martin • NFL Veterans • D1 College Coaches
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events - Now Featured at Top */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center neon-text mb-4">{eventsContent.title}</h2>
          <p className="text-center text-slate-400 mb-12">{eventsContent.subtitle}</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {eventsContent.events?.map((event: any, index: number) => (
              <div key={event.id || index} className="hero-bg neon-border rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className={`text-white px-3 py-1 rounded-full text-sm font-bold ${
                    event.category === 'BILINGUAL' ? 'bg-red-600' :
                    event.category === 'ELITE' ? 'bg-purple-600' :
                    event.category === 'OPEN HOUSE' ? 'bg-green-600' :
                    'bg-blue-600'
                  }`}>
                    {event.category}
                  </div>
                </div>
                {event.image && (
                  <div className="mb-6">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  <div className="flex items-center text-slate-400 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-slate-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{event.dates}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {event.features?.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        event.category === 'BILINGUAL' ? 'text-blue-400' :
                        event.category === 'ELITE' ? 'text-purple-400' :
                        'text-blue-400'
                      }`} />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className={`text-3xl font-bold ${
                    event.category === 'BILINGUAL' ? 'text-blue-400' :
                    event.category === 'ELITE' ? 'text-purple-400' :
                    'text-blue-400'
                  }`}>
                    {event.price}
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.schedule || `Max ${event.maxParticipants} athletes`}</span>
                  </div>
                </div>
                
                {/* USA Football Benefits */}
                {event.usaFootballBenefits && (
                  <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 font-bold text-sm">USA FOOTBALL INCLUDED</span>
                    </div>
                    <div className="text-sm text-slate-300 mb-2">
                      {event.usaFootballBenefits.membershipType} • {event.usaFootballBenefits.discount}
                    </div>
                    <div className="text-xs text-slate-400">
                      + 6-month Go4It platform access • Official credentials • $100K insurance
                    </div>
                  </div>
                )}
                
                <a href="/camp-registration" className={`w-full text-center py-3 inline-block font-bold transition-colors rounded-lg ${
                  event.category === 'BILINGUAL' ? 'glow-button' :
                  event.category === 'ELITE' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                  'glow-button'
                }`}>
                  Register - Profile Required
                </a>
                
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500 rounded-full blur-2xl"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 mb-4">Registration requires creating your Go4It athlete profile</p>
            <p className="text-blue-400 font-semibold">Featured: 2x Super Bowl Champion Derrick Martin & NFL alumnus Talib Wise</p>
            <p className="text-slate-500 text-sm mt-2">Elite participants may qualify for exclusive 10-week S.T.A.g.e. program in Dallas, Texas</p>
          </div>
        </div>
      </section>

      {/* StarPath Gaming System - NEW FEATURED SECTION */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
              🎮 GAMIFIED TRAINING SYSTEM
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              STARPATH XP SYSTEM
            </h2>
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
              Level up your skills with our revolutionary gaming-style progression system
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/50">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Technical Skills</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Ball Control</span>
                  <span className="text-blue-400 font-bold">Level 3/5</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">First Touch</span>
                  <span className="text-green-400 font-bold">Level 5/5 ✓</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                750 XP earned • Next unlock: Advanced Techniques
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-purple-500/50">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Physical Training</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Speed & Agility</span>
                  <span className="text-purple-400 font-bold">Level 2/5</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Strength</span>
                  <span className="text-yellow-400 font-bold">Level 4/5</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                450 XP earned • Achievement unlocked: Speed Demon 🏃‍♂️
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-green-500/50">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mental Game</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Game Vision</span>
                  <span className="text-green-400 font-bold">Level 1/5</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Focus</span>
                  <span className="text-slate-500">Locked 🔒</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-slate-600 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                200 XP earned • Complete Game Vision to unlock Focus
              </div>
            </div>
          </div>

          <div className="text-center bg-slate-800/30 rounded-xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Your StarPath Journey</h3>
            <p className="text-slate-300 mb-6">
              Every training session, every drill, every improvement earns XP. Unlock new skills, earn badges, and climb the leaderboards.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="/starpath" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all">
                <Play className="w-5 h-5 mr-2" />
                Start Your StarPath Journey
              </a>
              <a href="/starpath/leaderboard" className="inline-flex items-center px-6 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold rounded-lg transition-all">
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* International Travel Teams - NEW SECTION */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
              🌍 INTERNATIONAL COMPETITION
            </div>
            <h2 className="text-5xl font-bold mb-4 glow-text">
              TRAVEL TEAMS
            </h2>
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
              Elite international competition opportunities in Flag Football, Basketball, and Soccer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="hero-bg neon-border rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  FLAG FOOTBALL
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">USA Football Elite</h3>
                <p className="text-slate-300">
                  Compete internationally with official USA Football sanctioning and full NCAA eligibility protection.
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">International tournaments in Mexico, Canada</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">USA Football official credentials</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">$100,000 medical coverage included</span>
                </div>
              </div>
              <div className="bg-green-600/20 p-4 rounded-lg text-center">
                <p className="text-green-400 font-bold">Next Tournament: Mexico</p>
                <p className="text-slate-300 text-sm">January 2025</p>
              </div>
            </div>

            <div className="hero-bg neon-border rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  BASKETBALL
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Elite Court Academy</h3>
                <p className="text-slate-300">
                  International basketball exposure with top European and Canadian programs.
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-300">European exposure tournaments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-300">Professional coaching from overseas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-300">College scout exposure events</span>
                </div>
              </div>
              <div className="bg-orange-600/20 p-4 rounded-lg text-center">
                <p className="text-orange-400 font-bold">Next Tournament: Canada</p>
                <p className="text-slate-300 text-sm">March 2025</p>
              </div>
            </div>

            <div className="hero-bg neon-border rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  SOCCER
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">International Futbol</h3>
                <p className="text-slate-300">
                  Compete against international youth academies and professional development programs.
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">Academy partnerships in Mexico</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">Professional scout exposure</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">MLS Development pathway</span>
                </div>
              </div>
              <div className="bg-blue-600/20 p-4 rounded-lg text-center">
                <p className="text-blue-400 font-bold">Next Tournament: Mexico</p>
                <p className="text-slate-300 text-sm">February 2025</p>
              </div>
            </div>
          </div>

          <div className="text-center hero-bg neon-border rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Gap Year + Travel Teams = Elite Pathway</h3>
            <p className="text-lg text-slate-300 mb-6 max-w-3xl mx-auto">
              Combine our Gap Year Elite Program with international travel team opportunities for the ultimate competitive advantage. 
              Train daily, compete internationally, get recruited globally.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="/gap-year" className="glow-button inline-flex items-center px-8 py-3">
                Join Gap Year + Teams
              </a>
              <a href="/teams" className="inline-flex items-center px-6 py-3 neon-border neon-text hover:hero-bg font-bold rounded-lg transition-all">
                View Team Opportunities
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Start Free - Now After Featured Sections */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
                <h2 className="text-3xl font-bold text-white">START FREE — CLAIM YOUR SPOT</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">Your journey starts now.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Build your profile
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Upload your highlight reels
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Access your own training dashboard
                </li>
              </ul>
              <p className="text-blue-400 font-bold text-lg mb-6">No commitment. No fluff. All fire.</p>
              <a href="/register" className="glow-button text-lg px-8 py-3">
                Create Your Free Account
              </a>
            </div>
            <div className="relative">
              <div className="hero-bg neon-border p-8 rounded-xl shadow-2xl hover-lift">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Athlete Dashboard</h3>
                <p className="text-slate-400 mb-4">
                  Your complete performance command center with real-time analytics and progress tracking.
                </p>
                <div className="bg-slate-900/50 neon-border p-4 rounded-lg">
                  <ClientOnly>
                    <AnimatedProgressBar 
                      percentage={84} 
                      showLabel={true} 
                      labelText="GAR Score"
                      delay={500}
                    />
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Verified Athletes Showcase */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold neon-text mb-4">TOP VERIFIED ATHLETES</h2>
            <p className="text-xl text-slate-300">Elite performers setting the standard with their GAR scores</p>
          </div>
          
          <div className="mb-16">
            <img 
              src="/assets/verified-athletes.png"
              alt="Top Verified Athletes with GAR Scores - showcasing elite performers across multiple sports"
              className="w-full max-w-4xl mx-auto rounded-xl shadow-2xl border border-slate-700"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Step 2: Get Your GAR */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Add Activity Feed */}
              <div className="mb-6">
                <ClientOnly>
                  <ActivityFeed />
                </ClientOnly>
              </div>
              <img 
                src="/assets/gar-system-breakdown.png"
                alt="GAR Rating System Breakdown - comprehensive explanation of our 3-part evaluation system"
                className="w-full rounded-xl shadow-2xl border border-slate-700"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
                <h2 className="text-3xl font-bold text-white">GET YOUR GAR — YOUR VERIFIED SCORE</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">The <strong>Growth & Ability Rating (GAR)</strong> isn't hype — it's science.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <Star className="w-5 h-5 text-yellow-400 mr-3" />
                  <strong>Physical (60%)</strong> - Sprint, agility, strength, coordination
                </li>
                <li className="flex items-center text-slate-300">
                  <Target className="w-5 h-5 text-red-400 mr-3" />
                  <strong>Cognitive (20%)</strong> - Decision-making, memory, learning style
                </li>
                <li className="flex items-center text-slate-300">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
                  <strong>Psychological (20%)</strong> - Confidence, coachability, resilience
                </li>
                <li className="flex items-center text-slate-300">
                  <Award className="w-5 h-5 text-purple-400 mr-3" />
                  Complete holistic rating system for total athlete development
                </li>
              </ul>
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-green-400 font-bold text-lg">$49 one-time — or unlimited with PRO/ELITE</p>
              </div>
              <a href="/gar-analysis" className="glow-button text-lg px-8 py-3 mb-4 inline-block">
                Get My GAR Score
              </a>
              <div className="hero-bg neon-border p-6 rounded-lg mt-6">
                <h4 className="text-lg font-bold neon-text mb-2">The Go4It Athletic Rating (GAR)</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  A dynamic scientifically backed multi-dimensional wholistic system that scores more than physical stats. 
                  Our system captures mental, emotional and learning traits to provide the most complete rating known to date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Enter the StarPath */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
                <h2 className="text-3xl font-bold text-white">ENTER THE STARPATH</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">You've been training. Now it's time to level up.</p>
              <p className="text-lg text-slate-400 mb-6">
                <strong>The StarPath System</strong> turns your grind into a growth game:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <Zap className="w-5 h-5 text-yellow-400 mr-3" />
                  Unlockable XP trees and milestone markers
                </li>
                <li className="flex items-center text-slate-300">
                  <TrendingUp className="w-5 h-5 text-blue-400 mr-3" />
                  Performance tracking that feels like progress
                </li>
                <li className="flex items-center text-slate-300">
                  <Trophy className="w-5 h-5 text-purple-400 mr-3" />
                  Weekly targets, trophies, and rankings
                </li>
              </ul>
              <div className="hero-bg neon-border p-4 rounded-lg mb-6">
                <p className="neon-text font-bold text-lg">Starter Plan: $19/month</p>
                <p className="text-slate-400">because average isn't in your vocabulary.</p>
              </div>
              <a href="/starpath" className="glow-button text-lg px-8 py-3 inline-block">
                Start My StarPath Journey
              </a>
            </div>
            <div className="relative">
              <div className="hero-bg neon-border p-8 rounded-xl shadow-2xl hover-lift">
                <h3 className="text-xl font-semibold mb-6 text-white text-center">StarPath Progress</h3>
                <div className="space-y-4">
                  {[
                    { skill: "Speed Training", progress: 85, xp: "2,340 XP" },
                    { skill: "Technique", progress: 72, xp: "1,890 XP" },
                    { skill: "Game IQ", progress: 63, xp: "1,245 XP" },
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white font-medium">{item.skill}</span>
                        <span className="text-xs text-purple-400">{item.xp}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full" style={{width: `${item.progress}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: NCAA StarPath Elite */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="hero-bg neon-border rounded-xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <Crown className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold neon-text">NCAA STARPATH ELITE</h3>
                  <p className="text-slate-300">For athletes who mean business</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Real-time NCAA eligibility tracking",
                    "GPA and course monitoring", 
                    "AI-powered academic tutoring",
                    "Access to 500+ recruiter contacts"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">4</div>
                <h2 className="text-3xl font-bold text-white">GO NEXT-LEVEL WITH NCAA STARPATH ELITE</h2>
              </div>
              <p className="text-xl text-slate-300 mb-6">
                Want scholarships? Offers? Your name on a recruiter's board?<br />
                This is where you separate from the pack.
              </p>
              <p className="text-lg text-slate-400 mb-8">
                <strong>NCAA StarPath ELITE gives you:</strong>
              </p>
              <div className="hero-bg neon-border p-4 rounded-lg mb-6">
                <p className="neon-text font-bold text-lg">Elite Plan: $99/month</p>
                <p className="text-slate-400">for athletes who mean business.</p>
              </div>
              <a href="/elite-upgrade" className="glow-button text-lg px-8 py-3 inline-block">
                Upgrade to NCAA StarPath ELITE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold neon-text mb-4">THE NUMBERS SPEAK</h2>
          <p className="text-2xl text-slate-300 mb-12 font-medium">Real results from real athletes making real moves.</p>
          <ClientOnly>
            <StatisticsCounter />
          </ClientOnly>
        </div>
      </section>

      {/* Why Go4It Wins */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold neon-text mb-4">WHY GO4IT WINS</h2>
          <p className="text-2xl text-slate-300 mb-12 font-medium">Because you don't just want to play. You want to rise.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 neon-border rounded-full flex items-center justify-center mx-auto mb-4 neon-glow bg-gradient-to-r from-blue-600 to-cyan-400">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Built for Athletes</h3>
              <p className="text-slate-400">Every feature, every tool, every click is designed for your path.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 neon-border rounded-full flex items-center justify-center mx-auto mb-4 neon-glow bg-gradient-to-r from-purple-600 to-blue-400">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Evaluation</h3>
              <p className="text-slate-400">No opinions. Just facts, footage, and verified data.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 neon-border rounded-full flex items-center justify-center mx-auto mb-4 neon-glow bg-gradient-to-r from-green-600 to-blue-400">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Recruitment Ready</h3>
              <p className="text-slate-400">From your highlight reel to your GPA — we track it all.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 neon-border rounded-full flex items-center justify-center mx-auto mb-4 neon-glow bg-gradient-to-r from-yellow-600 to-cyan-400">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gamified Growth</h3>
              <p className="text-slate-400">Progress isn't boring when it feels like winning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Athletes - Horizontal Carousel */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center neon-text mb-4">VERIFIED ATHLETES</h2>
          <p className="text-center text-slate-400 mb-12">See how our top performers stack up</p>
          
          {/* Horizontal Carousel */}
          <div className="relative">
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 w-max">
                {[
                  {
                    id: '1',
                    name: 'Marcus Johnson',
                    position: 'Quarterback',
                    sport: 'Football',
                    garScore: 9.2,
                    isVerified: true,
                    year: '2025',
                    stats: {
                      speed: 8.7,
                      agility: 9.1,
                      strength: 8.4,
                      technique: 9.3,
                      gameIQ: 9.5
                    }
                  },
                  {
                    id: '2',
                    name: 'Sarah Chen',
                    position: 'Point Guard',
                    sport: 'Basketball',
                    garScore: 8.8,
                    isVerified: true,
                    year: '2026',
                    stats: {
                      speed: 9.2,
                      agility: 9.4,
                      strength: 7.8,
                      technique: 8.9,
                      gameIQ: 9.1
                    }
                  },
                  {
                    id: '3',
                    name: 'Diego Rodriguez',
                    position: 'Midfielder',
                    sport: 'Soccer',
                    garScore: 8.5,
                    isVerified: true,
                    year: '2025',
                    stats: {
                      speed: 8.9,
                      agility: 8.8,
                      strength: 8.1,
                      technique: 8.7,
                      gameIQ: 8.3
                    }
                  },
                  {
                    id: '4',
                    name: 'Alex Thompson',
                    position: 'Sprinter',
                    sport: 'Track & Field',
                    garScore: 9.0,
                    isVerified: true,
                    year: '2024',
                    stats: {
                      speed: 9.5,
                      agility: 8.6,
                      strength: 8.8,
                      technique: 9.1,
                      gameIQ: 8.4
                    }
                  },
                  {
                    id: '5',
                    name: 'Maya Patel',
                    position: 'Defender',
                    sport: 'Soccer',
                    garScore: 8.7,
                    isVerified: true,
                    year: '2025',
                    stats: {
                      speed: 8.3,
                      agility: 8.9,
                      strength: 8.5,
                      technique: 8.8,
                      gameIQ: 9.2
                    }
                  }
                ].map((player) => (
                  <div key={player.id} className="w-80 flex-shrink-0 hero-bg neon-border rounded-xl p-6 card-hover relative overflow-hidden">
                    {/* Verification Badge */}
                    {player.isVerified && (
                      <div className="absolute top-4 right-4 w-8 h-8 neon-border rounded-full flex items-center justify-center neon-glow bg-gradient-to-r from-blue-400 to-cyan-300">
                        <span className="text-slate-900 font-bold text-sm">✓</span>
                      </div>
                    )}

                    {/* Player Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{player.name}</h3>
                        <p className="text-slate-400 text-sm">{player.position} • {player.sport}</p>
                        <p className="text-slate-500 text-xs">Class of {player.year}</p>
                      </div>
                    </div>

                    {/* GAR Score */}
                    <div className="mb-4 text-center">
                      <div className={`text-3xl font-bold ${player.garScore >= 8 ? 'neon-text neon-glow' : 'text-blue-400'}`}>
                        {player.garScore.toFixed(1)}
                      </div>
                      <p className="text-slate-400 text-sm">GAR Score</p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="text-sm text-slate-300 font-medium mb-2">Performance Metrics</div>
                      {Object.entries(player.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm capitalize">{key}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-700 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${value >= 8 ? 'bg-gradient-to-r from-blue-400 to-cyan-300 neon-glow' : value >= 6 ? 'bg-blue-400' : value >= 4 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                style={{ width: `${(value / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${value >= 8 ? 'neon-text' : value >= 6 ? 'text-blue-400' : value >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {value.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Star Rating */}
                    <div className="flex justify-center mt-4 gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = player.garScore >= star * 2
                        return (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              isActive 
                                ? player.garScore >= 8 
                                  ? 'text-cyan-400 neon-glow' 
                                  : 'text-blue-400'
                                : 'text-slate-600'
                            } ${isActive ? 'fill-current' : ''}`}
                          />
                        )
                      })}
                    </div>

                    {/* Background Effect */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500 rounded-full blur-2xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="text-center mt-4">
              <p className="text-slate-400 text-sm">← Scroll to view more verified athletes →</p>
            </div>
          </div>
        </div>
      </section>



      {/* Complete Stack */}
      <section className="py-16 px-4 hero-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold glow-text mb-8">YOUR COMPLETE STACK</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              "GAR Score Analysis (13 sports)",
              "StarPath XP Progression System",
              "24/7 AI Coaching Engine",
              "Academic GPA + NCAA Eligibility Tools",
              "Mental Wellness & Nutrition Hub",
              "National Rankings + Leaderboards",
              "Athlete Dashboard + Mobile Access"
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-slate-300 text-lg">
                <CheckCircle className="w-6 h-6 neon-text mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <a href="/register" className="glow-button text-xl px-12 py-4">
            Start Free. Get Ranked. Go4It.
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center hero-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            THIS ISN'T JUST TRAINING —<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              THIS IS TRANSFORMATION
            </span>
          </h2>
          <div className="text-xl text-slate-300 mb-8 space-y-2">
            <p>You're not just trying out. You're breaking through.</p>
            <p>You're not just chasing stars. You're earning them.</p>
          </div>
          <p className="text-lg text-slate-400 mb-8">
            <strong>Go4It is the first platform built for athletes who want to be verified — and recruited.</strong>
          </p>
          <p className="text-xl text-slate-300 mb-12 font-semibold">
            This isn't a workout app. It's a war map.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <a href="/register" className="glow-button px-10 py-4 text-xl">
              Go4It. Get Verified.
            </a>
            <a href="/camp-registration" className="neon-border neon-text hover:hero-bg px-10 py-4 rounded-lg font-bold text-xl transition-colors">
              Become Unstoppable
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 hero-bg relative overflow-hidden">
        <div className="absolute inset-0 neon-border opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="glow-text">One Platform. One Mission. Go D1.</span>
          </h2>
          <a href="/register" className="glow-button text-xl px-12 py-4">
            Get Verified Today
          </a>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  )
}