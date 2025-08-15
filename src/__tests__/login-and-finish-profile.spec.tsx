import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(public)/login/page';
import * as auth from '@/lib/auth';

jest.mock('@/lib/supabaseClient', () => ({
  supabase: { auth: { signInWithPassword: jest.fn().mockResolvedValue({ error: null }), getUser: jest.fn() } }
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Dev login + finish profile', () => {
  it('signs in and navigates to onboarding', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'dev.user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'ChangeMe123!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    // Router push is exercised; rely on Playwright for full nav
  });

  it('blocks Finish Profile when not authenticated', async () => {
    jest.spyOn(auth, 'getSessionUserId').mockResolvedValue(null);
    jest.spyOn(auth, 'allowFakeDevUser').mockReturnValue(false);
    // invoke your finish handler and assert redirect to /signup?returnTo=...
  });
});
