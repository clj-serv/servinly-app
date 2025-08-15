// src/lib/__tests__/preview.test.ts
import { adaptSignalsToForm, buildBulletsFromSignals, buildPreviewSectionsFromSignals } from '../preview';
import type { TOnboardingSignals } from '@/contracts/onboarding';

describe('preview adapter', () => {
  const mockSignals: TOnboardingSignals = {
    roleId: 'bartender',
    roleFamily: 'bar',
    shineKeys: ['Customer-focused', 'Quick thinking', 'Team player'],
    busyKeys: ['Rush hour', 'Complex orders'],
    vibeKey: 'energetic',
    orgName: 'The Local Pub',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    highlightText: 'Led team during busy Friday nights',
    responsibilities: ['Prepare drinks', 'Take orders', 'Maintain inventory'],
  };

  describe('adaptSignalsToForm', () => {
    it('should map signals fields to form fields correctly', () => {
      const result = adaptSignalsToForm(mockSignals);

      expect(result).toEqual({
        role: 'bartender',
        organization: 'The Local Pub',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        responsibilities: ['Prepare drinks', 'Take orders', 'Maintain inventory'],
        highlights: ['Led team during busy Friday nights'],
        busyShift: ['Rush hour', 'Complex orders'],
        howYouShine: ['Customer-focused', 'Quick thinking', 'Team player'], // ← Key mapping
        traits: ['Customer-focused', 'Quick thinking', 'Team player'],
        vibe: 'energetic',
      });
    });

    it('should handle missing optional fields', () => {
      const minimalSignals: TOnboardingSignals = {
        roleId: 'server',
        roleFamily: 'service',
        shineKeys: [],
        busyKeys: [],
        responsibilities: [],
      };

      const result = adaptSignalsToForm(minimalSignals);

      expect(result).toEqual({
        role: 'server',
        organization: undefined,
        startDate: undefined,
        endDate: undefined,
        responsibilities: [],
        highlights: [],
        busyShift: [],
        howYouShine: [],
        traits: [],
        vibe: undefined,
      });
    });

    it('should convert highlightText string to highlights array', () => {
      const signalsWithHighlight: TOnboardingSignals = {
        roleId: 'chef',
        roleFamily: 'kitchen',
        shineKeys: [],
        busyKeys: [],
        responsibilities: [],
        highlightText: 'Won employee of the month',
      };

      const result = adaptSignalsToForm(signalsWithHighlight);

      expect(result.highlights).toEqual(['Won employee of the month']);
    });

    it('should handle empty highlightText', () => {
      const signalsNoHighlight: TOnboardingSignals = {
        roleId: 'chef',
        roleFamily: 'kitchen',
        shineKeys: [],
        busyKeys: [],
        responsibilities: [],
        highlightText: undefined,
      };

      const result = adaptSignalsToForm(signalsNoHighlight);

      expect(result.highlights).toEqual([]);
    });
  });

  describe('buildBulletsFromSignals', () => {
    it('should build bullets using the adapter', () => {
      const bullets = buildBulletsFromSignals(mockSignals);

      expect(bullets).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ icon: '•', text: 'Prepare drinks' }),
          expect.objectContaining({ icon: '★', text: 'Led team during busy Friday nights' }),
          expect.objectContaining({ icon: '⚡', text: 'Rush hour' }),
          expect.objectContaining({ icon: '✨', text: 'Customer-focused' }),
        ])
      );
    });

    it('should respect max option', () => {
      const bullets = buildBulletsFromSignals(mockSignals, { max: 2 });

      expect(bullets).toHaveLength(2);
    });
  });

  describe('buildPreviewSectionsFromSignals', () => {
    it('should build sections using the adapter', () => {
      const sections = buildPreviewSectionsFromSignals(mockSignals);

      expect(sections).toEqual([
        { title: 'Responsibilities', items: ['Prepare drinks', 'Take orders', 'Maintain inventory'] },
        { title: 'Highlights', items: ['Led team during busy Friday nights'] },
        { title: 'Busy Shifts', items: ['Rush hour', 'Complex orders'] },
        { title: 'How You Shine', items: ['Customer-focused', 'Quick thinking', 'Team player'] },
      ]);
    });

    it('should filter out empty sections', () => {
      const emptySignals: TOnboardingSignals = {
        roleId: 'server',
        roleFamily: 'service',
        shineKeys: ['Friendly'],
        busyKeys: [],
        responsibilities: [],
      };

      const sections = buildPreviewSectionsFromSignals(emptySignals);

      expect(sections).toEqual([
        { title: 'How You Shine', items: ['Friendly'] },
      ]);
      
      expect(sections).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: 'Responsibilities' }),
          expect.objectContaining({ title: 'Highlights' }),
          expect.objectContaining({ title: 'Busy Shifts' }),
        ])
      );
    });
  });
});
