"use client";

import { useSendOtp, useVerifyOtp } from "@/lib/trpc";
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
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OtpFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function OtpForm({ onSuccess, onError }: OtpFormProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const router = useRouter();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await sendOtp.mutateAsync({ email });
      setSuccess("OTP sent! Check your email for the 6-digit code.");
      setIsOtpSent(true);
      startResendCountdown();
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to send OTP";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    try {
      await verifyOtp.mutateAsync({ email, token: otp });
      setSuccess("OTP verified successfully!");
      onSuccess?.();

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to verify OTP";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      await sendOtp.mutateAsync({ email });
      setSuccess("OTP resent! Check your email.");
      startResendCountdown();
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to resend OTP";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const startResendCountdown = () => {
    setIsResendDisabled(true);
    setResendCountdown(60);

    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBackToEmail = () => {
    setIsOtpSent(false);
    setOtp("");
    setError("");
    setSuccess("");
    setIsResendDisabled(false);
    setResendCountdown(0);
  };

  if (isOtpSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-600" />
            Enter OTP Code
          </CardTitle>
          <CardDescription>
            We've sent a 6-digit code to {email}
          </CardDescription>
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

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyOtp.isPending || otp.length !== 6}
            >
              {verifyOtp.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify OTP
            </Button>
          </form>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={isResendDisabled || sendOtp.isPending}
              className="w-full"
            >
              {sendOtp.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isResendDisabled
                ? `Resend in ${resendCountdown}s`
                : "Resend OTP"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToEmail}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Use different email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in with OTP</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a 6-digit code to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOtp} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={sendOtp.isPending}>
            {sendOtp.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send OTP Code
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
