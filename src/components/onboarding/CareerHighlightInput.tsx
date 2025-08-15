import React, { useState } from 'react';
import { useBulletize } from '@/lib/useBulletize';

interface CareerHighlightInputProps {
  role?: string;
  onAdd: (bullet: string) => void;
  maxToAdd?: number;
  selectedBullets?: string[]; // Add this to track what's already selected
}

export default function CareerHighlightInput({ 
  role, 
  onAdd, 
  maxToAdd = 3,
  selectedBullets = []
}: CareerHighlightInputProps) {
  const {
    input,
    setInput,
    loading,
    bullets,
    error,
    usedAI,
    bulletize,
    clearBullets,
    clearError,
  } = useBulletize();

  const [addedBullets, setAddedBullets] = useState<Set<string>>(new Set());

  const handleAIAssist = () => {
    clearError();
    bulletize(role, maxToAdd);
  };

  const handleAddBullet = (bullet: string) => {
    onAdd(bullet);
    setAddedBullets(prev => new Set([...prev, bullet]));
    
    // Show success feedback briefly
    setTimeout(() => {
      setAddedBullets(prev => {
        const newSet = new Set(prev);
        newSet.delete(bullet);
        return newSet;
      });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (error) clearError();
  };

  const isBulletSelected = (bullet: string) => {
    return selectedBullets.includes(bullet);
  };

  const canAddBullet = (bullet: string) => {
    return !isBulletSelected(bullet) && maxToAdd > 0;
  };

  return (
    <div className="space-y-4">
      {/* Title and Helper Text */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Career highlight
        </h3>
        <p className="text-sm text-gray-600">
          Add a highlight in your words, or tap AI assist to turn it into resume-ready bullets.
        </p>
      </div>

      {/* Text Input */}
      <div>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="E.g., Designed a seasonal cocktail menu that lifted sales by 15%"
          rows={3}
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
        />
      </div>

      {/* AI Assist Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAIAssist}
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI assist
            </>
          )}
        </button>
        
        {usedAI && (
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            AI enhanced
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Bullets Results */}
      {bullets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Resume-ready bullets
            </h4>
            <button
              onClick={clearBullets}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          
          <div className="space-y-2">
            {bullets.map((bullet, index) => {
              const isSelected = isBulletSelected(bullet);
              const canAdd = canAddBullet(bullet);
              const wasJustAdded = addedBullets.has(bullet);
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-green-50 border-green-200' 
                      : wasJustAdded 
                        ? 'bg-blue-50 border-blue-200 animate-pulse' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-sm text-gray-900 flex-1 mr-3">
                    {bullet}
                  </span>
                  
                  {isSelected ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        ✓ Added
                      </span>
                    </div>
                  ) : canAdd ? (
                    <button
                      onClick={() => handleAddBullet(bullet)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 px-2 py-1">
                      Max reached
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Status indicator */}
          <div className="text-center text-xs text-gray-500">
            {selectedBullets.length}/{selectedBullets.length + maxToAdd} bullets selected
          </div>
        </div>
      )}
    </div>
  );
}
