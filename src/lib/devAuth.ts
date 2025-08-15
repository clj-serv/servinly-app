import { createClient } from '@supabase/supabase-js';

export async function ensureDevSession(): Promise<string | null> {
  if (process.env.NODE_ENV === 'production') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.NEXT_PUBLIC_DEV_EMAIL;
  const password = process.env.NEXT_PUBLIC_DEV_PASSWORD;

  if (!url || !anon) {
    console.debug('dev auth: missing supabase url/key, skipping');
    return null;
  }
  if (!email || !password) {
    console.debug('dev auth: missing dev email/password, skipping');
    return null;
  }

  const supabase = createClient(url, anon);
  const sess = await supabase.auth.getSession();
  if (sess.data.session?.user?.id) {
    console.debug('dev auth: existing session', sess.data.session.user.id);
    return sess.data.session.user.id;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.debug('dev auth: sign-in error', error.message);
    return null;
  }
  console.debug('dev auth: signed in', data.user?.id);
  return data.user?.id ?? null;
}
