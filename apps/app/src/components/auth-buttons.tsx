"use client";

import { useAuth } from "@v1/auth/hooks";
import { Button } from "@v1/ui/button";

export function GoogleSignin() {
  const { signIn, isLoading } = useAuth();

  const handleSignin = () => {
    signIn("google", {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    });
  };

  return (
    <Button onClick={handleSignin} variant="outline" className="font-mono" disabled={isLoading}>
      Sign in with Google
    </Button>
  );
}

export function DiscordSignin() {
  const { signIn, isLoading } = useAuth();

  const handleSignin = () => {
    signIn("discord", {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    });
  };

  return (
    <Button onClick={handleSignin} variant="outline" className="font-mono" disabled={isLoading}>
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
