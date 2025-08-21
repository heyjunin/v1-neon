import { OtpForm } from "@/components/auth/otp-form";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "OTP Sign In",
};

export default function OtpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">Sign in with OTP</h1>
          <p className="text-muted-foreground mt-2">
            Or{" "}
            <Link href="/login" className="text-primary hover:underline">
              use other sign in methods
            </Link>
          </p>
        </div>

        <OtpForm />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
