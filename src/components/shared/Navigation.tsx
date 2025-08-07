// src/components/shared/Navigation.tsx
'use client';

import React from 'react';
import { User } from '@supabase/supabase-js';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: User | null;
  profile: any;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  setCurrentPage,
  user,
  profile,
}) => {
  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Servinly</h1>
        <div className="space-x-4">
          <button onClick={() => setCurrentPage('dashboard')} className="text-sm text-blue-600 hover:underline">
            Dashboard
          </button>
          <button onClick={() => setCurrentPage('profile')} className="text-sm text-gray-600 hover:underline">
            Profile
          </button>
          <button onClick={() => setCurrentPage('jobs')} className="text-sm text-gray-600 hover:underline">
            Jobs
          </button>
          <button onClick={() => setCurrentPage('network')} className="text-sm text-gray-600 hover:underline">
            Network
          </button>
        </div>
      </div>
    </nav>
  );
};
