'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  Target,
  Users,
  Trophy,
  Video,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  Star,
  Brain,
  Rocket
} from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (isHomePage) {
    return null; // Home page has its own nav
  }

  const navigationLinks = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Performance',
      icon: TrendingUp,
      submenu: [
        { label: 'GAR Upload', href: '/gar-upload', icon: Target },
        { label: 'Video Analysis', href: '/video-analysis', icon: Video },
        { label: 'Performance Analytics', href: '/performance', icon: BarChart3 },
        { label: 'StarPath Progress', href: '/starpath', icon: Star },
      ],
    },
    {
      label: 'Recruiting',
      icon: Trophy,
      submenu: [
        { label: 'Recruiting Hub', href: '/recruiting-hub', icon: Trophy },
        { label: 'NCAA Eligibility', href: '/ncaa-eligibility', icon: Shield },
        { label: 'College Explorer', href: '/college-explorer', icon: GraduationCap },
        { label: 'Scholarship Tracker', href: '/scholarship-tracker', icon: Target },
      ],
    },
    {
      label: 'Academy',
      icon: GraduationCap,
      submenu: [
        { label: 'Go4It Academy', href: '/academy', icon: GraduationCap },
        { label: 'AI Coach', href: '/ai-coach', icon: Brain },
        { label: 'Courses', href: '/academy/courses', icon: GraduationCap },
        { label: 'Flag Football', href: '/flag-football-academy', icon: Trophy },
      ],
    },
    {
      label: 'Teams',
      href: '/teams',
      icon: Users,
    },
  ];

  const userMenuLinks = [
    { label: 'Profile', href: '/profile', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Admin', href: '/admin', icon: Shield, adminOnly: true },
  ];

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all"
          >
            <Rocket className="w-6 h-6 text-blue-400" />
            Go4It Sports
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <div key={link.label} className="relative">
                {link.submenu ? (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                        {link.submenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href!}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      pathname === link.href
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - User Menu & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/upload"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Upload Video
            </Link>
            
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('user')}
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'user' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                  {userMenuLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                  <hr className="my-2 border-slate-700" />
                  <Link
                    href="/logout"
                    className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-800/95 backdrop-blur-sm border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navigationLinks.map((link) => (
              <div key={link.label}>
                {link.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeDropdown === link.label && (
                      <div className="ml-4 mt-2 space-y-1">
                        {link.submenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors text-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href!}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <hr className="my-4 border-slate-700" />

            {/* Mobile User Menu */}
            {userMenuLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            <Link
              href="/upload"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Video className="w-5 h-5" />
              Upload Video
            </Link>

            <Link
              href="/logout"
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}