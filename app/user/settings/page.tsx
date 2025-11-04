'use client';

import React, { useState } from 'react';
import ProfilePictureUpload from '../../../components/ProfilePictureUpload';
import { useUser } from '@clerk/nextjs';

export default function UserSettings() {
  const { user } = useUser();
  const [profileImageUrl, setProfileImageUrl] = useState(user?.imageUrl || null);
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    password: '',
    notifications: 'all'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // TODO: Implement actual API call to update user settings
      const response = await fetch('/api/user/update-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
    setMessage({ type: 'success', text: 'Profile picture updated!' });
  };

  const handleProfilePictureDelete = () => {
    setProfileImageUrl(null);
    setMessage({ type: 'success', text: 'Profile picture deleted!' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">User Settings</h1>
            <p className="text-cyan-100 mt-2">Manage your profile and preferences</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Success/Error Messages */}
            {message && (
              <div className={`mb-6 px-4 py-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="md:col-span-1">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Picture</h2>
                  <ProfilePictureUpload
                    currentImageUrl={profileImageUrl}
                    onUploadSuccess={handleProfilePictureUpload}
                    onDeleteSuccess={handleProfilePictureDelete}
                    size="xl"
                  />
                </div>
              </div>

              {/* Settings Form */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                      New Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Leave blank to keep current password"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Leave blank if you don&apos;t want to change your password
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="notifications">
                      Email Notifications
                    </label>
                    <select
                      id="notifications"
                      name="notifications"
                      value={formData.notifications}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    >
                      <option value="all">All Notifications</option>
                      <option value="important">Important Only</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-cyan-50 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
            💡 Profile Tips
          </h3>
          <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-2">
            <li>• Use a clear, professional photo for your profile picture</li>
            <li>• Keep your email address up to date to receive important notifications</li>
            <li>• Choose a strong password with at least 8 characters</li>
            <li>• Profile pictures help coaches and teammates recognize you</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
