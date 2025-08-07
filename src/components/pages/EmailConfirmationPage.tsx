// src/components/pages/EmailConfirmationPage.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailConfirmationPageProps {
  email: string;
  setCurrentPage: (page: string) => void;
}

export const EmailConfirmationPage: React.FC<EmailConfirmationPageProps> = ({ email, setCurrentPage }) => {
  const { confirmEmail, resendConfirmation, loading } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    const { error } = await confirmEmail(email, verificationCode);
    if (error) {
      setError(error.message || 'Invalid verification code. Please try again.');
    } else {
      setSuccess(true);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setError('');
    const { error } = await resendConfirmation(email);
    if (error) {
      setError(error.message || 'Failed to resend confirmation email. Please try again.');
    } else {
      setResendCount(prev => prev + 1);
      setResendCooldown(60);
    }
  };

  const formatCode = (code: string): string => {
    if (code.length <= 3) return code;
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now access your Servinly account.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-4">
            We&apos;ve sent a 6-digit verification code to:
          </p>
          <p className="font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
            {email}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleVerificationSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="000-000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-wider"
              value={formatCode(verificationCode)}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={7}
              autoComplete="one-time-code"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code from your email
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the email?</p>
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || loading}
            className="text-blue-600 hover:underline text-sm font-medium disabled:text-gray-400 disabled:no-underline"
          >
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s` 
              : resendCount > 0 
                ? 'Resend Code Again' 
                : 'Resend Code'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Need to use a different email address?{' '}
            <button 
              onClick={() => setCurrentPage('signup')}
              className="text-blue-600 hover:underline"
            >
              Sign up again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};