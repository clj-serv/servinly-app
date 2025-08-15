import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Preview from '../Preview';
import { finalizeRole } from '@/modules/onboarding-v2/repos/profileRepo';
import type { UseStepRouterReturn } from '@/lib/useStepRouter';
import type { TOnboardingSignals } from '@/contracts/onboarding';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/modules/onboarding-v2/repos/profileRepo');
jest.mock('@/lib/flags', () => ({
  isAddAnotherEnabled: () => false,
}));
jest.mock('@/lib/preview', () => ({
  adaptSignalsToForm: jest.fn(() => ({})),
  buildBulletsFromSignals: jest.fn(() => []),
}));
jest.mock('@/lib/storage', () => ({
  loadDraft: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFinalizeRole = finalizeRole as jest.MockedFunction<typeof finalizeRole>;

describe('Preview - Finalize Flow', () => {
  const mockPush = jest.fn();
  const mockRouter: UseStepRouterReturn = {
    signals: {
      roleId: 'bartender',
      roleFamily: 'bar',
      shineKeys: ['multitasking'],
      busyKeys: ['rush-hour'],
      vibeKey: 'energetic',
      orgName: 'Test Bar',
      startDate: '2023-01',
      endDate: '2024-01',
      highlightText: 'Led team',
      responsibilities: ['Mix drinks'],
    } as TOnboardingSignals,
    goPrev: jest.fn(),
    goNext: jest.fn(),
    updateSignals: jest.fn(),
    currentStep: 'PREVIEW',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('calls finalizeRole and navigates to profile on successful finish', async () => {
    const mockRoleId = 'test-role-id-123';
    mockFinalizeRole.mockResolvedValue({ ok: true, id: mockRoleId });

    render(<Preview router={mockRouter} />);

    const finishButton = screen.getByText('Finish Profile');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(mockFinalizeRole).toHaveBeenCalledWith(mockRouter.signals);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('shows error state when finalizeRole fails', async () => {
    const errorMessage = 'Database connection failed';
    mockFinalizeRole.mockResolvedValue({ ok: false, error: errorMessage });

    render(<Preview router={mockRouter} />);

    const finishButton = screen.getByText('Finish Profile');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(mockFinalizeRole).toHaveBeenCalledWith(mockRouter.signals);
    });

    // Should not navigate on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles unexpected errors during finalization', async () => {
    const networkError = new Error('Network timeout');
    mockFinalizeRole.mockRejectedValue(networkError);

    render(<Preview router={mockRouter} />);

    const finishButton = screen.getByText('Finish Profile');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(mockFinalizeRole).toHaveBeenCalledWith(mockRouter.signals);
    });

    // Should not navigate on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('disables finish button while submitting', async () => {
    // Mock a slow response to test loading state
    mockFinalizeRole.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, id: 'test-id' }), 100))
    );

    render(<Preview router={mockRouter} />);

    const finishButton = screen.getByText('Finish Profile');
    fireEvent.click(finishButton);

    // Button should be disabled during submission
    expect(finishButton).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('logs debug information in development', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    const mockRoleId = 'test-role-id-123';
    mockFinalizeRole.mockResolvedValue({ ok: true, id: mockRoleId });

    render(<Preview router={mockRouter} />);

    const finishButton = screen.getByText('Finish Profile');
    fireEvent.click(finishButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('finalize ok', mockRoleId);
    });

    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
