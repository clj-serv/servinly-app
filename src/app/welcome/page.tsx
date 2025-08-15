"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  experience: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUserData(data);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.replace("/signup");
        return;
      }
    } else {
      // No user data, redirect to signup
      router.replace("/signup");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleCreateProfile = () => {
    // Redirect to profile page to start building the full profile
    router.push("/profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null; // Will redirect
  }

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      bartender: "Bartender",
      server: "Server",
      host: "Host/Hostess",
      manager: "Manager",
      chef: "Chef",
      barista: "Barista",
      other: "Other"
    };
    return roleMap[role] || role;
  };

  const getExperienceDisplay = (exp: string) => {
    const expMap: Record<string, string> = {
      entry: "Entry Level (0-2 years)",
      mid: "Mid Level (3-5 years)",
      senior: "Senior Level (5+ years)"
    };
    return expMap[exp] || exp;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Servinly, {userData.firstName}! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Your account has been created successfully. Let's build your professional profile.
          </p>
        </div>

        {/* User Info Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{userData.firstName} {userData.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Primary Role</p>
              <p className="font-medium text-gray-900">{getRoleDisplay(userData.role)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience Level</p>
              <p className="font-medium text-gray-900">{getExperienceDisplay(userData.experience)}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h3>
            <p className="text-gray-600">
              Complete your professional profile by adding your work experience, skills, and career highlights.
            </p>
          </div>

          <button
            onClick={handleCreateProfile}
            className="w-full py-4 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 text-lg"
          >
            Create My Profile
          </button>

          <div className="text-sm text-gray-500">
            <p>You can always edit your profile later from your dashboard.</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <div className="flex justify-center space-x-4 text-sm">
            <Link href="/profile" className="text-blue-600 hover:underline">
              Go to Profile
            </Link>
            <Link href="/test-app" className="text-blue-600 hover:underline">
              Test Dashboard
            </Link>
            <Link href="/coming-soon" className="text-blue-600 hover:underline">
              About Servinly
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}