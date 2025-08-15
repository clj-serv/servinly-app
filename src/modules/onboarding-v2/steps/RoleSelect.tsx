"use client";

import { useEffect, useState } from "react";
import { getAvailableRoles } from "@/role-engine/registry";
import type { UseStepRouterReturn } from "@/lib/useStepRouter";
import type { UserContext } from "@/contracts/onboarding";
import { ChevronDown } from "lucide-react";
import { saveRoleDraft } from "@/modules/onboarding-v2/repos/profileRepo";

interface RoleSelectProps {
  router: UseStepRouterReturn;
  user: UserContext;
}

export default function RoleSelect({ router, user }: RoleSelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const roles = getAvailableRoles();
  
  const selectedRoleData = roles.find(role => role.id === selectedRole);
  
  useEffect(() => {
    // Initialize with current signals if available
    if (router.signals.roleId) {
      setSelectedRole(router.signals.roleId);
    }
  }, [router.signals.roleId]);
  
  const handleRoleSelect = (roleId: string, family: string) => {
    setSelectedRole(roleId);
    setIsDropdownOpen(false);
    
    // Update the router signals immediately
    router.updateSignals({ 
      roleId: roleId, 
      roleFamily: family 
    });
  };
  
  const handleContinue = async () => {
    if (selectedRole && selectedRoleData) {
      // Ensure signals are updated before navigation
      router.updateSignals({ 
        roleId: selectedRole, 
        roleFamily: selectedRoleData.family 
      });
      
      // Feature-flagged, non-blocking draft save
      if (process.env.NEXT_PUBLIC_ONB_SUPABASE_SAVE === "true") {
        // Use user.id from UserContext instead of getCurrentUserId()
        if (user?.id) {
          // Fire-and-forget; no blocking, no render writes
          void saveRoleDraft(user.id, router.signals);
        }
      }
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        router.goNext();
      }, 0);
    }
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
        {/* Draggable Handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-1 bg-gray-200 rounded-full">
            <div className="w-1/9 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-500">Step 1 of 9</span>
        </div>
        
        {/* User Welcome */}
        {user.firstName && (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">Welcome, {user.firstName}! 👋</p>
          </div>
        )}
        
        {/* Content Area */}
        <div className="space-y-6">
          {/* Main Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Your recent role
          </h1>
          
          {/* Subtitle */}
          <p className="text-base text-gray-700 text-center">
            What role do you want to add to your profile?
          </p>
          
          {/* Input Field */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="w-full h-14 px-4 border border-gray-300 rounded-xl bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <span className={selectedRole ? "text-gray-900" : "text-gray-400"}>
                {selectedRoleData ? selectedRoleData.label : "Select your role..."}
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`} 
              />
            </button>
            
            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id, role.family)}
                    className="w-full min-h-[44px] px-4 py-3 text-left text-base hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {role.id === "bartender" && "🍸"}
                        {role.id === "barista" && "☕"}
                        {role.id === "server" && "🍽️"}
                        {role.id === "host" && "👋"}
                        {role.id === "manager" && "👔"}
                        {role.id === "chef" && "👨‍🍳"}
                      </span>
                      <span className="text-gray-900">{role.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="w-full min-h-[44px] px-4 text-base bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

