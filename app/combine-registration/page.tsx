'use client';

import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Star,
  CheckCircle,
  AlertCircle,
  DollarSign,
  CreditCard,
  User,
  Mail,
  Phone,
  GraduationCap,
  Activity,
  Target,
  Shield,
  Award,
  ArrowRight,
  Camera,
  Video,
} from 'lucide-react';

interface RegistrationForm {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  parentEmail?: string;

  // Athletic Information
  sport: string;
  position: string;
  height: string;
  weight: string;
  classYear: string;
  currentSchool: string;

  // Performance Metrics
  gpa: string;
  satScore?: string;
  actScore?: string;
  previousGARScore?: string;

  // Event Selection
  selectedEvent: string;
  eventPackage: 'basic' | 'premium' | 'elite';
  additionalServices: string[];

  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // Medical Information
  medicalConditions: string;
  medications: string;
  allergies: string;

  // Terms and Waivers
  termsAccepted: boolean;
  liabilityWaiver: boolean;
  mediaRelease: boolean;
}

export default function CombineRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    parentEmail: '',
    sport: '',
    position: '',
    height: '',
    weight: '',
    classYear: '',
    currentSchool: '',
    gpa: '',
    satScore: '',
    actScore: '',
    previousGARScore: '',
    selectedEvent: 'vienna-2025',
    eventPackage: 'premium',
    additionalServices: [],
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    medicalConditions: '',
    medications: '',
    allergies: '',
    termsAccepted: false,
    liabilityWaiver: false,
    mediaRelease: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const events = [
    {
      id: 'vienna-2025',
      name: 'Vienna Elite Combine 2025',
      location: 'Vienna, Austria',
      dates: 'July 22-24, 2025',
      description:
        'First official GAR Score testing event featuring comprehensive athletic evaluation',
      highlight: 'Friday Night Lights @ 7PM',
      status: 'filling-fast',
      spotsRemaining: 23,
      totalSpots: 100,
    },
    {
      id: 'chicago-2025',
      name: 'Chicago Elite Combine',
      location: 'Chicago, IL',
      dates: 'August 15-17, 2025',
      description: 'Midwest premier combine with college coach attendance',
      highlight: 'College Scout Day',
      status: 'open',
      spotsRemaining: 67,
      totalSpots: 150,
    },
    {
      id: 'los-angeles-2025',
      name: 'Los Angeles Skills Showcase',
      location: 'Los Angeles, CA',
      dates: 'September 5-7, 2025',
      description: 'West Coast elite showcase featuring top high school athletes',
      highlight: 'Media Coverage',
      status: 'open',
      spotsRemaining: 89,
      totalSpots: 120,
    },
  ];

  const packages = {
    basic: {
      name: 'Basic Evaluation',
      price: 299,
      features: [
        'Complete GAR Score Analysis',
        'Physical Testing (Speed, Agility, Strength)',
        'Basic Skills Assessment',
        'Digital Results Report',
        'Certificate of Participation',
      ],
    },
    premium: {
      name: 'Premium Package',
      price: 599,
      features: [
        'Everything in Basic',
        'Video Analysis with AI Coaching',
        'College Recruiting Profile',
        'One-on-One Coach Feedback',
        'Professional Headshots',
        'StarPath Progression Plan',
        'Priority College Scout Access',
      ],
    },
    elite: {
      name: 'Elite Experience',
      price: 999,
      features: [
        'Everything in Premium',
        'Personal Performance Coach',
        'Full Event Documentation',
        'Scholarship Opportunity Matching',
        'VIP Event Access',
        'Verified 100 Lifetime Membership',
        'Direct College Coach Meetings',
      ],
    },
  };

  const additionalServices = [
    { id: 'nutrition', name: 'Nutrition Consultation', price: 149 },
    { id: 'mental-performance', name: 'Mental Performance Session', price: 199 },
    { id: 'injury-screening', name: 'Injury Risk Screening', price: 129 },
    { id: 'highlight-reel', name: 'Professional Highlight Reel', price: 299 },
    { id: 'social-media', name: 'Social Media Package', price: 179 },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/combine/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === formData.selectedEvent);
  const selectedPackage = packages[formData.eventPackage];
  const selectedServices = additionalServices.filter((s) =>
    formData.additionalServices.includes(s.id),
  );
  const totalCost = selectedPackage.price + selectedServices.reduce((sum, s) => sum + s.price, 0);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-green-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Registration Confirmed!</h1>
          <p className="text-xl text-slate-300 mb-8">
            Welcome to the {selectedEvent?.name}. You're officially registered!
          </p>
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">What's Next:</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Confirmation email sent to {formData.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Event details and preparation guide will arrive within 24 hours</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Pre-event video upload instructions coming soon</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Access to exclusive combine preparation materials</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Combine Registration</h1>
          <p className="text-xl text-slate-300 mb-6">
            Register for elite athletic evaluation and GAR Score testing
          </p>

          {/* Progress Bar */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step <= currentStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-600 text-slate-400'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
              {/* Step 1: Event Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Your Event</h2>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => updateFormData('selectedEvent', event.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.selectedEvent === event.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                            <div className="flex items-center gap-4 text-slate-300 mb-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {event.dates}
                              </div>
                            </div>
                            <p className="text-slate-400 mb-2">{event.description}</p>
                            <div className="text-yellow-400 font-semibold">{event.highlight}</div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`px-3 py-1 rounded text-sm font-bold mb-2 ${
                                event.status === 'filling-fast'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}
                            >
                              {event.status === 'filling-fast' ? 'FILLING FAST' : 'OPEN'}
                            </div>
                            <div className="text-sm text-slate-400">
                              {event.spotsRemaining} of {event.totalSpots} spots left
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Parent/Guardian Email (if under 18)
                      </label>
                      <input
                        type="email"
                        value={formData.parentEmail || ''}
                        onChange={(e) => updateFormData('parentEmail', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Athletic Information */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Athletic Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Sport *</label>
                      <select
                        value={formData.sport}
                        onChange={(e) => updateFormData('sport', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Sport</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Football">Football</option>
                        <option value="Soccer">Soccer</option>
                        <option value="Baseball">Baseball</option>
                        <option value="Track & Field">Track & Field</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Tennis">Tennis</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Position *</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => updateFormData('position', e.target.value)}
                        placeholder="e.g., Point Guard, Quarterback"
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Height *</label>
                      <input
                        type="text"
                        value={formData.height}
                        onChange={(e) => updateFormData('height', e.target.value)}
                        placeholder="e.g., 6'2&quot; or 188cm"
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Weight *</label>
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={(e) => updateFormData('weight', e.target.value)}
                        placeholder="e.g., 180 lbs or 82 kg"
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Graduation Year *</label>
                      <select
                        value={formData.classYear}
                        onChange={(e) => updateFormData('classYear', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current School *</label>
                      <input
                        type="text"
                        value={formData.currentSchool}
                        onChange={(e) => updateFormData('currentSchool', e.target.value)}
                        className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors ml-auto flex items-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white px-8 py-3 rounded-lg font-semibold transition-colors ml-auto"
                  >
                    {loading ? 'Submitting...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Registration Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 sticky top-8">
              <h3 className="text-xl font-bold mb-6">Registration Summary</h3>

              {selectedEvent && (
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-400 mb-2">Selected Event</h4>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="font-semibold text-white mb-1">{selectedEvent.name}</div>
                    <div className="text-sm text-slate-400 mb-2">{selectedEvent.location}</div>
                    <div className="text-sm text-slate-400">{selectedEvent.dates}</div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold text-blue-400 mb-2">Package Selection</h4>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-white">{selectedPackage.name}</span>
                    <span className="text-green-400 font-bold">${selectedPackage.price}</span>
                  </div>
                  <div className="space-y-1">
                    {selectedPackage.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {feature}
                      </div>
                    ))}
                    {selectedPackage.features.length > 3 && (
                      <div className="text-xs text-slate-400">
                        +{selectedPackage.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-400 mb-2">Additional Services</h4>
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-300">{service.name}</span>
                      <span className="text-green-400 font-semibold">${service.price}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-green-400">${totalCost}</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Payment will be processed after registration confirmation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
