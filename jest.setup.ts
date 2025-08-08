// jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock Supabase client in tests to prevent act() warnings and network calls
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user', email: 'test@example.com' } } } }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
    },
  }),
}));
