'use client';

import AnimatedCounter from './AnimatedCounter';
import { Trophy, Users, GraduationCap, Star } from 'lucide-react';

const statistics = [
  {
    icon: <Trophy className="w-8 h-8 text-yellow-400" />,
    value: 156,
    suffix: '+',
    label: 'College Commits',
    sublabel: 'This Year',
  },
  {
    icon: <Users className="w-8 h-8 neon-text" />,
    value: 2847,
    suffix: '+',
    label: 'Verified Athletes',
    sublabel: 'Active Users',
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-purple-400" />,
    value: 89,
    suffix: '%',
    label: 'NCAA Eligible',
    sublabel: 'Success Rate',
  },
  {
    icon: <Star className="w-8 h-8 text-blue-400" />,
    value: 94,
    suffix: '%',
    label: 'Satisfaction',
    sublabel: 'User Rating',
  },
];

export default function StatisticsCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
      {statistics.map((stat, index) => (
        <div
          key={index}
          className="text-center hero-bg neon-border p-6 rounded-xl hover-lift"
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="flex justify-center mb-3">{stat.icon}</div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
              duration={2000 + index * 300}
            />
          </div>
          <div className="text-sm font-semibold text-slate-300">{stat.label}</div>
          <div className="text-xs text-slate-500">{stat.sublabel}</div>
        </div>
      ))}
    </div>
  );
}
