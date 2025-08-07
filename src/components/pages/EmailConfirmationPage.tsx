'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/components/context/AuthContext';

const EmailConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (token && type === 'signup') {
        const email = searchParams.get('email');
        const { data, error } = await supabase.auth.verifyOtp({
          email: email ?? '',
          token,
          type: 'email',
        });

        if (!error) {
          console.log('Email verified:', data);
          router.push('/dashboard'); // redirect after successful verification
        } else {
          console.error('Verification error:', error);
          router.push('/signup'); // redirect if something goes wrong
        }
      } else {
        router.push('/signup'); // fallback redirect
      }
    };

    confirmEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
        <p className="text-gray-600">Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
