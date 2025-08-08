'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNote('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setNote(error.message);
    else setNote('Check your email to confirm your account.');
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border w-full p-2 rounded" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input className="border w-full p-2 rounded" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button className="px-4 py-2 rounded bg-black text-white">Sign up</button>
      </form>
      {note && <p className="mt-3 text-sm opacity-80">{note}</p>}
    </main>
  );
}
