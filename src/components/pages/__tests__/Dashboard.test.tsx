// src/components/pages/__tests__/Dashboard.test.tsx
import React from 'react';
import { renderWithAuth, makeMockAuth } from '@/tests/renderWithAuth';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('renders with mock auth context', () => {
    const auth = makeMockAuth({ profile: { first_name: 'Claudio', skills: [] } as any });
    const { baseElement } = renderWithAuth(<Dashboard setCurrentPage={() => {}} />, { auth });
    expect(baseElement).toBeTruthy();
  });
});
