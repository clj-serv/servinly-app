import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // ✅ make sure this path is correct

// --- Types ---

export interface Trait {
  name: string;
  score: number; // between 0 and 1
}

export interface AssessmentResult {
  traits: Trait[];
  summary: string;
}

export interface OnboardingFormData {
  position: string;
  organization: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  responsibilities: string[];
}

// --- Hook ---

export const usePersonalityAssessment = () => {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateTraits = async (data: OnboardingFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mocked traits — randomized slightly
      const traits: Trait[] = [
        { name: 'Agreeableness', score: randomScore() },
        { name: 'Conscientiousness', score: randomScore() },
        { name: 'Openness', score: randomScore() },
        { name: 'Extraversion', score: randomScore() },
        { name: 'Emotional Stability', score: randomScore() },
      ];

      const summary = generateSummary(data);
      setResult({ traits, summary });
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const saveToSupabase = async (userId: string) => {
    if (!result) return;

    const { error } = await supabase.from('traits').upsert({
      user_id: userId,
      traits: result.traits,
      summary: result.summary,
    });

    if (error) {
      console.error('❌ Failed to save traits to Supabase:', error);
      throw error;
    }
  };

  return {
    result,
    loading,
    error,
    generateTraits,
    saveToSupabase,
  };
};

// --- Helpers ---

function randomScore(): number {
  return parseFloat((0.6 + Math.random() * 0.4).toFixed(2)); // 0.6 to 1.0
}

function generateSummary(data: OnboardingFormData): string {
  return `Based on your experience as a ${data.position} at ${data.organization}, you're likely dependable, service-oriented, and adaptable in fast-paced environments.`;
}
