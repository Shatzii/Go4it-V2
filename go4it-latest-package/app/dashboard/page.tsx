import React from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Video, Star, BookOpen, BarChart3, Target, User } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Go4It Sports</div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user?.firstName}!</span>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Athletic Dashboard</h1>
          <p className="text-slate-400">Track your progress and improve your performance</p>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            icon={<Video className="h-6 w-6" />}
            title="Video Analysis"
            description="Upload and analyze your game footage with GAR scoring"
            href="/video-analysis"
            bgColor="bg-blue-600"
          />
          
          <DashboardCard 
            icon={<Star className="h-6 w-6" />}
            title="StarPath™"
            description="Track your skill development and unlock achievements"
            href="/starpath"
            bgColor="bg-purple-600"
          />
          
          <DashboardCard 
            icon={<BookOpen className="h-6 w-6" />}
            title="Academic Progress"
            description="Monitor NCAA eligibility and course requirements"
            href="/academics"
            bgColor="bg-green-600"
          />
          
          <DashboardCard 
            icon={<BarChart3 className="h-6 w-6" />}
            title="Performance Stats"
            description="View detailed analytics and progress reports"
            href="/stats"
            bgColor="bg-orange-600"
          />
          
          <DashboardCard 
            icon={<Target className="h-6 w-6" />}
            title="Recruitment"
            description="Connect with college coaches and scouts"
            href="/recruitment"
            bgColor="bg-red-600"
          />
          
          <DashboardCard 
            icon={<User className="h-6 w-6" />}
            title="Profile Settings"
            description="Manage your athlete profile and preferences"
            href="/profile"
            bgColor="bg-slate-600"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ 
  icon, 
  title, 
  description, 
  href, 
  bgColor 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  bgColor: string;
}) {
  return (
    <a 
      href={href}
      className="block card hover:border-blue-400/50 transition-all duration-200 hover:scale-105"
    >
      <div className={`${bgColor} p-3 rounded-lg inline-flex mb-4`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </a>
  );
}