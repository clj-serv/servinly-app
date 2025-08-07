// src/__mocks__/useAuth.ts
export const useAuth = () => ({
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    email_confirmed_at: '2023-01-01T00:00:00.000Z',
  },
  profile: {
    first_name: 'Test',
    skills: ['Customer Service'],
    onboarding_completed: true,
  },
  loading: false,
  pendingConfirmationEmail: null,
  updateProfile: jest.fn().mockResolvedValue({ error: null }),
});
