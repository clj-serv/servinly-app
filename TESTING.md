# Testing Environment Setup

This document outlines the testing setup for the Servinly application.

## Overview

The testing environment is configured with:
- **Jest** as the test runner
- **React Testing Library** for component testing
- **TypeScript** support
- **Next.js** integration
- **Supabase** mocking for auth and database operations

## Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci

# Run only onboarding tests
npm run test:onboarding
```

## File Structure

```
src/
├── __tests__/
│   ├── contracts/
│   │   └── onboarding.test.ts
│   └── utils/
│       └── test-utils.tsx
├── modules/onboarding-v2/steps/__tests__/
│   └── RoleSelect.test.tsx
└── components/pages/__tests__/
    ├── Dashboard.test.tsx
    ├── LandingPage.test.tsx
    ├── ProfilePage.test.tsx
    └── SignUpPage.test.tsx
```

## Configuration Files

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- Supports TypeScript and JSX
- Handles CSS and static file imports
- Transforms ES modules from dependencies
- Includes coverage reporting

### Test Setup (`jest.setup.ts`)
- Imports `@testing-library/jest-dom` matchers
- Mocks Next.js router and navigation
- Mocks Supabase client and auth helpers
- Mocks localStorage
- Sets up environment variables

## Writing Tests

### Basic Component Test
```typescript
import { render, screen } from '@/__tests__/utils/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Testing Onboarding Components
```typescript
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import RoleSelect from '../RoleSelect';

// Mock the role engine
jest.mock('@/role-engine/registry', () => ({
  getAvailableRoles: () => [
    { id: 'bartender', label: 'Bartender', family: 'bar' },
  ],
}));

describe('RoleSelect Component', () => {
  const mockRouter = {
    signals: { roleId: '', roleFamily: '', /* ... */ },
    updateSignals: jest.fn(),
    goNext: jest.fn(),
    // ... other router methods
  };

  it('updates signals when role is selected', () => {
    render(<RoleSelect router={mockRouter} user={{ firstName: 'John' }} />);
    
    const dropdownButton = screen.getByText('Select your role...');
    fireEvent.click(dropdownButton);
    
    const bartenderOption = screen.getByText('Bartender');
    fireEvent.click(bartenderOption);
    
    expect(mockRouter.updateSignals).toHaveBeenCalledWith({
      roleId: 'bartender',
      roleFamily: 'bar',
    });
  });
});
```

## Mocking Guidelines

### Supabase
Supabase client is automatically mocked in `jest.setup.ts`. Auth methods return proper response structures:

```typescript
// Auth methods return:
{
  data: { user: null },
  error: null
}

// Database methods return:
{
  data: null,
  error: null
}
```

### Next.js Router
Router hooks are mocked to return jest functions:

```typescript
const mockRouter = useRouter(); // Returns mocked functions
mockRouter.push('/some-path'); // Jest mock function
```

### localStorage
localStorage is mocked globally and provides standard methods as jest functions.

## Coverage

Coverage reports are generated in the `coverage/` directory and include:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

View coverage reports by opening `coverage/lcov-report/index.html` in your browser.

## CI Integration

The GitHub Actions workflow (`.github/workflows/test.yml`) runs:
1. Type checking with `npm run type:onboarding`
2. All tests with coverage via `npm run test:ci`
3. Coverage upload to Codecov

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Make it clear what each test is verifying
3. **Mock External Dependencies**: Keep tests isolated and fast
4. **Test User Interactions**: Use `fireEvent` or `userEvent` for realistic interactions
5. **Async Testing**: Use `waitFor` for asynchronous operations
6. **Clean Up**: Use `beforeEach` and `afterEach` to reset mocks and state

## Troubleshooting

### ES Module Issues
If you encounter ES module transformation errors, add the problematic package to the `transformIgnorePatterns` in `jest.config.js`.

### Mock Issues
Ensure mocks are defined before the component imports. Use `jest.mock()` at the top of test files for module-level mocks.

### Type Errors
Make sure TypeScript types are properly defined for mocked functions and objects to avoid type checking errors in tests.
