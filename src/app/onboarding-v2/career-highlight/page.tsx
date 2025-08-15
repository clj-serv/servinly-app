"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CareerHighlightPage() {
  const router = useRouter();
  const [highlightText, setHighlightText] = useState("");

  const handleContinue = () => {
    if (!highlightText.trim()) {
      alert("Please describe your career highlight");
      return;
    }

    // Store career highlight data and continue
    const currentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const updatedData = { 
      ...currentData, 
      highlightText: highlightText.trim()
    };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    
    router.push("/onboarding-v2/responsibilities");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What's Your Career Highlight?</h1>
          <p className="text-lg text-gray-600">
            Describe a moment or achievement you're proud of in this role
          </p>
        </div>

        {/* Career Highlight Form */}
        <div className="mb-8">
          <label htmlFor="highlightText" className="block text-sm font-medium text-gray-700 mb-2">
            Career Highlight *
          </label>
          <textarea
            id="highlightText"
            value={highlightText}
            onChange={(e) => setHighlightText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base resize-none"
            placeholder="Describe a specific achievement, moment, or skill you're proud of in this role..."
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            This could be a customer interaction, a skill you developed, or an achievement you're proud of.
          </p>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="w-full max-w-md py-4 px-8 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            Continue to Responsibilities
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/onboarding-v2/dates"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dates
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
