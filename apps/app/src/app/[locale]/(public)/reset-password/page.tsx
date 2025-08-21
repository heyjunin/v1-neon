import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
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
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground mt-2">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <ResetPasswordForm />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
