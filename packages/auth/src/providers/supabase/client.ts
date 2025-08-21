import { createBrowserClient } from "@supabase/ssr";
import { SupabaseAuthProvider } from "./shared";
import type { Database } from "./types";

// Client-side client
export const createBrowserSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};

// Auth provider for client-side
export const createBrowserAuthProvider = () => {
  const client = createBrowserSupabaseClient();
  return new SupabaseAuthProvider(client);
};
