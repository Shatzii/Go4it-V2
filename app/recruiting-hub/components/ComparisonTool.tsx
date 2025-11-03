'use client';

import { X, TrendingUp, Users, DollarSign, GraduationCap, MapPin, Award, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface College {
  id: number;
  name: string;
  location: string;
  division: string;
  conference: string;
  enrollment: number;
  avgGPA: number;
  tuition: number;
  acceptanceRate: number;
  sports: string[];
}

interface ComparisonToolProps {
  colleges: College[];
  onClose: () => void;
}

export default function ComparisonTool({ colleges, onClose }: ComparisonToolProps) {
  const [selectedColleges, setSelectedColleges] = useState<College[]>(colleges.slice(0, 3));

  const metrics = [
    { label: 'Location', key: 'location', icon: MapPin },
    { label: 'Division', key: 'division', icon: Award },
    { label: 'Conference', key: 'conference', icon: Trophy },
    { label: 'Enrollment', key: 'enrollment', icon: Users, format: (val: number) => val.toLocaleString() },
    { label: 'Avg GPA Required', key: 'avgGPA', icon: GraduationCap },
    { label: 'Annual Tuition', key: 'tuition', icon: DollarSign, format: (val: number) => `$${val.toLocaleString()}` },
    { label: 'Acceptance Rate', key: 'acceptanceRate', icon: TrendingUp, format: (val: number) => `${val}%` },
  ];

  const removeCollege = (id: number) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">College Comparison</h2>
            <p className="text-slate-400 text-sm mt-1">Compare up to 3 colleges side by side</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          {selectedColleges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No colleges selected for comparison</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-400 font-medium">Metric</th>
                    {selectedColleges.map((college) => (
                      <th key={college.id} className="p-4 min-w-[200px]">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">{college.name}</h3>
                            <p className="text-slate-400 text-sm">{college.location}</p>
                          </div>
                          <button
                            onClick={() => removeCollege(college.id)}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, idx) => (
                    <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <metric.icon className="w-4 h-4 text-blue-400" />
                          {metric.label}
                        </div>
                      </td>
                      {selectedColleges.map((college) => {
                        const value = college[metric.key as keyof College];
                        const displayValue = metric.format && typeof value === 'number'
                          ? metric.format(value)
                          : value;
                        return (
                          <td key={college.id} className="p-4 text-white font-medium">
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Sports Programs Row */}
                  <tr className="border-b border-slate-700/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Award className="w-4 h-4 text-blue-400" />
                        Sports Programs
                      </div>
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {college.sports.map((sport, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              View Full Comparison
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
