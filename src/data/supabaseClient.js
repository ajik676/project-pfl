import { createClient } from "@supabase/supabase-js";

// Fetch configurations from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

if (supabaseUrl === "https://your-project.supabase.co" || supabaseAnonKey === "your-anon-key-here") {
  console.warn(
    "Warning: Supabase credentials are using default placeholder values. Please update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
