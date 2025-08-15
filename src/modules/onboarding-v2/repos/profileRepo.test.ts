import { saveRoleDraft, finalizeRole, getCurrentUserId } from './profileRepo';
import type { TOnboardingSignals } from '@/contracts/onboarding';
import type { FinalizeResult } from './profileRepo';
import { getDevFakeUserId } from '@/lib/auth';

// Mock the supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// Mock the auth helpers
jest.mock('@/lib/auth', () => ({
  getSessionUserId: jest.fn(),
  getDevFakeUserId: jest.fn(),
}));

import { supabase } from '@/lib/supabaseClient';
import { getSessionUserId } from '@/lib/auth';

describe('profileRepo', () => {
  // Mock implementations
  const mockFrom = jest.fn();
  const mockUpsert = jest.fn();
  const mockInsert = jest.fn();
  const mockGetUser = supabase.auth.getUser as jest.MockedFunction<typeof supabase.auth.getUser>;
  const mockGetSessionUserId = getSessionUserId as jest.MockedFunction<typeof getSessionUserId>;
  const mockGetDevFakeUserId = getDevFakeUserId as jest.MockedFunction<typeof getDevFakeUserId>;

  // Test data
  const mockUserId = 'u-123';
  const mockSignals: TOnboardingSignals = {
    roleId: 'bartender',
    roleFamily: 'bar',
    shineKeys: ['multitasking', 'customer-service'],
    busyKeys: ['rush-hour', 'difficult-customers'],
    vibeKey: 'energetic',
    orgName: 'Test Restaurant',
    startDate: '2023-01',
    endDate: '2024-01',
    highlightText: 'Led team during busy nights',
    responsibilities: ['Mix drinks', 'Serve customers'],
  };

  // Helper to set environment variable
  const setFeatureFlag = (enabled: boolean) => {
    process.env.NEXT_PUBLIC_ONB_SUPABASE_SAVE = enabled ? 'true' : 'false';
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockGetUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    } as any);

    mockGetSessionUserId.mockResolvedValue(mockUserId);
    mockGetDevFakeUserId.mockReturnValue(null);

    (supabase.from as jest.Mock).mockReturnValue({
      upsert: mockUpsert,
      insert: mockInsert,
    });

    mockUpsert.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_ONB_SUPABASE_SAVE;
  });

  describe('saveRoleDraft', () => {
    describe('when feature flag is OFF', () => {
      beforeEach(() => {
        setFeatureFlag(false);
      });

      it('returns success without making database calls', async () => {
        const result = await saveRoleDraft(mockUserId, mockSignals);

        expect(result).toEqual({ ok: true });
        expect(supabase.from).not.toHaveBeenCalled();
        expect(mockUpsert).not.toHaveBeenCalled();
      });
    });

    describe('when feature flag is ON', () => {
      beforeEach(() => {
        setFeatureFlag(true);
      });

      it('inserts user_roles with draft status', async () => {
        const result = await saveRoleDraft(mockUserId, mockSignals);

        expect(result).toEqual({ ok: true });
        expect(supabase.from).toHaveBeenCalledWith('user_roles');
        expect(mockInsert).toHaveBeenCalledWith({
          user_id: mockUserId,
          role_id: 'bartender',
          role_family: 'bar',
          status: 'draft',
          shine_keys: ['multitasking', 'customer-service'],
          busy_keys: ['rush-hour', 'difficult-customers'],
          vibe_key: 'energetic',
          org_name: 'Test Restaurant',
          start_ym: '2023-01',
          end_ym: '2024-01',
          highlight_text: 'Led team during busy nights',
          responsibilities: ['Mix drinks', 'Serve customers'],
          created_at: expect.any(String),
          updated_at: expect.any(String),
        });
        expect(mockUpsert).not.toHaveBeenCalled();
      });

      it('handles database errors', async () => {
        mockInsert.mockResolvedValue({ error: { message: 'Database error' } });

        const result = await saveRoleDraft(mockUserId, mockSignals);

        expect(result).toEqual({ ok: false, error: 'Database error' });
      });

      it('handles unexpected errors', async () => {
        mockInsert.mockRejectedValue(new Error('Network error'));

        const result = await saveRoleDraft(mockUserId, mockSignals);

        expect(result).toEqual({ ok: false, error: 'Network error' });
      });
    });
  });

  describe('finalizeRole', () => {
    describe('when feature flag is OFF', () => {
      beforeEach(() => {
        setFeatureFlag(false);
      });

      it('returns success with mock ID without making database calls', async () => {
        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: true, id: 'mock-id-feature-disabled' });
        expect(supabase.from).not.toHaveBeenCalled();
        expect(mockInsert).not.toHaveBeenCalled();
        expect(mockUpsert).not.toHaveBeenCalled();
      });
    });

    describe('when feature flag is ON', () => {
      beforeEach(() => {
        setFeatureFlag(true);
      });

      it('inserts user_roles with final status and returns ID', async () => {
        const mockRoleId = 'test-role-id-123';
        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { id: mockRoleId }, 
          error: null 
        });
        const mockSelect = jest.fn().mockReturnValue({
          single: mockSingle
        });
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        });
        const mockUserRolesChain = { 
          insert: mockInsert
        };
        (supabase.from as jest.Mock).mockReturnValue(mockUserRolesChain);

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: true, id: mockRoleId });
        expect(supabase.from).toHaveBeenCalledWith('user_roles');
        expect(mockUserRolesChain.insert).toHaveBeenCalledWith({
          user_id: mockUserId,
          role_id: 'bartender',
          role_family: 'bar',
          status: 'final',
          shine_keys: ['multitasking', 'customer-service'],
          busy_keys: ['rush-hour', 'difficult-customers'],
          vibe_key: 'energetic',
          org_name: 'Test Restaurant',
          start_ym: '2023-01',
          end_ym: '2024-01',
          highlight_text: 'Led team during busy nights',
          responsibilities: ['Mix drinks', 'Serve customers'],
          created_at: expect.any(String),
          updated_at: expect.any(String),
        });
      });

      it('upserts user_traits when traits data exists', async () => {
        // Setup mock to return different values for different table calls
        const mockRoleId = 'test-role-id-123';
        const mockUserRolesSingle = jest.fn().mockResolvedValue({ 
          data: { id: mockRoleId }, 
          error: null 
        });
        const mockUserRolesSelect = jest.fn().mockReturnValue({
          single: mockUserRolesSingle
        });
        const mockUserRolesInsert = jest.fn().mockReturnValue({
          select: mockUserRolesSelect
        });
        const mockUserRolesChain = { insert: mockUserRolesInsert };
        const mockUserTraitsChain = { upsert: jest.fn().mockResolvedValue({ error: null }) };
        
        (supabase.from as jest.Mock).mockImplementation((table: string) => {
          if (table === 'user_roles') return mockUserRolesChain;
          if (table === 'user_traits') return mockUserTraitsChain;
          return {};
        });

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: true, id: mockRoleId });
        
        // Verify user_roles insert
        expect(supabase.from).toHaveBeenCalledWith('user_roles');
        expect(mockUserRolesChain.insert).toHaveBeenCalledWith({
          user_id: mockUserId,
          role_id: 'bartender',
          role_family: 'bar',
          status: 'final',
          shine_keys: ['multitasking', 'customer-service'],
          busy_keys: ['rush-hour', 'difficult-customers'],
          vibe_key: 'energetic',
          org_name: 'Test Restaurant',
          start_ym: '2023-01',
          end_ym: '2024-01',
          highlight_text: 'Led team during busy nights',
          responsibilities: ['Mix drinks', 'Serve customers'],
          created_at: expect.any(String),
          updated_at: expect.any(String),
        });
        
        // Verify user_traits upsert (should be called because we have traits data)
        expect(supabase.from).toHaveBeenCalledWith('user_traits');
        expect(mockUserTraitsChain.upsert).toHaveBeenCalledWith({
          user_id: mockUserId,
          shine_keys: ['multitasking', 'customer-service'],
          busy_keys: ['rush-hour', 'difficult-customers'],
          vibe_key: 'energetic',
          highlight_text: 'Led team during busy nights',
          updated_at: expect.any(String),
        }, {
          onConflict: 'user_id'
        });
      });

      it('does not upsert user_traits when no traits data exists', async () => {
        const emptySignals: TOnboardingSignals = {
          ...mockSignals,
          shineKeys: [],
          busyKeys: [],
          vibeKey: undefined,
          highlightText: undefined
        };
        
        const mockRoleId = 'test-role-id-123';
        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { id: mockRoleId }, 
          error: null 
        });
        const mockSelect = jest.fn().mockReturnValue({
          single: mockSingle
        });
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        });
        const mockUserRolesChain = { insert: mockInsert };
        (supabase.from as jest.Mock).mockReturnValue(mockUserRolesChain);

        const result = await finalizeRole(emptySignals);

        expect(result).toEqual({ ok: true, id: mockRoleId });
        expect(supabase.from).toHaveBeenCalledTimes(1); // Only user_roles call
        expect(supabase.from).toHaveBeenCalledWith('user_roles');
      });

      it('handles authentication errors', async () => {
        mockGetSessionUserId.mockResolvedValue(null);
        mockGetDevFakeUserId.mockReturnValue(null);

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: false, error: 'AUTH_REQUIRED' });
      });

      it('handles user_roles insert errors', async () => {
        const mockSingle = jest.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Insert failed' } 
        });
        const mockSelect = jest.fn().mockReturnValue({
          single: mockSingle
        });
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        });
        const mockUserRolesChain = { insert: mockInsert };
        (supabase.from as jest.Mock).mockReturnValue(mockUserRolesChain);

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: false, error: 'Insert failed' });
      });

      it('handles user_traits upsert errors', async () => {
        const mockRoleId = 'test-role-id-123';
        const mockUserRolesSingle = jest.fn().mockResolvedValue({ 
          data: { id: mockRoleId }, 
          error: null 
        });
        const mockUserRolesSelect = jest.fn().mockReturnValue({
          single: mockUserRolesSingle
        });
        const mockUserRolesInsert = jest.fn().mockReturnValue({
          select: mockUserRolesSelect
        });
        const mockUserRolesChain = { insert: mockUserRolesInsert };
        const mockUserTraitsChain = { upsert: jest.fn().mockResolvedValue({ error: { message: 'Upsert failed' } }) };
        
        (supabase.from as jest.Mock).mockImplementation((table: string) => {
          if (table === 'user_roles') return mockUserRolesChain;
          if (table === 'user_traits') return mockUserTraitsChain;
          return {};
        });

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: false, error: 'Upsert failed' });
      });

      it('handles unexpected errors', async () => {
        mockGetSessionUserId.mockRejectedValue(new Error('Network error'));

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: false, error: 'Network error' });
      });

      it('uses dev fake user ID when session is null in development', async () => {
        const originalNodeEnv = process.env.NODE_ENV;
        Object.defineProperty(process.env, 'NODE_ENV', {
          value: 'development',
          writable: true,
          configurable: true
        });
        const fakeUserId = 'fake-dev-user-123';
        
        mockGetSessionUserId.mockResolvedValue(null);
        mockGetDevFakeUserId.mockReturnValue(fakeUserId);
        
        const mockRoleId = 'test-role-id-123';
        const mockSingle = jest.fn().mockResolvedValue({ 
          data: { id: mockRoleId }, 
          error: null 
        });
        const mockSelect = jest.fn().mockReturnValue({
          single: mockSingle
        });
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        });
        const mockUserRolesChain = { insert: mockInsert };
        (supabase.from as jest.Mock).mockReturnValue(mockUserRolesChain);

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: true, id: mockRoleId });
        expect(mockUserRolesChain.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            user_id: fakeUserId,
          })
        );
        
        Object.defineProperty(process.env, 'NODE_ENV', {
          value: originalNodeEnv,
          writable: true,
          configurable: true
        });
      });

      it('returns AUTH_REQUIRED when no session and no dev fake user', async () => {
        mockGetSessionUserId.mockResolvedValue(null);
        mockGetDevFakeUserId.mockReturnValue(null);

        const result = await finalizeRole(mockSignals);

        expect(result).toEqual({ ok: false, error: 'AUTH_REQUIRED' });
      });
    });
  });

  describe('getCurrentUserId', () => {
    describe('when feature flag is OFF', () => {
      beforeEach(() => {
        setFeatureFlag(false);
      });

      it('returns null without making auth calls', async () => {
        const result = await getCurrentUserId();

        expect(result).toBeNull();
        expect(mockGetUser).not.toHaveBeenCalled();
      });
    });

    describe('when feature flag is ON', () => {
      beforeEach(() => {
        setFeatureFlag(true);
      });

      it('returns user ID when authenticated', async () => {
        const result = await getCurrentUserId();

        expect(result).toBe(mockUserId);
        expect(mockGetUser).toHaveBeenCalled();
      });

      it('returns null when not authenticated', async () => {
        mockGetUser.mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' },
        } as any);

        const result = await getCurrentUserId();

        expect(result).toBeNull();
      });

      it('returns null on auth errors', async () => {
        mockGetUser.mockRejectedValue(new Error('Auth error'));

        const result = await getCurrentUserId();

        expect(result).toBeNull();
      });
    });
  });
});
