import { supabase } from './supabaseClient';

export async function getSessionUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const allowFakeDevUser = () =>
  process.env.NEXT_PUBLIC_ALLOW_FAKE_USER === '1';
