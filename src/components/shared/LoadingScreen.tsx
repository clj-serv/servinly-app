// src/components/shared/LoadingScreen.tsx

'use client';

import React from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const { error, retryConnection } = useAuth();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Issue</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={retryConnection}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Refresh Page
            </button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p>If this problem persists, please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Servinly</h2>
        <p className="text-blue-100">Loading your professional platform...</p>
        <div className="mt-4 text-sm text-blue-200">
          <p>Verifying your session and loading your profile...</p>
        </div>
      </div>
    </div>
  );
};