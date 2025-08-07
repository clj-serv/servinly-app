// src/components/pages/ServinlyApp.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/context/AuthContext';

import { LandingPage } from './LandingPage';
import { SignUpPage } from './SignUpPage';
import { SignInPage } from './SignInPage';
import { OnboardingFlow } from './OnboardingFlow';
import { ProfilePage } from './ProfilePage';
import { NetworkPage } from './NetworkPage';
import { JobsPage } from './JobsPage';
import { Dashboard } from './Dashboard';
import { EmailConfirmationPage } from './EmailConfirmationPage';
import { LoadingScreen } from '../shared/LoadingScreen';

interface PageProps {
  setCurrentPage: (page: string) => void;
}

const AppRouter: React.FC<{
  currentPage: string;
  setCurrentPage: (page: string) => void;
}> = ({ currentPage, setCurrentPage }) => {
  const { user, profile, loading, pendingConfirmationEmail } = useAuth();

  if (loading) return <LoadingScreen />;

  if (pendingConfirmationEmail) {
    return (
      <EmailConfirmationPage
        email={pendingConfirmationEmail}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (user && !user.email_confirmed_at) {
    return (
      <EmailConfirmationPage
        email={user.email || ''}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (!user) {
    switch (currentPage) {
      case 'signup':
        return <SignUpPage setCurrentPage={setCurrentPage} />;
      case 'signin':
        return <SignInPage setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  }

  if (user && profile && !profile.onboarding_completed) {
    return <OnboardingFlow setCurrentPage={setCurrentPage} />;
  }

  switch (currentPage) {
    case 'profile':
      return <ProfilePage setCurrentPage={setCurrentPage} />;
    case 'network':
      return <NetworkPage setCurrentPage={setCurrentPage} />;
    case 'jobs':
      return <JobsPage setCurrentPage={setCurrentPage} />;
    default:
      return <Dashboard setCurrentPage={setCurrentPage} />;
  }
};

const ServinlyApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');

  return (
    <div className="min-h-screen bg-gray-50">
      <AppRouter
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ServinlyApp;
