// Feature flags for onboarding V2
// These are build-time inlined by Next.js

export const isAddAnotherEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_FEATURE_ONB_ADD_ANOTHER === "true";
};
