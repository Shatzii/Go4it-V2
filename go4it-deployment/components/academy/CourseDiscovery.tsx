'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Star, Clock, Users, BookOpen, Play, Calendar } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  difficulty: string;
  subjects: string[];
  estimatedTime: string;
  enrolled: number;
  maxStudents: number;
  rating: number;
  nextStart: string;
  tags: string[];
  prerequisites?: string[];
}

export default function CourseDiscovery() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Sample course data - would come from API
  useEffect(() => {
    const sampleCourses: Course[] = [
      {
        id: '1',
        title: 'Advanced Biology with Lab',
        description: 'Comprehensive biology course with hands-on laboratory experiments',
        instructor: 'Dr. Sarah Chen',
        difficulty: 'Advanced',
        subjects: ['Biology', 'Science'],
        estimatedTime: '45 hours',
        enrolled: 24,
        maxStudents: 30,
        rating: 4.8,
        nextStart: '2025-02-03',
        tags: ['Laboratory', 'Research', 'College Prep'],
        prerequisites: ['Chemistry Basics'],
      },
      {
        id: '2',
        title: 'Calculus for Athletes',
        description: 'Applied calculus with sports analytics and performance optimization',
        instructor: 'Prof. Michael Rodriguez',
        difficulty: 'Intermediate',
        subjects: ['Mathematics', 'Sports Science'],
        estimatedTime: '60 hours',
        enrolled: 18,
        maxStudents: 25,
        rating: 4.6,
        nextStart: '2025-02-10',
        tags: ['Applied Math', 'Sports Analytics', 'NCAA Prep'],
      },
      {
        id: '3',
        title: 'Digital Media Production',
        description: 'Create highlight reels, social media content, and promotional videos',
        instructor: 'Ms. Jessica Park',
        difficulty: 'Beginner',
        subjects: ['Technology', 'Arts'],
        estimatedTime: '30 hours',
        enrolled: 32,
        maxStudents: 35,
        rating: 4.9,
        nextStart: '2025-01-28',
        tags: ['Video Editing', 'Social Media', 'Creative'],
      },
    ];
    setCourses(sampleCourses);
    setFilteredCourses(sampleCourses);
  }, []);

  useEffect(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDifficulty =
        difficultyFilter === 'all' || course.difficulty === difficultyFilter;
      const matchesSubject = subjectFilter === 'all' || course.subjects.includes(subjectFilter);

      return matchesSearch && matchesDifficulty && matchesSubject;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'enrollmentDate':
          return new Date(a.nextStart).getTime() - new Date(b.nextStart).getTime();
        case 'popularity':
          return b.enrolled - a.enrolled;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, difficultyFilter, subjectFilter, sortBy]);

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch('/api/academy/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        alert('Successfully enrolled! Check your schedule for class times.');
      } else {
        alert('Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Enrollment failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Discover Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="enrollmentDate">Starting Soon</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="bg-slate-800/50 border-slate-700 hover:border-blue-400 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                  <p className="text-slate-400 text-sm mt-1">{course.instructor}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-white">{course.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">{course.description}</p>

              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-600/20 text-blue-400">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  {course.estimatedTime}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  {course.enrolled}/{course.maxStudents}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  Starts {new Date(course.nextStart).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen className="w-4 h-4" />
                  {course.difficulty}
                </div>
              </div>

              {course.prerequisites && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Prerequisites:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleEnroll(course.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Enroll Now
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-slate-400">
              Try adjusting your search filters or check back later for new courses.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
