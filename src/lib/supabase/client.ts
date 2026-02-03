import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  // Check for various environment variable naming conventions
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    || process.env.SBASE_URL
    || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || process.env.SBASE_ANON_KEY
    || process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment."
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
