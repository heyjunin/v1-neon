import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseAuthProvider } from "./shared";
import type { Database } from "./types";

// Server-side client
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch (error) {
            // Handle cookie setting error
          }
        },
      },
    },
  );
};

// Auth provider for server-side
export const createServerAuthProvider = () => {
  const client = createServerSupabaseClient();
  return new SupabaseAuthProvider(client);
};
