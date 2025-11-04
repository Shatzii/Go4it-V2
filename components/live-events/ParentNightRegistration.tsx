'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegistrationData {
  // Parent/Guardian info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  
  // Student athlete info
  athleteName: string;
  athleteAge: string;
  athleteSport: string;
  athleteGrade: string;
  
  // Event selection
  eventId?: string;
  
  // Additional questions
  primaryGoals: string[];
  hearAboutUs: string;
  additionalQuestions: string;
}

export default function ParentNightRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: 'parent',
    athleteName: '',
    athleteAge: '',
    athleteSport: '',
    athleteGrade: '',
    primaryGoals: [],
    hearAboutUs: '',
    additionalQuestions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        // Auto-create account and send credentials
        await fetch('/api/events/create-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            registrationId: data.registrationId,
          }),
        });
      } else {
        alert(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal],
    }));
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Registration Successful!
        </h2>
        
        <div className="space-y-4 text-left max-w-2xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Check Your Email
            </h3>
            <p className="text-slate-300">
              We&apos;ve sent you a confirmation email with:
            </p>
            <ul className="mt-2 space-y-1 text-slate-400 ml-4">
              <li>• Meeting link for the live session</li>
              <li>• Your account login credentials</li>
              <li>• Calendar invite (add to your calendar!)</li>
              <li>• Pre-event materials to review</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your Account is Ready
            </h3>
            <p className="text-slate-300">
              We&apos;ve created a free account for you to explore the platform. 
              Login anytime to:
            </p>
            <ul className="mt-2 space-y-1 text-slate-400 ml-4">
              <li>• Browse demo videos and features</li>
              <li>• See sample athlete profiles</li>
              <li>• Learn about our programs</li>
              <li>• Schedule a one-on-one consultation</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What&apos;s Next?
            </h3>
            <p className="text-slate-300 text-sm">
              You&apos;ll receive a reminder email 24 hours and 1 hour before the event. 
              Make sure to test your camera and microphone beforehand!
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Explore Platform Now
          </button>
          <button
            onClick={() => router.push('/parent-night')}
            className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Register Another Athlete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Register for Parent Information Night
      </h2>

      {/* Parent/Guardian Information */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
          Your Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
            <p className="text-xs text-slate-400 mt-1">
              Meeting link and account credentials will be sent here
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Relationship to Athlete *
          </label>
          <select
            required
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="parent">Parent</option>
            <option value="guardian">Legal Guardian</option>
            <option value="coach">Coach</option>
            <option value="relative">Relative</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Student Athlete Information */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
          Student Athlete Information
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Athlete&apos;s Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.athleteName}
            onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Age *
            </label>
            <input
              type="number"
              required
              min="12"
              max="18"
              value={formData.athleteAge}
              onChange={(e) => setFormData({ ...formData, athleteAge: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Grade *
            </label>
            <select
              required
              value={formData.athleteGrade}
              onChange={(e) => setFormData({ ...formData, athleteGrade: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select grade</option>
              <option value="6">6th Grade</option>
              <option value="7">7th Grade</option>
              <option value="8">8th Grade</option>
              <option value="9">9th Grade (Freshman)</option>
              <option value="10">10th Grade (Sophomore)</option>
              <option value="11">11th Grade (Junior)</option>
              <option value="12">12th Grade (Senior)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Primary Sport *
            </label>
            <select
              required
              value={formData.athleteSport}
              onChange={(e) => setFormData({ ...formData, athleteSport: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select sport</option>
              <option value="soccer">Soccer</option>
              <option value="basketball">Basketball</option>
              <option value="flag-football">Flag Football</option>
              <option value="other">Other (interested in future sports)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals and Interests */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
          Your Goals
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            What are your primary goals? (Select all that apply)
          </label>
          <div className="space-y-2">
            {[
              'Improve athletic performance',
              'Get recruited by colleges',
              'Receive professional coaching',
              'Track progress and development',
              'Connect with other athletes',
              'Prepare for college sports',
              'Earn athletic scholarships',
            ].map((goal) => (
              <label key={goal} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.primaryGoals.includes(goal)}
                  onChange={() => toggleGoal(goal)}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-slate-300">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            How did you hear about us?
          </label>
          <select
            value={formData.hearAboutUs}
            onChange={(e) => setFormData({ ...formData, hearAboutUs: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            <option value="social-media">Social Media</option>
            <option value="search-engine">Search Engine</option>
            <option value="friend-referral">Friend/Family Referral</option>
            <option value="coach-referral">Coach Referral</option>
            <option value="school">School/Tournament</option>
            <option value="advertisement">Advertisement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Any questions or topics you&apos;d like us to cover?
          </label>
          <textarea
            value={formData.additionalQuestions}
            onChange={(e) => setFormData({ ...formData, additionalQuestions: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Let us know what you'd like to learn about..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Registering...</span>
          </>
        ) : (
          <>
            <span>Complete Registration</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>

      <p className="text-sm text-slate-400 text-center mt-4">
        By registering, you agree to receive emails about the event and platform updates. 
        You can unsubscribe anytime.
      </p>
    </form>
  );
}
