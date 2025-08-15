"use client";

import { useState, useEffect } from "react";
import { getSessionUserId, getDevFakeUserId } from "@/lib/auth";

interface DevPanelProps {
  currentStep?: string;
  lastFinalizeError?: string | null;
}

export default function DevPanel({ currentStep, lastFinalizeError }: DevPanelProps) {
  const [userIdPath, setUserIdPath] = useState<string>("loading...");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function resolveUserId() {
      const sessionUid = await getSessionUserId();
      const devUid = process.env.NODE_ENV !== "production" ? getDevFakeUserId() : null;
      
      if (sessionUid) {
        setUserIdPath(`session: ${sessionUid}`);
      } else if (devUid) {
        setUserIdPath(`fake: ${devUid}`);
      } else {
        setUserIdPath("none (AUTH_REQUIRED)");
      }
    }
    
    resolveUserId();
  }, []);

  // Only show if NEXT_PUBLIC_DEBUG_UI is enabled
  if (process.env.NEXT_PUBLIC_DEBUG_UI !== "true") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-mono"
      >
        DEBUG
      </button>
      
      {isVisible && (
        <div className="absolute bottom-8 right-0 bg-black text-yellow-400 p-3 rounded text-xs font-mono min-w-64 max-w-80">
          <div className="space-y-1">
            <div><strong>userId:</strong> {userIdPath}</div>
            <div><strong>save:</strong> {process.env.NEXT_PUBLIC_ONB_SUPABASE_SAVE || "false"}</div>
            {currentStep && <div><strong>step:</strong> {currentStep}</div>}
            {lastFinalizeError && (
              <div className="text-red-400">
                <strong>error:</strong> {lastFinalizeError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
