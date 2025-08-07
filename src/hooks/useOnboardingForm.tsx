import { useEffect, useState } from 'react';

export interface OnboardingFormData {
  position: string;
  organization: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrentlyWorking: boolean;
  responsibilities: string[];
}

const STORAGE_KEY = 'onboarding-form';

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<OnboardingFormData>({
    position: '',
    organization: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentlyWorking: false,
    responsibilities: [],
  });

  // 🧠 Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse stored onboarding data:', e);
      }
    }
  }, []);

  // 💾 Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateForm = <K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({
      position: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false,
      responsibilities: [],
    });
  };

  return {
    formData,
    updateForm,
    resetForm,
  };
};
