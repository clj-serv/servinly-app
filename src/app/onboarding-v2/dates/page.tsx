"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DatesPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const handleContinue = () => {
    if (!startDate) {
      alert("Please select a start date");
      return;
    }

    // Store dates data and continue
    const currentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const updatedData = { 
      ...currentData, 
      startDate,
      endDate: isCurrent ? "" : endDate,
      isCurrent
    };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    
    router.push("/onboarding-v2/career-highlight");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">When Did You Work There?</h1>
          <p className="text-lg text-gray-600">
            Tell us about your time at this organization
          </p>
        </div>

        {/* Dates Form */}
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              id="startDate"
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
              required
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              id="isCurrent"
              type="checkbox"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrent" className="ml-2 text-sm text-gray-700">
              I currently work here
            </label>
          </div>

          {!isCurrent && (
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                id="endDate"
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
                min={startDate}
              />
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="w-full max-w-md py-4 px-8 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            Continue to Career Highlight
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/onboarding-v2/organization"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Organization
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
