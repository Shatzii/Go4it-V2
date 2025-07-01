import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Activity, Target } from 'lucide-react';

interface CounterProps {
  end: number;
  duration: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({ end, duration, prefix = '', suffix = '', decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(end * easeOutQuart);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return (
    <span>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

interface RevenueData {
  label: string;
  current: number;
  target: number;
  growth: string;
  icon: React.ComponentType<any>;
  color: string;
  format: 'currency' | 'number' | 'percentage';
}

const revenueMetrics: RevenueData[] = [
  {
    label: 'Monthly Revenue',
    current: 165.8,
    target: 250.0,
    growth: '+47%',
    icon: DollarSign,
    color: 'text-green-400',
    format: 'currency'
  },
  {
    label: 'Annual Potential',
    current: 161.7,
    target: 300.0,
    growth: '+185%',
    icon: TrendingUp,
    color: 'text-cyan-400',
    format: 'currency'
  },
  {
    label: 'Active Clients',
    current: 2847,
    target: 5000,
    growth: '+89%',
    icon: Target,
    color: 'text-purple-400',
    format: 'number'
  },
  {
    label: 'AI Agents',
    current: 197,
    target: 300,
    growth: '+156%',
    icon: Activity,
    color: 'text-blue-400',
    format: 'number'
  }
];

export default function LiveRevenueCounter() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState(revenueMetrics);

  useEffect(() => {
    setIsVisible(true);
    
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setCurrentMetrics(prev => prev.map(metric => ({
        ...metric,
        current: metric.current + (Math.random() * 2 - 1) * 0.1 // Small random fluctuation
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, format: 'currency' | 'number' | 'percentage') => {
    switch (format) {
      case 'currency':
        return { prefix: '$', suffix: 'M', decimals: 1 };
      case 'number':
        return { prefix: '', suffix: '', decimals: 0 };
      case 'percentage':
        return { prefix: '', suffix: '%', decimals: 1 };
      default:
        return { prefix: '', suffix: '', decimals: 0 };
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 animate-bounce" />
            Live Revenue Analytics
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Real-Time <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Revenue Performance</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Watch our autonomous AI agents generate revenue across 12 industry verticals in real-time. 
            These numbers update live as our systems operate 24/7.
          </p>
        </div>

        {/* Revenue Counters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentMetrics.map((metric, index) => {
            const format = formatValue(metric.current, metric.format);
            
            return (
              <div
                key={metric.label}
                className={`group relative bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-500 transform hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-600/50 group-hover:scale-110 transition-transform duration-300`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-400 font-mono uppercase">LIVE</span>
                  </div>
                </div>

                {/* Counter */}
                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${metric.color} font-mono`}>
                    {isVisible && (
                      <AnimatedCounter
                        end={metric.current}
                        duration={2000 + index * 200}
                        {...format}
                      />
                    )}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">{metric.label}</div>
                </div>

                {/* Growth indicator */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                  <div className="text-green-400 text-sm font-semibold">
                    {metric.growth}
                  </div>
                  <div className="text-slate-500 text-xs">
                    Target: {formatValue(metric.target, metric.format).prefix}
                    {metric.target.toFixed(formatValue(metric.target, metric.format).decimals)}
                    {formatValue(metric.target, metric.format).suffix}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        metric.color.includes('green') ? 'from-green-500 to-emerald-400' :
                        metric.color.includes('cyan') ? 'from-cyan-500 to-blue-400' :
                        metric.color.includes('purple') ? 'from-purple-500 to-indigo-400' :
                        'from-blue-500 to-cyan-400'
                      } transition-all duration-1000`}
                      style={{ 
                        width: `${Math.min((metric.current / metric.target) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Pulse effect */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-20"></div>
              </div>
            );
          })}
        </div>

        {/* Live Activity Feed */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400" />
            Live Activity Feed
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </h3>
          
          <div className="space-y-3 max-h-40 overflow-hidden">
            {[
              'TruckFlow AI generated $2,847 in driver earnings (2 min ago)',
              'Healthcare AI processed 47 patient appointments (3 min ago)',
              'Financial AI completed compliance audit worth $89K (5 min ago)',
              'Manufacturing AI prevented $156K equipment failure (7 min ago)',
              'Legal AI automated 23 contract reviews saving 67 hours (8 min ago)'
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 text-slate-300 text-sm p-3 bg-slate-700/30 rounded-lg transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: `${1000 + index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}