'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'worker' | 'employer';
  current_position?: string;
  location?: string;
  skills: string[];
  phone?: string;
  bio?: string;
  onboarding_completed: boolean;
  profile_completion: number;
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUp: (userData: SignUpData) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: any; error: any }>;
  retryConnection: () => void;
  sessionTimeRemaining: number | null;
  resendConfirmation: (email: string) => Promise<{ data: any; error: any }>;
  confirmEmail: (email: string, token: string) => Promise<{ data: any; error: any }>;
  pendingConfirmationEmail: string | null;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'worker' | 'employer';
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // ✅ important for post-verification
  },
});

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);

  const signUp = async (userData: SignUpData) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          userType: userData.userType,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_type: userData.userType,
        onboarding_completed: false,
        profile_completion: 10,
        skills: [],
      });
    }

    setPendingConfirmationEmail(userData.email);
    setLoading(false);
    return { data, error };
  };

  const loadProfile = async (id: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (!error) setProfile(data);
  };

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      setUser(data.session.user);
      await loadProfile(data.session.user.id);
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data.session && rememberMe) {
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('servinly_session_expiry', expiry.toString());
    }
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('servinly_session_expiry');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: 'No user found' };
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (!error) setProfile({ ...profile!, ...updates });
    return { data, error };
  };

  const resendConfirmation = async (email: string) => {
    return await supabase.auth.resend({ type: 'signup', email });
  };

  const confirmEmail = async (email: string, token: string) => {
    return await supabase.auth.verifyOtp({ email, token, type: 'email' });
  };

  const retryConnection = () => checkSession();

  useEffect(() => {
    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        updateProfile,
        retryConnection,
        sessionTimeRemaining,
        resendConfirmation,
        confirmEmail,
        pendingConfirmationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
