"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Trophy,
  Clock,
  Users,
  Star,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface StaticQuickLinksProps {
  userType: 'student' | 'parent' | 'teacher' | 'admin';
  schoolId: string;
}

export function StaticQuickLinks({ userType, schoolId }: StaticQuickLinksProps) {
  const getQuickLinksForUser = (type: string, school: string) => {
    const baseLinks = [
      {
        title: 'Assignments',
        description: 'View and manage assignments',
        icon: BookOpen,
        href: `/schools/${school}/assignments`,
        badge: '3 new',
        color: 'text-blue-600'
      },
      {
        title: 'Calendar',
        description: 'Upcoming events and deadlines',
        icon: Calendar,
        href: `/schools/${school}/calendar`,
        badge: 'Today',
        color: 'text-green-600'
      },
      {
        title: 'Messages',
        description: 'Communication center',
        icon: MessageSquare,
        href: `/schools/${school}/messages`,
        badge: '2 unread',
        color: 'text-purple-600'
      }
    ];

    if (type === 'parent') {
      return [
        ...baseLinks,
        {
          title: 'Progress Reports',
          description: 'Child progress and achievements',
          icon: Trophy,
          href: `/schools/${school}/progress`,
          badge: 'Updated',
          color: 'text-orange-600'
        },
        {
          title: 'Parent Meetings',
          description: 'Schedule and join meetings',
          icon: Users,
          href: `/schools/${school}/meetings`,
          badge: 'Next: Tomorrow',
          color: 'text-red-600'
        },
        {
          title: 'Safety Center',
          description: 'Digital safety and monitoring',
          icon: Star,
          href: `/social-media-safety`,
          badge: 'Active',
          color: 'text-indigo-600'
        }
      ];
    }

    return baseLinks;
  };

  const links = getQuickLinksForUser(userType, schoolId);

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Clock className="w-5 h-5" />
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Link key={index} href={link.href}>
                <div className="group p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`w-6 h-6 ${link.color} group-hover:scale-110 transition-transform`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {link.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {link.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {link.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}