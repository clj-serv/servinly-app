import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useStepRouter } from '../useStepRouter';
import * as storage from '../storage';
import * as onboardingRouter from '../onboardingRouter';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock storage
jest.mock('../storage', () => ({
  loadDraft: jest.fn(),
  saveDraft: jest.fn(),
  clearDraft: jest.fn(),
}));

// Mock onboarding router
jest.mock('../onboardingRouter', () => ({
  decideFlowWithFamilyReuse: jest.fn(),
  guard: jest.fn(() => true),
  getNextStep: jest.fn(),
  getPrevStep: jest.fn(),
}));

const mockNextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

describe('useStepRouter - SHORT Reuse Prefill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockNextRouter);
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prefills previous answers when SHORT flow skips to ORG', async () => {
    // Arrange: Mock previous draft with shine/vibe/busy data
    const previousDraft = {
      currentStep: 'PREVIEW' as const,
      flow: 'FULL' as const,
      signals: {
        roleId: 'bartender-craft',
        roleFamily: 'bar',
        shineKeys: ['Customer-focused', 'Team player'],
        vibeKey: 'friendly',
        busyKeys: ['rush', 'late-night'],
        orgName: 'Previous Bar',
        highlightText: 'Previous experience',
        responsibilities: ['Mix drinks'],
      },
    };

    (storage.loadDraft as jest.Mock).mockReturnValue(previousDraft);
    (onboardingRouter.decideFlowWithFamilyReuse as jest.Mock).mockReturnValue({
      flow: 'SHORT',
      skipToStep: 'ORG'
    });

    // Act: Initialize router with same family role selection
    const { result } = renderHook(() => 
      useStepRouter('ROLE_SELECT', 'bartender-sports-bar', 'bartender-craft')
    );

    // Simulate role selection that triggers family reuse
    act(() => {
      result.current.updateSignals({
        roleId: 'bartender-sports-bar',
        roleFamily: 'bar'
      });
    });

    // Wait for useEffect to process
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Assert: Previous answers should be prefilled
    expect(result.current.signals.shineKeys).toEqual(['Customer-focused', 'Team player']);
    expect(result.current.signals.vibeKey).toBe('friendly');
    expect(result.current.signals.busyKeys).toEqual(['rush', 'late-night']);
    
    // Assert: New role selection preserved
    expect(result.current.signals.roleId).toBe('bartender-sports-bar');
    expect(result.current.signals.roleFamily).toBe('bar');
    
    // Assert: Navigation to ORG step
    expect(mockNextRouter.replace).toHaveBeenCalledWith('/onboarding-v2?step=ORG');
  });

  it('does not prefill when different family triggers FULL flow', async () => {
    // Arrange: Mock previous bar family draft
    const previousDraft = {
      currentStep: 'PREVIEW' as const,
      flow: 'FULL' as const,
      signals: {
        roleId: 'bartender-craft',
        roleFamily: 'bar',
        shineKeys: ['Customer-focused', 'Team player'],
        vibeKey: 'friendly',
        busyKeys: ['rush', 'late-night'],
      },
    };

    (storage.loadDraft as jest.Mock).mockReturnValue(previousDraft);
    (onboardingRouter.decideFlowWithFamilyReuse as jest.Mock).mockReturnValue({
      flow: 'FULL' // Different family = FULL flow
    });

    // Act: Initialize router with different family role
    const { result } = renderHook(() => 
      useStepRouter('ROLE_SELECT', 'server-fine-dining', 'bartender-craft')
    );

    act(() => {
      result.current.updateSignals({
        roleId: 'server-fine-dining',
        roleFamily: 'service'
      });
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Assert: No prefilling for different family
    expect(result.current.signals.shineKeys).toEqual([]);
    expect(result.current.signals.vibeKey).toBeUndefined();
    expect(result.current.signals.busyKeys).toEqual([]);
    
    // Assert: No skip to ORG
    expect(mockNextRouter.replace).not.toHaveBeenCalledWith('/onboarding-v2?step=ORG');
  });

  it('does not prefill when shineKeys already exist', async () => {
    // Arrange: Mock draft and current signals with existing shineKeys
    const previousDraft = {
      currentStep: 'PREVIEW' as const,
      flow: 'FULL' as const,
      signals: {
        roleId: 'bartender-craft',
        roleFamily: 'bar',
        shineKeys: ['Customer-focused', 'Team player'],
        vibeKey: 'friendly',
      },
    };

    (storage.loadDraft as jest.Mock).mockReturnValue(previousDraft);
    (onboardingRouter.decideFlowWithFamilyReuse as jest.Mock).mockReturnValue({
      flow: 'SHORT',
      skipToStep: 'ORG'
    });

    // Act: Initialize with existing shineKeys
    const { result } = renderHook(() => 
      useStepRouter('ROLE_SELECT', 'bartender-sports-bar', 'bartender-craft')
    );

    act(() => {
      result.current.updateSignals({
        roleId: 'bartender-sports-bar',
        roleFamily: 'bar',
        shineKeys: ['Existing', 'Keys'] // Already has shine keys
      });
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Assert: Existing shineKeys preserved, not overwritten
    expect(result.current.signals.shineKeys).toEqual(['Existing', 'Keys']);
    expect(result.current.signals.vibeKey).toBeUndefined(); // Not prefilled
  });

  it('logs debug information for SHORT reuse prefill', async () => {
    const consoleSpy = jest.spyOn(console, 'debug');
    
    const previousDraft = {
      currentStep: 'PREVIEW' as const,
      flow: 'FULL' as const,
      signals: {
        roleId: 'bartender-craft',
        roleFamily: 'bar',
        shineKeys: ['Customer-focused'],
        vibeKey: 'friendly',
      },
    };

    (storage.loadDraft as jest.Mock).mockReturnValue(previousDraft);
    (onboardingRouter.decideFlowWithFamilyReuse as jest.Mock).mockReturnValue({
      flow: 'SHORT',
      skipToStep: 'ORG'
    });

    const { result } = renderHook(() => 
      useStepRouter('ROLE_SELECT', 'bartender-sports-bar', 'bartender-craft')
    );

    act(() => {
      result.current.updateSignals({
        roleId: 'bartender-sports-bar',
        roleFamily: 'bar'
      });
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Assert: Debug logging called
    expect(consoleSpy).toHaveBeenCalledWith('SHORT reuse → prefill', {
      prevShine: ['Customer-focused'],
      nextShine: [],
      target: 'ORG',
    });
  });
});
