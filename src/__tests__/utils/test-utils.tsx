import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { TOnboardingSignals } from '@/contracts/onboarding';

// Mock onboarding context
const mockOnboardingSignals: TOnboardingSignals = {
  roleId: '',
  roleFamily: '',
  shineKeys: [],
  busyKeys: [],
  vibeKey: undefined,
  orgName: undefined,
  startDate: undefined,
  endDate: undefined,
  highlightText: undefined,
  responsibilities: [],
};

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data factories
export const createMockOnboardingSignals = (
  overrides: Partial<TOnboardingSignals> = {}
): TOnboardingSignals => ({
  ...mockOnboardingSignals,
  ...overrides,
});

// Common test utilities
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

// Test to prevent Jest from complaining about no tests
describe('Test Utils', () => {
  it('should export test utilities', () => {
    expect(createMockOnboardingSignals).toBeDefined();
    expect(mockLocalStorage).toBeDefined();
    expect(mockRouter).toBeDefined();
  });
});
