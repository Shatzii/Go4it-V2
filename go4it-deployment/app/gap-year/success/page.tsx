'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Star, Trophy, ArrowRight } from 'lucide-react';

export default function GapYearSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify the session
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // You could verify the session with your backend here
      setIsLoading(false);
    } else {
      // Redirect if no session ID
      router.push('/gap-year');
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Confirming your enrollment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Welcome to Gap Year Elite!
          </h1>

          <p className="text-2xl text-slate-300 mb-8">
            Your enrollment has been confirmed successfully
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Check Your Email</h3>
                <p className="text-slate-400">
                  We've sent your welcome packet with login credentials and program details to your
                  registered email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Initial Assessment</h3>
                <p className="text-slate-400">
                  Complete your baseline GAR assessment within the next 7 days to establish your
                  starting metrics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Meet Your Coach</h3>
                <p className="text-slate-400">
                  Your dedicated coach will contact you within 48 hours to schedule your first
                  strategy session.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Begin Training</h3>
                <p className="text-slate-400">
                  Start your personalized training program designed to maximize your athletic and
                  academic potential.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Reminder */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-700/50 mb-8">
          <h3 className="text-xl font-bold mb-4">Your Gap Year Benefits Include:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">Weekly 1-on-1 coaching sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">Monthly GAR assessments</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">College recruitment support</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">NCAA compliance monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">Elite training programs</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">Performance analytics</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/gar-analysis')}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
          >
            Start GAR Assessment
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center text-slate-400">
          <p className="mb-2">Need help? Contact our support team:</p>
          <p className="text-blue-400">support@go4itsports.com • 1-800-GO4-ELITE</p>
        </div>
      </div>
    </div>
  );
}
