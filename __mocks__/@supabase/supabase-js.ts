// __mocks__/@supabase/supabase-js.ts
export const createClient = () => ({
  auth: {
    // Mock onAuthStateChange to return a fake subscription object
    onAuthStateChange: jest.fn((_callback) => ({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    })),

    // Mock getSession to return a null session or fake session if needed
    getSession: jest.fn().mockResolvedValue({
      data: {
        session: null,
      },
    }),
  },
});
