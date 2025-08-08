// src/components/pages/__tests__/SignUpPage.test.tsx
import React from 'react';
import { renderWithAuth } from '@/tests/renderWithAuth';
import SignUpPage from '../SignUpPage';

describe('SignUpPage', () => {
  it('renders with mock auth context', () => {
    const { baseElement } = renderWithAuth(<SignUpPage setCurrentPage={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
