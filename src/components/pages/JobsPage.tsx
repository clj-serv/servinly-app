// src/components/pages/JobsPage.tsx

'use client';

import React from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { Briefcase } from 'lucide-react';
import { Navigation } from '../shared/Navigation';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

export const JobsPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="jobs" setCurrentPage={setCurrentPage} user={user} profile={profile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Opportunities Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re building an amazing job discovery platform with AI-powered matching!
          </p>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};