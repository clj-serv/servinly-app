/**
 * Supabase environment validation utilities
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const looksReal = url && key && !/placeholder|<your-ref>/i.test(url) && !/placeholder|<anon_key>/i.test(key);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug('Supabase config check:', { url, hasKey: !!key, looksReal });
  }
  
  return !!looksReal;
}
