import React from "react";
import { Card } from "@/ui/Card";
import { Progress } from "@/ui/Progress";

interface OnboardingLayoutProps {
  title: string;
  helper?: string;
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
  children: React.ReactNode;
}

export function OnboardingLayout({ 
  title, 
  helper, 
  currentStep,
  totalSteps,
  showProgress = true,
  children 
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {showProgress && currentStep && totalSteps && (
          <div className="mb-8">
            <Progress current={currentStep} total={totalSteps} />
          </div>
        )}
        
        {/* Main Card */}
        <Card padding="lg" shadow="lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
            {helper && (
              <p className="text-gray-600 text-lg">{helper}</p>
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}
