import { createClient } from "@supabase/supabase-js";

// Create a single Supabase client for use in both the client and server.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);