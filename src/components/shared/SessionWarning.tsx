// src/components/shared/SessionWarning.tsx

'use client';

import { useAuth } from '@/components/context/AuthContext';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const SESSION_WARNING_MS = 5 * 60 * 1000;

export const SessionWarning = () => {
  const { sessionTimeRemaining } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (
      sessionTimeRemaining &&
      sessionTimeRemaining <= SESSION_WARNING_MS &&
      sessionTimeRemaining > 0
    ) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [sessionTimeRemaining]);

  if (!showWarning || !sessionTimeRemaining) return null;

  const minutes = Math.ceil(sessionTimeRemaining / (60 * 1000));

  return (
    <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-start">
        <Clock className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-yellow-800">Session Expiring Soon</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Your session will expire in {minutes} minute{minutes !== 1 ? 's' : ''}. Any activity will extend your session.
          </p>
          <button
            onClick={() => setShowWarning(false)}
            className="text-xs text-yellow-600 hover:text-yellow-800 mt-2 underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
