"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrganizationPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [location, setLocation] = useState("");

  const handleContinue = () => {
    if (!orgName.trim()) {
      alert("Please enter an organization name");
      return;
    }

    // Store organization data and continue
    const currentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const updatedData = { 
      ...currentData, 
      orgName: orgName.trim(),
      location: location.trim()
    };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    
    router.push("/onboarding-v2/dates");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Where Do You Work?</h1>
          <p className="text-lg text-gray-600">
            Tell us about your workplace
          </p>
        </div>

        {/* Organization Form */}
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
              placeholder="e.g., The Grand Hotel, Downtown Restaurant"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="w-full max-w-md py-4 px-8 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            Continue to Dates
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/onboarding-v2/how-you-shine"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Traits
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
