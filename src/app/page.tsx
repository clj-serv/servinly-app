'use client';

import React from 'react';
import { AuthProvider } from '@/components/context/AuthContext';
import { SessionWarning } from '@/components/shared/SessionWarning';
import ServinlyApp from '@/components/pages/ServinlyApp';

export default function HomePage() {
  return (
    <AuthProvider>
      <SessionWarning />
      <ServinlyApp />
    </AuthProvider>
  );
}
