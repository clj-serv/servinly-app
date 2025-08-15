import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servinly — Coming Soon",
  description: "Something innovative is coming soon. Stay tuned!",
};

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Servinly is under construction
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 opacity-80">
          Something innovative is coming soon. Stay tuned!
        </p>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <p className="text-lg text-gray-700 mb-4">Want early access?</p>
          <p className="text-blue-600 font-semibold text-xl">hello@servinly.com</p>
        </div>
      </div>
    </main>
  );
}
