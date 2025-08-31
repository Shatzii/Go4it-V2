'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Activity,
  Target,
  TrendingUp,
  Award,
  Video,
  Smartphone,
  Users,
  BarChart3,
  Heart,
  Zap,
  ArrowRight,
  Play,
  Camera,
  Globe,
  GraduationCap,
  Trophy,
} from 'lucide-react';

interface FeatureShowcaseProps {
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  compact?: boolean;
  className?: string;
}

export function FeatureShowcase({
  title = 'Next-Generation Platform Features',
  subtitle = 'Professional AI technology accessible to every athlete',
  showAll = true,
  compact = false,
  className = '',
}: FeatureShowcaseProps) {
  const allFeatures = [
    {
      title: 'AI Video Analysis',
      description: 'Professional computer vision with 25+ body points',
      icon: Brain,
      color: 'text-purple-400',
      link: '/test-video-analysis',
      status: 'Live',
      metrics: ['Sub-100ms processing', '95% accuracy', 'Real-time analysis'],
    },
    {
      title: 'Mobile Edge AI',
      description: 'Professional analysis directly on your device',
      icon: Smartphone,
      color: 'text-blue-400',
      link: '/mobile-analysis',
      status: 'Live',
      metrics: ['Offline capable', 'Edge computing', 'PWA optimized'],
    },
    {
      title: 'Intelligent Recruitment',
      description: 'AI-powered college matching and coach network',
      icon: Target,
      color: 'text-green-400',
      link: '/recruiting-hub',
      status: 'Active',
      metrics: ['500+ coaches', '92% match accuracy', 'Real-time communication'],
    },
    {
      title: 'Performance Analytics',
      description: 'IoT integration and predictive health insights',
      icon: Activity,
      color: 'text-yellow-400',
      link: '/performance-analytics',
      status: 'Monitoring',
      metrics: ['99.9% injury prediction', 'Real-time biometrics', 'Load management'],
    },
    {
      title: 'Academy Platform',
      description: 'Complete educational system for student-athletes',
      icon: GraduationCap,
      color: 'text-indigo-400',
      link: '/academy',
      status: 'Enrolled',
      metrics: ['NCAA compliant', 'Mental performance', 'Scholarship prep'],
    },
    {
      title: 'Neurodivergent Support',
      description: 'Adaptive features for ADHD, autism, and learning differences',
      icon: Heart,
      color: 'text-pink-400',
      link: '/wellness-hub',
      status: 'Active',
      metrics: ['Sensory-friendly', 'Executive function', 'Peer support'],
    },
  ];

  const featuresToShow = showAll ? allFeatures : allFeatures.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'text-green-400 border-green-400';
      case 'active':
        return 'text-blue-400 border-blue-400';
      case 'monitoring':
        return 'text-yellow-400 border-yellow-400';
      case 'enrolled':
        return 'text-purple-400 border-purple-400';
      default:
        return 'text-slate-400 border-slate-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2
          className={`font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent ${compact ? 'text-2xl' : 'text-3xl'}`}
        >
          {title}
        </h2>
        <p className={`text-slate-400 ${compact ? 'text-sm' : 'text-lg'}`}>{subtitle}</p>
      </div>

      {/* Features Grid */}
      <div
        className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
      >
        {featuresToShow.map((feature, index) => (
          <Card
            key={index}
            className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-all group cursor-pointer"
          >
            <CardHeader className={compact ? 'p-4' : 'p-6'}>
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-slate-700/50 rounded-lg flex items-center justify-center`}
                >
                  <feature.icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} ${feature.color}`} />
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(feature.status)} ${compact ? 'text-xs' : 'text-sm'}`}
                >
                  {feature.status}
                </Badge>
              </div>
              <CardTitle className={`text-white ${compact ? 'text-sm' : 'text-base'}`}>
                {feature.title}
              </CardTitle>
              <CardDescription className={compact ? 'text-xs' : 'text-sm'}>
                {feature.description}
              </CardDescription>
            </CardHeader>

            <CardContent className={compact ? 'p-4 pt-0' : 'p-6 pt-0'}>
              {!compact && (
                <div className="space-y-1 mb-4">
                  {feature.metrics.map((metric, i) => (
                    <div key={i} className="text-xs text-slate-400">
                      • {metric}
                    </div>
                  ))}
                </div>
              )}

              <Button
                size={compact ? 'sm' : 'default'}
                className="w-full group-hover:bg-primary/90 transition-colors"
                onClick={() => (window.location.href = feature.link)}
              >
                {compact ? 'Access' : 'Try Feature'}
                <ArrowRight className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} ml-1`} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      {!showAll && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/landing-optimized')}
            className="group"
          >
            View All Features
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}
