'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Theater, Music, Palette, BookOpen, 
  Calendar, Users, Star, Award,
  Clock, Target, Heart
} from 'lucide-react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function StagePrepOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    artisticInterest: '',
    experience: '',
    goals: '',
    accommodations: ''
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Simulate onboarding completion
    setTimeout(() => {
      window.location.href = '/schools/stage-prep';
    }, 2000);
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Theater className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              S.T.A.G.E Prep Academy
            </h1>
          </div>
          <p className="text-purple-200 text-lg">Welcome to your theatrical arts journey!</p>
          <Badge className="mt-2 bg-purple-500">Student Onboarding</Badge>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-purple-300">Step {currentStep} of 4</span>
            <span className="text-sm text-purple-300">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              {currentStep === 1 && <><Users className="w-5 h-5" /> Student Information</>}
              {currentStep === 2 && <><Palette className="w-5 h-5" /> Artistic Interests</>}
              {currentStep === 3 && <><Target className="w-5 h-5" /> Goals & Experience</>}
              {currentStep === 4 && <><Heart className="w-5 h-5" /> Accommodations & Support</>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="studentName" className="text-purple-300">Student Name</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    placeholder="Enter student's full name"
                    className="bg-purple-500/10 border-purple-400 text-white placeholder:text-purple-300"
                  />
                </div>
                <div>
                  <Label htmlFor="grade" className="text-purple-300">Grade Level</Label>
                  <select
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full p-2 bg-purple-500/10 border border-purple-400 rounded text-white"
                  >
                    <option value="">Select grade...</option>
                    <option value="7th">7th Grade</option>
                    <option value="8th">8th Grade</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                  </select>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-300 mb-2">About S.T.A.G.E Prep Academy</h3>
                  <p className="text-sm text-purple-200">
                    Our academy focuses on theatrical arts, performance, and creative expression. 
                    Students develop skills in acting, directing, set design, and theatrical production.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-purple-300">Primary Artistic Interest</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { value: 'acting', label: 'Acting', icon: Theater },
                      { value: 'directing', label: 'Directing', icon: Star },
                      { value: 'music', label: 'Musical Theater', icon: Music },
                      { value: 'design', label: 'Set Design', icon: Palette }
                    ].map(interest => (
                      <Button
                        key={interest.value}
                        variant="outline"
                        className={`h-20 flex flex-col items-center gap-2 ${
                          formData.artisticInterest === interest.value 
                            ? 'bg-purple-500/20 border-purple-400' 
                            : 'bg-purple-500/10 border-purple-400 hover:bg-purple-500/20'
                        }`}
                        onClick={() => setFormData({...formData, artisticInterest: interest.value})}
                      >
                        <interest.icon className="w-6 h-6 text-purple-300" />
                        <span className="text-xs text-purple-200">{interest.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-300 mb-2">Our Programs</h3>
                  <ul className="text-sm text-purple-200 space-y-1">
                    <li>• Drama and Acting Classes</li>
                    <li>• Musical Theater Production</li>
                    <li>• Technical Theater and Design</li>
                    <li>• Improvisation and Script Writing</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experience" className="text-purple-300">Previous Experience</Label>
                  <textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    placeholder="Tell us about any theater experience, performances, or related activities..."
                    className="w-full p-3 bg-purple-500/10 border border-purple-400 rounded text-white placeholder:text-purple-300 h-24"
                  />
                </div>
                <div>
                  <Label htmlFor="goals" className="text-purple-300">Academic and Artistic Goals</Label>
                  <textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    placeholder="What do you hope to achieve this year? College prep, specific skills, career goals..."
                    className="w-full p-3 bg-purple-500/10 border border-purple-400 rounded text-white placeholder:text-purple-300 h-24"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accommodations" className="text-purple-300">Learning Accommodations</Label>
                  <textarea
                    id="accommodations"
                    value={formData.accommodations}
                    onChange={(e) => setFormData({...formData, accommodations: e.target.value})}
                    placeholder="Any learning differences, accommodations, or support needs we should know about..."
                    className="w-full p-3 bg-purple-500/10 border border-purple-400 rounded text-white placeholder:text-purple-300 h-24"
                  />
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-300 mb-2">Support Services</h3>
                  <ul className="text-sm text-purple-200 space-y-1">
                    <li>• Performance anxiety support</li>
                    <li>• Individualized instruction</li>
                    <li>• Flexible scheduling for rehearsals</li>
                    <li>• Peer mentoring programs</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-400">
                  <h3 className="font-semibold text-green-300 mb-2">Ready to Begin!</h3>
                  <p className="text-sm text-green-200">
                    Your personalized learning schedule will be generated based on your interests and goals.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-purple-500/10 border-purple-400 hover:bg-purple-500/20"
          >
            Back
          </Button>
          <Button
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentStep === 4 ? 'Complete Onboarding' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}