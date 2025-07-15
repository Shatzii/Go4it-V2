"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Calendar,
  Settings,
  Sparkles,
  Brain,
  Star
} from 'lucide-react';

interface StaticClassCreatorProps {
  userType: 'student' | 'parent' | 'teacher' | 'admin';
  schoolId: string;
  userId: string;
}

export function StaticClassCreator({ userType, schoolId, userId }: StaticClassCreatorProps) {
  // Mock static data for demonstration
  const recentClasses = [
    {
      id: '1',
      title: 'Math Adventures',
      subject: 'Mathematics',
      participants: 12,
      lastActivity: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      title: 'Science Experiments',
      subject: 'Science',
      participants: 8,
      lastActivity: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      title: 'Creative Writing',
      subject: 'English',
      participants: 15,
      lastActivity: '3 days ago',
      status: 'completed'
    }
  ];

  const suggestedTopics = [
    'Ancient Civilizations',
    'Space Exploration',
    'Animal Kingdom',
    'Weather Patterns',
    'Creative Arts',
    'Problem Solving'
  ];

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-600">
          <Plus className="w-5 h-5" />
          Class Creator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Create Section */}
          <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Quick Create
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {suggestedTopics.map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto py-2 px-3 text-sm hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Classes */}
          <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Recent Classes
            </h3>
            <div className="space-y-3">
              {recentClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{cls.title}</h4>
                      <p className="text-sm text-gray-600">{cls.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{cls.participants}</span>
                    </div>
                    <Badge variant={cls.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {cls.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Class
            </Button>
            <Button variant="outline" className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}