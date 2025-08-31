'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { HydrationFix } from '../hydration-fix';

interface QuickLinksProps {
  userType: 'student' | 'teacher' | 'parent' | 'admin';
  schoolId: string;
}

export function QuickLinks({ userType, schoolId }: QuickLinksProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLinks = () => {
    const baseLinks = {
      student: [
        { icon: BookOpen, label: 'My Courses', href: '/courses' },
        { icon: FileText, label: 'Assignments', href: '/assignments' },
        { icon: BarChart3, label: 'Progress', href: '/progress' },
        { icon: MessageCircle, label: 'Messages', href: '/messages' },
      ],
      teacher: [
        { icon: Users, label: 'My Classes', href: '/classes' },
        { icon: FileText, label: 'Lesson Plans', href: '/lesson-plans' },
        { icon: BarChart3, label: 'Analytics', href: '/analytics' },
        { icon: GraduationCap, label: 'Gradebook', href: '/gradebook' },
      ],
      parent: [
        { icon: GraduationCap, label: 'Child Progress', href: '/child-progress' },
        { icon: Calendar, label: 'Schedule', href: '/schedule' },
        { icon: MessageCircle, label: 'Communication', href: '/communication' },
        { icon: FileText, label: 'Reports', href: '/reports' },
      ],
      admin: [
        { icon: Users, label: 'Staff Management', href: '/staff' },
        { icon: BarChart3, label: 'School Analytics', href: '/analytics' },
        { icon: Settings, label: 'System Settings', href: '/settings' },
        { icon: FileText, label: 'Reports', href: '/reports' },
      ],
    };

    return baseLinks[userType] || [];
  };

  const links = getLinks();

  return (
    <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500">
      <CardHeader>
        <CardTitle className="text-indigo-400">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <HydrationFix
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-indigo-500/10 rounded-lg animate-pulse"></div>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {links.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 bg-indigo-500/10 border-indigo-400 hover:bg-indigo-500/20"
                onClick={() => (window.location.href = link.href)}
              >
                <link.icon className="w-6 h-6 text-indigo-300" />
                <span className="text-xs text-indigo-200">{link.label}</span>
              </Button>
            ))}
          </div>
        </HydrationFix>
      </CardContent>
    </Card>
  );
}
