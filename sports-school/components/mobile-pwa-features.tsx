'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Battery,
  Bell,
  Bookmark,
  PlayCircle,
  Headphones,
  BookOpen,
  MessageSquare,
  Camera,
  Mic,
  Share2,
  Star,
} from 'lucide-react';

export default function MobilePWAFeatures() {
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState(0);

  useEffect(() => {
    // Check if PWA is installable
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate offline content progress
    const timer = setInterval(() => {
      setOfflineProgress((prev) => Math.min(prev + 2, 100));
    }, 100);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timer);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
      }
    }
  };

  const features = [
    {
      icon: WifiOff,
      title: 'Offline Learning',
      description: 'Continue learning even without internet connection',
      color: 'blue',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get reminders for assignments and study sessions',
      color: 'purple',
    },
    {
      icon: Bookmark,
      title: 'Save for Later',
      description: 'Bookmark content to access anytime',
      color: 'green',
    },
    {
      icon: PlayCircle,
      title: 'Video Lessons',
      description: 'Watch interactive video content optimized for mobile',
      color: 'red',
    },
    {
      icon: Headphones,
      title: 'Audio Learning',
      description: 'Listen to lessons during commutes or workouts',
      color: 'orange',
    },
    {
      icon: Camera,
      title: 'AR/VR Ready',
      description: 'Experience immersive learning with AR camera features',
      color: 'pink',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4" variant="secondary">
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Learning Experience
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Learn Anywhere, Anytime
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Install Universal One School as a Progressive Web App for the ultimate mobile learning
              experience with offline capabilities, notifications, and optimized performance.
            </p>
          </motion.div>
        </div>

        {/* Installation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Install Universal One School</CardTitle>
              <CardDescription>
                Get app-like experience with offline learning, notifications, and faster loading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <span className="font-medium">{isOnline ? 'Online' : 'Offline Mode'}</span>
                </div>
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
              </div>

              {isInstallable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={handleInstallPWA}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Install App
                  </Button>
                </motion.div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Offline Content Ready</span>
                  <span>{offlineProgress}%</span>
                </div>
                <Progress value={offlineProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Features Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Mobile-First Learning Tools</CardTitle>
              <CardDescription>
                Optimized interface and features designed specifically for mobile learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Interactive Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm">Real-time AI chat support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mic className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm">Voice-to-text for accessibility</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm">Easy sharing and collaboration</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Optimized</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Battery className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm">Battery-efficient design</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-pink-600" />
                      </div>
                      <span className="text-sm">Optimized content loading</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-sm">Smooth animations and transitions</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Learn on the Go?</h2>
              <p className="text-blue-100 mb-6">
                Join thousands of students who are already learning with our mobile-optimized
                platform
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Try Mobile Version
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
