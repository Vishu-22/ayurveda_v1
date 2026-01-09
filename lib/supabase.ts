import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Client-side Supabase client (only initialize if variables exist)
let supabase: SupabaseClient | null = null;

if (typeof window !== "undefined") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn("Supabase environment variables not configured for client-side");
  }
}

export { supabase };

// Server-side Supabase client (for API routes and server components)
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables. Please set:");
    console.error("- NEXT_PUBLIC_SUPABASE_URL");
    console.error("- NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY for server-side)");
    throw new Error("Missing Supabase environment variables. Check your .env.local file.");
  }

  return createClient(supabaseUrl, supabaseKey);
}
