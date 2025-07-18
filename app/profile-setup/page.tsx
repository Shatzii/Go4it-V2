'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Calendar, Target, Phone, Users, Check, ArrowRight, Star, Trophy, Zap } from 'lucide-react';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: 1, // Mock user ID for now
    sport: '',
    position: '',
    graduationYear: new Date().getFullYear() + 1,
    height: '',
    weight: '',
    yearsPlaying: '',
    goals: '',
    phoneNumber: '',
    parentContactName: '',
    parentContactPhone: '',
    parentContactEmail: '',
  });

  const steps = [
    {
      id: 'basic-info',
      title: 'Basic Athletic Info',
      description: 'Tell us about your sport and position',
      icon: User,
      fields: ['sport', 'position', 'graduationYear'],
    },
    {
      id: 'physical-stats',
      title: 'Physical Stats',
      description: 'Your physical measurements and experience',
      icon: Star,
      fields: ['height', 'weight', 'yearsPlaying'],
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'How coaches can reach you',
      icon: Phone,
      fields: ['phoneNumber', 'parentContactName', 'parentContactPhone', 'parentContactEmail'],
    },
    {
      id: 'goals',
      title: 'Athletic Goals',
      description: 'What do you want to achieve?',
      icon: Target,
      fields: ['goals'],
    },
  ];

  const sportOptions = [
    'American Football', 'Basketball', 'Soccer', 'Baseball', 'Track & Field',
    'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Cross Country', 'Golf',
    'Lacrosse', 'Hockey', 'Softball', 'Gymnastics', 'Other'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOneClickCreate = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quick-profile-setup?action=one-click-create', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push('/profile?created=true');
      } else {
        console.error('Error creating profile:', result.error);
        alert('Error creating profile. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isCurrentStepValid = () => {
    const currentStepFields = steps[currentStep].fields;
    return currentStepFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value !== '' && value !== undefined;
    });
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Athletic Profile</h1>
          <p className="text-slate-400">Get discovered by coaches in just a few minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-slate-400">{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-500 p-3 rounded-full mr-4">
              {(() => {
                const IconComponent = steps[currentStep].icon;
                return <IconComponent className="w-6 h-6 text-white" />;
              })()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{steps[currentStep].title}</h2>
              <p className="text-slate-400">{steps[currentStep].description}</p>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => handleInputChange('sport', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your sport</option>
                  {sportOptions.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="e.g., Point Guard, Quarterback, Midfielder"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Graduation Year</label>
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                  min="2024"
                  max="2030"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Physical Stats */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Height</label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="e.g., 6'2&quot; or 188cm"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weight</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="e.g., 185 lbs or 84 kg"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Years Playing</label>
                <input
                  type="number"
                  value={formData.yearsPlaying}
                  onChange={(e) => handleInputChange('yearsPlaying', parseInt(e.target.value))}
                  min="0"
                  max="20"
                  placeholder="How many years have you played?"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Parent/Guardian Name</label>
                <input
                  type="text"
                  value={formData.parentContactName}
                  onChange={(e) => handleInputChange('parentContactName', e.target.value)}
                  placeholder="Parent or guardian's full name"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Parent/Guardian Phone</label>
                <input
                  type="tel"
                  value={formData.parentContactPhone}
                  onChange={(e) => handleInputChange('parentContactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Parent/Guardian Email</label>
                <input
                  type="email"
                  value={formData.parentContactEmail}
                  onChange={(e) => handleInputChange('parentContactEmail', e.target.value)}
                  placeholder="parent@email.com"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Athletic Goals</label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="What are your athletic goals? (e.g., play college basketball, get a scholarship, improve my skills)"
                  rows={4}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNextStep}
              disabled={!isCurrentStepValid()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isCurrentStepValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleOneClickCreate}
              disabled={!isCurrentStepValid() || isSubmitting}
              className={`px-8 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isCurrentStepValid() && !isSubmitting
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create Profile</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* One-Click Option */}
        {currentStep === 0 && (
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-white">Quick Start</h3>
                  <p className="text-sm text-slate-400">Skip the steps and create a basic profile instantly</p>
                </div>
              </div>
              <button
                onClick={handleOneClickCreate}
                disabled={!formData.sport || !formData.position || isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.sport && formData.position && !isSubmitting
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'One-Click Create'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}