'use client';

import React from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { Navigation } from '../shared/Navigation';
import {
  Users,
  Briefcase,
  User as UserIcon,
  Award,
  CheckCircle,
} from 'lucide-react';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

export const Dashboard: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { user, profile, sessionTimeRemaining } = useAuth();

  const quickStats = [
    { label: 'Network Connections', value: '0', icon: Users },
    { label: 'Job Applications', value: '0', icon: Briefcase },
    { label: 'Profile Views', value: '0', icon: UserIcon },
    {
      label: 'Skills Listed',
      value: profile?.skills.length.toString() || '0',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="dashboard" setCurrentPage={setCurrentPage} user={user} profile={profile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">Here&apos;s your hospitality career dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Icon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => setCurrentPage('jobs')} className="btn">Browse Job Opportunities</button>
              <button onClick={() => setCurrentPage('network')} className="btn">Find Colleagues in Your Area</button>
              <button onClick={() => setCurrentPage('profile')} className="btn">Update Your Profile</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Profile Created</div>
              <div className="flex items-start"><div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-2" />Connect with Colleagues</div>
              <div className="flex items-start"><div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-2" />Apply for Jobs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
