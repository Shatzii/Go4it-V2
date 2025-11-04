'use client';

import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Go4It Sports
          </h1>
          <p className="text-slate-300 mt-2">Elite Athletic Development Platform</p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-300",
                socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                formFieldInput: "bg-slate-700 border-slate-600 text-white",
                footerActionLink: "text-blue-400 hover:text-blue-300"
              }
            }}
            redirectUrl="/dashboard"
            signUpUrl="/register"
          />
        </div>

        {/* Platform Features */}
        <div className="bg-slate-800/30 border border-slate-700 backdrop-blur-sm rounded-lg p-4">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-medium text-white">What You Get Access To</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div>✓ GAR Analysis System</div>
              <div>✓ StarPath Progression</div>
              <div>✓ Social Leaderboards</div>
              <div>✓ Academy Courses</div>
              <div>✓ AI Coach Integration</div>
              <div>✓ Recruiting Tools</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
