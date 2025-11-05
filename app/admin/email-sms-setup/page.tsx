'use client';

import { useState } from 'react';

export default function EmailSMSSetupPage() {
  const [credentials, setCredentials] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
  });

  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-email-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials,
          testEmail: credentials.smtpUser,
          testPhone: '', // Optional
          testCarrier: 'att',
        }),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">📧 Email & SMS Setup</h1>
        <p className="text-gray-600 mb-6">
          Configure your SMTP credentials to enable FREE email and SMS (via email-to-SMS)
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">✅ What This Enables:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Parent Night email confirmations (FREE)</li>
            <li>• SMS reminders via email-to-SMS (FREE, unlimited)</li>
            <li>• All automation sequences (Tuesday/Thursday/Monday)</li>
            <li>• No Twilio needed - saves $1,300+/year!</li>
          </ul>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Host
            </label>
            <input
              type="text"
              value={credentials.smtpHost}
              onChange={(e) => setCredentials({ ...credentials, smtpHost: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Port
            </label>
            <input
              type="text"
              value={credentials.smtpPort}
              onChange={(e) => setCredentials({ ...credentials, smtpPort: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="587"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address (SMTP User)
            </label>
            <input
              type="email"
              value={credentials.smtpUser}
              onChange={(e) => setCredentials({ ...credentials, smtpUser: e.target.value, smtpFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="your-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Password (NOT your Gmail password)
              <a 
                href="https://myaccount.google.com/apppasswords" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 text-xs hover:underline"
              >
                Get App Password →
              </a>
            </label>
            <input
              type="password"
              value={credentials.smtpPass}
              onChange={(e) => setCredentials({ ...credentials, smtpPass: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="16-digit app password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Go to Google Account → Security → 2-Step Verification → App Passwords
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">📝 How to Set in Production:</h3>
          <p className="text-sm text-yellow-800 mb-2">
            In Replit, go to <strong>Secrets</strong> tab (lock icon) and add:
          </p>
          <pre className="bg-yellow-100 p-3 rounded text-xs overflow-x-auto">
{`SMTP_HOST=${credentials.smtpHost}
SMTP_PORT=${credentials.smtpPort}
SMTP_USER=${credentials.smtpUser || 'your-email@gmail.com'}
SMTP_PASS=${credentials.smtpPass || 'your-app-password'}
SMTP_FROM=${credentials.smtpFrom || credentials.smtpUser || 'your-email@gmail.com'}`}
          </pre>
        </div>

        <button
          onClick={handleTest}
          disabled={loading || !credentials.smtpUser || !credentials.smtpPass}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '🧪 Test Email (sends to your address)'}
        </button>

        {testResult && (
          <div className={`mt-6 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-semibold mb-2 ${testResult.success ? 'text-green-900' : 'text-red-900'}`}>
              {testResult.success ? '✅ Email Test Successful!' : '❌ Email Test Failed'}
            </h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
            {testResult.success && (
              <p className="text-sm text-green-800 mt-2">
                Check your inbox! Now add these to Replit Secrets to enable on production.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-4">📱 SMS Setup (FREE via Email-to-SMS)</h2>
          <p className="text-gray-600 mb-4">
            Once email is working, SMS is automatically enabled! Your signup form already asks for carrier.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Supported Carriers:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>✅ AT&T</div>
              <div>✅ Verizon</div>
              <div>✅ T-Mobile</div>
              <div>✅ Sprint</div>
              <div>✅ US Cellular</div>
              <div>✅ Boost Mobile</div>
              <div>✅ Cricket</div>
              <div>✅ MetroPCS</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">💰 Cost Savings:</h3>
          <div className="text-sm text-green-800 space-y-1">
            <div className="flex justify-between">
              <span>Email via Gmail SMTP:</span>
              <span className="font-semibold">$0 (500/day free)</span>
            </div>
            <div className="flex justify-between">
              <span>SMS via Email-to-SMS:</span>
              <span className="font-semibold">$0 (unlimited)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-green-300">
              <span>Your monthly cost:</span>
              <span className="font-bold text-lg">$0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>vs Twilio ($0.0079/SMS × 1,368/mo):</span>
              <span className="line-through">$108/month</span>
            </div>
            <div className="text-center pt-2 font-bold text-green-900">
              Annual Savings: $1,296! 🎉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
