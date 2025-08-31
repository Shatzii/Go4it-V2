'use client';

import { useState } from 'react';
import {
  MessageSquare,
  BookOpen,
  Calculator,
  Microscope,
  Palette,
  Globe,
  Heart,
  Star,
  Video,
  Clock,
  Users,
  Brain,
  Zap,
  Trophy,
} from 'lucide-react';

export default function AITeachers() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const aiTeachers = [
    {
      id: 1,
      name: 'Professor Newton',
      subject: 'Mathematics',
      personality: 'Patient & Methodical',
      specialization: 'Problem-solving, logical thinking',
      icon: Calculator,
      color: 'blue',
      status: 'online',
      studentsHelped: 1240,
      description: 'Makes complex math concepts simple and fun through step-by-step guidance',
      strengths: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
      availability: '24/7',
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Dr. Curie',
      subject: 'Science',
      personality: 'Curious & Experimental',
      specialization: 'Scientific inquiry, experiments',
      icon: Microscope,
      color: 'green',
      status: 'online',
      studentsHelped: 980,
      description: 'Encourages discovery through hands-on experiments and real-world applications',
      strengths: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
      availability: '24/7',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Ms. Shakespeare',
      subject: 'English Literature',
      personality: 'Creative & Inspiring',
      specialization: 'Writing, reading comprehension',
      icon: BookOpen,
      color: 'purple',
      status: 'online',
      studentsHelped: 856,
      description:
        'Brings literature to life with engaging storytelling and creative writing techniques',
      strengths: ['Creative Writing', 'Poetry', 'Literature Analysis', 'Grammar'],
      availability: '24/7',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Coach Wilson',
      subject: 'Physical Education',
      personality: 'Energetic & Motivational',
      specialization: 'Sports training, fitness',
      icon: Heart,
      color: 'red',
      status: 'online',
      studentsHelped: 642,
      description: 'Combines athletic training with academic performance enhancement strategies',
      strengths: ['Fitness Training', 'Sports Psychology', 'Nutrition', 'Recovery'],
      availability: '24/7',
      rating: 4.9,
    },
    {
      id: 5,
      name: 'Professor Atlas',
      subject: 'World History',
      personality: 'Knowledgeable & Engaging',
      specialization: 'Historical context, critical thinking',
      icon: Globe,
      color: 'orange',
      status: 'online',
      studentsHelped: 734,
      description: 'Makes history relevant by connecting past events to modern day situations',
      strengths: ['World History', 'Government', 'Economics', 'Geography'],
      availability: '24/7',
      rating: 4.6,
    },
    {
      id: 6,
      name: 'Ms. Picasso',
      subject: 'Creative Arts',
      personality: 'Imaginative & Supportive',
      specialization: 'Visual arts, creativity',
      icon: Palette,
      color: 'pink',
      status: 'online',
      studentsHelped: 523,
      description: 'Nurtures artistic expression while building confidence in creative abilities',
      strengths: ['Digital Art', 'Drawing', 'Color Theory', 'Design'],
      availability: '24/7',
      rating: 4.8,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      red: 'bg-red-500 text-white',
      orange: 'bg-orange-500 text-white',
      pink: 'bg-pink-500 text-white',
    };
    return colors[color] || 'bg-gray-500 text-white';
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-400' : 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Teachers</h1>
              <p className="text-slate-400">
                Get personalized tutoring support from our AI teaching assistants
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-400">
                <Users className="h-4 w-4" />
                <span>4,975 students helped today</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Clock className="h-4 w-4" />
                <span>Available 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-sm text-slate-400">AI Teachers</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 rounded-full p-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4,975</div>
                <div className="text-sm text-slate-400">Students Helped</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 rounded-full p-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 rounded-full p-3">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.8</div>
                <div className="text-sm text-slate-400">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-colors"
            >
              {/* Teacher Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(teacher.color)}`}
                  >
                    <teacher.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(teacher.status)}`}
                      ></div>
                    </div>
                    <p className="text-slate-400 text-sm">{teacher.subject}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{teacher.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Personality</h4>
                    <p className="text-slate-400 text-sm">{teacher.personality}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Specialization</h4>
                    <p className="text-slate-400 text-sm">{teacher.specialization}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Description</h4>
                    <p className="text-slate-400 text-sm">{teacher.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.strengths.map((strength, index) => (
                        <span
                          key={index}
                          className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-slate-400">
                      <span className="font-medium">{teacher.studentsHelped.toLocaleString()}</span>{' '}
                      students helped
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        teacher.status === 'online'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-gray-900 text-gray-300'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Start Chat</span>
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>Video Call</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-slate-800 rounded-lg p-8">
          <div className="text-center">
            <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Need Help Getting Started?</h3>
            <p className="text-slate-400 mb-6">
              Our AI teachers are designed to adapt to your learning style and provide personalized
              support. Simply click "Start Chat" with any teacher that matches your subject needs.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                Take Learning Style Quiz
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors">
                View Help Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
