'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Users,
  Settings,
  Save,
  User,
  BookOpen,
  Target,
  Heart,
  Lightbulb,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface PersonalizationProfile {
  id: string;
  userId: string;
  learningStyle: string;
  preferredDifficulty: string;
  accommodations: string[];
  subjectPreferences: { [key: string]: string };
  communicationStyle: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  profile?: PersonalizationProfile;
}

export default function AIPersonalization({ teacherId }: { teacherId?: string }) {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [profile, setProfile] = useState<Partial<PersonalizationProfile>>({
    learningStyle: '',
    preferredDifficulty: 'intermediate',
    accommodations: [],
    subjectPreferences: {},
    communicationStyle: 'balanced',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const learningStyles = [
    { value: 'visual', label: 'Visual', description: 'Learns best through images, diagrams, and visual aids' },
    { value: 'auditory', label: 'Auditory', description: 'Learns best through listening and verbal explanations' },
    { value: 'kinesthetic', label: 'Kinesthetic', description: 'Learns best through hands-on activities and movement' },
    { value: 'reading', label: 'Reading/Writing', description: 'Learns best through reading and writing activities' },
    { value: 'mixed', label: 'Mixed', description: 'Benefits from a combination of learning styles' },
  ];

  const accommodations = [
    { value: 'extra-time', label: 'Extra Time', description: 'Additional time for assignments and tests' },
    { value: 'large-print', label: 'Large Print', description: 'Larger text size for better readability' },
    { value: 'audio-books', label: 'Audio Books', description: 'Text-to-speech and audio alternatives' },
    { value: 'simplified-text', label: 'Simplified Text', description: 'Simplified language and explanations' },
    { value: 'visual-aids', label: 'Visual Aids', description: 'Additional diagrams and visual supports' },
    { value: 'breaks', label: 'Frequent Breaks', description: 'Regular breaks during learning sessions' },
    { value: 'quiet-space', label: 'Quiet Space', description: 'Reduced distractions and noise' },
    { value: 'color-coding', label: 'Color Coding', description: 'Color-coded materials for organization' },
    { value: 'voice-to-text', label: 'Voice-to-Text', description: 'Speech-to-text input methods' },
  ];

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography',
    'Art', 'Music', 'Physical Education', 'Computer Science', 'Foreign Languages'
  ];

  const communicationStyles = [
    { value: 'direct', label: 'Direct', description: 'Clear, straightforward communication' },
    { value: 'encouraging', label: 'Encouraging', description: 'Positive reinforcement and motivation' },
    { value: 'structured', label: 'Structured', description: 'Clear expectations and routines' },
    { value: 'flexible', label: 'Flexible', description: 'Adaptable to student needs' },
    { value: 'balanced', label: 'Balanced', description: 'Combination of approaches' },
  ];

  useEffect(() => {
    loadStudents();
  }, [teacherId]);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentProfile(selectedStudent.id);
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      // Get students from teacher's courses
      const response = await fetch(`/api/academy/teacher/students?teacherId=${teacherId}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentProfile = async (studentId: string) => {
    try {
      const response = await fetch(`/api/academy/ai/personalization?studentId=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile({
            ...data.profile,
            accommodations: data.profile.accommodations ? JSON.parse(data.profile.accommodations) : [],
            subjectPreferences: data.profile.subjectPreferences ? JSON.parse(data.profile.subjectPreferences) : {},
          });
        } else {
          // Reset to default
          setProfile({
            learningStyle: '',
            preferredDifficulty: 'intermediate',
            accommodations: [],
            subjectPreferences: {},
            communicationStyle: 'balanced',
          });
        }
      }
    } catch (error) {
      console.error('Error loading student profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!selectedStudent) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/academy/ai/personalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          teacherId,
          ...profile,
        }),
      });

      if (response.ok) {
        alert('Student profile saved successfully!');
        loadStudents(); // Refresh to show updated profiles
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAccommodation = (accommodation: string) => {
    setProfile(prev => ({
      ...prev,
      accommodations: prev.accommodations?.includes(accommodation)
        ? prev.accommodations.filter(a => a !== accommodation)
        : [...(prev.accommodations || []), accommodation]
    }));
  };

  const updateSubjectPreference = (subject: string, preference: string) => {
    setProfile(prev => ({
      ...prev,
      subjectPreferences: {
        ...(prev.subjectPreferences || {}),
        [subject]: preference
      }
    }));
  };

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return '👁️';
      case 'auditory': return '🔊';
      case 'kinesthetic': return '🤸';
      case 'reading': return '📖';
      default: return '🎯';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-400" />
            AI Personalization
          </h2>
          <p className="text-slate-300">Customize learning experiences for individual students</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-slate-300">
          <Settings className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">My Students</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-slate-400">Loading students...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map(student => (
                    <div
                      key={student.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedStudent?.id === student.id
                          ? 'bg-blue-600 border border-blue-500'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-white font-medium">{student.name}</span>
                        </div>
                        <Badge className="bg-slate-600 text-white text-xs">
                          Grade {student.grade}
                        </Badge>
                      </div>

                      {student.profile && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{getLearningStyleIcon(student.profile.learningStyle)}</span>
                          <span>{student.profile.learningStyle}</span>
                          {student.profile.accommodations && student.profile.accommodations.length > 0 && (
                            <Badge className="bg-green-600 text-white text-xs">
                              {student.profile.accommodations.length} accommodations
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {students.length === 0 && (
                    <p className="text-slate-400 text-center py-4">No students found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Personalization Form */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              {/* Student Header */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {selectedStudent.name}
                    <Badge className="bg-blue-600">Grade {selectedStudent.grade}</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Learning Style */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Learning Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {learningStyles.map(style => (
                      <div
                        key={style.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          profile.learningStyle === style.value
                            ? 'border-purple-500 bg-purple-600/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => setProfile({...profile, learningStyle: style.value})}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{getLearningStyleIcon(style.value)}</div>
                          <h3 className="font-semibold text-white">{style.label}</h3>
                          <p className="text-sm text-slate-400 mt-1">{style.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty & Communication */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Preferred Difficulty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={profile.preferredDifficulty}
                      onValueChange={(value) => setProfile({...profile, preferredDifficulty: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner - Basic concepts and simple explanations</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Moderate complexity with some challenges</SelectItem>
                        <SelectItem value="advanced">Advanced - Complex topics with in-depth analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Communication Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={profile.communicationStyle}
                      onValueChange={(value) => setProfile({...profile, communicationStyle: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {communicationStyles.map(style => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label} - {style.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              {/* Accommodations */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Learning Accommodations
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Select accommodations that help this student learn effectively</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accommodations.map(accommodation => (
                      <div key={accommodation.value} className="flex items-start space-x-3">
                        <Checkbox
                          id={accommodation.value}
                          checked={profile.accommodations?.includes(accommodation.value) || false}
                          onCheckedChange={() => toggleAccommodation(accommodation.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={accommodation.value}
                            className="text-white font-medium cursor-pointer"
                          >
                            {accommodation.label}
                          </Label>
                          <p className="text-sm text-slate-400 mt-1">{accommodation.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Preferences */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Subject-Specific Preferences
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Customize difficulty and approach for specific subjects</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map(subject => (
                      <div key={subject} className="space-y-2">
                        <Label className="text-white">{subject}</Label>
                        <Select
                          value={profile.subjectPreferences?.[subject] || 'default'}
                          onValueChange={(value) => updateSubjectPreference(subject, value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Use general preferences</SelectItem>
                            <SelectItem value="easier">Make easier</SelectItem>
                            <SelectItem value="harder">Make more challenging</SelectItem>
                            <SelectItem value="visual-focus">Emphasize visuals</SelectItem>
                            <SelectItem value="practical">Focus on practical applications</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Student</h3>
                <p className="text-slate-400">Choose a student from the list to customize their learning experience</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}