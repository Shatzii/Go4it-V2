'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Activity, Target, Users, BarChart3, Star, TrendingUp, Award, Calendar, MapPin, ArrowRight, Play } from 'lucide-react'

// Star Rating Component to match deployed site
function StarRating({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  const stars = []
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star 
        key={i} 
        className={`w-4 h-4 ${i <= rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
      />
    )
  }
  return <div className="flex items-center gap-1">{stars}</div>
}

// Go4It Sports Landing Page - Exact match to deployed site styling
export default function Go4ItHomePage() {
  const [platformStatus, setPlatformStatus] = useState('loading')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setPlatformStatus('ready')
        } else {
          setPlatformStatus('degraded')
        }
      } catch (error) {
        console.log('Health check failed, using offline mode')
        setPlatformStatus('offline')
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-foreground">
              Go4It Sports
            </div>
            <div className="flex items-center space-x-4">
              <SafeLink 
                href="/cms" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                CMS
              </SafeLink>
              <SafeLink 
                href="/auth" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </SafeLink>
              <SafeLink 
                href="/auth" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </SafeLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dynamic Sports Platform */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">Platform Status: {platformStatus.charAt(0).toUpperCase() + platformStatus.slice(1)}</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                  Elevate Your
                  <span className="block text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Athletic Journey
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  The ultimate AI-powered platform designed specifically for neurodivergent student athletes. 
                  Combine elite athletic training with academic excellence.
                </p>
              </div>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">AI Coach</div>
                    <div className="text-sm text-muted-foreground">Personal Training</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">GAR Rating</div>
                    <div className="text-sm text-muted-foreground">Performance Analytics</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">StarPath</div>
                    <div className="text-sm text-muted-foreground">Skill Progression</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Academy</div>
                    <div className="text-sm text-muted-foreground">Full Education</div>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <SafeLink 
                  href="/auth" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5" />
                  Start Your Journey
                </SafeLink>
                
                <SafeLink 
                  href="/ai-coach" 
                  className="border border-primary/30 hover:bg-primary/10 text-primary px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Try AI Coach
                </SafeLink>
              </div>
            </div>
            
            {/* Right Column - Visual Elements */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative bg-gradient-to-br from-card to-card/50 rounded-3xl border border-border/50 p-8 shadow-2xl">
                {/* Performance Stats */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">Performance Overview</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Live</span>
                    </div>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Athletic Performance</span>
                        <span className="text-sm text-primary font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[92%] transition-all duration-1000"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Academic Progress</span>
                        <span className="text-sm text-primary font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[87%] transition-all duration-1000 delay-300"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">StarPath Level</span>
                        <span className="text-sm text-primary font-semibold">Elite</span>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[95%] transition-all duration-1000 delay-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">1,247</div>
                      <div className="text-sm text-muted-foreground">Training Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">94%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Achievement Card */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg transform rotate-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">New Achievement!</span>
                </div>
                <div className="text-sm opacity-90">Elite Performance Unlocked</div>
              </div>
              
              {/* Floating Notification */}
              <div className="absolute -bottom-4 -left-4 bg-card border border-border/50 p-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">AI Coach Ready</div>
                    <div className="text-xs text-muted-foreground">3 new drills available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Verified Athletes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Top Verified Athletes</h2>
            <SafeLink 
              href="/athletes" 
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </SafeLink>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AthleteCard
              name="Alonzo Barrett"
              sport="Basketball"
              position="Shooting Guard"
              garScore={92}
              verified={true}
              imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
            />
            <AthleteCard
              name="Alonzo Barrett"
              sport="Track & Field"
              position="Sprinter"
              garScore={87}
              verified={true}
              imageUrl="https://images.unsplash.com/photo-1527334919515-b8dee906a34b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJhY2slMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
            />
            <AthleteCard
              name="Malik Barrett"
              sport="Skiing"
              position="Ski Jumper"
              garScore={85}
              verified={true}
              imageUrl="https://go4itsports.org/uploads/athletes/IMG_6486.jpeg"
            />
            <AthleteCard
              name="Adee Méndez"
              sport="Soccer"
              position="Center Midfielder"
              garScore={94}
              verified={true}
              imageUrl="https://images.unsplash.com/photo-1511067007398-7e4b9499a637?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Combine Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Upcoming Combine Events</h2>
            <SafeLink 
              href="/combine-tour" 
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </SafeLink>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <CombineEventCard
              title="Chicago Elite Combine"
              location="Chicago, IL"
              date="Jul 22, 2025"
              status="FILLING FAST"
              description="Join us for a comprehensive evaluation featuring physical testing, skills assessment, and game play. College coaches will be in attendance to evaluate talent."
            />
            <CombineEventCard
              title="Los Angeles Skills Showcase"
              location="Los Angeles, CA"
              date="Jul 29, 2025"
              status="FILLING FAST"
              description="An exclusive opportunity for top high school athletes to showcase their skills in front of college scouts and coaches."
            />
            <CombineEventCard
              title="Dallas All-Stars Combine"
              location="Arlington, TX"
              date="Jul 16, 2025"
              status="FILLING FAST"
              description="The premier combine event in Texas featuring comprehensive testing and evaluation for multiple sports."
            />
          </div>
        </div>
      </section>

      {/* Blog & News */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Blog & News</h2>
            <SafeLink 
              href="/blog" 
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </SafeLink>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Featured
            </button>
            <button className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Training
            </button>
            <button className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Nutrition
            </button>
            <button className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Recruiting
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogCard
              title="The Ultimate Guide to NIL opportunities for high school athletes"
              category="tips"
              date="Jun 2, 2025"
              imageUrl="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800"
              excerpt="This comprehensive guide explores nil opportunities for high school athletes, offering valuable insights for athletes, coaches, and parents."
            />
            <BlogCard
              title="5 Key Insights About Soccer position-specific training for midfielders"
              category="training"
              date="Jun 2, 2025"
              imageUrl="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"
              excerpt="Learn the latest strategies, techniques, and trends that can help young athletes excel in today's competitive sports landscape."
            />
            <BlogCard
              title="How college recruiters are using AI to find talent"
              category="ncaa"
              date="Jun 2, 2025"
              imageUrl="https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800"
              excerpt="Discover how AI is changing the recruiting landscape and what it means for student athletes."
            />
          </div>
        </div>
      </section>

      {/* Community Forum */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Community Forum</h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Connect with athletes, coaches, and parents in our community forum. Share experiences, get advice, and build your network.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <CommunityCard
              title="Athletes"
              subtitle="Training & Development"
              description="Share your training routines, progress, and goals with other athletes."
              href="/community/athletes"
            />
            <CommunityCard
              title="Coaches"
              subtitle="Coaching Strategies"
              description="Exchange coaching tips, drills, and management strategies."
              href="/community/coaches"
            />
            <CommunityCard
              title="Parents"
              subtitle="Parent Support Network"
              description="Connect with other parents about supporting your young athletes."
              href="/community/parents"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-secondary-foreground mb-4">
            Ready to Elevate Your Athletic Journey?
          </h2>
          <p className="text-xl text-secondary-foreground/80 mb-8">
            Join thousands of athletes who have discovered their potential and connected with coaches through our platform.
          </p>
          <SafeLink 
            href="/auth" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </SafeLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-foreground mb-4">Go4It Sports</div>
              <p className="text-muted-foreground">
                Empowering athletes through AI-powered performance analysis and verified evaluation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <div className="space-y-2">
                <SafeLink href="/dashboard" className="text-muted-foreground hover:text-foreground block">Dashboard</SafeLink>
                <SafeLink href="/gar-upload" className="text-muted-foreground hover:text-foreground block">GAR Analysis</SafeLink>
                <SafeLink href="/combine-tour" className="text-muted-foreground hover:text-foreground block">Combines</SafeLink>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Community</h3>
              <div className="space-y-2">
                <SafeLink href="/community/athletes" className="text-muted-foreground hover:text-foreground block">Athletes</SafeLink>
                <SafeLink href="/community/coaches" className="text-muted-foreground hover:text-foreground block">Coaches</SafeLink>
                <SafeLink href="/community/parents" className="text-muted-foreground hover:text-foreground block">Parents</SafeLink>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2">
                <SafeLink href="/about" className="text-muted-foreground hover:text-foreground block">About</SafeLink>
                <SafeLink href="/contact" className="text-muted-foreground hover:text-foreground block">Contact</SafeLink>
                <SafeLink href="/privacy" className="text-muted-foreground hover:text-foreground block">Privacy</SafeLink>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Go4It Sports. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Reusable Components
function SafeLink({ href, children, className }: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <a 
      href={href} 
      className={className}
      onClick={(e) => {
        e.preventDefault()
        window.location.href = href
      }}
    >
      {children}
    </a>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border hover:neon-border transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function AthleteCard({ 
  name, 
  sport, 
  position, 
  garScore, 
  verified, 
  imageUrl 
}: { 
  name: string; 
  sport: string; 
  position: string; 
  garScore: number; 
  verified: boolean; 
  imageUrl: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:neon-border transition-all duration-300">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {verified && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold neon-glow">
            VERIFIED
          </div>
        )}
        
        {/* GAR Score circle with neon glow */}
        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold neon-glow">
          {garScore}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-card-foreground mb-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-1">{position}</p>
        
        {/* Match deployed site format exactly */}
        <div className="text-xs text-muted-foreground space-y-1 mb-2">
          <div>SPORT{sport}</div>
          <div>POSITION{position}</div>
          <div>GAR{garScore}/100</div>
        </div>
        
        {/* Star Rating based on GAR score with neon glow */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={Math.floor(garScore / 20)} maxRating={5} />
          <span className="text-xs text-muted-foreground">({garScore}/100)</span>
        </div>
        
        <div className="mt-3 flex gap-2">
          <SafeLink 
            href={`/profile/${encodeURIComponent(name.toLowerCase().replace(' ', '-'))}`}
            className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors neon-glow"
          >
            View Profile
          </SafeLink>
          <button className="text-primary border border-primary px-3 py-1 rounded text-xs font-medium hover:neon-border transition-all duration-300">
            Highlights
          </button>
        </div>
      </div>
    </div>
  )
}

function CombineEventCard({ 
  title, 
  location, 
  date, 
  status, 
  description 
}: { 
  title: string; 
  location: string; 
  date: string; 
  status: string; 
  description: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {status}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      <div className="flex items-center text-muted-foreground text-sm mb-1">
        <MapPin className="w-4 h-4 mr-1" />
        {location}
      </div>
      <div className="flex items-center text-muted-foreground text-sm mb-3">
        <Calendar className="w-4 h-4 mr-1" />
        {date}
      </div>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm font-medium transition-colors">
        Register Now
      </button>
    </div>
  )
}

function BlogCard({ 
  title, 
  category, 
  date, 
  imageUrl, 
  excerpt 
}: { 
  title: string; 
  category: string; 
  date: string; 
  imageUrl: string; 
  excerpt: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {category}
          </span>
          <span className="text-muted-foreground text-xs">{date}</span>
        </div>
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{excerpt}</p>
        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
          Read Article
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function CommunityCard({ 
  title, 
  subtitle, 
  description, 
  href 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  href: string;
}) {
  return (
    <div className="bg-primary/10 p-6 rounded-lg text-center">
      <h3 className="text-xl font-semibold text-primary-foreground mb-2">{title}</h3>
      <h4 className="text-lg text-primary-foreground/80 mb-3">{subtitle}</h4>
      <p className="text-primary-foreground/70 text-sm mb-4">{description}</p>
      <SafeLink 
        href={href} 
        className="bg-card text-card-foreground px-4 py-2 rounded text-sm font-medium hover:bg-card/90 transition-colors inline-block"
      >
        Join Discussion
      </SafeLink>
    </div>
  )
}