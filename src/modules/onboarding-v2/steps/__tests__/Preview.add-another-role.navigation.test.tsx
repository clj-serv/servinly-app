import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Preview from '../Preview';
import type { UseStepRouterReturn } from '@/lib/useStepRouter';

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

const mockNextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

const mockRouter: UseStepRouterReturn = {
  currentStep: 'PREVIEW',
  flow: 'FULL',
  signals: {
    roleId: 'test-role',
    roleFamily: 'service',
    shineKeys: ['friendly'],
    busyKeys: ['rush-hour'],
    vibeKey: 'energetic',
    orgName: 'Test Restaurant',
    startDate: '2023-01-01',
    endDate: undefined,
    highlightText: 'Great customer service experience',
    responsibilities: ['Take orders', 'Serve food'],
  },
  goNext: jest.fn(),
  goPrev: jest.fn(),
  goToStep: jest.fn(),
  updateSignals: jest.fn(),
  saveProgress: jest.fn(),
  loadProgress: jest.fn(),
  clearProgress: jest.fn(),
};

describe('Preview - Add Another Role Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockNextRouter);
    // Mock console.debug to avoid test noise
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('navigates to role select without fresh parameter on click', () => {
    render(<Preview router={mockRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    fireEvent.click(btn);
    
    expect(mockNextRouter.push).toHaveBeenCalledWith('/onboarding-v2?step=ROLE_SELECT');
    expect(mockNextRouter.push).not.toHaveBeenCalledWith(expect.stringContaining('fresh=1'));
  });

  it('logs debug message in development', () => {
    const consoleSpy = jest.spyOn(console, 'debug');
    
    render(<Preview router={mockRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    fireEvent.click(btn);
    
    expect(consoleSpy).toHaveBeenCalledWith('AddAnotherRole click');
  });

  it('is disabled when submitting', async () => {
    // Mock finalizeRole to simulate submitting state
    const { finalizeRole } = require('@/modules/onboarding-v2/repos/profileRepo');
    finalizeRole.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)));
    
    render(<Preview router={mockRouter} />);
    
    // Click Finish Profile to trigger submitting state
    const finishBtn = screen.getByRole('button', { name: /finish profile/i });
    fireEvent.click(finishBtn);
    
    // Add Another Role should be disabled during submission
    const addAnotherBtn = screen.getByRole('button', { name: /add another role/i });
    expect(addAnotherBtn).toBeDisabled();
    
    // Should not navigate when disabled
    fireEvent.click(addAnotherBtn);
    expect(mockNextRouter.push).not.toHaveBeenCalled();
  });

  it('preserves prior signals for Short Flow detection', () => {
    render(<Preview router={mockRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    fireEvent.click(btn);
    
    // Verify we navigate without fresh=1 to preserve signals
    expect(mockNextRouter.push).toHaveBeenCalledWith('/onboarding-v2?step=ROLE_SELECT');
    
    // Verify no draft clearing methods are called
    expect(mockRouter.clearProgress).not.toHaveBeenCalled();
  });

  it('has correct button attributes for accessibility', () => {
    render(<Preview router={mockRouter} />);
    
    const btn = screen.getByRole('button', { name: /add another role/i });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('min-h-[44px]'); // Tap target requirement
  });
});
