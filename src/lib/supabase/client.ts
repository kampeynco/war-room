import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const url = process.env.SBASE_URL;
  const anonKey = process.env.SBASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing SBASE_URL or SBASE_ANON_KEY. Add them to .env.local."
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
