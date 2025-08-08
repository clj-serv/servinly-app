'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Status = 'idle' | 'verifying' | 'success' | 'error' | 'missing';

export default function EmailConfirmationPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const hash = new URLSearchParams(url.hash.replace(/^#/, ''));

      const typeParam = (params.get('type') || hash.get('type')) as any;
      const tokenHash = params.get('token_hash') || hash.get('token_hash');

      if (!typeParam || !tokenHash) {
        setStatus('missing');
        setMessage('Missing parameters in the confirmation link.');
        return;
      }

      setStatus('verifying');
      supabase.auth
        .verifyOtp({ type: typeParam, token_hash: tokenHash })
        .then(({ error }) => {
          if (error) {
            setStatus('error');
            setMessage(error.message);
          } else {
            setStatus('success');
            setMessage('Your email has been confirmed. You can close this tab.');
          }
        });
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message ?? 'Unexpected error');
    }
  }, []);

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Email confirmation</h1>
      {status === 'idle' && <p>Waiting…</p>}
      {status === 'verifying' && <p>Verifying your link…</p>}
      {status === 'success' && (
        <div className="space-y-3">
          <p className="text-green-600">{message}</p>
          <Link className="underline" href="/">Go to home</Link>
        </div>
      )}
      {status === 'missing' && (
        <div className="space-y-3">
          <p className="text-amber-600">{message}</p>
          <Link className="underline" href="/">Go to home</Link>
        </div>
      )}
      {status === 'error' && (
        <div className="space-y-3">
          <p className="text-red-600">There was a problem confirming your email.</p>
          {message && <pre className="text-sm opacity-75">{message}</pre>}
        </div>
      )}
    </main>
  );
}
