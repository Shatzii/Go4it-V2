'use client'

import { useState, useEffect } from 'react'
import { Search, Menu, X, Bell, MessageCircle, User, GraduationCap, Brain, Zap, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function EnhancedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const schools = [
    { id: 'primary', name: 'Primary School', href: '/schools/primary', color: 'blue' },
    { id: 'secondary', name: 'S.T.A.G.E Prep', href: '/schools/secondary', color: 'purple' },
    { id: 'law', name: 'Law School', href: '/schools/law', color: 'green' },
    { id: 'language', name: 'Language School', href: '/schools/language', color: 'orange' },
    { id: 'sports', name: 'Sports Academy', href: '/schools/sports', color: 'red' }
  ]

  const aiFeatures = [
    { name: 'AI Tutor', href: '/ai-tutor', icon: Brain },
    { name: 'Study Buddy', href: '/study-buddy', icon: GraduationCap },
    { name: 'Content Creator', href: '/ai-content', icon: Zap }
  ]

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

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
          <nav className="hidden md:flex items-center space-x-6">
            {/* Schools Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <span>Schools</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {schools.map((school) => (
                  <Link
                    key={school.id}
                    href={school.href}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-${school.color}-500`} />
                      <span>{school.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Features */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <Brain className="w-4 h-4" />
                <span>AI Features</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {aiFeatures.map((feature) => (
                  <Link
                    key={feature.name}
                    href={feature.href}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <feature.icon className="w-4 h-4" />
                      <span>{feature.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/dashboards" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboards
            </Link>
          </nav>

          {/* Search */}
          <div className="relative flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search courses, topics, schools..."
                className="pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
              />
            </div>
            
            {/* Search Results */}
            {isSearchOpen && (searchQuery || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result: any) => (
                      <Link
                        key={result.id}
                        href={`/courses/${result.id}`}
                        className="block p-3 hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div className="font-medium text-gray-900">{result.title}</div>
                        <div className="text-sm text-gray-500">{result.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {result.subject}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.schoolId}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Start typing to search...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                5
              </Badge>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button>Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* Schools */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Schools</h3>
                <div className="space-y-2">
                  {schools.map((school) => (
                    <Link
                      key={school.id}
                      href={school.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={`w-2 h-2 rounded-full bg-${school.color}-500`} />
                      <span>{school.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* AI Features */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">AI Features</h3>
                <div className="space-y-2">
                  {aiFeatures.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <feature.icon className="w-4 h-4" />
                      <span>{feature.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dashboard */}
              <Link
                href="/dashboards"
                className="block text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboards
              </Link>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Overlay for Mobile */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </header>
  )
}