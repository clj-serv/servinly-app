'use client';

import { useState, useEffect } from 'react';

interface OnboardingDraft {
  schemaVersion?: string;
  currentStep?: string;
  roleId?: string;
  updated?: number;
  [key: string]: any;
}

interface ClientState {
  origin: string;
  envFlags: Record<string, string>;
  localStorage: Array<{ key: string; size: number }>;
  cookies: string[];
  cacheKeys: string[];
  onboardingDraft: OnboardingDraft | null;
}

export default function ClientStateReport() {
  const [state, setState] = useState<ClientState | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const collectClientState = async (): Promise<ClientState> => {
    // Window location origin
    const origin = window.location.origin;

    // Process.env NEXT_PUBLIC_* flags
    const envFlags: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        envFlags[key] = process.env[key] || '';
      }
    });

    // localStorage entries starting with onboarding_
    const localStorage: Array<{ key: string; size: number }> = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('onboarding_')) {
        const value = window.localStorage.getItem(key) || '';
        localStorage.push({ key, size: value.length });
      }
    }

    // Cookies for this origin (names only)
    const cookies = document.cookie
      .split(';')
      .map(cookie => cookie.trim().split('=')[0])
      .filter(name => name.length > 0);

    // caches.keys() if service worker/caches exist
    let cacheKeys: string[] = [];
    try {
      if ('caches' in window) {
        cacheKeys = await caches.keys();
      }
    } catch (error) {
      // Ignore cache access errors
    }

    // Parse onboarding_draft
    let onboardingDraft: OnboardingDraft | null = null;
    try {
      const draftStr = window.localStorage.getItem('onboarding_draft');
      if (draftStr) {
        onboardingDraft = JSON.parse(draftStr);
      }
    } catch (error) {
      // Ignore parse errors
    }

    return {
      origin,
      envFlags,
      localStorage,
      cookies,
      cacheKeys,
      onboardingDraft
    };
  };

  const resetOrigin = async () => {
    setIsResetting(true);
    
    try {
      // Remove localStorage entries
      window.localStorage.removeItem('onboarding_draft');
      window.localStorage.removeItem('onboarding_signals');

      // Clear caches
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(key => caches.delete(key)));
        }
      } catch (error) {
        // Ignore cache errors
      }

      // Clear servinly_* cookies
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.trim().split('=')[0];
        if (name.startsWith('servinly_')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });

      // Refresh state
      const newState = await collectClientState();
      setState(newState);
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    collectClientState().then(setState);
  }, []);

  if (!state) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-yellow-800">Loading client state...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">🔧 Client State Report (DEV)</h3>
        <button
          onClick={resetOrigin}
          disabled={isResetting}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isResetting ? 'Resetting...' : 'Reset this origin'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Origin */}
        <div>
          <strong className="text-gray-700">Origin:</strong>
          <div className="font-mono bg-white p-2 rounded border mt-1">
            {state.origin}
          </div>
        </div>

        {/* Environment Flags */}
        <div>
          <strong className="text-gray-700">NEXT_PUBLIC_* Flags:</strong>
          <div className="bg-white p-2 rounded border mt-1">
            {Object.keys(state.envFlags).length === 0 ? (
              <span className="text-gray-500">None</span>
            ) : (
              <div className="space-y-1">
                {Object.entries(state.envFlags).map(([key, value]) => (
                  <div key={key} className="font-mono text-xs">
                    <span className="text-blue-600">{key}</span>=
                    <span className="text-green-600">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* localStorage */}
        <div>
          <strong className="text-gray-700">localStorage (onboarding_*):</strong>
          <div className="bg-white p-2 rounded border mt-1">
            {state.localStorage.length === 0 ? (
              <span className="text-gray-500">None</span>
            ) : (
              <div className="space-y-1">
                {state.localStorage.map(({ key, size }) => (
                  <div key={key} className="font-mono text-xs">
                    <span className="text-blue-600">{key}</span>: {size} chars
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cookies */}
        <div>
          <strong className="text-gray-700">Cookies (names only):</strong>
          <div className="bg-white p-2 rounded border mt-1">
            {state.cookies.length === 0 ? (
              <span className="text-gray-500">None</span>
            ) : (
              <div className="font-mono text-xs">
                {state.cookies.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Cache Keys */}
        <div>
          <strong className="text-gray-700">Cache Keys:</strong>
          <div className="bg-white p-2 rounded border mt-1">
            {state.cacheKeys.length === 0 ? (
              <span className="text-gray-500">None</span>
            ) : (
              <div className="space-y-1">
                {state.cacheKeys.map(key => (
                  <div key={key} className="font-mono text-xs text-purple-600">
                    {key}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Onboarding Draft Details */}
        <div>
          <strong className="text-gray-700">Onboarding Draft:</strong>
          <div className="bg-white p-2 rounded border mt-1">
            {!state.onboardingDraft ? (
              <span className="text-gray-500">No draft found</span>
            ) : (
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-600">Schema Version:</span>{' '}
                  <span className="font-mono">{state.onboardingDraft.schemaVersion || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Current Step:</span>{' '}
                  <span className="font-mono">{state.onboardingDraft.currentStep || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Role ID:</span>{' '}
                  <span className="font-mono">{state.onboardingDraft.roleId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Updated:</span>{' '}
                  <span className="font-mono">
                    {state.onboardingDraft.updated 
                      ? new Date(state.onboardingDraft.updated).toLocaleString()
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
