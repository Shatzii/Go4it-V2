'use client';

import { useState, useEffect } from 'react';
import { triggerInstallPrompt, isAppInstalled, isIOS, getIOSInstallInstructions } from '@/lib/pwa-utils';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (isAppInstalled()) {
      setShowPrompt(false);
      return;
    }

    // Check if iOS
    const iosDevice = isIOS();
    setIsIOSDevice(iosDevice);

    // Show prompt after 30 seconds if not installed
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (!isIOSDevice) {
      const installed = await triggerInstallPrompt();
      if (installed) {
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-lg bg-white p-2">
            <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-white">Install Go4It Sports</h3>
          
          {isIOSDevice ? (
            <div className="mt-2 text-sm text-white/90">
              <p>{getIOSInstallInstructions()}</p>
              <div className="mt-2 flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Look for the Share icon in your browser</span>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-white/90">
              Get quick access, offline support, and push notifications
            </p>
          )}

          <div className="mt-3 flex gap-2">
            {!isIOSDevice && (
              <button
                onClick={handleInstall}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Install App
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
