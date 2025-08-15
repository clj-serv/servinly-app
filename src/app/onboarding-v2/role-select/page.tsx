"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  experience: string;
}

export default function RoleSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're coming from signup
    const fromSignup = searchParams.get("from");
    const role = searchParams.get("role");
    const experience = searchParams.get("experience");

    if (fromSignup === "signup" && role) {
      // We have signup data, use it
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        role: role,
        experience: experience || "entry"
      });
      setSelectedRole(role);
    } else {
      // Check localStorage for signup data
      const stored = localStorage.getItem("userData");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setSignupData(data);
          setSelectedRole(data.role || "");
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role to continue");
      return;
    }

    // Store the selected role and continue to next step
    const currentData = signupData || {};
    const updatedData = { ...currentData, role: selectedRole };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    
    // Navigate to next step in onboarding
    router.push("/onboarding-v2/how-you-shine");
  };

  const roles = [
    { id: "bartender", name: "Bartender", icon: "🍸" },
    { id: "server", name: "Server", icon: "🍽️" },
    { id: "host", name: "Host/Hostess", icon: "👋" },
    { id: "manager", name: "Manager", icon: "👔" },
    { id: "chef", name: "Chef", icon: "👨‍🍳" },
    { id: "barista", name: "Barista", icon: "☕" },
    { id: "other", name: "Other", icon: "🎯" }
  ];

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What's Your Role?</h1>
          <p className="text-lg text-gray-600">
            {signupData ? 
              `Hi ${signupData.firstName}! Let's confirm your role and start building your profile.` :
              "Select your primary role in hospitality to get started."
            }
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === role.id
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="text-3xl mb-2">{role.icon}</div>
              <div className="font-medium text-gray-900">{role.name}</div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="w-full max-w-md py-4 px-8 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            Continue to Next Step
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/profile"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
