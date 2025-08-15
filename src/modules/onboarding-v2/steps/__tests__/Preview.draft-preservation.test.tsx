import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Preview from '../Preview';
import type { UseStepRouterReturn } from '@/lib/useStepRouter';
import * as storage from '@/lib/storage';

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

// Mock storage
jest.mock('@/lib/storage', () => ({
  loadDraft: jest.fn(),
  saveDraft: jest.fn(),
  clearDraft: jest.fn(),
}));

const mockNextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

const mockRouter: UseStepRouterReturn = {
  currentStep: 'PREVIEW',
  flow: 'FULL',
  signals: {
    roleId: 'bartender-craft',
    roleFamily: 'bar',
    shineKeys: ['friendly', 'efficient'],
    busyKeys: ['rush-hour'],
    vibeKey: 'energetic',
    orgName: 'Craft Cocktail Bar',
    startDate: '2023-01-01',
    endDate: undefined,
    highlightText: 'Led team during busy weekend service',
    responsibilities: ['Mix cocktails', 'Manage bar inventory'],
  },
  goNext: jest.fn(),
  goPrev: jest.fn(),
  goToStep: jest.fn(),
  updateSignals: jest.fn(),
  saveProgress: jest.fn(),
  loadProgress: jest.fn(),
  clearProgress: jest.fn(),
};

describe('Preview - Draft Preservation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockNextRouter);
    // Mock console.debug to avoid test noise
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('preserves draft when navigating to role select', () => {
    // Mock storage to return previous role data
    (storage.loadDraft as jest.Mock).mockReturnValue({
      currentStep: 'PREVIEW',
      flow: 'FULL',
      signals: mockRouter.signals,
    });

    render(<Preview router={mockRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    fireEvent.click(btn);
    
    // Should navigate without fresh=1 to preserve draft
    expect(mockNextRouter.push).toHaveBeenCalledWith('/onboarding-v2?step=ROLE_SELECT');
    
    // Should NOT call clearDraft or clearProgress
    expect(storage.clearDraft).not.toHaveBeenCalled();
    expect(mockRouter.clearProgress).not.toHaveBeenCalled();
  });

  it('maintains previous role data for short flow detection', () => {
    const previousSignals = {
      ...mockRouter.signals,
      roleId: 'server-fine-dining',
      roleFamily: 'service',
    };

    // Mock storage showing previous role from different family
    (storage.loadDraft as jest.Mock).mockReturnValue({
      currentStep: 'PREVIEW',
      flow: 'FULL',
      signals: previousSignals,
    });

    render(<Preview router={mockRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    fireEvent.click(btn);
    
    // Navigation preserves draft for family comparison
    expect(mockNextRouter.push).toHaveBeenCalledWith('/onboarding-v2?step=ROLE_SELECT');
    expect(mockNextRouter.push).not.toHaveBeenCalledWith(expect.stringContaining('fresh=1'));
    
    // Storage should still contain previous role data
    expect(storage.clearDraft).not.toHaveBeenCalled();
  });

  it('does not clear draft on component mount', () => {
    render(<Preview router={mockRouter} />);
    
    // Component should not clear draft during initialization
    expect(storage.clearDraft).not.toHaveBeenCalled();
    expect(mockRouter.clearProgress).not.toHaveBeenCalled();
  });

  it('preserves signals for same family short flow', () => {
    const sameFamilySignals = {
      ...mockRouter.signals,
      roleId: 'bartender-sports-bar', // Different bar role, same family
      roleFamily: 'bar',
    };

    render(<Preview router={{ ...mockRouter, signals: sameFamilySignals }} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    fireEvent.click(btn);
    
    // Should preserve draft for same family comparison
    expect(mockNextRouter.push).toHaveBeenCalledWith('/onboarding-v2?step=ROLE_SELECT');
    expect(storage.clearDraft).not.toHaveBeenCalled();
  });
});
