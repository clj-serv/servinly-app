// Debug script to test Finish Profile flow
// Run this in browser console on Preview page

console.log('=== DEBUGGING FINISH PROFILE ===');

// 1. Check environment variables
console.log('Feature flags:', {
  onboardingV2: process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_V2_ROUTER,
  supabaseSave: process.env.NEXT_PUBLIC_ONB_SUPABASE_SAVE,
  debugUI: process.env.NEXT_PUBLIC_DEBUG_UI
});

// 2. Check Supabase config
console.log('Supabase config:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

// 3. Check localStorage signals
const signals = localStorage.getItem('onboarding_signals');
console.log('Stored signals:', signals ? JSON.parse(signals) : 'MISSING');

// 4. Test auth functions (if available)
if (window.supabase) {
  window.supabase.auth.getUser().then(result => {
    console.log('Current user:', result.data?.user?.id || 'NOT_AUTHENTICATED');
  });
}

// 5. Check dev auth
console.log('Dev auth:', {
  devEmail: process.env.NEXT_PUBLIC_DEV_EMAIL,
  devFakeUserId: process.env.NEXT_PUBLIC_DEV_FAKE_USER_ID
});

console.log('=== END DEBUG ===');
