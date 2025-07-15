'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Activity, Target, Users, BarChart3, Star, TrendingUp, Award, Calendar, MapPin, ArrowRight, Play } from 'lucide-react'

// Go4It Sports Landing Page - Matching deployed site design exactly
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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gray-900">
              Go4It Sports
            </div>
            <div className="flex items-center space-x-4">
              <SafeLink 
                href="/auth" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </SafeLink>
              <SafeLink 
                href="/auth" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </SafeLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            GET VERIFIED
          </h1>
          
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              GAR Rating System
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              The Ultimate AI-Powered Athlete Evaluation
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our revolutionary GAR Rating System uses AI to analyze physical metrics, cognitive abilities, 
              and psychological factors for the most comprehensive athlete evaluation available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-blue-600" />}
              title="AI Motion Analysis"
              description="Our cutting-edge AI technology analyzes your motion mechanics with professional-grade accuracy."
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-indigo-600" />}
              title="Verified Combines"
              description="Participate in certified athletic combines where your performance metrics are verified by professionals."
            />
          </div>
          
          <SafeLink 
            href="/auth" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            Get Verified Today
            <ArrowRight className="w-5 h-5" />
          </SafeLink>
        </div>
      </section>

      {/* Top Verified Athletes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Verified Athletes</h2>
            <SafeLink 
              href="/athletes" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Combine Events</h2>
            <SafeLink 
              href="/combine-tour" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Blog & News</h2>
            <SafeLink 
              href="/blog" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </SafeLink>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Featured
            </button>
            <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">
              Training
            </button>
            <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">
              Nutrition
            </button>
            <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">
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
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Community Forum</h2>
          <p className="text-xl text-blue-100 mb-8">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Athletic Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of athletes who have discovered their potential and connected with coaches through our platform.
          </p>
          <SafeLink 
            href="/auth" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </SafeLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">Go4It Sports</div>
              <p className="text-gray-400">
                Empowering athletes through AI-powered performance analysis and verified evaluation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2">
                <SafeLink href="/dashboard" className="text-gray-400 hover:text-white block">Dashboard</SafeLink>
                <SafeLink href="/gar-upload" className="text-gray-400 hover:text-white block">GAR Analysis</SafeLink>
                <SafeLink href="/combine-tour" className="text-gray-400 hover:text-white block">Combines</SafeLink>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <div className="space-y-2">
                <SafeLink href="/community/athletes" className="text-gray-400 hover:text-white block">Athletes</SafeLink>
                <SafeLink href="/community/coaches" className="text-gray-400 hover:text-white block">Coaches</SafeLink>
                <SafeLink href="/community/parents" className="text-gray-400 hover:text-white block">Parents</SafeLink>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <SafeLink href="/about" className="text-gray-400 hover:text-white block">About</SafeLink>
                <SafeLink href="/contact" className="text-gray-400 hover:text-white block">Contact</SafeLink>
                <SafeLink href="/privacy" className="text-gray-400 hover:text-white block">Privacy</SafeLink>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
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
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            VERIFIED
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-lg font-bold">
          {garScore}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-1">{position}</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>SPORT: {sport}</span>
          <span>GAR: {garScore}/100</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium">
            View Profile
          </button>
          <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-xs font-medium">
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
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {status}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="flex items-center text-gray-600 text-sm mb-1">
        <MapPin className="w-4 h-4 mr-1" />
        {location}
      </div>
      <div className="flex items-center text-gray-600 text-sm mb-3">
        <Calendar className="w-4 h-4 mr-1" />
        {date}
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {category}
          </span>
          <span className="text-gray-500 text-xs">{date}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{excerpt}</p>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
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
    <div className="bg-blue-500 p-6 rounded-lg text-center">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <h4 className="text-lg text-blue-100 mb-3">{subtitle}</h4>
      <p className="text-blue-100 text-sm mb-4">{description}</p>
      <SafeLink 
        href={href} 
        className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors inline-block"
      >
        Join Discussion
      </SafeLink>
    </div>
  )
}