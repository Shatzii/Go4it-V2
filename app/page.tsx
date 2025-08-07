'use client';

// Go4It Sports Landing Page - StarPath Enhanced with Media Integration
import { Star, TrendingUp, GraduationCap, Trophy, CheckCircle, Target, Zap, Crown, Award, MapPin, Calendar, Users, Shield, Play, Image as ImageIcon } from 'lucide-react'
import { useCMS } from '../hooks/useCMS'
import { useState, useEffect } from 'react'

export default function Go4ItHomePage() {
  const { getSectionContent, getGlobalSettings, isLoaded } = useCMS();
  const [featuredMedia, setFeaturedMedia] = useState<any>({
    hero: {},
    gallery: [],
    videos: []
  });
  
  // Get content from CMS or use fallback
  const heroContent = getSectionContent('hero') || {
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
  
  const eventsContent = getSectionContent('events') || {
    title: 'UPCOMING EVENTS',
    subtitle: 'Elite training camps and competitions to elevate your game',
    events: []
  };
  
  const globalSettings = getGlobalSettings() || {
    siteName: 'Go4It Sports',
    tagline: 'Get Verified. Get Ranked. Get Recruited.'
  };

  // Load featured media for homepage
  useEffect(() => {
    const loadFeaturedMedia = async () => {
      try {
        const response = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getFeaturedForHomepage' })
        });
        if (response.ok) {
          const data = await response.json();
          setFeaturedMedia(data);
        }
      } catch (error) {
        console.error('Failed to load featured media:', error);
      }
    };

    loadFeaturedMedia();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="hero-bg py-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-20 neon-border rounded-lg flex items-center justify-center text-white font-bold text-xl neon-glow">
              GO4IT
            </div>
          </div>
          <div className="mb-4">
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

      {/* Featured Media Gallery */}
      {featuredMedia.gallery && featuredMedia.gallery.length > 0 && (
        <section className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold neon-text mb-4">Featured Content</h2>
              <p className="text-slate-400">See our athletes in action and discover what makes Go4It special</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMedia.gallery.slice(0, 6).map((asset: any) => (
                <div key={asset.id} className="group relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                  <div className="aspect-video relative">
                    {asset.type === 'video' ? (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <div className="relative">
                          <Play className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300"></div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            VIDEO
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img 
                          src={asset.url} 
                          alt={asset.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {asset.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {asset.originalName}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                      {asset.description || 'Featured content from our training programs'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags && asset.tags.slice(0, 3).map((tag: string) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            {featuredMedia.gallery.length > 6 && (
              <div className="text-center mt-12">
                <button className="glow-button">
                  View More Content
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Video Spotlight Section */}
      {featuredMedia.videos && featuredMedia.videos.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold neon-text mb-4">Training in Action</h2>
              <p className="text-slate-400">Watch our athletes develop their skills with Go4It Sports</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredMedia.videos.slice(0, 2).map((video: any) => (
                <div key={video.id} className="group relative">
                  <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
                      {/* Video Thumbnail or Placeholder */}
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Play className="w-20 h-20 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-slate-300 font-medium">{video.originalName}</p>
                        </div>
                      )}
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {video.originalName}
                    </h3>
                    <p className="text-slate-400">
                      {video.description || 'Training footage showcasing athletic development and technique improvement'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events - Now Featured at Top */}
      <section className="py-16 px-4">
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
                    'bg-blue-600'
                  }`}>
                    {event.category}
                  </div>
                </div>
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

      {/* Step 1: Start Free - Now After Events */}
      <section className="py-16 px-4">
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
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Athlete Dashboard</h3>
                <p className="text-slate-400 mb-4">
                  Your complete performance command center with real-time analytics and progress tracking.
                </p>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">GAR Score</span>
                    <span className="text-blue-400 font-bold">8.4/10</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '84%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Get Your GAR */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="w-full max-w-md mx-auto hero-bg neon-border rounded-xl shadow-2xl p-12 text-center relative">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto mb-6 neon-border rounded-full flex items-center justify-center text-slate-900 font-bold text-2xl neon-glow bg-gradient-to-r from-blue-400 to-cyan-300">
                    ✓
                  </div>
                  <h3 className="text-4xl font-bold neon-text mb-4">
                    GET VERIFIED
                  </h3>
                  <p className="text-slate-300 text-lg">
                    Your official athletic rating
                  </p>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
                </div>
              </div>
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
                  AI-driven breakdown of your movement and mechanics
                </li>
                <li className="flex items-center text-slate-300">
                  <Target className="w-5 h-5 text-red-400 mr-3" />
                  Full-body analysis across 5 game-changing categories
                </li>
                <li className="flex items-center text-slate-300">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-3" />
                  Real injury-risk prediction and performance trajectory
                </li>
                <li className="flex items-center text-slate-300">
                  <Award className="w-5 h-5 text-purple-400 mr-3" />
                  Compare yourself to college athletes and beyond
                </li>
              </ul>
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-green-400 font-bold text-lg">$49 one-time — or unlimited with PRO/ELITE</p>
              </div>
              <a href="/gar-analysis" className="glow-button text-lg px-8 py-3 mb-4 inline-block">
                Get My GAR Score
              </a>
              <blockquote className="border-l-4 border-blue-400 pl-4 italic text-slate-300 mt-6">
                "The GAR score didn't just improve my game — it got me in front of real recruiters. This is different."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Enter the StarPath */}
      <section className="py-16 px-4">
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
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-purple-400 font-bold text-lg">Starter Plan: $19/month</p>
                <p className="text-slate-400">because average isn't in your vocabulary.</p>
              </div>
              <a href="/starpath" className="glow-button text-lg px-8 py-3 inline-block">
                Start My StarPath Journey
              </a>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-8 rounded-xl border border-purple-500/30 shadow-2xl">
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
      <section className="py-16 px-4">
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
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <p className="text-blue-400 font-bold text-lg">Elite Plan: $99/month</p>
                <p className="text-slate-400">for athletes who mean business.</p>
              </div>
              <a href="/elite-upgrade" className="glow-button text-lg px-8 py-3 inline-block">
                Upgrade to NCAA StarPath ELITE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Go4It Wins */}
      <section className="py-16 px-4">
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
      <section className="py-16 px-4">
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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold neon-text mb-8">YOUR COMPLETE STACK</h2>
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
      <section className="py-20 px-4 text-center">
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
            <a href="/register" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-lg font-bold text-xl transition-colors">
              Go4It. Get Verified.
            </a>
            <a href="/camp-registration" className="border-2 border-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-lg font-bold text-xl transition-colors">
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