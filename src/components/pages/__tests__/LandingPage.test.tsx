import React from 'react';
import { render, screen } from '@testing-library/react';
import { LandingPage } from '../LandingPage';

describe('LandingPage', () => {
  it('renders landing page hero text', () => {
    render(<LandingPage setCurrentPage={() => {}} />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
