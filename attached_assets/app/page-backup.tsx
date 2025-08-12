import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Brain, Users, Zap, Shield, Heart, Rocket, Star } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Universal One School</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/schools" className="text-gray-600 hover:text-blue-600 transition-colors">
                Schools
              </Link>
              <Link href="/dashboards" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboards
              </Link>
              <Link href="/marketplace" className="text-gray-600 hover:text-blue-600 transition-colors">
                Marketplace
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section with Performance Metrics */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              Next-Generation AI Education
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-md">
              Personalized Learning for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-black">
                {" "}Every Student
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform adapts to each student's learning style, pace, and needs across 5 specialized schools with comprehensive neurodivergent support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg">
                <Link href="/auth/register">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 shadow-lg">
                <Link href="/demo">
                  <Users className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}