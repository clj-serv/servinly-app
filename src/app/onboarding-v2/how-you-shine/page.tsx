"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HowYouShinePage() {
  const router = useRouter();
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const traits = [
    { id: "detail-oriented", name: "Detail-Oriented", description: "I pay attention to the little things" },
    { id: "team-player", name: "Team Player", description: "I work well with others" },
    { id: "problem-solver", name: "Problem Solver", description: "I find solutions quickly" },
    { id: "customer-focused", name: "Customer-Focused", description: "I prioritize guest satisfaction" },
    { id: "fast-learner", name: "Fast Learner", description: "I pick up new skills quickly" },
    { id: "reliable", name: "Reliable", description: "I'm always there when needed" }
  ];

  const handleTraitToggle = (traitId: string) => {
    setSelectedTraits(prev => 
      prev.includes(traitId) 
        ? prev.filter(id => id !== traitId)
        : [...prev, traitId]
    );
  };

  const handleContinue = () => {
    // Store selected traits and continue
    const currentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const updatedData = { ...currentData, traits: selectedTraits };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    
    router.push("/onboarding-v2/organization");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How Do You Shine?</h1>
          <p className="text-lg text-gray-600">
            Select the traits that best describe you at work
          </p>
        </div>

        {/* Traits Selection */}
        <div className="space-y-4 mb-8">
          {traits.map((trait) => (
            <button
              key={trait.id}
              onClick={() => handleTraitToggle(trait.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedTraits.includes(trait.id)
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{trait.name}</div>
              <div className="text-sm text-gray-600">{trait.description}</div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={selectedTraits.length === 0}
            className="w-full max-w-md py-4 px-8 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            Continue to Organization
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/onboarding-v2/role-select"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Role Selection
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
