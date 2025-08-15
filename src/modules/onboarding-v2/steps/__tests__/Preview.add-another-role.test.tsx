import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Preview from '../Preview';
import type { UseStepRouterReturn } from '@/lib/useStepRouter';

// Mock the flags module
jest.mock('@/lib/flags', () => ({
  isAddAnotherEnabled: jest.fn(() => false), // Default OFF
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock profile repo
jest.mock('@/modules/onboarding-v2/repos/profileRepo', () => ({
  finalizeRole: jest.fn(),
}));

// Mock preview helpers
jest.mock('@/lib/preview', () => ({
  adaptSignalsToForm: jest.fn(() => ({ howYouShine: [] })),
  buildBulletsFromSignals: jest.fn(() => []),
}));

describe('Preview Add Another Role Button', () => {
  let mockRouter: jest.Mocked<UseStepRouterReturn>;
  let mockPush: jest.Mock;
  const { isAddAnotherEnabled } = require('@/lib/flags');

  beforeEach(() => {
    mockPush = jest.fn();
    const { useRouter } = require('next/navigation');
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    mockRouter = {
      signals: {
        roleId: 'bartender',
        roleFamily: 'bar',
        shineKeys: ['customer-service'],
        vibeKey: 'energetic',
        busyKeys: ['multitask'],
        orgName: 'Test Bar',
        highlightText: 'Great experience',
        responsibilities: ['Serve drinks'],
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
      goPrev: jest.fn(),
      goNext: jest.fn(),
      goToStep: jest.fn(),
      updateSignals: jest.fn(),
      saveProgress: jest.fn(),
      loadProgress: jest.fn(),
      clearProgress: jest.fn(),
      currentStep: 'PREVIEW',
      flow: 'FULL',
    };
  });

  it('button is hidden by default when flag is OFF', () => {
    // Default flag state is OFF
    render(<Preview router={mockRouter} />);
    
    const btn = screen.queryByRole('button', { name: /add another role/i });
    expect(btn).toBeNull();
  });

  it('button is shown and routes correctly when flag is ON', () => {
    // Enable the flag
    (isAddAnotherEnabled as jest.Mock).mockReturnValue(true);
    
    render(<Preview router={mockRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    expect(btn).toBeEnabled();
    
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith('/onboarding-v2?step=ROLE_SELECT');
  });

  it('remains enabled when signals are partial and flag is ON', async () => {
    // Enable the flag
    (isAddAnotherEnabled as jest.Mock).mockReturnValue(true);
    
    const partialRouter = {
      ...mockRouter,
      signals: {
        ...mockRouter.signals,
        orgName: undefined,
        startDate: undefined,
        highlightText: undefined,
        responsibilities: [],
      }
    };
    
    render(<Preview router={partialRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    expect(btn).toBeEnabled();
  });

  afterEach(() => {
    // Reset flag to default OFF state
    (isAddAnotherEnabled as jest.Mock).mockReturnValue(false);
  });
});
