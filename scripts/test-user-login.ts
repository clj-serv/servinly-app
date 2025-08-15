// scripts/test-user-login.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const email = process.env.TEST_EMAIL || process.env.NEXT_PUBLIC_DEV_EMAIL || 'claudiolopesjr@hotmail.com';
const password = process.env.TEST_PASSWORD || process.env.NEXT_PUBLIC_DEV_PASSWORD || '123Pim25';

if (!url || !anon) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function main() {
  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('❌ Login failed:', error.message);
    process.exit(1);
  }
  console.log('✅ Login succeeded for', data.user?.email, 'User ID:', data.user?.id);
}
main().catch((e) => { console.error(e); process.exit(1); });
