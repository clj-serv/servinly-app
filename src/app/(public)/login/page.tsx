'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setError(error.message);

    // After login, go into Onboarding V2 flow
    router.push('/onboarding-v2?step=ROLE_SELECT');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            type="password"
            placeholder="Password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 bg-blue-600 text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          <a className="underline" href="/signup">Need an account? Sign up</a>
        </div>
      </div>
    </div>
  );
}
