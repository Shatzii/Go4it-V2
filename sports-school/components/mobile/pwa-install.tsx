'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  Bell, 
  Home,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstallCard, setShowInstallCard] = useState(false);
  const [installStep, setInstallStep] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstallation();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallCard(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallCard(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    setInstallStep(1);

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setInstallStep(2);
        setTimeout(() => {
          setIsInstalled(true);
          setShowInstallCard(false);
          setInstallStep(0);
        }, 2000);
      } else {
        setInstallStep(0);
      }
    } catch (error) {
      console.error('Installation failed:', error);
      setInstallStep(0);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Universal One School', {
          body: 'You will now receive important notifications!',
          icon: '/favicon.ico',
          tag: 'pwa-setup'
        });
      }
    }
  };

  const getInstallInstructions = () => {
    const userAgent = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !isChrome;

    if (isIOS && isSafari) {
      return {
        title: 'Install on iOS',
        steps: [
          'Tap the Share button at the bottom of the screen',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else if (isAndroid && isChrome) {
      return {
        title: 'Install on Android',
        steps: [
          'Tap the menu (three dots) in the top right',
          'Tap "Add to Home screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else {
      return {
        title: 'Install App',
        steps: [
          'Look for the install icon in your browser',
          'Click "Install" when prompted',
          'Follow your browser\'s instructions'
        ]
      };
    }
  };

  if (isInstalled) {
    return (
      <Card className="w-full max-w-md mx-auto bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold text-green-800">App Installed!</h3>
            <p className="text-green-700">
              Universal One School is now installed on your device. 
              You can access it from your home screen.
            </p>
            <div className="flex justify-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Wifi className="w-3 h-3 mr-1" />
                Offline Ready
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Home className="w-3 h-3 mr-1" />
                Home Screen
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showInstallCard && !deferredPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Install App
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowInstallCard(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Install Universal One School for a better mobile experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Installation Steps */}
        {installStep === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">{instructions.title}</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                {instructions.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Wifi className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800">Offline Access</p>
                <p className="text-xs text-blue-600">Learn without internet</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Bell className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-800">Push Notifications</p>
                <p className="text-xs text-green-600">Stay updated</p>
              </div>
            </div>

            {deferredPrompt && (
              <Button 
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isInstalling ? 'Installing...' : 'Install Now'}
              </Button>
            )}
          </div>
        )}

        {/* Installing State */}
        {installStep === 1 && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h4 className="font-medium">Installing App...</h4>
            <p className="text-sm text-gray-600">Please wait while we set up your app</p>
          </div>
        )}

        {/* Success State */}
        {installStep === 2 && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h4 className="font-medium text-green-800">Installation Complete!</h4>
            <p className="text-sm text-green-600">
              The app will appear on your home screen shortly
            </p>
          </div>
        )}

        {/* Notification Permission */}
        {notificationPermission === 'default' && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Enable Notifications</p>
                <p className="text-xs text-gray-600">Get updates about your learning</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={requestNotificationPermission}
              >
                <Bell className="w-4 h-4 mr-1" />
                Allow
              </Button>
            </div>
          </div>
        )}

        {notificationPermission === 'granted' && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            Notifications enabled
          </div>
        )}

        {notificationPermission === 'denied' && (
          <div className="flex items-center gap-2 text-orange-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Notifications disabled - you can enable them in your browser settings
          </div>
        )}
      </CardContent>
    </Card>
  );
}