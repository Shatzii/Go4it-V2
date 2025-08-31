'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Shield,
  Trophy,
  CheckCircle,
  Star,
  ArrowRight,
  User,
} from 'lucide-react';

export default function CampRegistrationPage() {
  const [selectedCamp, setSelectedCamp] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    parentName: '',
    parentEmail: '',
    emergencyContact: '',
    emergencyPhone: '',
    position: '',
    experience: '',
    garAnalysis: false,
    usaFootballMembership: false,
    actionNetworkOptIn: true,
    createAccount: false,
    username: '',
    password: '',
  });

  // Check if user is logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          // Pre-fill form with user data
          setFormData((prev) => ({
            ...prev,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            dateOfBirth: user.dateOfBirth
              ? new Date(user.dateOfBirth).toISOString().split('T')[0]
              : '',
            position: user.position || '',
          }));
        }
      })
      .catch(() => {}); // Ignore errors, user not logged in
  }, []);

  const camps = [
    {
      id: 'merida-summer-2025',
      name: 'Merida Summer Elite Camp',
      location: 'Merida, Mexico',
      dates: 'July 15-20, 2025',
      price: '$899',
      description:
        'Elite football training in beautiful Merida with professional coaches and GAR analysis',
    },
    {
      id: 'merida-winter-2025',
      name: 'Merida Winter Skills Camp',
      location: 'Merida, Mexico',
      dates: 'December 20-23, 2025',
      price: '$699',
      description: 'Intensive skills development camp with personalized coaching',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCampData = camps.find((c) => c.id === selectedCamp);
    if (!selectedCampData) return;

    // If user wants to create account or is not logged in, redirect to registration
    if (formData.createAccount || !currentUser) {
      const registrationData = {
        ...formData,
        campId: selectedCamp,
        campName: selectedCampData.name,
        campPrice: selectedCampData.price,
      };

      // Store camp registration data in sessionStorage
      sessionStorage.setItem('campRegistration', JSON.stringify(registrationData));

      // Redirect to registration with camp context
      window.location.href = `/register?camp=${selectedCamp}&redirect=camp-registration`;
      return;
    }

    const registrationData = {
      campId: selectedCamp,
      campName: selectedCampData.name,
      campDates: selectedCampData.dates,
      campLocation: selectedCampData.location,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      parentName: formData.parentName,
      parentEmail: formData.parentEmail,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      position: formData.position,
      experience: formData.experience,
      garAnalysis: formData.garAnalysis,
      usaFootballMembership: formData.usaFootballMembership,
      actionNetworkOptIn: formData.actionNetworkOptIn,
      registrationFee: parseFloat(selectedCampData.price.replace('$', '')),
      createAccount: !currentUser && formData.createAccount,
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch('/api/camp-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Registration submitted successfully! ${result.accountCreated ? 'Your Go4It account has been created. ' : ''}You will receive a confirmation email shortly.`,
        );
        // Redirect to user dashboard or confirmation page
        if (result.accountCreated) {
          window.location.href = '/dashboard';
        }
      } else {
        alert(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold mb-2">Elite Football Camps</h1>
          <p className="text-slate-300 text-lg">Professional training in Merida, Mexico</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camp Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-semibold mb-4 text-white">Select Your Camp</h2>

              {camps.map((camp) => (
                <div
                  key={camp.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all mb-4 ${
                    selectedCamp === camp.id
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedCamp(camp.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{camp.name}</h3>
                    <span className="text-blue-400 font-bold">{camp.price}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      {camp.location}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      {camp.dates}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mt-3">{camp.description}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-white">Included Benefits</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Professional GAR Analysis</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-slate-300">USA Football Membership</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-slate-300">Insurance Coverage</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-slate-300">Elite Coaching Staff</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-slate-300">Performance Analytics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-semibold mb-6 text-white">Registration Form</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Parent/Guardian Information */}
                <div className="border-t border-slate-600 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Parent/Guardian Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Parent/Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Parent Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Emergency Contact *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.emergencyContact}
                        onChange={(e) =>
                          setFormData({ ...formData, emergencyContact: e.target.value })
                        }
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Emergency Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.emergencyPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, emergencyPhone: e.target.value })
                        }
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Football Information */}
                <div className="border-t border-slate-600 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Football Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Primary Position
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select Position</option>
                        <option value="QB">Quarterback</option>
                        <option value="RB">Running Back</option>
                        <option value="WR">Wide Receiver</option>
                        <option value="TE">Tight End</option>
                        <option value="OL">Offensive Line</option>
                        <option value="DL">Defensive Line</option>
                        <option value="LB">Linebacker</option>
                        <option value="DB">Defensive Back</option>
                        <option value="K">Kicker</option>
                        <option value="P">Punter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Experience Level
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select Experience</option>
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (2-4 years)</option>
                        <option value="advanced">Advanced (5+ years)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Creation for Non-Members */}
                {!currentUser && (
                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Go4It Membership</h3>

                    <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg mb-4">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 text-blue-400 mr-2" />
                        <span className="font-semibold text-blue-400">Create Go4It Account</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-4">
                        Join Go4It to access exclusive features, track your progress, and connect
                        with coaches and recruiters.
                      </p>

                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={formData.createAccount}
                          onChange={(e) =>
                            setFormData({ ...formData, createAccount: e.target.checked })
                          }
                          className="mr-3"
                        />
                        <span className="text-white">Create Go4It account (recommended)</span>
                      </div>

                      {formData.createAccount && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Username *
                            </label>
                            <input
                              type="text"
                              required={formData.createAccount}
                              value={formData.username}
                              onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Password *
                            </label>
                            <input
                              type="password"
                              required={formData.createAccount}
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                              }
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add-ons and Benefits */}
                <div className="border-t border-slate-600 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Included Benefits</h3>

                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.garAnalysis}
                        onChange={(e) =>
                          setFormData({ ...formData, garAnalysis: e.target.checked })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-green-400">GAR Analysis ($49 value)</div>
                        <div className="text-sm text-slate-300">
                          Professional video analysis with Growth and Ability Rating
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.usaFootballMembership}
                        onChange={(e) =>
                          setFormData({ ...formData, usaFootballMembership: e.target.checked })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-blue-400">
                          USA Football Membership & Insurance
                        </div>
                        <div className="text-sm text-slate-300">
                          Official membership with comprehensive insurance coverage
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-slate-700 border border-slate-600 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.actionNetworkOptIn}
                        onChange={(e) =>
                          setFormData({ ...formData, actionNetworkOptIn: e.target.checked })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-white">Join Action Network</div>
                        <div className="text-sm text-slate-300">
                          Receive camp updates and football opportunities
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={!selectedCamp}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
                  >
                    Complete Registration
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>

                  {!selectedCamp && (
                    <p className="text-red-400 text-sm mt-2">Please select a camp to continue</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
