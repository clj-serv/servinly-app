export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function envOrThrow() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error('MISSING_SUPABASE_ENV');
  if (process.env.NODE_ENV === 'production') throw new Error('PROD_BLOCKED');
  return { url, service };
}

export async function POST(req: NextRequest) {
  try {
    const { url, service } = envOrThrow();
    const body = await req.json().catch(() => ({}));
    const email = (body?.email ?? process.env.NEXT_PUBLIC_DEV_EMAIL)?.trim();
    const password = (body?.password ?? process.env.NEXT_PUBLIC_DEV_PASSWORD)?.trim();
    if (!email || !password) {
      return NextResponse.json({ ok:false, error:'BAD_REQUEST', details:'email/password required' }, { status:400 });
    }

    const admin = createClient(url, service, {
      auth: { autoRefreshToken:false, persistSession:false }
    });

    // Ensure user exists (idempotent by email)
    const { data: list, error: listErr } = await admin.auth.admin.listUsers();
    if (listErr) return NextResponse.json({ ok:false, error:listErr.message }, { status:500 });

    const existing = list?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!existing) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      if (createErr) return NextResponse.json({ ok:false, error:createErr.message }, { status:500 });
      return NextResponse.json({ ok:true, uid: created.user?.id, created:true });
    }

    // Optionally set a password to match local .env (safe in dev)
    await admin.auth.admin.updateUserById(existing.id, { password });

    return NextResponse.json({ ok:true, uid: existing.id, created:false });
  } catch (e:any) {
    if (e?.message === 'PROD_BLOCKED') return new NextResponse('Not Found', { status:404 });
    if (e?.message === 'MISSING_SUPABASE_ENV') {
      return NextResponse.json({ ok:false, error:'SUPABASE_NOT_CONFIGURED' }, { status:400 });
    }
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
