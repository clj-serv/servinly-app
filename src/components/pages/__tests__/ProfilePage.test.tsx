// src/components/pages/__tests__/ProfilePage.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfilePage } from '../ProfilePage';
import { AuthContext } from '@/components/context/AuthContext';

describe('ProfilePage', () => {
  it('renders profile information with mock profile', () => {
    const mockAuth = {
      user: {
        id: '123',
        email: 'test@example.com',
        app_metadata: { provider: 'email' },
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
      },
      profile: {
        id: '123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        user_type: 'worker' as 'worker', // Fix here
        onboarding_completed: true,
        profile_completion: 100,
        skills: ['React', 'TypeScript'],
        created_at: '2023-01-01T00:00:00Z',
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

    render(
      <AuthContext.Provider value={mockAuth}>
        <ProfilePage setCurrentPage={() => {}} />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/React/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
  });
});
