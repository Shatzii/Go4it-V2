'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileNav from '@/components/ui/mobile-nav';
import {
  ChevronDown,
  GraduationCap,
  Shield,
  Target,
  Award,
  Globe,
  Trophy,
  Users,
  Heart,
  BookOpen,
  Zap,
  Play,
  Star,
  Brain,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SiteNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const schools = [
    {
      name: 'Primary School',
      href: '/schools/primary',
      icon: Shield,
      color: 'text-blue-600',
      description: 'K-6 superhero-themed education',
    },
    {
      name: 'S.T.A.G.E Prep Global Academy',
      href: '/schools/secondary',
      icon: Target,
      color: 'text-purple-600',
      description: '7-12 global academy with career programs',
    },
    {
      name: 'Law School',
      href: '/schools/law',
      icon: Award,
      color: 'text-green-600',
      description: 'Legal education with Mason Barrett',
    },
    {
      name: 'Language School',
      href: '/schools/language',
      icon: Globe,
      color: 'text-orange-600',
      description: 'Multilingual education platform',
    },
    {
      name: 'Go4it Sports Academy',
      href: '/schools/go4it-sports-academy',
      icon: Trophy,
      color: 'text-red-600',
      description: 'Elite athletic training',
    },
  ];

  const dashboards = [
    {
      name: 'Student Dashboard',
      href: '/student-dashboard',
      icon: Users,
      color: 'text-blue-600',
      description: 'Assignments, grades, progress',
    },
    {
      name: 'Parent Portal',
      href: '/parent-portal',
      icon: Heart,
      color: 'text-green-600',
      description: 'Child progress, billing, safety',
    },
    {
      name: 'Teacher Portal',
      href: '/teacher-portal',
      icon: BookOpen,
      color: 'text-purple-600',
      description: 'Class management, grading',
    },
  ];

  const aiFeatures = [
    {
      name: 'AI Tutor',
      href: '/ai-tutor',
      icon: Brain,
      color: 'text-yellow-600',
      description: '6 specialized AI teachers',
    },
    {
      name: 'Virtual Classroom',
      href: '/virtual-classroom',
      icon: Play,
      color: 'text-blue-600',
      description: 'Interactive online learning',
    },
    {
      name: 'Curriculum Generator',
      href: '/curriculum-generator',
      icon: Star,
      color: 'text-green-600',
      description: 'AI-powered curriculum creation',
    },
    {
      name: 'Adaptive Learning',
      href: '/adaptive-learning',
      icon: Zap,
      color: 'text-purple-600',
      description: 'Personalized learning paths',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Universal One School</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Schools Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <span>Schools</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {schools.map((school) => (
                  <Link
                    key={school.href}
                    href={school.href}
                    className="block px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <school.icon className={`w-5 h-5 ${school.color}`} />
                      <div>
                        <div className="font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500">{school.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Dashboards Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <span>Dashboards</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {dashboards.map((dashboard) => (
                  <Link
                    key={dashboard.href}
                    href={dashboard.href}
                    className="block px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <dashboard.icon className={`w-5 h-5 ${dashboard.color}`} />
                      <div>
                        <div className="font-medium text-gray-900">{dashboard.name}</div>
                        <div className="text-sm text-gray-500">{dashboard.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Features Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <Brain className="w-4 h-4" />
                <span>AI Features</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {aiFeatures.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="block px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      <div>
                        <div className="font-medium text-gray-900">{feature.name}</div>
                        <div className="text-sm text-gray-500">{feature.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 w-48 h-10 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button>Get Started</Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Schools */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Schools</h3>
                <div className="space-y-2 pl-4">
                  {schools.map((school) => (
                    <Link
                      key={school.href}
                      href={school.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <school.icon className="w-4 h-4" />
                      <span>{school.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dashboards */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Dashboards</h3>
                <div className="space-y-2 pl-4">
                  {dashboards.map((dashboard) => (
                    <Link
                      key={dashboard.href}
                      href={dashboard.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <dashboard.icon className="w-4 h-4" />
                      <span>{dashboard.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* AI Features */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">AI Features</h3>
                <div className="space-y-2 pl-4">
                  {aiFeatures.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <feature.icon className="w-4 h-4" />
                      <span>{feature.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
