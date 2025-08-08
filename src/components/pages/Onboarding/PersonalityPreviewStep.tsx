'use client';

import React from 'react';
import { useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import { usePersonalityAssessment } from '@/hooks/usePersonalityAssessment';
import { EditableSummary } from '@/components/EditableSummary';

export const PersonalityPreviewStep = () => {
  const { formData } = useOnboardingForm();
  const user = useUser(); // ✅ Correct destructure
  const {
    result,
    loading,
    error,
    generateTraits,
    saveToSupabase,
  } = usePersonalityAssessment();

  useEffect(() => {
    generateTraits(formData);
  }, []);

  const handleSave = async (newSummary: string) => {
    if (!user || !result) return; // ✅ Prevent null access
    result.summary = newSummary;
    await saveToSupabase(user.id);
  };

  if (loading) return <p>Analyzing your traits…</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!result) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Personality Summary</h2>

      <EditableSummary
        initialValue={result.summary}
        onSave={handleSave}
      />

      <div className="grid grid-cols-2 gap-4">
        {result.traits.map((trait) => (
          <div key={trait.name} className="border rounded p-3 bg-gray-50">
            <div className="font-medium">{trait.name}</div>
            <div className="text-sm text-gray-600">
              Score: {(trait.score * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
