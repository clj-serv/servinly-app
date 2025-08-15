"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResponsibilitiesPage() {
  const router = useRouter();
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const removeResponsibility = (index: number) => {
    if (responsibilities.length > 1) {
      setResponsibilities(responsibilities.filter((_, i) => i !== index));
    }
  };

  const updateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
  };

  const handleContinue = () => {
    const validResponsibilities = responsibilities.filter(r => r.trim() !== "");
    if (validResponsibilities.length === 0) {
      alert("Please add at least one responsibility");
      return;
    }

    // Store responsibilities data and continue
    const currentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const updatedData = { 
      ...currentData, 
      responsibilities: validResponsibilities
    };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    
    router.push("/onboarding-v2/preview");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What Are Your Key Responsibilities?</h1>
          <p className="text-lg text-gray-600">
            List your main duties and responsibilities in this role
          </p>
        </div>

        {/* Responsibilities Form */}
        <div className="space-y-4 mb-8">
          {responsibilities.map((responsibility, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={responsibility}
                onChange={(e) => updateResponsibility(index, e.target.value)}
                className="flex-1 h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
                placeholder={`Responsibility ${index + 1}`}
              />
              {responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="h-12 w-12 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addResponsibility}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 rounded-xl transition-colors"
          >
            + Add Another Responsibility
          </button>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="w-full max-w-md py-4 px-8 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            Continue to Preview
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/onboarding-v2/career-highlight"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Career Highlight
          </Link>
          <Link
            href="/profile"
            className="text-blue-600 hover:underline text-sm"
          >
            Skip to Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
