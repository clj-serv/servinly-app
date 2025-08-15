-- Migration: Onboarding V2 Tables (user_roles + user_traits)
-- Created: 2025-08-15T02:28:35Z
-- Purpose: Support Onboarding V2 Supabase persistence with RLS
-- Deploy: Staging-first via supabase db push --db-url "$SUPABASE_STAGING_DB_URL"

-- =============================================================================
-- TABLE: public.user_roles
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Role identification
  role_id TEXT NOT NULL,
  role_family TEXT NOT NULL,
  
  -- Organization and timeline
  org_name TEXT,
  start_ym TEXT, -- YYYY-MM format
  end_ym TEXT,   -- YYYY-MM format
  
  -- Career content
  highlight_text TEXT,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  
  -- Personality signals
  shine_keys JSONB DEFAULT '[]'::jsonb,
  busy_keys JSONB DEFAULT '[]'::jsonb,
  vibe_key TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TABLE: public.user_traits
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_traits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Trait data
  traits JSONB DEFAULT '{}'::jsonb,
  summary TEXT,
  consent_version TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- user_roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_status ON public.user_roles(status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on both tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_traits ENABLE ROW LEVEL SECURITY;

-- user_roles policies (self-scope)
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
CREATE POLICY "user_roles_select_policy" ON public.user_roles
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;
CREATE POLICY "user_roles_insert_policy" ON public.user_roles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_roles_update_policy" ON public.user_roles;
CREATE POLICY "user_roles_update_policy" ON public.user_roles
  FOR UPDATE USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_roles_delete_policy" ON public.user_roles;
CREATE POLICY "user_roles_delete_policy" ON public.user_roles
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- user_traits policies (self-scope)
DROP POLICY IF EXISTS "user_traits_select_policy" ON public.user_traits;
CREATE POLICY "user_traits_select_policy" ON public.user_traits
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_traits_insert_policy" ON public.user_traits;
CREATE POLICY "user_traits_insert_policy" ON public.user_traits
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_traits_update_policy" ON public.user_traits;
CREATE POLICY "user_traits_update_policy" ON public.user_traits
  FOR UPDATE USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "user_traits_delete_policy" ON public.user_traits;
CREATE POLICY "user_traits_delete_policy" ON public.user_traits
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- =============================================================================
-- TRIGGERS: Auto-update timestamps
-- =============================================================================

-- Create or replace the trigger function (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- user_roles trigger
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at 
  BEFORE UPDATE ON public.user_roles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- user_traits trigger  
DROP TRIGGER IF EXISTS update_user_traits_updated_at ON public.user_traits;
CREATE TRIGGER update_user_traits_updated_at 
  BEFORE UPDATE ON public.user_traits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- STAGING HARDENING: Security lockdown for anonymous access
-- =============================================================================

/*
  STAGING HARDENING BLOCK
  
  These tables contain sensitive user data and should have zero anonymous access.
  RLS policies handle authenticated user access, but we explicitly revoke any
  potential anonymous permissions as defense-in-depth.
  
  Run in staging first to verify no application breakage.
*/

-- Revoke all anonymous access to user_roles
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.user_roles FROM public;

-- Revoke all anonymous access to user_traits  
REVOKE ALL ON public.user_traits FROM anon;
REVOKE ALL ON public.user_traits FROM public;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Verify tables exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles' AND table_schema = 'public') THEN
    RAISE EXCEPTION 'Migration failed: user_roles table not created';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_traits' AND table_schema = 'public') THEN
    RAISE EXCEPTION 'Migration failed: user_traits table not created';
  END IF;
  
  RAISE NOTICE 'Migration 20250815022835_onboarding_v2_tables.sql completed successfully';
END $$;
