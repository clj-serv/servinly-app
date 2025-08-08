'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Profile = {
  id: string;
  email: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('id,email,first_name,last_name')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data ?? null);
    })();
  }, [supabase]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      {!profile ? <p>Loading…</p> : (
        <pre className="text-sm bg-gray-50 p-3 rounded border">{JSON.stringify(profile, null, 2)}</pre>
      )}
    </main>
  );
}
