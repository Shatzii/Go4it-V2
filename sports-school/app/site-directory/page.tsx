'use client'

import { ErrorBoundary } from 'react-error-boundary'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SiteNavigation from '@/components/site-navigation'
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  Trophy,
  Target,
  Globe,
  Heart,
  Shield,
  Zap,
  Star,
  Play,
  Brain,
  Search,
  Calendar,
  FileText,
  Settings,
  BarChart,
  Lock,
  Globe2,
  Building,
  Smartphone,
  Monitor,
  Gamepad2,
  Palette,
  Music,
  Camera,
  Video,
  Headphones,
  Mic,
  Database,
  Code,
  Terminal,
  GitBranch,
  Cloud,
  Server,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  MessageCircle,
  Bell,
  Mail,
  Phone,
  MapPin,
  Car,
  Plane,
  Train,
  Ship,
  Bike,
  Clock,
  Timer,
  Stopwatch,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Thermometer,
  Wind,
  Eye,
  EyeOff,
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Pause,
  PlayCircle,
  Square,
  Download,
  Upload,
  Share,
  Copy,
  Cut,
  Paste,
  Trash,
  Edit,
  Save,
  Folder,
  File,
  Image,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Unlink,
  List,
  Hash,
  Quote,
  Minus,
  Plus,
  Equal,
  Percent,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  CreditCard,
  Banknote,
  Coins,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  Package,
  Truck,
  Home,
  Navigation,
  Compass,
  Map,
  Route,
  Flag,
  Bookmark,
  Tag,
  Tags,
  Archive,
  Inbox,
  Outbox,
  Send,
  Reply,
  Forward,
  ReplyAll,
  Printer,
  Scanner,
  Fax,
  Tablet,
  Laptop,
  Desktop,
  Tv,
  Radio,
  Speaker,
  Microphone,
  Film,
  Clapperboard,
  Aperture,
  Focus,
  Zoom,
  ZoomIn,
  ZoomOut,
  Crop,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Filter,
  Sliders,
  Paintbrush,
  Pipette,
  Eraser,
  Pen,
  PenTool,
  Pencil,
  Highlighter,
  Scissors,
  Ruler,
  Triangle,
  Circle,
  Hexagon,
  Diamond,
  Flame,
  Umbrella,
  Rainbow,
  Snowflake,
  Leaf,
  Flower,
  Tree,
  Seedling,
  Sprout,
  Cactus,
  PalmTree,
  Crown,
  TrendingUp,
  Scale,
  Network,
  Cube,
  Glasses,
  Activity,
  Microscope,
  UserPlus,
  Key,
  Gauge,
  FileCheck,
  Languages,
  Lightbulb,
  Sparkles,
  TestTube,
  Wrench,
  Rocket
} from 'lucide-react'

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">There was an error loading the site directory.</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default function SiteDirectoryPage() {
  const categories = [
    {
      title: 'Five Specialized Schools',
      description: 'Our comprehensive educational institutions',
      icon: GraduationCap,
      color: 'bg-blue-50 border-blue-200',
      items: [
        { name: 'Primary School', href: '/schools/primary', icon: Shield, description: 'K-6 superhero-themed education with AI support' },
        { name: 'S.T.A.G.E Prep Global Academy', href: '/schools/secondary', icon: Target, description: '7-12 global academy with 5 career programs' },
        { name: 'Law School', href: '/schools/law', icon: Award, description: 'Legal education with Mason Barrett' },
        { name: 'Language School', href: '/schools/language', icon: Globe, description: 'Multilingual education with 15+ languages' },
        { name: 'Go4it Sports Academy', href: '/schools/go4it-sports-academy', icon: Trophy, description: 'Elite athletic training at $95M Vienna campus' }
      ]
    },
    {
      title: 'Dashboard Systems',
      description: 'Personalized portals for all user types',
      icon: Monitor,
      color: 'bg-green-50 border-green-200',
      items: [
        { name: 'Student Dashboard', href: '/student-dashboard', icon: Users, description: 'Assignments, grades, progress tracking' },
        { name: 'Parent Portal', href: '/parent-portal', icon: Heart, description: 'Child progress, billing, safety monitoring' },
        { name: 'Teacher Portal', href: '/teacher-portal', icon: BookOpen, description: 'Class management, grading, tools' },
        { name: 'Admin Dashboard', href: '/admin', icon: Settings, description: 'System administration and management' },
        { name: 'School Admin', href: '/school-admin', icon: Building, description: 'School-level administration' },
        { name: 'Master Admin', href: '/master-admin', icon: Crown, description: 'Platform-wide administration' }
      ]
    },
    {
      title: 'AI-Powered Features',
      description: 'Advanced AI capabilities and tools',
      icon: Brain,
      color: 'bg-purple-50 border-purple-200',
      items: [
        { name: 'AI Tutor', href: '/ai-tutor', icon: Zap, description: '6 specialized AI teachers' },
        { name: 'Virtual Classroom', href: '/virtual-classroom', icon: Play, description: 'Interactive online learning environment' },
        { name: 'Curriculum Generator', href: '/curriculum-generator', icon: Star, description: 'AI-powered curriculum creation' },
        { name: 'Adaptive Learning', href: '/adaptive-learning', icon: Target, description: 'Personalized learning paths' },
        { name: 'AI Content Creator', href: '/ai-content-creator', icon: Palette, description: 'Generate educational materials' },
        { name: 'AI Analytics', href: '/ai-analytics', icon: BarChart, description: 'Advanced learning analytics' }
      ]
    },
    {
      title: 'Educational Tools',
      description: 'Core learning and teaching resources',
      icon: BookOpen,
      color: 'bg-orange-50 border-orange-200',
      items: [
        { name: 'Curriculum Library', href: '/curriculum-library', icon: Archive, description: 'Pre-built curriculum database' },
        { name: 'Assessment Tools', href: '/assessment-tools', icon: FileText, description: 'Comprehensive testing and evaluation' },
        { name: 'Progress Tracking', href: '/progress-tracking', icon: TrendingUp, description: 'Student progress monitoring' },
        { name: 'Grade Book', href: '/grade-book', icon: BookOpen, description: 'Digital grade management' },
        { name: 'Assignment Center', href: '/assignment-center', icon: Folder, description: 'Create and distribute assignments' },
        { name: 'Learning Resources', href: '/learning-resources', icon: FileText, description: 'Educational materials library' }
      ]
    },
    {
      title: 'Communication & Collaboration',
      description: 'Connect students, parents, and teachers',
      icon: MessageCircle,
      color: 'bg-pink-50 border-pink-200',
      items: [
        { name: 'Messaging System', href: '/messaging', icon: Mail, description: 'Secure school communication' },
        { name: 'Video Conferencing', href: '/video-conferencing', icon: Video, description: 'Live online meetings' },
        { name: 'Parent-Teacher Conferences', href: '/parent-teacher-conferences', icon: Calendar, description: 'Schedule and manage meetings' },
        { name: 'Class Forums', href: '/class-forums', icon: MessageCircle, description: 'Discussion boards for classes' },
        { name: 'Announcements', href: '/announcements', icon: Bell, description: 'School-wide notifications' },
        { name: 'Calendar Integration', href: '/calendar-integration', icon: Calendar, description: 'Synchronized scheduling' }
      ]
    },
    {
      title: 'Safety & Security',
      description: 'Comprehensive safety monitoring and protection',
      icon: Shield,
      color: 'bg-red-50 border-red-200',
      items: [
        { name: 'Safety Monitoring', href: '/safety-monitoring', icon: Eye, description: 'AI-powered safety oversight' },
        { name: 'Emergency Alerts', href: '/emergency-alerts', icon: AlertTriangle, description: 'Critical safety notifications' },
        { name: 'Attendance Tracking', href: '/attendance-tracking', icon: CheckCircle, description: 'Real-time attendance monitoring' },
        { name: 'Visitor Management', href: '/visitor-management', icon: UserPlus, description: 'Secure visitor check-in system' },
        { name: 'Access Control', href: '/access-control', icon: Key, description: 'Secure building access' },
        { name: 'Incident Reporting', href: '/incident-reporting', icon: FileText, description: 'Document safety incidents' }
      ]
    },
    {
      title: 'Analytics & Reporting',
      description: 'Data-driven insights and comprehensive reports',
      icon: BarChart,
      color: 'bg-indigo-50 border-indigo-200',
      items: [
        { name: 'Performance Analytics', href: '/performance-analytics', icon: TrendingUp, description: 'Student performance insights' },
        { name: 'School Reports', href: '/school-reports', icon: FileText, description: 'Comprehensive school analytics' },
        { name: 'Attendance Reports', href: '/attendance-reports', icon: Calendar, description: 'Detailed attendance analysis' },
        { name: 'Financial Reports', href: '/financial-reports', icon: DollarSign, description: 'Budget and finance tracking' },
        { name: 'Parent Engagement', href: '/parent-engagement', icon: Heart, description: 'Parent involvement metrics' },
        { name: 'System Performance', href: '/system-performance', icon: Gauge, description: 'Platform performance monitoring' }
      ]
    },
    {
      title: 'Billing & Payments',
      description: 'Comprehensive financial management',
      icon: CreditCard,
      color: 'bg-yellow-50 border-yellow-200',
      items: [
        { name: 'Tuition Management', href: '/tuition-management', icon: DollarSign, description: 'Automated tuition billing' },
        { name: 'Payment Processing', href: '/payment-processing', icon: CreditCard, description: 'Secure online payments' },
        { name: 'Fee Tracking', href: '/fee-tracking', icon: Coins, description: 'Track additional fees and charges' },
        { name: 'Financial Aid', href: '/financial-aid', icon: Heart, description: 'Scholarship and aid management' },
        { name: 'Billing History', href: '/billing-history', icon: FileText, description: 'Complete payment records' },
        { name: 'Budget Planning', href: '/budget-planning', icon: BarChart, description: 'Financial planning tools' }
      ]
    },
    {
      title: 'Accessibility & Inclusion',
      description: 'Comprehensive support for all learners',
      icon: Glasses,
      color: 'bg-teal-50 border-teal-200',
      items: [
        { name: 'Neurodivergent Support', href: '/neurodivergent-support', icon: Brain, description: 'ADHD, autism, dyslexia accommodations' },
        { name: 'Language Translation', href: '/language-translation', icon: Languages, description: 'Multi-language support' },
        { name: 'Assistive Technology', href: '/assistive-technology', icon: Glasses, description: 'Accessibility tools and features' },
        { name: 'Special Education', href: '/special-education', icon: Heart, description: 'Specialized learning support' },
        { name: 'Adaptive Interfaces', href: '/adaptive-interfaces', icon: Monitor, description: 'Customizable user interfaces' },
        { name: 'Sensory Support', href: '/sensory-support', icon: Volume, description: 'Visual and auditory accommodations' }
      ]
    },
    {
      title: 'Future Technology',
      description: 'Cutting-edge educational innovations',
      icon: Rocket,
      color: 'bg-cyan-50 border-cyan-200',
      items: [
        { name: 'Virtual Reality Labs', href: '/vr-labs', icon: Glasses, description: 'Immersive learning experiences' },
        { name: 'AI Research Projects', href: '/ai-research', icon: TestTube, description: 'Student AI research initiatives' },
        { name: 'Robotics Programs', href: '/robotics', icon: Wrench, description: 'Hands-on robotics education' },
        { name: 'Space Science', href: '/space-science', icon: Rocket, description: 'Astronomy and space exploration' },
        { name: 'Biotechnology', href: '/biotechnology', icon: Microscope, description: 'Modern biological research' },
        { name: 'Innovation Labs', href: '/innovation-labs', icon: Lightbulb, description: 'Creative technology projects' }
      ]
    }
  ]

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50">
        <SiteNavigation />
        
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Universal One School Directory
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our comprehensive AI-powered educational platform with 50+ features 
                across 5 specialized schools, supporting all learning styles and needs.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8">
            {categories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className={`${category.color} border-2`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <category.icon className="h-8 w-8 text-gray-700" />
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {category.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <Link key={itemIndex} href={item.href}>
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <item.icon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Platform Overview
              </h2>
              <p className="text-gray-600">
                Comprehensive statistics about our educational platform
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-sm text-gray-600">Specialized Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Platform Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
                <div className="text-sm text-gray-600">AI Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                <div className="text-sm text-gray-600">Languages Supported</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}