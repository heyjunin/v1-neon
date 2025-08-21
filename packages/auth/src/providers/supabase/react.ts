import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { SupabaseAuthProvider } from "./shared";

// Client for React Router (SPA)
export const createReactSupabaseClient = () => {
  return createClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
};

// Auth provider for React Router
export const createReactAuthProvider = () => {
  const client = createReactSupabaseClient();
  return new SupabaseAuthProvider(client);
};
