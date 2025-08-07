// src/components/pages/LandingPage.tsx

'use client';

import React from 'react';
import { Briefcase } from 'lucide-react';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

export const LandingPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-xl text-center">
        <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Servinly</h1>
        <p className="text-gray-600 mb-6">
          Your all-in-one platform for hospitality professionals and employers
        </p>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentPage('signup')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Join Now
          </button>
          <button
            onClick={() => setCurrentPage('signin')}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign In
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Secure, private, and tailored for the hospitality industry
        </p>
      </div>
    </div>
  );
};