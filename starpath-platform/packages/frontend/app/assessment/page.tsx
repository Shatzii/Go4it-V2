'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    sport: '',
    academicYear: '',
    internationalInterest: '',
  });
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    // Complete assessment
    const response = await fetch('http://localhost:3001/api/assessment/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId: 'demo-' + Date.now(),
        responses: formData
      })
    });

    const data = await response.json();
    setResult(data.data);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#05070b] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[#00D4FF] hover:text-[#27E36A] mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-[#0B0F14] border border-gray-800 rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-2 text-[#00D4FF]">
            StarPath Assessment™
          </h1>
          <p className="text-xl text-[#27E36A] mb-6">$397</p>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 bg-[#05070b] border border-gray-700 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-[#05070b] border border-gray-700 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-[#05070b] border border-gray-700 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Sport
                </label>
                <input
                  type="text"
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  className="w-full px-4 py-2 bg-[#05070b] border border-gray-700 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Academic Year
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-4 py-2 bg-[#05070b] border border-gray-700 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="freshman">Freshman</option>
                  <option value="sophomore">Sophomore</option>
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00D4FF] text-[#05070b] font-bold rounded-lg hover:bg-[#27E36A] transition-colors"
              >
                Continue to Assessment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-300 mb-6">
                Hi {formData.firstName}! Let's find your ideal pathway.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  How interested are you in studying abroad?
                </label>
                <select
                  required
                  value={formData.internationalInterest}
                  onChange={(e) => setFormData({ ...formData, internationalInterest: e.target.value })}
                  className="w-full px-4 py-2 bg-[#05070b] border border-gray-700 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="high">Very interested - I want to study in Europe</option>
                  <option value="medium">Somewhat interested - I'm open to it</option>
                  <option value="low">Not interested - I prefer to stay in the US</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-700 text-gray-300 font-bold rounded-lg hover:border-[#00D4FF] transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00D4FF] text-[#05070b] font-bold rounded-lg hover:bg-[#27E36A] transition-colors"
                >
                  Complete Assessment
                </button>
              </div>
            </form>
          )}

          {step === 3 && result && (
            <div className="space-y-6">
              <div className="bg-[#05070b] border border-[#27E36A] rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-[#27E36A]">
                  Assessment Complete!
                </h2>
                <p className="text-gray-300 mb-4">
                  Based on your responses, we recommend:
                </p>
                <p className="text-xl font-bold text-[#00D4FF] mb-2">
                  {result.recommendedProgram === 'vienna_residency' 
                    ? 'Vienna Global Residency' 
                    : 'StarPath Online Accelerator'}
                </p>
                <p className="text-gray-400 text-sm">
                  Assessment ID: {result.assessmentId}
                </p>
              </div>

              <div className="bg-[#05070b] border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-[#00D4FF]">
                  Next Steps:
                </h3>
                <ul className="space-y-2 text-gray-300">
                  {result.nextSteps?.map((step: string, i: number) => (
                    <li key={i}>✓ {step}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/programs/${result.recommendedProgram}`}
                  className="flex-1 text-center py-3 bg-[#00D4FF] text-[#05070b] font-bold rounded-lg hover:bg-[#27E36A] transition-colors"
                >
                  View Program Details
                </Link>
                <Link
                  href="/"
                  className="flex-1 text-center py-3 border border-gray-700 text-gray-300 font-bold rounded-lg hover:border-[#00D4FF] transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
