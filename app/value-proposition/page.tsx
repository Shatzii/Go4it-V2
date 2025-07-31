'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, ArrowRight, Target, Users, BookOpen, Trophy, BarChart3, Heart, Brain, Shield } from 'lucide-react'

export default function ValuePropositionPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Platform Analysis: What We Really Provide</h1>
          <p className="text-xl text-slate-300">Clear breakdown of our core value proposition</p>
        </div>

        {/* The Problem We Solve */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">The Student-Athlete Challenge</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-red-900/20 border-red-800">
              <CardHeader>
                <CardTitle className="text-red-300 flex items-center">
                  <X className="w-5 h-5 mr-2" />
                  Traditional Approach Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-slate-300">
                  <li>• Athletes struggle balancing sports and academics</li>
                  <li>• Expensive separate solutions for each need</li>
                  <li>• No integrated progress tracking</li>
                  <li>• Limited access to quality education</li>
                  <li>• Unclear path to college recruitment</li>
                  <li>• Performance analysis only for elite athletes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Our Integrated Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-slate-300">
                  <li>• One platform for sports + academics</li>
                  <li>• Affordable monthly pricing for complete solution</li>
                  <li>• Unified progress tracking and NCAA compliance</li>
                  <li>• Access to 200M+ student curriculum</li>
                  <li>• Clear recruitment pathway and tools</li>
                  <li>• AI-powered analysis for every athlete</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Value Propositions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Three Clear Value Propositions</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Athletic Performance */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-center text-blue-300">Athletic Excellence</CardTitle>
                <CardDescription className="text-center">
                  Professional-grade sports analysis accessible to all
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">What We Provide:</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• AI-powered video analysis</li>
                      <li>• GAR (Growth & Ability Rating) scoring</li>
                      <li>• Performance benchmarking</li>
                      <li>• Injury prevention insights</li>
                      <li>• Training recommendations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Unique Value:</h4>
                    <p className="text-sm text-slate-300">
                      Democratizes elite-level sports analysis. What used to cost $1000+ per session is now available monthly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Foundation */}
            <Card className="bg-slate-800 border-slate-700 ring-2 ring-purple-500">
              <CardHeader>
                <Badge className="bg-purple-600 text-white mx-auto mb-2">Core Differentiator</Badge>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-center text-purple-300">Academic Success</CardTitle>
                <CardDescription className="text-center">
                  Complete 7th-12th grade education from trusted sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">What We Provide:</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• CK-12 Foundation curriculum (200M+ students)</li>
                      <li>• OER Commons resources (50K+ materials)</li>
                      <li>• NCAA-approved coursework</li>
                      <li>• Progress tracking & GPA calculation</li>
                      <li>• Standards-aligned content</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Unique Value:</h4>
                    <p className="text-sm text-slate-300">
                      The ONLY platform combining elite sports training with complete academic education. Competitors focus on one or the other.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recruitment Success */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-center text-orange-300">Recruitment Pipeline</CardTitle>
                <CardDescription className="text-center">
                  Direct path from performance to college opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">What We Provide:</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Verified coach database</li>
                      <li>• Professional highlight reels</li>
                      <li>• Performance rankings</li>
                      <li>• Scholarship matching</li>
                      <li>• NCAA compliance tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Unique Value:</h4>
                    <p className="text-sm text-slate-300">
                      Integrated approach ensures academic eligibility while showcasing athletic performance. Complete student-athlete package.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Target Audiences */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Who We Serve</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-300 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Individual Student-Athletes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">Primary Users:</h4>
                    <ul className="text-sm text-slate-300 mt-2 space-y-1">
                      <li>• High school athletes (grades 7-12)</li>
                      <li>• Homeschool athletes needing curriculum</li>
                      <li>• Athletes in underserved areas</li>
                      <li>• Neurodivergent student-athletes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Value Delivered:</h4>
                    <ul className="text-sm text-slate-300 mt-2 space-y-1">
                      <li>• One platform for all their needs</li>
                      <li>• Affordable access to premium tools</li>
                      <li>• Clear path to college recruitment</li>
                      <li>• Academic and athletic progress tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Schools & Organizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">Institutional Clients:</h4>
                    <ul className="text-sm text-slate-300 mt-2 space-y-1">
                      <li>• High schools with athletic programs</li>
                      <li>• Club sports organizations</li>
                      <li>• Homeschool co-ops</li>
                      <li>• Training academies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Institutional Value:</h4>
                    <ul className="text-sm text-slate-300 mt-2 space-y-1">
                      <li>• Bulk pricing and team management</li>
                      <li>• Academic compliance monitoring</li>
                      <li>• Performance analytics for all athletes</li>
                      <li>• Simplified recruitment support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Competitive Advantage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why We Win</h2>
          
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Unique Market Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-4">What Competitors Offer:</h4>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div>
                      <strong>Sports Platforms (NCSA, Stack Sports):</strong>
                      <p>• Recruitment only, no academics</p>
                      <p>• $1,300-$4,200 annual pricing</p>
                      <p>• Limited performance analysis</p>
                    </div>
                    <div>
                      <strong>Education Platforms (Khan Academy, Coursera):</strong>
                      <p>• Education only, no sports integration</p>
                      <p>• No NCAA compliance tracking</p>
                      <p>• Not designed for student-athletes</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-4">Our Advantage:</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      <span>Only platform combining sports + academics</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      <span>Affordable monthly pricing ($49-149/month)</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      <span>AI-powered analysis for all athletes</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      <span>Proven curriculum (200M+ students)</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      <span>Built specifically for student-athletes</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-2" />
                      <span>NCAA compliance built-in</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Clear Messaging Framework */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Condensed Messaging Framework</h2>
          
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-300">Primary Message (15 seconds)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-white">
                  "Go4It Sports is the complete student-athlete platform. AI-powered sports analysis plus full 7th-12th grade education. Everything you need to excel in sports and school."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-300">Value Proposition (30 seconds)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">
                  "Student-athletes face a unique challenge: excelling in both sports and academics while navigating college recruitment. Traditional solutions are expensive, fragmented, and don't understand the student-athlete journey.
                  <br/><br/>
                  Go4It Sports solves this with one integrated platform: professional sports analysis, complete K-12 education from trusted sources, and direct recruitment tools. For less than competitors charge for recruitment alone, you get everything a student-athlete needs to succeed."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-300">Three-Point Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Sports Performance</h4>
                    <p className="text-slate-300">AI analysis & training</p>
                  </div>
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Complete Education</h4>
                    <p className="text-slate-300">Grades 7-12 curriculum</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">College Recruitment</h4>
                    <p className="text-slate-300">Direct coach connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8">Implementation Recommendations</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-300">Immediate Actions</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-2 text-slate-300">
                  <li>• Simplify homepage to three core benefits</li>
                  <li>• Create clear navigation: Sports | Education | Recruitment</li>
                  <li>• Reduce pricing options to Free, Athlete ($49), Academy ($84)</li>
                  <li>• Focus marketing on student-athlete integration story</li>
                  <li>• Remove confusing secondary features from main navigation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-300">Content Strategy</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-2 text-slate-300">
                  <li>• Lead with student-athlete success stories</li>
                  <li>• Emphasize "one platform" integration benefits</li>
                  <li>• Showcase before/after academic + athletic progress</li>
                  <li>• Compare all-in-one pricing vs. fragmented competition</li>
                  <li>• Highlight NCAA compliance and college recruitment outcomes</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            View Simplified Landing Page
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>
      </div>
    </div>
  )
}