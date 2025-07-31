'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Trophy, GraduationCap, BarChart3, Users, ArrowRight, Play, BookOpen } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SimpleLandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Image
              src="/go4it-logo-new.jpg"
              alt="Go4It Sports Logo"
              width={60}
              height={60}
              className="rounded-lg mr-4"
            />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Go4It Sports
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            The Complete Student-Athlete Platform
          </h2>
          
          <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            AI-powered sports analysis + complete 7th-12th grade education. 
            Everything student-athletes need to excel in sports and academics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              onClick={() => router.push('/auth')}
            >
              Start Free Profile
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
              onClick={() => router.push('/pricing')}
            >
              View Plans & Pricing
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-400 mr-2" />
              200M+ Students Use Our Curriculum
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-400 mr-2" />
              NCAA-Approved Coursework
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-400 mr-2" />
              AI-Powered Sports Analysis
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - Three Clear Solutions */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">What We Provide</h3>
          <p className="text-xl text-slate-400 text-center mb-12">Three essential services for student-athlete success</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sports Performance */}
            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Sports Performance</CardTitle>
                <CardDescription className="text-slate-300">
                  AI-powered video analysis and performance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    GAR Score Analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Performance Insights
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Injury Prevention
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Training Recommendations
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Try AI Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-slate-800 border-slate-700 text-center ring-2 ring-blue-500">
              <CardHeader>
                <Badge className="bg-blue-600 text-white mx-auto mb-2">Most Popular</Badge>
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Complete Education</CardTitle>
                <CardDescription className="text-slate-300">
                  Full 7th-12th grade curriculum from trusted sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    CK-12 Math & Science
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    OER Commons Curriculum
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    NCAA Compliance Tracking
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Progress Monitoring
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  View Academy
                </Button>
              </CardContent>
            </Card>

            {/* College Recruitment */}
            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">College Recruitment</CardTitle>
                <CardDescription className="text-slate-300">
                  Connect with coaches and showcase your talents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Coach Database
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Highlight Videos
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Rankings & Stats
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    Scholarship Matching
                  </li>
                </ul>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Build Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Simple, Clear Pricing</h3>
          <p className="text-xl text-slate-400 mb-12">Choose the plan that fits your athletic journey</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Free</CardTitle>
                <div className="text-3xl font-bold text-white">$0</div>
                <CardDescription>Forever free athlete profile</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Create athlete profile
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Upload highlight videos
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Basic coach contact
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Athlete Plan */}
            <Card className="bg-slate-800 border-slate-700 ring-2 ring-blue-500">
              <CardHeader className="text-center">
                <Badge className="bg-blue-600 text-white mx-auto mb-2">Most Popular</Badge>
                <CardTitle className="text-white">Athlete</CardTitle>
                <div className="text-3xl font-bold text-white">$49</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Everything in Free
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    AI performance analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Advanced recruiting tools
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Performance tracking
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Athlete Plan
                </Button>
              </CardContent>
            </Card>

            {/* Academy Plan */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Academy</CardTitle>
                <div className="text-3xl font-bold text-white">$84</div>
                <CardDescription>per month (Athlete + Education)</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Everything in Athlete
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Complete 7th-12th curriculum
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    NCAA compliance tracking
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Academic progress monitoring
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Start Academy Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Button variant="outline" onClick={() => router.push('/pricing')}>
              View Detailed Pricing & Features
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Trusted by Student-Athletes</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">200M+</div>
              <p className="text-slate-300">Students using our curriculum globally</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
              <p className="text-slate-300">Educational resources available</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">100%</div>
              <p className="text-slate-300">NCAA-approved coursework</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Excel in Sports and School?</h3>
          <p className="text-xl text-slate-400 mb-8">
            Join the platform that understands student-athletes need both athletic and academic success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              onClick={() => router.push('/auth')}
            >
              Start Your Free Profile
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/go4it-logo-new.jpg"
              alt="Go4It Sports Logo"
              width={32}
              height={32}
              className="rounded mr-3"
            />
            <span className="text-white font-semibold">Go4It Sports</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-slate-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}