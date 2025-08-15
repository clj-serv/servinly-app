// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Circular Element - Visual Anchor */}
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 bg-blue-400 rounded-full"></div>
        </div>
        
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join the Hospitality Revolution
          </h1>
          <p className="text-lg text-gray-600 max-w-sm mx-auto">
            Create your hospitality profile, showcase your skills, and connect with opportunities that match your unique style.
          </p>
        </div>
        
        {/* Information Box */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
          <p className="text-blue-700 text-sm leading-relaxed">
            <span className="font-semibold">In just a few quick steps,</span> you'll have a professional profile that highlights your hospitality expertise and connects you with the right opportunities.
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="space-y-4">
          <a
            href="/signup"
            className="inline-flex items-center justify-center w-full px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 text-lg shadow-sm hover:shadow-md"
          >
            Get Started
          </a>
          
          <a
            href="/test-gate"
            className="inline-flex items-center justify-center w-full px-8 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 border-2 border-blue-500"
          >
            Try Demo
          </a>
        </div>
        
        {/* Footer Info */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-xs">S</span>
            </div>
            <span>servinly.com</span>
          </div>
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-4 text-sm text-center">
              <a className="underline text-blue-600" href="/login">Developer sign in</a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
