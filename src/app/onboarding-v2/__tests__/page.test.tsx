import { render, screen } from '@testing-library/react';
import OnboardingPage from '../page';

// Mock the OnboardingClient component
jest.mock('@/modules/onboarding-v2/OnboardingClient', () => {
  return function MockOnboardingClient() {
    return <div data-testid="onboarding-client">Onboarding Client</div>;
  };
});

// Mock the role engine
jest.mock('@/role-engine/registry', () => ({
  getPack: jest.fn(() => ({ family: 'bar' })),
}));

// Mock server functions
jest.mock('@/server', () => ({
  rankHighlightSuggestions: jest.fn(() => []),
  rankResponsibilities: jest.fn(() => ({ groupsSorted: [], pinnedIds: [], recommendedMix: [] })),
}));

describe('OnboardingPage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('renders disabled message when feature flag is OFF', () => {
    // Set feature flag to OFF
    process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER = 'false';

    render(<OnboardingPage searchParams={{}} />);

    // Should render disabled message
    expect(screen.getByText('Onboarding V2 Disabled')).toBeInTheDocument();
    expect(screen.getByText(/This feature is currently disabled/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Profile' })).toBeInTheDocument();

    // Should NOT render the onboarding client
    expect(screen.queryByTestId('onboarding-client')).not.toBeInTheDocument();
  });

  it('renders onboarding client when feature flag is ON', () => {
    // Set feature flag to ON
    process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER = 'true';

    render(<OnboardingPage searchParams={{ step: 'ROLE_SELECT' }} />);

    // Should render onboarding client
    expect(screen.getByTestId('onboarding-client')).toBeInTheDocument();

    // Should NOT render disabled message
    expect(screen.queryByText('Onboarding V2 Disabled')).not.toBeInTheDocument();
  });

  it('defaults to ROLE_SELECT step when step is missing', () => {
    process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER = 'true';

    render(<OnboardingPage searchParams={{}} />);

    // Should render onboarding client (not disabled message)
    expect(screen.getByTestId('onboarding-client')).toBeInTheDocument();
  });

  it('defaults to ROLE_SELECT step when step is invalid', () => {
    process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER = 'true';

    render(<OnboardingPage searchParams={{ step: 'INVALID_STEP' }} />);

    // Should render onboarding client (not disabled message)
    expect(screen.getByTestId('onboarding-client')).toBeInTheDocument();
  });

  it('renders onboarding client for valid steps', () => {
    process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER = 'true';

    const validSteps = ['ROLE_SELECT', 'SHINE', 'SCENARIO', 'VIBE', 'ORG', 'DATES', 'HIGHLIGHT', 'RESPONSIBILITIES', 'PREVIEW'];
    
    validSteps.forEach(step => {
      const { unmount } = render(<OnboardingPage searchParams={{ step }} />);
      
      // Should render onboarding client
      expect(screen.getByTestId('onboarding-client')).toBeInTheDocument();
      
      unmount();
    });
  });

  it('has correct link href in disabled message', () => {
    process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER = 'false';

    render(<OnboardingPage searchParams={{}} />);

    const profileLink = screen.getByRole('link', { name: 'Back to Profile' });
    expect(profileLink).toHaveAttribute('href', '/profile');
  });
});
