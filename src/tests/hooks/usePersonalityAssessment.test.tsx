import { renderHook, act } from '@testing-library/react';
import { usePersonalityAssessment } from '../../hooks/usePersonalityAssessment';

const mockFormData = {
  position: 'Barista',
  organization: 'Starbucks',
  location: 'Brisbane',
  startDate: '2022-01-01',
  endDate: '2023-06-01',
  isCurrentlyWorking: false,
  responsibilities: ['Customer service', 'Cash handling'],
};

describe('usePersonalityAssessment', () => {
  it('generates traits and summary from mock data', async () => {
    const { result } = renderHook(() => usePersonalityAssessment());

    await act(async () => {
      await result.current.generateTraits(mockFormData);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.traits.length).toBeGreaterThan(0);
    expect(result.current.result?.summary).toMatch(/Based on your experience/);
  });
});
