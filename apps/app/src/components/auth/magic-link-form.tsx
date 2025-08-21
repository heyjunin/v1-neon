"use client";

import { useSendMagicLink } from "@/lib/trpc";
import { Alert, AlertDescription } from "@v1/ui/alert";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";

interface MagicLinkFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function MagicLinkForm({ onSuccess, onError }: MagicLinkFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSent, setIsSent] = useState(false);

  const sendMagicLink = useSendMagicLink();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await sendMagicLink.mutateAsync({ email });
      setSuccess("Magic link sent! Check your email for the login link.");
      setIsSent(true);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to send magic link";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    try {
      await sendMagicLink.mutateAsync({ email });
      setSuccess("Magic link resent! Check your email.");
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to resend magic link";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  if (isSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Check your email
          </CardTitle>
          <CardDescription>We've sent a magic link to {email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to sign in. The link will expire in 1
              hour.
            </p>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={sendMagicLink.isPending}
                className="w-full"
              >
                {sendMagicLink.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Resend magic link
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsSent(false);
                  setEmail("");
                  setSuccess("");
                  setError("");
                }}
                className="w-full"
              >
                Use different email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in with Magic Link</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a secure link to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={sendMagicLink.isPending}
          >
            {sendMagicLink.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Magic Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
