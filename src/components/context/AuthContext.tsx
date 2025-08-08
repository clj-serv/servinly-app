import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export type AuthContextType = {
  user: { id: string; email?: string } | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined); // <-- NAMED EXPORT

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();
  const [state, setState] = useState<Omit<AuthContextType, 'signIn' | 'signOut'>>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      const user = data.session?.user ? { id: data.session.user.id, email: data.session.user.email ?? undefined } : null;
      setState(s => ({ ...s, user, loading: false }));
      // optionally load profile here...
    })();
    return () => { alive = false; };
  }, [supabase]);

  const signIn = async () => { /* noop for tests or real impl */ };
  const signOut = async () => { /* noop for tests or real impl */ };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}