'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils'
import { 
  Home, 
  Video, 
  Star, 
  Users, 
  BarChart3, 
  User,
  Settings,
  LogOut
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/video-analysis', label: 'Video Analysis', icon: Video },
  { href: '/starpath', label: 'StarPath', icon: Star },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-800 border-r border-slate-700 w-64 h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          Go4It Sports
        </Link>
      </div>

      <div className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="border-t border-slate-700 p-4">
        <Link
          href="/settings"
          className="flex items-center px-2 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Link>
        <button className="flex items-center px-2 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors w-full mt-1">
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </nav>
  )
}