export const useAuth = () => ({
  user: {
    id: 'mock-user-id',
    email: 'mock@example.com',
    email_confirmed_at: new Date().toISOString(),
  },
  profile: {
    first_name: 'Test',
    onboarding_completed: true,
  },
  sessionTimeRemaining: 999,
  loading: false,
  pendingConfirmationEmail: null,
  updateProfile: jest.fn().mockResolvedValue({ error: null }),
});
