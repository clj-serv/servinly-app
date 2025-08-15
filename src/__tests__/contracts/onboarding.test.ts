import { OnboardingSignals } from '@/contracts/onboarding';
import type { TOnboardingSignals } from '@/contracts/onboarding';

describe('Onboarding Contracts', () => {
  it('validates correct onboarding signals', () => {
    const validSignals: TOnboardingSignals = {
      roleId: 'bartender',
      roleFamily: 'bar',
      shineKeys: ['customer-service', 'multitasking'],
      busyKeys: ['stay-calm'],
      vibeKey: 'energetic',
      orgName: 'Test Restaurant',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      highlightText: 'Increased sales by 20%',
      responsibilities: ['serve-drinks', 'clean-bar'],
    };

    const result = OnboardingSignals.safeParse(validSignals);
    expect(result.success).toBe(true);
  });

  it('validates minimal onboarding signals', () => {
    const minimalSignals = {
      roleId: 'server',
      roleFamily: 'service',
    };

    const result = OnboardingSignals.safeParse(minimalSignals);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.shineKeys).toEqual([]);
      expect(result.data.busyKeys).toEqual([]);
      expect(result.data.responsibilities).toEqual([]);
    }
  });

  it('rejects invalid signals', () => {
    const invalidSignals = {
      roleId: '', // Empty string should be invalid
      roleFamily: '',
      shineKeys: ['too', 'many', 'shine', 'keys'], // Max 3 allowed
    };

    const result = OnboardingSignals.safeParse(invalidSignals);
    expect(result.success).toBe(false);
  });
});
