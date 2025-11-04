'use client';

import { SignIn } from '@clerk/nextjs';
import { Shield } from 'lucide-react';

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Admin Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-400 mt-2">Go4It Sports Platform Administration</p>
        </div>

        {/* Clerk Sign In Component for Admin */}
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-slate-800/50 border-slate-700 shadow-xl",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-300",
                socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                formButtonPrimary: "bg-red-600 hover:bg-red-700",
                formFieldInput: "bg-slate-700 border-slate-600 text-white",
                footerActionLink: "text-blue-400 hover:text-blue-300"
              }
            }}
            redirectUrl="/admin/dashboard"
            signUpUrl="/register"
          />
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-slate-400 hover:text-white text-sm">
            ← Back to Go4It Sports Platform
          </a>
        </div>
      </div>
    </div>
  );
}
