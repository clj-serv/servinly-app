// src/components/pages/NetworkPage.tsx

'use client';

import React from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { Users, Briefcase } from 'lucide-react';
import { Navigation } from '../shared/Navigation';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

export const NetworkPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="network" setCurrentPage={setCurrentPage} user={user} profile={profile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Network Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Connect with other hospitality professionals and build your career network!
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