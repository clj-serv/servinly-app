// src/components/pages/ProfilePage.tsx

'use client';

import React from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { Navigation } from '../shared/Navigation';
import { MapPin, Mail, Phone } from 'lucide-react';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

export const ProfilePage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="profile" setCurrentPage={setCurrentPage} user={user} profile={profile} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-gray-600">{profile?.current_position || 'Hospitality Professional'}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {profile?.location || 'Location not set'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                {profile?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {profile.phone}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Account Type</h3>
              <p className="text-sm text-gray-600 capitalize">
                {profile?.user_type === 'worker' ? 'Hospitality Professional' : 'Employer'}
              </p>
            </div>
          </div>

          {profile?.skills && profile.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile?.bio && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🚀 Enhanced Profile Features Coming Soon!</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Multiple work positions and history</li>
                <li>• AI-powered bio enhancement</li>
                <li>• Skills verification and endorsements</li>
                <li>• Professional photo upload</li>
                <li>• Certifications and achievements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};