'use client';

import { useState } from 'react';

interface ParentNightSignupProps {
  eventType?: 'tuesday' | 'thursday';
  defaultDate?: string;
}

export default function ParentNightSignup({ eventType = 'tuesday', defaultDate }: ParentNightSignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carrier: '',
    athleteName: '',
    sport: '',
    gradYear: '',
    rsvpType: eventType,
    rsvpDate: defaultDate || '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/automation/parent-night', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: `🎉 You're registered! Check your ${formData.carrier ? 'phone' : 'email'} for confirmation.`,
        });
        
        // NEW: Redirect to StarPath after successful registration
        // Show success message for 3 seconds, then redirect
        setTimeout(() => {
          window.location.href = '/starpath?utm_source=parent-night&utm_medium=signup&utm_campaign=transcript-audit';
        }, 3000);
        
        // Reset form (will happen before redirect)
        setFormData({
          name: '',
          email: '',
          phone: '',
          carrier: '',
          athleteName: '',
          sport: '',
          gradYear: '',
          rsvpType: eventType,
          rsvpDate: defaultDate || '',
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  const carrierOptions = [
    'att',
    'verizon',
    'tmobile',
    'sprint',
    'uscellular',
    'boost',
    'cricket',
    'metropcs',
  ];

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {eventType === 'tuesday' ? '📋 Tuesday Info Session' : '🔥 Thursday Decision Session'}
        </h2>
        <p className="text-gray-600 mb-3">
          {eventType === 'tuesday' 
            ? 'Learn about NCAA eligibility, GAR testing, and how Go4it works'
            : 'Make your decision - 89% of Thursday attendees enroll'}
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <strong className="text-blue-900">⭐ New: StarPath System</strong>
          <p className="text-blue-700 mt-1">
            After registration, see your $199 Transcript Audit + NCAA Tracker
          </p>
        </div>
      </div>

      {result && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parent Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jennifer Martinez"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="jennifer@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (214) 555-1234"
            />
          </div>

          {/* Carrier - KEY FIELD FOR FREE SMS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Carrier * <span className="text-xs text-gray-500">(for SMS reminders)</span>
            </label>
            <select
              required
              value={formData.carrier}
              onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your carrier...</option>
              {carrierOptions.map((carrier) => (
                <option key={carrier} value={carrier}>
                  {carrier.charAt(0).toUpperCase() + carrier.slice(1).replace(/-/g, ' ')}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              💡 This lets us send FREE SMS reminders (no spam, we promise!)
            </p>
          </div>

          {/* Athlete Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Athlete&apos;s Name
            </label>
            <input
              type="text"
              value={formData.athleteName}
              onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Marcus"
            />
          </div>

          {/* Sport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sport
            </label>
            <input
              type="text"
              value={formData.sport}
              onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Basketball"
            />
          </div>

          {/* Grad Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year
            </label>
            <select
              value={formData.gradYear}
              onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select year...</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
            </select>
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.rsvpDate}
              onChange={(e) => setFormData({ ...formData, rsvpDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Registering...' : '🎓 Register for Parent Night (FREE)'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-2">
          ✅ Free SMS reminders • ✅ No credit card required • ✅ 342 parents joined last week
        </p>
      </form>

      {/* What to Expect */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Instant confirmation via SMS & email</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>24-hour reminder with Zoom link</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>1-hour reminder so you don&apos;t miss it</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>{eventType === 'tuesday' ? 'Learn everything about Go4it' : 'Make your decision with confidence'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
