'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 10 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show after 15 seconds
    if (iOS && !isInstalled) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 15000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt && !isIOS) {
      return;
    }

    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowPrompt(false);
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300 md:left-auto md:right-4 md:max-w-md">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-[2px] shadow-2xl">
        <div className="relative flex flex-col gap-4 rounded-xl bg-slate-900 p-6">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1">
                Install Go4It Sports
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Get faster access and work offline. Install our app for the best experience!
              </p>
            </div>
          </div>

          {/* Installation Instructions */}
          {isIOS ? (
            <div className="space-y-3 rounded-lg bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-white">To install on iOS:</p>
              <ol className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">1</span>
                  <span>Tap the Share button <Share className="inline h-4 w-4" /></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">2</span>
                  <span>Scroll and tap &quot;Add to Home Screen&quot;</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">3</span>
                  <span>Tap &quot;Add&quot; in the top right</span>
                </li>
              </ol>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              disabled={!deferredPrompt}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              Install App
            </button>
          )}

          {/* Benefits */}
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
              ⚡ Faster Loading
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
              📱 Works Offline
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
              🔔 Push Notifications
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
