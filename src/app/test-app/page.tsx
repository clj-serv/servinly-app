"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function TestApp() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: "signup",
      title: "Signup Flow",
      description: "Test the complete signup and onboarding experience",
      path: "/signup"
    },
    {
      id: "profile",
      title: "Profile Management",
      description: "Test profile editing, inline forms, and database persistence",
      path: "/profile"
    },
    {
      id: "onboarding",
      title: "Onboarding Flow",
      description: "Test the complete onboarding workflow for role creation",
      path: "/onboarding-v2/role-select"
    },
    {
      id: "ui-lab",
      title: "UI Lab",
      description: "Explore different UI components and layouts",
      path: "/ui-lab"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧪 Servinly Test Environment</h1>
          <p className="text-gray-600 text-lg">
            Welcome to the testing version of Servinly. Select a feature to explore.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`bg-white rounded-2xl shadow-lg p-6 transition-shadow border-2 border-transparent ${
                feature.disabled
                  ? 'cursor-not-allowed opacity-75'
                  : 'cursor-pointer hover:shadow-xl hover:border-blue-200'
              }`}
              onClick={() => !feature.disabled && setSelectedFeature(feature.id)} // Prevent click for disabled
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              {feature.disabled ? (
                <button
                  disabled
                  className="inline-block bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed opacity-50"
                >
                  Coming Soon
                </button>
              ) : (
                <Link
                  href={feature.path}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open {feature.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="text-center space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Quick Navigation</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/"
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                Signup
              </Link>
              <Link
                href="/welcome"
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Welcome
              </Link>
              <Link
                href="/profile"
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/coming-soon"
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Coming Soon
              </Link>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🧪 Testing Instructions</h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p><strong>1. Signup Flow:</strong> Start at /signup → Fill form → Welcome page → Profile creation</p>
            <p><strong>2. Profile Management:</strong> Test inline editing, database persistence, and responsive design</p>
            <p><strong>3. UI Lab:</strong> Explore different UI components and layouts</p>
            <p><strong>4. Navigation:</strong> Test all links and ensure smooth user experience</p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This is a testing environment. Your production site at{" "}
            <a href="https://servinly.com" className="text-blue-600 hover:underline">
              servinly.com
            </a>{" "}
            shows the main landing page.
          </p>
        </div>
      </div>
    </main>
  );
}
