// src/components/pages/__tests__/ProfilePage.test.tsx
import React from 'react';
import { renderWithAuth } from '@/tests/renderWithAuth';
import ProfilePage from '../ProfilePage';

describe('ProfilePage', () => {
  it('renders with mock auth context', () => {
    const { baseElement } = renderWithAuth(<ProfilePage setCurrentPage={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
