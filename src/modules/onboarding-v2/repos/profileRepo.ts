import type { TOnboardingSignals } from "@/contracts/onboarding";
import { supabase } from "@/lib/supabaseClient";
import { getSessionUserId, allowFakeDevUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

// Discriminated union result types
export type SaveResult = 
  | { ok: true }
  | { ok: false; error: string };

export type FinalizeResult = 
  | { ok: true; id: string }
  | { ok: false; error: string };

// Feature flag check - when disabled, all operations are no-ops
function isSupabaseSaveEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ONB_SUPABASE_SAVE === 'true';
}

/**
 * Save role draft to Supabase - always inserts new public.user_roles with status='draft'
 * Creates distinct draft rows, never overwrites existing ones
 * Gated by NEXT_PUBLIC_ONB_SUPABASE_SAVE feature flag
 */
export async function saveRoleDraft(
  userId: string, 
  signals: TOnboardingSignals
): Promise<SaveResult> {
  // Feature flag gate - return success no-op when disabled
  if (!isSupabaseSaveEnabled()) {
    return { ok: true };
  }

  // Supabase config guard - fail fast if not properly configured
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "production") console.debug('Supabase not configured; skipping save');
    return { ok: false, error: 'SUPABASE_NOT_CONFIGURED' } as const;
  }

  try {
    // Resolve userId: provided userId -> session userId -> AUTH_REQUIRED (no fake user support)
    const finalUserId = userId ?? await getSessionUserId();
    
    if (!finalUserId && !allowFakeDevUser()) {
      return { ok: false, error: 'AUTH_REQUIRED' };
    }

    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: finalUserId,
        role_id: signals.roleId,
        role_family: signals.roleFamily,
        status: 'draft',
        shine_keys: signals.shineKeys,
        busy_keys: signals.busyKeys,
        vibe_key: signals.vibeKey,
        org_name: signals.orgName,
        start_ym: signals.startDate,
        end_ym: signals.endDate,
        highlight_text: signals.highlightText,
        responsibilities: signals.responsibilities,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    return { 
      ok: false, 
      error: err instanceof Error ? err.message : 'Unknown error saving role draft'
    };
  }
}

/**
 * Finalize role - inserts public.user_roles with status='final'
 * Also upserts public.user_traits if traits/summary exist
 * Returns the inserted row ID for immediate reflection
 * Gated by NEXT_PUBLIC_ONB_SUPABASE_SAVE feature flag
 */
export async function finalizeRole(signals: TOnboardingSignals): Promise<FinalizeResult> {
  // Feature flag gate - return success no-op when disabled
  if (!isSupabaseSaveEnabled()) {
    return { ok: true, id: 'mock-id-feature-disabled' };
  }

  // Supabase config guard - fail fast if not properly configured
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "production") console.debug('Supabase not configured; skipping finalize');
    return { ok: false, error: 'SUPABASE_NOT_CONFIGURED' } as const;
  }

  try {
    // Resolve userId: session userId -> AUTH_REQUIRED (no fake user support)
    const userId = await getSessionUserId();
    
    if (!userId && !allowFakeDevUser()) {
      return { ok: false, error: 'AUTH_REQUIRED' };
    }

    // Insert final role record and return the ID
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: signals.roleId,
        role_family: signals.roleFamily,
        status: 'final',
        shine_keys: signals.shineKeys,
        busy_keys: signals.busyKeys,
        vibe_key: signals.vibeKey,
        org_name: signals.orgName,
        start_ym: signals.startDate,
        end_ym: signals.endDate,
        highlight_text: signals.highlightText,
        responsibilities: signals.responsibilities,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (roleError) {
      return { ok: false, error: roleError.message };
    }

    if (!roleData?.id) {
      return { ok: false, error: 'Failed to retrieve inserted role ID' };
    }

    // If we have traits/summary data, upsert user_traits
    const hasTraitsData = signals.shineKeys.length > 0 || 
                         signals.busyKeys.length > 0 || 
                         signals.vibeKey ||
                         signals.highlightText;

    if (hasTraitsData) {
      const { error: traitsError } = await supabase
        .from('user_traits')
        .upsert({
          user_id: userId,
          shine_keys: signals.shineKeys,
          busy_keys: signals.busyKeys,
          vibe_key: signals.vibeKey,
          highlight_text: signals.highlightText,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (traitsError) {
        return { ok: false, error: traitsError.message };
      }
    }

    return { ok: true, id: roleData.id };
  } catch (err) {
    return { 
      ok: false, 
      error: err instanceof Error ? err.message : 'Unknown error finalizing role'
    };
  }
}

/**
 * Helper function to get current authenticated user ID
 * Returns null if not authenticated or feature flag is disabled
 */
export async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseSaveEnabled()) {
    return null;
  }

  try {
    const { data: userData, error } = await supabase.auth.getUser();
    
    if (error || !userData.user) {
      return null;
    }

    return userData.user.id;
  } catch {
    return null;
  }
}
