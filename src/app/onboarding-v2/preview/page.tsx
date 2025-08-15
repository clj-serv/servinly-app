"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  experience: string;
  traits: string[];
  orgName: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlightText: string;
  responsibilities: string[];
}

export default function PreviewPage() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load onboarding data from localStorage
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setOnboardingData(data);
      } catch (error) {
        console.error("Error parsing onboarding data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleFinish = () => {
    // Navigate to profile page
    router.push("/profile");
  };

  const handleAddAnotherRole = () => {
    // Clear current role data but keep user info
    if (onboardingData) {
      const userInfo = {
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        email: onboardingData.email,
        experience: onboardingData.experience
      };
      localStorage.setItem("userData", JSON.stringify(userInfo));
    }
    
    // Start new role onboarding
    router.push("/onboarding-v2/role-select");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No onboarding data found</p>
          <Link
            href="/onboarding-v2/role-select"
            className="text-blue-600 hover:underline"
          >
            Start Onboarding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Preview</h1>
          <p className="text-lg text-gray-600">
            Review your profile information before finishing
          </p>
        </div>

        {/* Profile Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-gray-900">{onboardingData.firstName} {onboardingData.lastName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{onboardingData.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Experience Level:</span>
                  <p className="text-gray-900">{onboardingData.experience}</p>
                </div>
              </div>
            </div>

            {/* Role Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Role:</span>
                  <p className="text-gray-900 capitalize">{onboardingData.role}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Organization:</span>
                  <p className="text-gray-900">{onboardingData.orgName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-900">{onboardingData.location || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Duration:</span>
                  <p className="text-gray-900">
                    {formatDate(onboardingData.startDate)} - {onboardingData.isCurrent ? "Present" : formatDate(onboardingData.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Traits */}
          {onboardingData.traits && onboardingData.traits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Traits</h3>
              <div className="flex flex-wrap gap-2">
                {onboardingData.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Career Highlight */}
          {onboardingData.highlightText && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Career Highlight</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {onboardingData.highlightText}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {onboardingData.responsibilities && onboardingData.responsibilities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {onboardingData.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleFinish}
            className="w-full sm:w-auto py-4 px-8 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            ✅ Finish & Go to Profile
          </button>
          <button
            onClick={handleAddAnotherRole}
            className="w-full sm:w-auto py-4 px-8 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            ➕ Add Another Role
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/onboarding-v2/responsibilities"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Responsibilities
          </Link>
        </div>
      </div>
    </main>
  );
}
