'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, BookOpen } from 'lucide-react';

interface ClassCreatorProps {
  userType: 'teacher' | 'admin' | 'parent';
  schoolId: string;
  userId: string;
}

export function ClassCreator({ userType, schoolId, userId }: ClassCreatorProps) {
  const [mounted, setMounted] = useState(false);
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateClass = () => {
    if (!className.trim() || !subject.trim()) return;

    // Simulate class creation
    console.log('Creating class:', { className, subject, schoolId, userId });
    setClassName('');
    setSubject('');
  };

  if (!mounted) {
    return (
      <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500">
        <CardHeader>
          <CardTitle className="text-green-400">Class Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-green-500/10 rounded"></div>
            <div className="h-10 bg-green-500/10 rounded"></div>
            <div className="h-10 bg-green-500/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userType !== 'teacher' && userType !== 'admin') {
    // For parents, show a different view
    return (
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <BookOpen className="w-5 h-5" />
            Your Children's Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Total Active Classes</span>
              <span className="text-blue-300">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Performance</span>
              <span className="text-blue-300">88%</span>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Users className="w-4 h-4 mr-2" />
              View All Classes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Plus className="w-5 h-5" />
          Create New Class
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="bg-green-500/10 border-green-400 text-white placeholder:text-green-300"
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-green-500/10 border-green-400 text-white placeholder:text-green-300"
            />
          </div>
          <Button
            onClick={handleCreateClass}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!className.trim() || !subject.trim()}
          >
            <Users className="w-4 h-4 mr-2" />
            Create Class
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
