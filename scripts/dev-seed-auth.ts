/* eslint-disable no-console */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const email = process.env.NEXT_PUBLIC_DEV_EMAIL || 'claudiolopesjr@hotmail.com';
const password = process.env.NEXT_PUBLIC_DEV_PASSWORD || 'dev-password';

// Fixed UID you provided
const FIXED_UID = 'c2f75966-e9e2-47b8-a354-d63d2d1d7ca0';

function failFast() {
  const missing: string[] = [];
  if (!url || url.includes('<your-ref>')) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('<anon_key>')) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!serviceKey || serviceKey.includes('<service_role_key>')) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (missing.length) {
    console.error(JSON.stringify({ ok:false, error:'SUPABASE_NOT_CONFIGURED', missing }, null, 2));
    process.exit(1);
  }
}

async function main() {
  failFast();

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // 1) Try to fetch existing users with this email
  const { data: list, error: listErr } = await admin.auth.admin.listUsers();
  if (listErr) {
    console.error(JSON.stringify({ ok:false, error:String(listErr) }, null, 2));
    process.exit(1);
  }

  const existingByEmail = list.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  const existingById    = list.users.find(u => u.id === FIXED_UID);

  // 2) If a user with different id already exists for this email, reuse it (safer than forcing id change)
  const finalId = existingByEmail?.id || existingById?.id || FIXED_UID;

  if (!existingByEmail && !existingById) {
    // Create user (admin API)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { devSeed: true },
      // NOTE: Supabase may ignore a manual id; we accept the returned id
    });

    if (createErr) {
      console.error(JSON.stringify({ ok:false, error:String(createErr) }, null, 2));
      process.exit(1);
    }

    // 3) Upsert the public.users profile row if your app expects it
    const db = admin; // reuse client
    const userId = created.user?.id || finalId;

    const { error: upsertErr } = await db
      .from('users') // <-- adjust if your profile table is named differently
      .upsert({
        id: userId,
        email,
        user_type: 'worker',
        onboarding_completed: false,
        profile_completion: 10,
      }, { onConflict: 'id' });

    if (upsertErr) {
      console.error(JSON.stringify({ ok:false, error:'PROFILE_UPSERT_FAILED', details:String(upsertErr) }, null, 2));
      process.exit(1);
    }

    console.log(JSON.stringify({ ok:true, created:true, id: userId, email }, null, 2));
    process.exit(0);
  } else {
    // Ensure profile row exists
    const db = admin;
    const userId = finalId;

    const { error: upsertErr } = await db
      .from('users') // <-- adjust if needed
      .upsert({
        id: userId,
        email,
        user_type: 'worker',
      }, { onConflict: 'id' });

    if (upsertErr) {
      console.error(JSON.stringify({ ok:false, error:'PROFILE_UPSERT_FAILED', details:String(upsertErr) }, null, 2));
      process.exit(1);
    }

    console.log(JSON.stringify({ ok:true, created:false, id: userId, email }, null, 2));
    process.exit(0);
  }
}

main().catch(e => {
  console.error(JSON.stringify({ ok:false, error:String(e) }, null, 2));
  process.exit(1);
});
