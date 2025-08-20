"use client";

import { createClient } from "@v1/supabase/client";
import { Button } from "@v1/ui/button";

export function GoogleSignin() {
  const supabase = createClient();

  const handleSignin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={handleSignin} variant="outline" className="font-mono">
      Sign in with Google
    </Button>
  );
}

export function DiscordSignin() {
  const supabase = createClient();

  const handleSignin = () => {
    supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={handleSignin} variant="outline" className="font-mono">
      Sign in with Discord
    </Button>
  );
}

export function AuthButtons() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <GoogleSignin />
      <DiscordSignin />
    </div>
  );
}
