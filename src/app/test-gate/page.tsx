"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Test password - you can change this or make it more sophisticated
  const TEST_PASSWORD = "servinly.hobart-2024";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple password check - you can enhance this with API calls
    if (password === TEST_PASSWORD) {
      // Set a cookie to allow access (more secure than sessionStorage)
      document.cookie = "testAccess=granted; path=/; max-age=86400"; // 24 hours
      router.push("/test-app");
    } else {
      setError("Incorrect password. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Test Environment</h1>
          <p className="text-gray-600">
            This is the testing version of Servinly. Enter the password to access the full app.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Test Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter test password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? "Checking..." : "Access Test App"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need the password? Contact the development team.
          </p>
        </div>
      </div>
    </main>
  );
}
