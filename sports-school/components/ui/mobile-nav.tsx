'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  X, 
  Home, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Brain, 
  Settings,
  Shield,
  Target,
  Award,
  Globe,
  Trophy,
  Heart
} from 'lucide-react'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const mainNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: Users },
    { name: 'AI Tutors', href: '/ai-tutor', icon: Brain },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const schools = [
    { name: 'Primary School', href: '/schools/primary', icon: Shield, color: 'bg-blue-100 text-blue-700' },
    { name: 'S.T.A.G.E Prep', href: '/schools/secondary', icon: Target, color: 'bg-purple-100 text-purple-700' },
    { name: 'Law School', href: '/schools/law', icon: Award, color: 'bg-green-100 text-green-700' },
    { name: 'Language School', href: '/schools/language', icon: Globe, color: 'bg-orange-100 text-orange-700' },
    { name: 'Sports Academy', href: '/schools/go4it-sports-academy', icon: Trophy, color: 'bg-red-100 text-red-700' },
  ]

  const dashboards = [
    { name: 'Student Dashboard', href: '/student-dashboard', icon: Users },
    { name: 'Parent Portal', href: '/parent-portal', icon: Heart },
    { name: 'Teacher Portal', href: '/teacher-portal', icon: BookOpen },
    { name: 'Admin Dashboard', href: '/admin', icon: Settings },
  ]

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader className="text-left">
            <SheetTitle className="text-xl font-bold text-blue-600">
              Universal One School
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Main Navigation
              </h3>
              <nav className="space-y-2">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Schools */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Schools
              </h3>
              <div className="space-y-2">
                {schools.map((school) => (
                  <Link
                    key={school.name}
                    href={school.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-1.5 rounded-md ${school.color}`}>
                      <school.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">{school.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Dashboards */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Dashboards
              </h3>
              <div className="space-y-2">
                {dashboards.map((dashboard) => (
                  <Link
                    key={dashboard.name}
                    href={dashboard.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <dashboard.icon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{dashboard.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">6,950+</div>
                  <div className="text-xs text-blue-600">Students</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-xs text-green-600">Schools</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <div className="text-xs text-purple-600">AI Teachers</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-600">4.8</div>
                  <div className="text-xs text-orange-600">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}