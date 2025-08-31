'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Star,
  Filter,
  AlertCircle,
} from 'lucide-react';

interface School {
  id: string;
  name: string;
  division: 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO';
  conference: string;
  location: string;
  state: string;
  sport: string;
  scholarships: number;
  contactInfo: {
    headCoach: string;
    email: string;
    phone: string;
    recruitingCoordinator?: string;
  };
  requirements: {
    minGPA: number;
    minSAT?: number;
    minACT?: number;
    coreCredits: number;
  };
  visited: boolean;
  interested: boolean;
  contacted: boolean;
  lastContact?: Date;
}

interface RecruitmentProfile {
  id: string;
  athleteId: string;
  sport: string;
  position: string;
  garScore: number;
  academicInfo: {
    gpa: number;
    sat?: number;
    act?: number;
    coreCredits: number;
  };
  athleticStats: {
    height: string;
    weight: string;
    stats: { [key: string]: any };
  };
  highlights: string[];
  timeline: RecruitmentEvent[];
  ncaaEligible: boolean;
  targetSchools: string[];
}

interface RecruitmentEvent {
  id: string;
  type: 'contact' | 'visit' | 'offer' | 'commitment' | 'rejection' | 'interest';
  schoolId: string;
  schoolName: string;
  date: Date;
  details: string;
  followUpNeeded: boolean;
  nextAction?: string;
  nextActionDate?: Date;
}

export function AdvancedRecruitmentTools() {
  const [activeTab, setActiveTab] = useState('schools');
  const [schools, setSchools] = useState<School[]>([]);
  const [profile, setProfile] = useState<RecruitmentProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    division: 'all',
    state: 'all',
    minScholarships: 0,
    maxGPA: 4.0,
    visited: false,
    interested: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    try {
      const [schoolsResponse, profileResponse] = await Promise.all([
        fetch('/api/recruitment/schools'),
        fetch('/api/recruitment/profile'),
      ]);

      if (schoolsResponse.ok) {
        const schoolsData = await schoolsResponse.json();
        setSchools(schoolsData.schools);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      }
    } catch (error) {
      console.error('Failed to fetch recruitment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactSchool = async (schoolId: string) => {
    try {
      const response = await fetch(`/api/recruitment/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId }),
      });

      if (response.ok) {
        await fetchRecruitmentData();
      }
    } catch (error) {
      console.error('Failed to contact school:', error);
    }
  };

  const generatePortfolio = async () => {
    try {
      const response = await fetch('/api/recruitment/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'athletic-portfolio.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to generate portfolio:', error);
    }
  };

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.conference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (filters.division === 'all' || school.division === filters.division) &&
      (filters.state === 'all' || school.state === filters.state) &&
      school.scholarships >= filters.minScholarships &&
      school.requirements.minGPA <= filters.maxGPA &&
      (!filters.visited || school.visited) &&
      (!filters.interested || school.interested);

    return matchesSearch && matchesFilters;
  });

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'D1':
        return 'bg-red-600';
      case 'D2':
        return 'bg-blue-600';
      case 'D3':
        return 'bg-green-600';
      case 'NAIA':
        return 'bg-purple-600';
      case 'JUCO':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const renderSchoolSearch = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools, locations, conferences..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
            />
          </div>
          <button
            onClick={() =>
              setFilters({
                division: 'all',
                state: 'all',
                minScholarships: 0,
                maxGPA: 4.0,
                visited: false,
                interested: false,
              })
            }
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.division}
            onChange={(e) => setFilters((prev) => ({ ...prev, division: e.target.value }))}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Divisions</option>
            <option value="D1">Division I</option>
            <option value="D2">Division II</option>
            <option value="D3">Division III</option>
            <option value="NAIA">NAIA</option>
            <option value="JUCO">Junior College</option>
          </select>

          <select
            value={filters.state}
            onChange={(e) => setFilters((prev) => ({ ...prev, state: e.target.value }))}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All States</option>
            <option value="TX">Texas</option>
            <option value="CA">California</option>
            <option value="FL">Florida</option>
            <option value="NY">New York</option>
            <option value="PA">Pennsylvania</option>
          </select>

          <input
            type="number"
            value={filters.minScholarships}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minScholarships: parseInt(e.target.value) }))
            }
            placeholder="Min Scholarships"
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          />

          <input
            type="number"
            step="0.1"
            value={filters.maxGPA}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxGPA: parseFloat(e.target.value) }))
            }
            placeholder="Max GPA Requirement"
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      {/* Schools List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchools.map((school) => (
          <div key={school.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{school.name}</h3>
                <p className="text-slate-400 text-sm">{school.location}</p>
                <p className="text-slate-400 text-sm">{school.conference}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs text-white ${getDivisionColor(school.division)}`}
                >
                  {school.division}
                </span>
                {school.interested && <Star className="w-4 h-4 text-yellow-500" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400">Scholarships</p>
                <p className="text-sm text-white">{school.scholarships}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Min GPA</p>
                <p className="text-sm text-white">{school.requirements.minGPA}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Head Coach</p>
                <p className="text-sm text-white">{school.contactInfo.headCoach}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Last Contact</p>
                <p className="text-sm text-white">
                  {school.lastContact ? new Date(school.lastContact).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <a
                href={`mailto:${school.contactInfo.email}`}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href={`tel:${school.contactInfo.phone}`}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
              <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                <ExternalLink className="w-4 h-4" />
                Website
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => contactSchool(school.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
              >
                {school.contacted ? 'Follow Up' : 'Contact'}
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                {school.interested ? 'Remove Interest' : 'Mark Interested'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recruitment Profile</h2>
          <button
            onClick={generatePortfolio}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Generate Portfolio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Athletic Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sport:</span>
                  <span className="text-white">{profile?.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Position:</span>
                  <span className="text-white">{profile?.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GAR Score:</span>
                  <span className="text-white">{profile?.garScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Height:</span>
                  <span className="text-white">{profile?.athleticStats.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Weight:</span>
                  <span className="text-white">{profile?.athleticStats.weight}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Academic Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">GPA:</span>
                  <span className="text-white">{profile?.academicInfo.gpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SAT:</span>
                  <span className="text-white">{profile?.academicInfo.sat || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ACT:</span>
                  <span className="text-white">{profile?.academicInfo.act || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Core Credits:</span>
                  <span className="text-white">{profile?.academicInfo.coreCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NCAA Eligible:</span>
                  <span className={`${profile?.ncaaEligible ? 'text-green-400' : 'text-red-400'}`}>
                    {profile?.ncaaEligible ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NCAA Compliance */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">NCAA Compliance Status</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-white">Core course requirements met</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-white">GPA requirement satisfied</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-white">Test score pending</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-white">Amateurism certification needed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recruitment Timeline</h2>
        <div className="space-y-4">
          {profile?.timeline.map((event) => (
            <div key={event.id} className="flex items-start gap-4 p-4 bg-slate-700 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white">{event.schoolName}</h4>
                  <span className="text-sm text-slate-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{event.details}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      event.type === 'offer'
                        ? 'bg-green-600 text-white'
                        : event.type === 'contact'
                          ? 'bg-blue-600 text-white'
                          : event.type === 'visit'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-600 text-white'
                    }`}
                  >
                    {event.type}
                  </span>
                  {event.followUpNeeded && (
                    <span className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">
                      Follow-up needed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Recruitment Center</h1>
          <p className="text-slate-400 mt-1">Manage your college recruitment process</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'schools', label: 'School Search', icon: Search },
              { id: 'profile', label: 'My Profile', icon: Users },
              { id: 'timeline', label: 'Timeline', icon: Calendar },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'schools' && renderSchoolSearch()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'timeline' && renderTimeline()}
      </div>
    </div>
  );
}
