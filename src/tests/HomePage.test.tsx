import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Home Page', () => {
  it('renders the welcome message', () => {
    render(<HomePage />);
    expect(screen.getByText(/Servinly/i)).toBeInTheDocument();
  });
});
