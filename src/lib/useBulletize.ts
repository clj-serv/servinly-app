import { useState } from 'react';

interface BulletizeResponse {
  bullets: string[];
  usedAI: boolean;
}

interface UseBulletizeState {
  input: string;
  loading: boolean;
  bullets: string[];
  error: string | null;
  usedAI: boolean;
}

interface UseBulletizeReturn extends UseBulletizeState {
  setInput: (input: string) => void;
  bulletize: (role?: string, maxBullets?: number) => Promise<void>;
  clearBullets: () => void;
  clearError: () => void;
}

export function useBulletize(): UseBulletizeReturn {
  const [state, setState] = useState<UseBulletizeState>({
    input: '',
    loading: false,
    bullets: [],
    error: null,
    usedAI: false,
  });

  const setInput = (input: string) => {
    setState(prev => ({ ...prev, input }));
  };

  const bulletize = async (role?: string, maxBullets: number = 3) => {
    if (!state.input.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter some text to bulletize' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      bullets: [] 
    }));

    try {
      const response = await fetch('/api/highlights/bulletize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: state.input.trim(),
          role,
          maxBullets,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BulletizeResponse = await response.json();
      
      setState(prev => ({
        ...prev,
        bullets: data.bullets,
        usedAI: data.usedAI,
        loading: false,
      }));
    } catch (error) {
      console.error('Bulletize error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to bulletize text',
        loading: false,
      }));
    }
  };

  const clearBullets = () => {
    setState(prev => ({ ...prev, bullets: [] }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    setInput,
    bulletize,
    clearBullets,
    clearError,
  };
}
