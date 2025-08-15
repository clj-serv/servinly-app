import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthContext, AuthContextType } from '@/components/context/AuthContext';

export const makeMockAuth = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
  user: { id: 'test-user', email: 'test@example.com' },
  profile: { first_name: 'Test' } as any,
  loading: false,
  signIn: jest.fn(),
  signOut: jest.fn(),
  ...overrides,
});

export function renderWithAuth(
  ui: React.ReactElement,
  { auth = makeMockAuth(), ...options }: { auth?: AuthContextType } & RenderOptions = {}
) {
  const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}
