import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Preview from '../Preview';
import { finalizeRole } from '@/modules/onboarding-v2/repos/profileRepo';
import { isAddAnotherEnabled } from '@/lib/flags';
import { getSessionUserId } from '@/lib/auth';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/modules/onboarding-v2/repos/profileRepo');
jest.mock('@/lib/flags');
jest.mock('@/lib/auth');
jest.mock('@/lib/preview', () => ({
  adaptSignalsToForm: jest.fn(),
  buildBulletsFromSignals: jest.fn(),
}));
jest.mock('@/lib/storage', () => ({
  loadDraft: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockFinalizeRole = finalizeRole as jest.MockedFunction<typeof finalizeRole>;
const mockIsAddAnotherEnabled = isAddAnotherEnabled as jest.MockedFunction<typeof isAddAnotherEnabled>;
const mockGetSessionUserId = getSessionUserId as jest.MockedFunction<typeof getSessionUserId>;

describe('Preview', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockStepRouter = {
    currentStep: 'PREVIEW' as const,
    flow: 'FULL' as const,
    signals: {
      roleId: 'bartender',
      roleFamily: 'bar',
      shineKeys: ['friendly', 'efficient'],
      busyKeys: ['multitask'],
      vibeKey: 'energetic',
      orgName: 'Test Restaurant',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      highlightText: 'Served 200+ customers daily',
      responsibilities: ['Mix drinks', 'Handle payments'],
    },
    prevRoleId: undefined,
    goNext: jest.fn(),
    goPrev: jest.fn(),
    goToStep: jest.fn(),
    updateSignals: jest.fn(),
    saveProgress: jest.fn(),
    loadProgress: jest.fn(),
    clearProgress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockIsAddAnotherEnabled.mockReturnValue(false);
    mockGetSessionUserId.mockResolvedValue('user-123');
    
    // Mock console.debug to avoid noise in tests
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders finish profile button with correct attributes', () => {
    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Finish Profile');
  });

  it('logs "finish click" when button is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'debug');
    mockFinalizeRole.mockResolvedValue({ ok: true, id: 'test-id-123' });

    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('finish click', { isSubmitting: false });
  });

  it('prevents double submission on rapid clicks', async () => {
    mockFinalizeRole.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ ok: true, id: 'test-id' }), 100)
    ));

    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    
    // Click twice rapidly
    fireEvent.click(button);
    fireEvent.click(button);

    // Should only call finalizeRole once
    await waitFor(() => {
      expect(mockFinalizeRole).toHaveBeenCalledTimes(1);
    });
  });

  it('sets submitting state and calls finalizeRole once', async () => {
    mockFinalizeRole.mockResolvedValue({ ok: true, id: 'test-id-123' });

    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    fireEvent.click(button);

    // Button should be disabled and show loading state
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveTextContent('Finishing...');

    // Should call finalizeRole with signals
    expect(mockFinalizeRole).toHaveBeenCalledTimes(1);
    expect(mockFinalizeRole).toHaveBeenCalledWith(mockStepRouter.signals);

    // Wait for completion
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'false');
      expect(button).toHaveTextContent('Finish Profile');
    });
  });

  it('navigates to profile on successful finalization', async () => {
    const consoleSpy = jest.spyOn(console, 'debug');
    mockFinalizeRole.mockResolvedValue({ ok: true, id: 'test-id-123' });

    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('finalize ok', { id: 'test-id-123' });
      expect(mockStepRouter.clearProgress).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });
  });

  it('shows error and stays on preview when finalization fails', async () => {
    const consoleSpy = jest.spyOn(console, 'debug');
    mockFinalizeRole.mockResolvedValue({ ok: false, error: 'Database error' });
    
    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('finalize failed', { ok: false, error: 'Database error' });
      expect(screen.getByText('Could not finish profile.')).toBeInTheDocument();
      expect(mockStepRouter.clearProgress).not.toHaveBeenCalled();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('handles exceptions gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'debug');
    const error = new Error('Network error');
    mockFinalizeRole.mockRejectedValue(error);

    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('finalize exception', error);
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(mockStepRouter.clearProgress).not.toHaveBeenCalled();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('logs SAVE flag and session UID on mount', async () => {
    render(<Preview router={mockStepRouter} />);
    
    await waitFor(() => {
      expect(console.debug).toHaveBeenCalledWith('SAVE flag:', undefined);
      expect(console.debug).toHaveBeenCalledWith('session uid:', 'user-123');
    });
  });

  it('handles AUTH_REQUIRED error and redirects to signup', async () => {
    mockFinalizeRole.mockResolvedValue({ ok: false, error: 'AUTH_REQUIRED' });
    
    render(<Preview router={mockStepRouter} />);
    
    const button = screen.getByTestId('finish-profile');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Please sign in to save your profile.')).toBeInTheDocument();
      expect(mockRouter.push).toHaveBeenCalledWith('/signup?returnTo=%2Fonboarding-v2%3Fstep%3DPREVIEW');
    });
  });
});
