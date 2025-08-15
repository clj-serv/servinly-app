// Import supabase dynamically to prevent SSR issues
import type { OnboardingState } from './onboardingState';
import { ensureDevSession } from '@/lib/devAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

// Lazy supabase client getter to prevent SSR issues
async function getSupabase() {
  const { supabase } = await import('./supabaseClient');
  return supabase;
}

export interface UserExperience {
  id: string;
  user_id: string;
  role: string;
  org_name?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  traits: string[];
  scenario?: string;
  vibe?: string;
  highlight_text?: string;
  highlight_suggestions: string[];
  responsibilities: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Save onboarding state to database
 * This function takes your existing onboarding state and saves it
 */
export async function createUserExperience(
  userId: string,
  onboardingState: Partial<OnboardingState>
): Promise<UserExperience | null> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('user_experiences')
      .insert({
        user_id: userId,
        role: onboardingState.role || '',
        org_name: onboardingState.orgName,
        location: onboardingState.location,
        start_date: onboardingState.startDate,
        end_date: onboardingState.endDate,
        is_current: onboardingState.isCurrent || false,
        traits: onboardingState.traits || [],
        scenario: onboardingState.scenario,
        vibe: onboardingState.vibe,
        highlight_text: onboardingState.highlightText,
        highlight_suggestions: onboardingState.highlightSuggestions || [],
        responsibilities: onboardingState.responsibilities || [],
      })
      .select()
      .single();

    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error saving user experience:', error);
      }
      return null;
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error saving user experience:', error);
    }
    return null;
  }
}

/**
 * Load user experiences from database
 * Returns experiences in the exact format your profile page expects
 */
export async function loadUserExperiences(userId?: string): Promise<UserExperience[]> {
  try {
    // Supabase config guard - return empty array if not properly configured
    if (!isSupabaseConfigured()) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Supabase not configured; returning empty experiences');
      }
      return [];
    }

    const supabase = await getSupabase();
    // In dev, ensure session exists for RLS queries
    if (process.env.NODE_ENV !== 'production') {
      const devUserId = await ensureDevSession(supabase);
      if (devUserId && !userId) {
        userId = devUserId;
      }
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'final')
      .order('created_at', { ascending: false });

    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error loading user experiences:', error);
      }
      return [];
    }

    const experiences = (data || []).map(role => ({
      id: role.id,
      user_id: role.user_id,
      role: role.role_id,
      org_name: role.org_name,
      location: undefined, // Not available in user_roles
      start_date: role.start_ym,
      end_date: role.end_ym,
      is_current: !role.end_ym, // Current if no end date
      traits: [...(role.shine_keys || []), ...(role.busy_keys || [])],
      scenario: undefined, // Not directly available
      vibe: role.vibe_key,
      highlight_text: role.highlight_text,
      highlight_suggestions: [], // Not available in user_roles
      responsibilities: role.responsibilities || [],
      created_at: role.created_at,
      updated_at: role.updated_at
    }));

    // Dev-only RLS sanity log
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Profile experiences loaded:', {
        count: experiences.length,
        firstId: experiences[0]?.id || 'none',
        userId: userId
      });
    }

    return experiences;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error loading user experiences:', error);
    }
    return [];
  }
}

/**
 * Update existing user experience
 */
export async function updateUserExperience(
  experienceId: string,
  updates: Partial<UserExperience>
): Promise<UserExperience | null> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('user_experiences')
      .update(updates)
      .eq('id', experienceId)
      .select()
      .single();

    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error updating user experience:', error);
      }
      return null;
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating user experience:', error);
    }
    return null;
  }
}

/**
 * Delete user experience
 */
export async function deleteUserExperience(experienceId: string): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('user_experiences')
      .delete()
      .eq('id', experienceId);

    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error deleting user experience:', error);
      }
      return false;
    }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error deleting user experience:', error);
    }
    return false;
  }
}

/**
 * Save onboarding state to database as user experience
 * This function takes onboarding state and creates a user experience
 */
export async function saveOnboardingExperience(
  onboardingState: OnboardingState
): Promise<UserExperience | null> {
  try {
    const supabase = await getSupabase();
    // Get the current user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('No authenticated user found');
      }
      return null;
    }

    const { data, error } = await supabase
      .from('user_experiences')
      .insert({
        user_id: user.id,
        role: onboardingState.role || '',
        org_name: onboardingState.orgName,
        location: onboardingState.location,
        start_date: onboardingState.startDate,
        end_date: onboardingState.endDate,
        is_current: onboardingState.isCurrent || false,
        traits: onboardingState.traits || [],
        scenario: onboardingState.scenario,
        vibe: onboardingState.vibe,
        highlight_text: onboardingState.highlightText,
        highlight_suggestions: onboardingState.highlightSuggestions || [],
        responsibilities: onboardingState.responsibilities || [],
      })
      .select()
      .single();

    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error creating user experience:', error);
      }
      return null;
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error creating user experience:', error);
    }
    return null;
  }
}

/**
 * Convert database experience to onboarding state format
 * This allows seamless integration with your existing code
 */
export function experienceToOnboardingState(experience: UserExperience): Partial<OnboardingState> {
  return {
    role: experience.role,
    orgName: experience.org_name,
    location: experience.location,
    startDate: experience.start_date,
    endDate: experience.end_date,
    isCurrent: experience.is_current,
    traits: experience.traits as any, // Cast to TraitId[]
    scenario: experience.scenario as any, // Cast to ScenarioId
    vibe: experience.vibe,
    highlightText: experience.highlight_text,
    highlightSuggestions: experience.highlight_suggestions,
    responsibilities: experience.responsibilities,
  };
}
