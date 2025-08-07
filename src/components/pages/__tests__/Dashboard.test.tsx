// src/components/pages/__tests__/Dashboard.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { AuthContext } from '@/components/context/AuthContext';

const mockAuth = {
  user: {
    id: 'user-id-123',
    email: 'test@example.com',
    app_metadata: { provider: 'email' },
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  },
  profile: {
    id: 'user-id-123',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    user_type: 'worker' as 'worker' | 'employer',
    onboarding_completed: true,
    profile_completion: 80,
    skills: ['React', 'Node.js'],
    created_at: new Date().toISOString(),
  },
  loading: false,
  error: null,
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  retryConnection: jest.fn(),
  sessionTimeRemaining: null,
  resendConfirmation: jest.fn(),
  confirmEmail: jest.fn(),
  pendingConfirmationEmail: null,
};

describe('Dashboard', () => {
  it('renders welcome message with mock profile', () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <Dashboard setCurrentPage={() => {}} />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Welcome back, Test/i)).toBeInTheDocument();
  });
});
